import mongoose from 'mongoose';
import config from './config';
import User from './models/User';
import { randomUUID } from 'crypto';

const run = async () => {
  mongoose.set('strictQuery', false);
  await mongoose.connect(config.db);
  const db = mongoose.connection;

  try {
    await db.dropCollection('users');
  } catch (e) {
    console.log('Collections were not present, skipping drop...');
  }

  await User.create({
    displayName: 'Test Admin',
    email: 'test@test.com',
    role: 'admin',
    password: '123',
    token: randomUUID(),
  });

  await db.close();
  console.log('Success');
};
void run();
