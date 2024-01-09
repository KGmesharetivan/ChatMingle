import dotenv from "dotenv";
import { MongoClient, ObjectId } from "mongodb";

dotenv.config();

class ChatMingle {
  constructor() {
    this.url = process.env.MONGO_URI;
    this.DB_NAME = "ChatMingle";
    this.client = new MongoClient(this.url, { maxPoolSize: 10 });
    this.connected = false; // Track the connection status
  }

  async init() {
    try {
      if (!this.connected) {
        await this.client.connect();
        console.log("Connected to MongoDB");
        this.connected = true;
      }
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error;
    }
  }

  async connectToDatabase() {
    try {
      await this.init(); // Ensure connection is established

      // Reconnect logic moved here
      if (!this.client.isConnected) {
        this.client = new MongoClient(this.url, { maxPoolSize: 10 });
        await this.client.connect();
        console.log("Reconnected to MongoDB");
      }

      return this.client;
    } catch (error) {
      console.error("Error connecting to the database:", error);
      throw error;
    }
  }

  async executeMongoOperation(callback) {
    let client;
    try {
      client = await this.connectToDatabase();
      return await callback(client.db(this.DB_NAME));
    } catch (error) {
      console.error("MongoDB Operation Error:", error);
      throw error;
    } finally {
      if (client) {
        await this.closeDatabaseConnection();
      }
    }
  }

  async getUserByEmail(email) {
    let client;
    try {
      client = await this.connectToDatabase();
      const db = client.db(this.DB_NAME);
      const usersCollection = db.collection("users");
      return await usersCollection.findOne({ email });
    } catch (error) {
      console.error("Error in getUserByEmail:", error);
      throw error;
    } finally {
      if (client) {
        await this.closeDatabaseConnection(client);
      }
    }
  }

  async getUserById(query) {
    let client;
    try {
      client = await this.connectToDatabase();
      if (!client) {
        console.error("MongoDB client not connected");
        return null;
      }

      console.log("Connected to MongoDB");

      const db = client.db(this.DB_NAME);
      const usersCollection = db.collection("users");

      if (Array.isArray(query)) {
        const objectIds = query.map((id) => new ObjectId(id));
        const users = await usersCollection
          .find({ _id: { $in: objectIds } })
          .toArray();

        if (users.length === 0) {
          console.error(`Users with IDs ${query.join(", ")} not found.`);
        }

        return users;
      } else {
        const userId = new ObjectId(query);
        const user = await usersCollection.findOne({ _id: userId });

        if (!user) {
          console.error(`User with ID ${query} not found.`);
        }

        return user;
      }
    } catch (error) {
      console.error("Error in getUserById:", error);
      throw error; // Rethrow the error
    } finally {
      await this.closeDatabaseConnection(client);
    }
  }

  async saveNewUser(newUser) {
    let client;
    try {
      client = await this.connectToDatabase();
      const db = client.db(this.DB_NAME);
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
      await this.closeDatabaseConnection(client);
    }
  }

  async getUserByPhone(phone) {
    let client;
    try {
      client = await this.connectToDatabase();
      const db = client.db(this.DB_NAME);
      const usersCollection = db.collection("users");

      console.log("Connected to MongoDB");

      console.log("Querying for user with phone:", phone);

      const user = await usersCollection.findOne({ phone });

      console.log("User found:", user);

      return user;
    } catch (error) {
      console.error("Error in getUserByPhone:", error);
      throw error;
    } finally {
      await this.closeDatabaseConnection(client);
    }
  }

  async saveResetToken(identifier, resetToken, tokenType) {
    let client;
    try {
      client = await this.connectToDatabase();
      const db = client.db(this.DB_NAME);
      const usersCollection = db.collection("users");

      console.log(
        `Saving ${tokenType} token for identifier: ${identifier}, Token: ${resetToken}`
      );

      const existingUser = await usersCollection.findOne({
        [tokenType]: identifier,
      });

      if (!existingUser) {
        console.log(
          `User not found. Creating new user for identifier: ${identifier}`
        );
      }

      const result = await usersCollection.updateOne(
        { [tokenType]: identifier },
        {
          $set: { resetToken },
          $setOnInsert: {
            /* other fields */
          },
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
      throw error;
    } finally {
      await this.closeDatabaseConnection(client);
    }
  }

  async getResetToken(identifier, tokenType) {
    let client;
    try {
      client = await this.connectToDatabase();
      const db = client.db(this.DB_NAME);
      const usersCollection = db.collection("users");

      console.log("Querying for reset token with identifier:", identifier);

      const isPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(identifier);

      const user = isPhoneNumber
        ? await usersCollection.findOne({ phone: identifier })
        : await usersCollection.findOne({ email: identifier });

      console.log("Reset token found:", user && user[tokenType]);

      return user && user[tokenType] ? user[tokenType] : null;
    } catch (error) {
      console.error("Error in getResetToken:", error);
      throw error;
    } finally {
      await this.closeDatabaseConnection(client);
    }
  }

  async updateUserPassword(phone, hash) {
    let client;
    try {
      client = await this.connectToDatabase();
      const db = client.db(this.DB_NAME);
      const usersCollection = db.collection("users");

      console.log(`Updating password for user with phone: ${phone}`);

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
      throw error;
    } finally {
      await this.closeDatabaseConnection(client);
    }
  }

  async invalidateResetToken(phone) {
    let client;
    try {
      client = await this.connectToDatabase();
      const db = client.db(this.DB_NAME);
      const usersCollection = db.collection("users");

      console.log(`Invalidating reset token for user with phone: ${phone}`);

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
      throw error;
    } finally {
      await this.closeDatabaseConnection(client);
    }
  }

  async getUserByIdentifier(identifier) {
    let client;
    try {
      client = await this.connectToDatabase();
      const db = client.db(this.DB_NAME);
      const usersCollection = db.collection("users");

      console.log("Connected to MongoDB");

      console.log("Querying for user with identifier:", identifier);

      const isPhoneNumber = /^\+?[1-9]\d{1,14}$/.test(identifier);

      const user = isPhoneNumber
        ? await usersCollection.findOne({ phone: identifier })
        : await usersCollection.findOne({ email: identifier });

      console.log("User found:", user);

      return user || null;
    } catch (error) {
      console.error("Error in getUserByIdentifier:", error);
      throw error;
    } finally {
      await this.closeDatabaseConnection(client);
    }
  }

  async updateUserImage(userId, filename, path) {
    let client;
    try {
      console.log("Updating user image:", userId, filename, path);

      client = await this.connectToDatabase();
      const db = client.db(this.DB_NAME);
      const usersCollection = db.collection("users");

      const userIdObj = new ObjectId(userId);

      console.log("Searching for user:", userIdObj);

      const userExists = await usersCollection.findOne({ _id: userIdObj });

      if (!userExists) {
        console.error("User not found");
        return {
          success: false,
          message: "User not found",
          path: path,
        };
      }

      const result = await usersCollection.updateOne(
        { _id: userIdObj },
        { $set: { profileImage: { filename, path } } }
      );

      console.log("Update result:", result);

      return {
        success: result.modifiedCount > 0,
        message:
          result.modifiedCount > 0
            ? "User image updated successfully"
            : "Image not updated",
        path: path,
      };
    } catch (error) {
      console.error("Error updating user image:", error.message);
      throw error;
    } finally {
      await this.closeDatabaseConnection(client);
    }
  }

  async removeUserImage(userId) {
    try {
      const db = await this.connectToDatabase();
      const usersCollection = db.collection("users");

      const updateResult = await usersCollection.updateOne(
        { _id: new ObjectId(userId) },
        { $unset: { profileImage: "" } }
      );

      if (updateResult.modifiedCount === 1) {
        return { success: true };
      } else {
        return {
          success: false,
          message: "User not found or profileImage field already removed.",
        };
      }
    } catch (error) {
      console.error("Error removing user image:", error);
      return { success: false, message: "Error removing user image." };
    } finally {
      await this.closeDatabaseConnection();
    }
  }

  async saveResetToken(identifier, resetToken, tokenType) {
    let client;
    try {
      client = await this.connectToDatabase();
      const db = client.db(this.DB_NAME);
      const tokensCollection = db.collection("tokens");

      console.log(
        `Saving ${tokenType} token for identifier: ${identifier}, Token: ${resetToken}`
      );

      const existingToken = await tokensCollection.findOne({
        [tokenType]: identifier,
      });

      if (!existingToken) {
        console.log(
          `Token not found. Creating new token for identifier: ${identifier}`
        );
      }

      const result = await tokensCollection.updateOne(
        { [tokenType]: identifier },
        {
          $set: { resetToken, tokenType }, // Include tokenType in the set operation
          $setOnInsert: {
            /* other fields */
          },
        },
        { upsert: true }
      );

      console.log("Update Result:", result);

      return {
        success: result.modifiedCount > 0 || result.upsertedCount > 0,
        message:
          result.modifiedCount > 0
            ? "Token saved successfully"
            : "Token not saved",
      };
    } catch (error) {
      console.error(
        `Error saving reset token for ${tokenType}. Identifier: ${identifier}`,
        error
      );
      throw error;
    } finally {
      await this.closeDatabaseConnection(client);
    }
  }

  async closeDatabaseConnection() {
    try {
      if (this.client) {
        await this.client.close();
        console.log("Closed MongoDB connection");
        this.connected = false; // Reset the connection status
      }
    } catch (error) {
      console.error("Error closing the database connection:", error);
      throw error;
    }
  }
}

export default new ChatMingle();
