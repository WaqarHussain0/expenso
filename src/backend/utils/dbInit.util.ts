import connectToDB from "./database.util";

export async function initDB() {
  try {
    await connectToDB();
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB connection failed ❌", err);
  }
}
