import connectToDB from './database.util';

export async function initDB() {
  await connectToDB();
}
