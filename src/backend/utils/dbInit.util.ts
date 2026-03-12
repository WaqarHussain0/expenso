import connectToDB from "./database.util";

export async function initDB(isServerSide=false) {
  try {
    await connectToDB(isServerSide);
    console.log("MongoDB connected ✅");
  } catch (err) {
    console.error("MongoDB connection failed ❌", err);
  }
}
