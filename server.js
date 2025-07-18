require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const adminRoutes = require('./routes/adminRoutes');
const connectDB = require('./config/db');

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: 'https://gym-management-production-e84d.up.railway.app', // <-- your frontend origin
  credentials: true
}));
app.use(bodyParser.json());

// Routes
app.use('/api', adminRoutes);

// Connect to MongoDB and start server
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});