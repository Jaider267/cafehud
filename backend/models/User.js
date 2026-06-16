import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['client', 'user', 'admin'],
    default: 'client'
  },
  points: {
    type: Number,
    default: 0,
    min: 0
  },
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cafe'
  }]
}, {
  timestamps: true
});

export default mongoose.model('User', userSchema);
