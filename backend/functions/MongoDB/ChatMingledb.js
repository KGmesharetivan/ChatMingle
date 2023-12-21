// Import necessary MongoDB modules
const { MongoClient, ObjectId } = require("mongodb");

// Define the ChatMingle module
function ChatMingle() {
  const ChatMingle = {};

  const url =
    "mongodb+srv://mesharet93:fh1TKG5wWQigURlz@cluster0.osfx5k9.mongodb.net/ChatMingle";
  const DB_NAME = "ChatMingle";

  // Function to get a user by email
  ChatMingle.getUserByEmail = async function (email) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");
      return await usersCollection.findOne({ email });
    } finally {
      client.close();
    }
  };

  // Function to get a user by ID or an array of IDs
  ChatMingle.getUserById = async function (query) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");

      if (Array.isArray(query)) {
        const objectIds = query.map((id) => new ObjectId(id));
        return await usersCollection
          .find({ _id: { $in: objectIds } })
          .toArray();
      } else {
        return await usersCollection.findOne({ _id: new ObjectId(query) });
      }
    } finally {
      client.close();
    }
  };

  // Function to save a new user
  ChatMingle.saveNewUser = async function (newUser) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");

      if (newUser.googleId) {
        const existingUser = await usersCollection.findOne({
          googleId: newUser.googleId,
        });
        if (existingUser) {
          return { acknowledged: false };
        }
      }

      return await usersCollection.insertOne(newUser);
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    } finally {
      client.close();
    }
  };

  // Function to get a user by phone number
  ChatMingle.getUserByPhone = async function (phone) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connected to MongoDB");

      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");

      // Log the query being executed
      console.log("Querying for user with phone:", phone);

      const user = await usersCollection.findOne({ phone });

      // Log the result of the query
      console.log("User found:", user);

      return user;
    } catch (error) {
      console.error("Error in getUserByPhone:", error);
      throw error; // Rethrow the error to be handled elsewhere if needed
    } finally {
      if (client) {
        await client.close();
        console.log("Closed MongoDB connection");
      }
    }
  };

  // Function to save a reset token for a user
  ChatMingle.saveResetToken = async function (
    identifier,
    resetToken,
    tokenType
  ) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");

      // Log the identifier and resetToken being saved
      console.log(
        `Saving ${tokenType} token for identifier: ${identifier}, Token: ${resetToken}`
      );

      // Check if the user already exists
      const existingUser = await usersCollection.findOne({
        [tokenType]: identifier,
      });

      if (!existingUser) {
        // Handle the case when the user does not exist
        // For example, you might want to create a new user here
        console.log(
          `User not found. Creating new user for identifier: ${identifier}`
        );
        // Create a new user document or handle it based on your application logic
      }

      // Update the user document to include the reset token
      const result = await usersCollection.updateOne(
        { [tokenType]: identifier },
        {
          $set: { resetToken },
          $setOnInsert: {
            /* other fields */
          }, // Specify additional fields if needed
        },
        { upsert: true }
      );

      console.log("Update Result:", result);

      return {
        success: result.modifiedCount > 0 || result.upsertedCount > 0,
        message:
          result.modifiedCount > 0
            ? "Token saved successfully"
            : "User not found or token not saved",
      };
    } catch (error) {
      console.error(
        `Error saving reset token for ${tokenType}. Identifier: ${identifier}`,
        error
      );
      throw error; // Rethrow the error to be handled elsewhere if needed
    } finally {
      try {
        if (client) {
          await client.close();
        }
      } catch (closeError) {
        console.error("Error closing MongoDB connection:", closeError);
      }

      console.log("Closed MongoDB connection");
    }
  };

  // Function to get the reset token for a user by phone
  ChatMingle.getResetToken = async function (identifier, tokenType) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");

      // Log the query being executed
      console.log("Querying for reset token with identifier:", identifier);

      // Check if the identifier is a valid phone number
      const isPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(identifier);

      // Use either getResetTokenByPhone or getResetTokenByEmail based on the identifier type
      const user = isPhoneNumber
        ? await usersCollection.findOne({ phone: identifier })
        : await usersCollection.findOne({ email: identifier });

      // Log the result of the query
      console.log("Reset token found:", user.resetToken);

      return user.resetToken || null; // Return null if resetToken is not found
    } catch (error) {
      console.error("Error in getResetToken:", error);
      throw error; // Rethrow the error to be handled elsewhere if needed
    } finally {
      if (client) {
        await client.close();
        console.log("Closed MongoDB connection");
      }
    }
  };

  // Function to update the user's password
  ChatMingle.updateUserPassword = async function (phone, hash) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");

      // Log the phone and hashed password being updated
      console.log(`Updating password for user with phone: ${phone}`);

      // Update the user document to include the new hashed password
      const result = await usersCollection.updateOne(
        { phone },
        { $set: { hash: hash } }
      );

      return {
        success: result.modifiedCount > 0,
        message:
          result.modifiedCount > 0
            ? "Password updated successfully"
            : "User not found or password not updated",
      };
    } catch (error) {
      console.error("Error in updateUserPassword:", error);
      throw error; // Rethrow the error to be handled elsewhere if needed
    } finally {
      if (client) {
        await client.close();
        console.log("Closed MongoDB connection");
      }
    }
  };

  // Function to invalidate the reset token for a user by phone
  ChatMingle.invalidateResetToken = async function (phone) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");

      // Log the phone and resetToken being invalidated
      console.log(`Invalidating reset token for user with phone: ${phone}`);

      // Update the user document to remove the reset token
      const result = await usersCollection.updateOne(
        { phone },
        { $unset: { resetToken: "" } }
      );

      return {
        success: result.modifiedCount > 0,
        message:
          result.modifiedCount > 0
            ? "Reset token invalidated successfully"
            : "User not found or reset token not invalidated",
      };
    } catch (error) {
      console.error("Error in invalidateResetToken:", error);
      throw error; // Rethrow the error to be handled elsewhere if needed
    } finally {
      if (client) {
        await client.close();
        console.log("Closed MongoDB connection");
      }
    }
  };

  // Function to get a user by phone number or email
  ChatMingle.getUserByIdentifier = async function (identifier) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      console.log("Connected to MongoDB");

      const db = client.db(DB_NAME);
      const usersCollection = db.collection("users");

      // Log the query being executed
      console.log("Querying for user with identifier:", identifier);

      // Check if the identifier is a valid phone number
      const isPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(identifier);

      // Use either getUserByPhone or getUserByEmail based on the identifier type
      const user = isPhoneNumber
        ? await usersCollection.findOne({ phone: identifier })
        : await usersCollection.findOne({ email: identifier });

      // Log the result of the query
      console.log("User found:", user);

      return user || null; // Return null if user is not found
    } catch (error) {
      console.error("Error in getUserByIdentifier:", error);
      throw error; // Rethrow the error to be handled elsewhere if needed
    } finally {
      if (client) {
        await client.close();
        console.log("Closed MongoDB connection");
      }
    }
  };

  return ChatMingle;
}

// Export the ChatMingle module
module.exports = ChatMingle();
