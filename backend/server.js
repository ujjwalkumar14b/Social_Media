import dotenv from 'dotenv';
import connectDB from './src/config/db.js';
import app from './src/app.js';

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB Database
connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});