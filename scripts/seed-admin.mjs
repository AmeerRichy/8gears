import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;
const username = process.env.ADMIN_USERNAME?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
const email = (process.env.ADMIN_EMAIL || (username?.includes('@') ? username : 'admin@8gears.com'))?.toLowerCase();

if (!uri || !username || !password || !email) {
  throw new Error('MONGODB_URI, ADMIN_USERNAME, ADMIN_PASSWORD, and ADMIN_EMAIL are required');
}
if (password.length < 8) throw new Error('ADMIN_PASSWORD must be at least 8 characters');

const client = new MongoClient(uri);
try {
  await client.connect();
  const collection = client.db().collection('adminusers');
  const existing = await collection.findOne({ $or: [{ username }, { email }] });
  if (existing) {
    console.log(`Admin user already exists: ${existing.email}`);
  } else {
    const now = new Date();
    await collection.insertOne({
      name: 'Administrator', email, username,
      passwordHash: await bcrypt.hash(password, 12),
      role: 'super_admin', customRoleName: '', allowedPages: [], isActive: true,
      createdAt: now, updatedAt: now,
    });
    await collection.createIndex({ email: 1 }, { unique: true });
    await collection.createIndex({ username: 1 }, { unique: true });
    console.log(`Created first super-admin: ${email}`);
  }
} finally {
  await client.close();
}
