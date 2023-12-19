require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

function ChatMingle() {
  const ChatMingle = {};

  const url = process.env.MONGODB_URI;
  const DB_NAME = "ChatMingle";

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

  return ChatMingle;
}

module.exports = ChatMingle();
