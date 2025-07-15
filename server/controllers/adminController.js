const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'your_jwt_secret'; // Use env variable in production

exports.login = async (req, res) => {
  const { email, password } = req.body; // Use email, not username
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      SECRET,
      { expiresIn: '1h' }
    );
    res.json({ token, isAdmin: true });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};