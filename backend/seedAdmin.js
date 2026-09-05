import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

// Simple Inline Schema to prevent import path errors
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  role: String,
});

const User = mongoose.models.User || mongoose.model('User', userSchema);

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/social_media_db');

    // Remove existing admin if present
    await User.deleteOne({ email: 'admin@gmail.com' });

    // Hash the simple password "admin"
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin', salt);

    // Create Admin user
    await User.create({
      username: 'Admin',
      email: 'admin@gmail.com',
      password: hashedPassword,
      role: 'admin',
    });

    console.log('✅ Admin user successfully created!');
    console.log('Email: admin@gmail.com | Password: admin');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to seed admin:', error.message);
    process.exit(1);
  }
};

seedAdmin();