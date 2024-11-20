const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trading-journal')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));
  // Trade Schema
  const tradeSchema = new mongoose.Schema({
    date: { type: Date, required: true },
    type: { type: String, required: true },
    pair: { type: String, required: true },
    direction: { type: String, required: true },
    riskRewardRatio: { type: String, required: true },
    riskAmount: { type: Number, required: true },
    outcome: { type: String, required: true },
    notes: String,
    createdAt: { type: Date, default: Date.now }
  });
  
  const Trade = mongoose.model('Trade', tradeSchema);
  
  // Routes
  app.get('/api/trades', async (req, res) => {
    try {
      const trades = await Trade.find().sort({ date: -1 });
      res.json(trades);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  app.post('/api/trades', async (req, res) => {
    const trade = new Trade(req.body);
    try {
      const newTrade = await trade.save();
      res.status(201).json(newTrade);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  });
  
  app.delete('/api/trades/:id', async (req, res) => {
    try {
      await Trade.findByIdAndDelete(req.params.id);
      res.json({ message: 'Trade deleted' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));