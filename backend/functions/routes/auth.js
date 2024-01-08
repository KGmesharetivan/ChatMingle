require("dotenv").config();

const express = require("express");
const fs = require("fs").promises;
const router = express.Router();
const multer = require("multer");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const ChatMingle = require("../MongoDB/ChatMingledb");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const moment = require("moment");
const { promisify } = require("util");
const winston = require("winston");
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3");

// Create an S3 client instance with the specified region
const s3 = new S3Client({
  region: "ap-southeast-1",
  credentials: {
    accessKeyId: process.env.NETLIFY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.NETLIFY_AWS_SECRET_ACCESS_KEY,
  },
});

// Multer setup for file upload
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only images are allowed."), false);
  }
};
const upload = multer({ storage, fileFilter });

const saltRounds = 10;

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = new twilio(accountSid, authToken);

var defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey =
  process.env.SENDINBLUE_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

const generateResetTokenWithExpiry = () => {
  const min = 100000;
  const max = 999999;
  const resetToken = Math.floor(Math.random() * (max - min + 1)) + min;

  const creationTime = new Date();

  return { resetToken, creationTime };
};

const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ success: false, message: "Unauthorized" });
};

router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    let user;

    if (/^\S+@\S+\.\S+$/.test(username)) {
      user = await ChatMingle.getUserByEmail(username);
    } else {
      user = await ChatMingle.getUserByPhone(username);
    }

    if (!user || !(await bcrypt.compare(password, user.hash))) {
      return res.status(401).send({ loginStatus: false });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      const token = jwt.sign({ sub: user._id }, process.env.JWT_SECRET_KEY);

      res.send({ loginStatus: true, user, token });
    });
  } catch (error) {
    res.status(500).send({ loginStatus: false });
  }
});

router.post("/register", async (req, res) => {
  try {
    const duplicateEmail = await ChatMingle.getUserByEmail(req.body.email);

    if (duplicateEmail) {
      return res
        .status(409)
        .send({ registered: false, message: "Email already exists" });
    }

    const hash = await bcrypt.hash(req.body.password, saltRounds);

    const newUser = {
      fullname: req.body.fullname,
      email: req.body.email,
      phone: req.body.phone,
      role: req.body.role,
      gender: req.body.gender,
      age: req.body.age,
      country: req.body.country,
      hash: hash,
    };

    const saveResult = await ChatMingle.saveNewUser(newUser);

    if (saveResult.acknowledged) {
      res.send({ registered: true });
    } else {
      res
        .status(400)
        .send({ registered: false, message: "Failed to save the user" });
    }
  } catch (error) {
    res.status(500).send({
      registered: false,
      message: "An error occurred during registration",
    });
  }
});

router.get("/isLoggedIn", (req, res) => {
  res.send({
    isLoggedIn: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user : null,
  });
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    res.send({ logout: !err });
  });
});

router.post("/sendcode", async (req, res) => {
  try {
    const { toEmail } = req.body;

    const { resetToken, creationTime } = generateResetTokenWithExpiry();
    const saveTokenResult = await ChatMingle.saveResetToken(
      toEmail,
      resetToken,
      "email"
    );

    if (!saveTokenResult.success) {
      return res
        .status(500)
        .json({ success: false, message: "Error saving reset token." });
    }

    let sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.sender = {
      email: "chatmingle@contact.us",
      name: "ChatMingle Support",
    };

    sendSmtpEmail.to = [
      {
        email: toEmail,
        name: "Recipient Name",
      },
    ];

    sendSmtpEmail.subject = "Password Reset Request";
    sendSmtpEmail.htmlContent = `<p>You requested a password reset. Here's your token: <strong>${resetToken}</strong></p><p>If you didn't make this request, please ignore this email.</p>`;

    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending email.",
      error: error.message,
    });
  }
});

router.post("/sendsms", async (req, res) => {
  try {
    const { toPhone } = req.body;

    const { resetToken, creationTime } = generateResetTokenWithExpiry();
    const saveTokenResult = await ChatMingle.saveResetToken(
      toPhone,
      resetToken,
      "phone"
    );

    if (!saveTokenResult.success) {
      return res
        .status(500)
        .json({ success: false, message: "Error saving reset token." });
    }

    const smsMessage = `You requested a password reset. Here's your token: ${resetToken}`;
    const message = await twilioClient.messages.create({
      body: smsMessage,
      to: toPhone,
      from: "+12059971071",
    });

    res.status(200).json({ success: true, message: "SMS sent successfully." });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending SMS.",
      error: error.message,
    });
  }
});

router.post("/resetpassword", async (req, res) => {
  try {
    const { identifier, resetToken, newPassword } = req.body;

    console.log("Received reset password request:", {
      identifier,
      resetToken,
      newPassword,
    });

    const storedResetToken = await ChatMingle.getResetToken(identifier);

    if (!storedResetToken) {
      return res.status(401).json({
        success: false,
        message: "Reset token not found.",
      });
    }

    const parsedResetToken = parseInt(resetToken, 10);

    if (parsedResetToken !== storedResetToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token.",
      });
    }

    const user = await ChatMingle.getUserByIdentifier(identifier);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    const updatePasswordResult = await ChatMingle.updateUserPassword(
      user.phone,
      hash
    );

    if (updatePasswordResult.success) {
      await ChatMingle.invalidateResetToken(user.phone);

      return res.status(200).json({
        success: true,
        message: "Password reset successfully.",
      });
    } else {
      return res.status(500).json({
        success: false,
        message: "Error updating password.",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error resetting password.",
      error: error.message,
    });
  }
});

router.post(
  "/uploadimg",
  isLoggedIn,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res
          .status(400)
          .json({ success: false, message: "No file uploaded." });
      }

      const authToken = req.headers.authorization.split(" ")[1];
      const decodedToken = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
      const userId = decodedToken.sub;

      if (!userId) {
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized." });
      }

      const { buffer, originalname } = req.file;

      const uploadParams = {
        Bucket: "chatmingle-bucket", // Replace with your S3 bucket name
        Key: `images/${userId}/${originalname}`,
        Body: buffer,
      };

      try {
        const uploadResult = await s3.send(new PutObjectCommand(uploadParams));

        // Extract Bucket and Key from uploadParams
        const { Bucket, Key } = uploadParams;

        if (Bucket && Key) {
          const s3URL = `https://${Bucket}.s3.amazonaws.com/${Key}`;

          // Update user document with S3 image details
          const updateUserResult = await ChatMingle.updateUserImage(
            userId,
            originalname,
            s3URL
          );

          if (updateUserResult.success) {
            res.status(200).json({
              success: true,
              message: "Image uploaded successfully",
              filename: originalname,
              filePath: updateUserResult.path,
            });
          } else {
            console.error(
              "Error updating user with image details:",
              updateUserResult.message
            );
            res.status(500).json({
              success: false,
              message: "Error updating user with image details.",
              error: updateUserResult.message,
            });
          }
        } else {
          console.error(
            "Bucket or Key is undefined in uploadParams:",
            uploadParams
          );
          res.status(500).json({
            success: false,
            message: "Error uploading image. Bucket or Key is undefined.",
          });
        }
      } catch (uploadError) {
        console.error("Error uploading image to S3:", uploadError);
        res.status(500).json({
          success: false,
          message: "Error uploading image to S3.",
          error: uploadError.message,
        });
      }
    } catch (error) {
      console.error("Error processing image upload request:", error);
      res.status(500).json({
        success: false,
        message: "Error processing image upload request.",
        error: error.message,
      });
    }
  }
);

module.exports = router;
