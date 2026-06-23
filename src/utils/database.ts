import { MongoClient } from "mongodb";
import { DATABASE_URL } from "./environment";

let cachedClient: MongoClient | null = null;

const connectDB = async () => {
  if (cachedClient) {
    console.log("♻️ Using cached MongoDB connection");
    return cachedClient;
  }

  try {
    console.log("🔌 Connecting to MongoDB...");

    const client = new MongoClient(DATABASE_URL, {
      maxPoolSize: 10,
      minPoolSize: 2,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      retryWrites: true,
      retryReads: true,
      family: 4,
    });

    await client.connect();

    cachedClient = client;
    console.log(`\x1b[32m
+==================================================+
✅ MongoDB Connected
+==================================================+
`);

    return client;
  } catch (err) {
    console.error("❌ MongoDB Connection Error: ", err);
    throw err;
  }
};

const getDB = async () => {
  const client = await connectDB();
  return client.db("cybernet");
};

const getCollection = async (collectionName: string) => {
  const db = await getDB();
  return db.collection(collectionName);
};

export const getAdmin = () => getCollection("admin");
export const getRegion = () => getCollection("regions");
export const getClientMember = () => getCollection("client");
export const getMembership = () => getCollection("membership");

export { getDB, connectDB };
