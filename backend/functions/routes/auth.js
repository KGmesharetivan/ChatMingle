const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const ChatMingle = require("../MongoDB/ChatMingledb");
const SibApiV3Sdk = require("sib-api-v3-sdk");
const moment = require("moment");

const saltRounds = 10;
const secretKey =
  "fb541366046928fd9acfd2bcb1db8bf06d0d124342d136d56e079e27164113d9";

// Initialize Twilio client
const accountSid = "AC9e3dd6e20a92ebeb8014b25f1bfe7e25";
const authToken = "63666ae5e82bfbeda25062aa381b859f";
const twilioClient = new twilio(accountSid, authToken);

// Set your Sendinblue API key
var defaultClient = SibApiV3Sdk.ApiClient.instance;
defaultClient.authentications["api-key"].apiKey =
  "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";

// Instantiate the EmailCampaignsApi
const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

// Helper function to generate a 6-digit reset token and store creation time
const generateResetTokenWithExpiry = () => {
  const min = 100000; // Minimum 6-digit number
  const max = 999999; // Maximum 6-digit number
  const resetToken = Math.floor(Math.random() * (max - min + 1)) + min;

  // Store the current date and time along with the token
  const creationTime = new Date();

  return { resetToken, creationTime };
};

// Example of how to use the modified function
const { resetToken, creationTime } = generateResetTokenWithExpiry();
console.log("Generated Reset Token:", resetToken);
console.log("Creation Time:", creationTime);

// Handles login requests
router.post("/login", async (req, res, next) => {
  const { username, password } = req.body;

  try {
    let user;

    // Check if the username is a valid email format
    if (/^\S+@\S+\.\S+$/.test(username)) {
      user = await ChatMingle.getUserByEmail(username);
    } else {
      // Assume it's a phone number
      user = await ChatMingle.getUserByPhone(username);
    }

    if (!user || !(await bcrypt.compare(password, user.hash))) {
      return res.status(401).send({ loginStatus: false });
    }

    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }

      const token = jwt.sign({ sub: user._id }, secretKey);

      res.send({ loginStatus: true, user, token });
    });
  } catch (error) {
    res.status(500).send({ loginStatus: false });
  }
});

// Handles user registration
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

// Checks if the user is logged in
router.get("/isLoggedIn", (req, res) => {
  res.send({
    isLoggedIn: req.isAuthenticated(),
    user: req.isAuthenticated() ? req.user : null,
  });
});

// Logs out the user
router.get("/logout", (req, res) => {
  req.logout((err) => {
    res.send({ logout: !err });
  });
});

// Sends reset link via Twilio (SMS)
router.post("/sendcode", async (req, res) => {
  try {
    const { toEmail } = req.body;

    // Generate a 6-digit reset token and save it in the database
    const { resetToken, creationTime } = generateResetTokenWithExpiry();
    const saveTokenResult = await ChatMingle.saveResetToken(
      toEmail,
      resetToken,
      "email"
    );

    if (!saveTokenResult.success) {
      console.error("Error saving reset token:", saveTokenResult.message);
      return res
        .status(500)
        .json({ success: false, message: "Error saving reset token." });
    }

    // Use SendinBlue to send the email
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

    // Log request headers before sending
    console.log(
      "SendinBlue API Request Headers:",
      defaultClient._defaultHeaders
    );

    // Send the email
    const response = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("SendinBlue API Response:", response);

    res
      .status(200)
      .json({ success: true, message: "Email sent successfully." });
  } catch (error) {
    console.error("Error sending email:", error.message);
    res.status(500).json({
      success: false,
      message: "Error sending email.",
      error: error.message,
    });
  }
});

// Define the Brevo campaign settings
router.post("/sendsms", async (req, res) => {
  try {
    const { toPhone } = req.body;

    // Generate a 6-digit reset token and save it in the database
    const { resetToken, creationTime } = generateResetTokenWithExpiry();
    const saveTokenResult = await ChatMingle.saveResetToken(
      toPhone,
      resetToken,
      "phone"
    );

    if (!saveTokenResult.success) {
      console.error("Error saving reset token:", saveTokenResult.message);
      return res
        .status(500)
        .json({ success: false, message: "Error saving reset token." });
    }

    // Use Twilio to send the SMS with the reset token
    const smsMessage = `You requested a password reset. Here's your token: ${resetToken}`;
    const message = await twilioClient.messages.create({
      body: smsMessage,
      to: toPhone, // Replace with the recipient's phone number
      from: "+12059971071", // Replace with your Twilio phone number
    });

    console.log("Twilio Message SID:", message.sid);

    res.status(200).json({ success: true, message: "SMS sent successfully." });
  } catch (error) {
    console.error("Error sending SMS:", error.message);
    res.status(500).json({
      success: false,
      message: "Error sending SMS.",
      error: error.message,
    });
  }
});

// Handles password reset
router.post("/resetpassword", async (req, res) => {
  try {
    const { identifier, resetToken, newPassword } = req.body;

    console.log("Received reset password request:", {
      identifier,
      resetToken,
      newPassword,
    });

    // Get the reset token for the user
    const storedResetToken = await ChatMingle.getResetToken(identifier);

    if (!storedResetToken) {
      return res.status(401).json({
        success: false,
        message: "Reset token not found.",
      });
    }

    // Parse the received reset token as an integer for comparison
    const parsedResetToken = parseInt(resetToken, 10);

    // Check if the reset token matches the one stored in the database
    if (parsedResetToken !== storedResetToken) {
      return res.status(401).json({
        success: false,
        message: "Invalid reset token.",
      });
    }

    // Proceed with password update
    const user = await ChatMingle.getUserByIdentifier(identifier);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    const hash = await bcrypt.hash(newPassword, 10);
    const updatePasswordResult = await ChatMingle.updateUserPassword(
      user.phone, // Assuming you're using phone as the identifier
      hash
    );

    if (updatePasswordResult.success) {
      // Invalidate the reset token after password reset
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
    console.error("Error resetting password:", error.message);
    return res.status(500).json({
      success: false,
      message: "Error resetting password.",
      error: error.message,
    });
  }
});

module.exports = router;
