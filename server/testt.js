const { MongoClient } = require("mongodb");

const uri = "mongodb+srv://adhi:1234@db.usshl9s.mongodb.net"; // Explicitly use IPv4 address
const dbName = 'testinggg'; // Replace with your database name

const findNullValues = async () => {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db(dbName);
    const collections = await db.listCollections().toArray();

    for (const { name } of collections) {
      const collection = db.collection(name);
      const nullDocs = await collection.find({ 
        $or: [
          { quizId: null },
          { userId: null },
          { someOtherField: null }
        ] 
      }).toArray();

      if (nullDocs.length > 0) {
        console.log(`Collection: ${name}`);
        console.log(JSON.stringify(nullDocs, null, 2));
      }
    }
  } finally {
    await client.close();
  }
};

findNullValues().catch(console.error);
