const mongoose = require('mongoose');

const processSchema = new mongoose.Schema({
  pid: { type: String },
  arrival: { type: Number },
  burst: { type: Number }
}, { _id: false });

const simulationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  algorithm: { type: String, required: true },
  quantum: { type: Number },
  processes: { type: [processSchema], default: [] },
  result: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

// Add indexes to speed up common queries (by user and recent creations)
simulationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model('Simulation', simulationSchema);
