const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load env vars
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('MongoDB Connected'))
  .catch((err) => console.log('MongoDB Connection Error:', err));

const User = require('./models/User');

async function createAdminUser() {
  try {
    // First, delete any existing admin user
    await User.deleteOne({ email: 'admin@college.com' });

    // Create new admin user with plain password (will be hashed by the model)
    const adminUser = await User.create({
      email: 'admin@college.com',
      password: 'Admin@123',  // Model's pre-save hook will hash this
      role: 'admin'
    });

    console.log('Admin user created successfully!');
    console.log('Email: admin@college.com');
    console.log('Password: Admin@123');
    
    // Verify the user was created and password works
    const user = await User.findOne({ email: 'admin@college.com' }).select('+password');
    if (!user) {
      throw new Error('User was not created properly');
    }

    const isMatch = await user.matchPassword('Admin@123');
    if (!isMatch) {
      throw new Error('Password was not hashed properly');
    }

    console.log('Password verification successful!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
}

createAdminUser();