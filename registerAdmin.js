const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./config/db');

// Define Admin schema (same as in your models/Admin.js)
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});
const Admin = mongoose.model('Admin', adminSchema);

const run = async () => {
  await connectDB();

  // Get email and password from CLI arguments
  const [,, email, password] = process.argv;
  if (!email || !password) {
    console.log('Usage: node registerAdmin.js <email> <password>');
    process.exit(1);
  }

  // Hash password
  const hashed = await bcrypt.hash(password, 10);

  // Upsert admin: update if exists, otherwise create
  const result = await Admin.findOneAndUpdate(
    { email },
    { password: hashed },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  if (result) {
    console.log('Admin created or password updated successfully');
  } else {
    console.log('Operation failed');
  }
  process.exit(0);
};

run().catch(err => {
  console.error(err);
  process.exit(1);
});