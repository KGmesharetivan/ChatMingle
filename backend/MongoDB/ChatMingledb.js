require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");

function ChatMingle() {
  const ChatMingle = {};

  const url = process.env.MONGODB_URI;
  const DB_NAME = "ChatMingle";

  // try to find a user given an email
  ChatMingle.getUserByEmail = async function (email) {
    let client;
    try {
      client = new MongoClient(url, { useUnifiedTopology: true });
      await client.connect();
      const db = client.db(DB_NAME);
      const usersCollections = db.collection("users");
      const result = await usersCollections.findOne({
        email: email,
      });
      return result;
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

        const results = await usersCollection
          .find({ _id: { $in: objectIds } })
          .toArray();

        return results;
      } else {
        const result = await usersCollection.findOne({
          _id: new ObjectId(query),
        });

        return result;
      }
    } finally {
      client.close();
    }
  };

  return ChatMingle;
}

module.exports = ChatMingle();
