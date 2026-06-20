import { MongoClient } from "mongodb";
import { DATABASE_URL } from "./environment";

const client = new MongoClient(DATABASE_URL, {
  serverSelectionTimeoutMS: 10000,
  family: 4,
});

(async () => {
  try {
    await client.connect();
    console.log(`\x1b[32m
+==================================================+
✅ MongoDB Connected
+==================================================+
`);
  } catch (err) {
    console.error("❌ MongoDB Gagal Connect: ", err);
    process.exit(1);
  }
})();

export const db = client.db("cybernet");
export const admin = db.collection("admin");
export const region = db.collection("regions");
export const membership = db.collection("membership")