require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const User = require('../models/User');
const Sweet = require('../models/Sweet');

async function seedSampleData() {
  try {
    await connectDB();

    // Create a demo user if not exists
    const demoEmail = process.env.DEMO_USER_EMAIL || 'user@sweetshop.com';
    const demoPassword = process.env.DEMO_USER_PASSWORD || 'User@12345';

    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      demoUser = await User.create({ name: 'Demo User', email: demoEmail, password: demoPassword, role: 'user' });
      console.log('Demo user created:', demoUser.email);
    } else {
      console.log('Demo user already exists:', demoUser.email);
    }

    const sweets = [
      { name: 'Gulab Jamun', category: 'Indian', price: 12.5, quantity: 100, imageUrl: 'https://i.postimg.cc/NM0c9B47/Gemini-Generated-Image-gyndi2gyndi2gynd-removebg-preview-1.png' },
      { name: 'Rasgulla', category: 'Indian', price: 10.0, quantity: 120, imageUrl: 'https://i.postimg.cc/MGLSQgrC/Gemini-Generated-Image-jeutk2jeutk2jeut-removebg-preview.png' },
      { name: 'Kaju Katli', category: 'Indian', price: 25.0, quantity: 80, imageUrl: 'https://i.postimg.cc/JhvfnZsm/Gemini-Generated-Image-2kd6ga2kd6ga2kd6-removebg-preview.png' },
      { name: 'Barfi', category: 'Indian', price: 18.0, quantity: 60, imageUrl: 'https://i.postimg.cc/BbMN8fmD/Gemini-Generated-Image-jve0tejve0tejve0-removebg-preview.png' },
      { name: 'Ladoo', category: 'Indian', price: 15.0, quantity: 150, imageUrl: 'https://i.postimg.cc/nL1xhTym/Gemini-Generated-Image-ngz7f5ngz7f5ngz7-removebg-preview.png' },
      { name: 'Jalebi', category: 'Indian', price: 8.0, quantity: 200, imageUrl: 'https://i.postimg.cc/s2WcYNjB/Gemini-Generated-Image-fkayw1fkayw1fkay-removebg-preview.png' },
      { name: 'Soan Papdi', category: 'Indian', price: 12.0, quantity: 90, imageUrl: 'https://i.postimg.cc/htsJH82C/Gemini-Generated-Image-43y81l43y81l43y8-removebg-preview.png' },
      { name: 'Peda', category: 'Indian', price: 14.0, quantity: 110, imageUrl: 'https://i.postimg.cc/qM8d4Wbj/Gemini-Generated-Image-noymnbnoymnbnoym.png' },
      { name: 'Chocolate Truffle', category: 'Western', price: 30.0, quantity: 50, imageUrl: 'https://i.postimg.cc/Tw9Wzk8w/Gemini-Generated-Image-y3hx76y3hx76y3hx.png' },
      { name: 'Cheesecake Slice', category: 'Western', price: 28.0, quantity: 40, imageUrl: 'https://i.postimg.cc/t4Hg4Yz7/Gemini-Generated-Image-4c47th4c47th4c47-removebg-preview.png' },
    ];

    // Upsert sweets by name to avoid duplicates
    const ops = sweets.map((s) => {
      const { imageUrl, ...insertDoc } = s;
      const update = { $setOnInsert: insertDoc };
      if (imageUrl) update.$set = { imageUrl };
      return {
        updateOne: {
          filter: { name: s.name },
          update,
          upsert: true,
        },
      };
    });

    if (ops.length > 0) {
      const res = await Sweet.bulkWrite(ops);
      const inserted = res.upsertedCount || 0;
      console.log(`Sweets upserted: ${inserted} (existing were skipped)`);
    }

    console.log('Sample data seeding completed.');
  } catch (err) {
    console.error('Sample data seed failed:', err.message);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

seedSampleData();
