require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');

async function seedAdmin() {
  try {
    await connectDB();

    const email = process.env.ADMIN_EMAIL || 'admin@sweetshop.com';
    const password = process.env.ADMIN_PASSWORD || 'Admin@12345';

    let admin = await User.findOne({ email });
    if (admin) {
      console.log('Admin user already exists:', admin.email);
    } else {
      admin = await User.create({ name: 'Admin', email, password, role: 'admin' });
      console.log('Admin user created:', admin.email);
    }
  } catch (err) {
    console.error('Admin seed failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedAdmin();
