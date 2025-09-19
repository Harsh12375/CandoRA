const mongoose = require('mongoose');

async function connectDB(uri) {
  const mongoUri = uri || process.env.MONGO_URI;
  if (!mongoUri) throw new Error('MONGO_URI is not set');

  mongoose.set('strictQuery', true);
  await mongoose.connect(mongoUri);
  console.log('MongoDB connected');
}

module.exports = connectDB;
