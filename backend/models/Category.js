// models/Category.js

const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true, // Ensures no duplicate category names
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the Category model
    required: true,
  },
  
}, { timestamps: true });

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
