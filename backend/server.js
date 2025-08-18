
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const registrationSchema = new mongoose.Schema({
  playerName: String,
  email: String,
  freeFireUID: String,
  phoneNumber: String,
});

const Registration = mongoose.model('Registration', registrationSchema);

app.post('/api/register', async (req, res) => {
  try {
    const { playerName, email, freeFireUID, phoneNumber } = req.body;
    // Check if UID already exists
    const existing = await Registration.findOne({ freeFireUID });
    if (existing) {
      return res.status(400).json({ error: 'Free Fire UID already registered' });
    }
    const registration = new Registration({ playerName, email, freeFireUID, phoneNumber });
    await registration.save();
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});



// Endpoint to get registration count
app.get('/api/registration-count', async (req, res) => {
  try {
    const count = await Registration.countDocuments();
    res.json({ count });
  } catch {
    res.status(500).json({ error: 'Failed to get count' });
  }
});

app.listen(5000, () => {
  console.log('Server running on http://localhost:5000');
});