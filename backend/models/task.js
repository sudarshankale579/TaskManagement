const mongoose = require('mongoose');

// Define the Task schema
const taskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category', // Reference to the Category model
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'In-Progress', 'Completed'],
    // default: 'pending',
  },

  dueDate: {
    type: Date, // Define the type for dueDate
    required: true, // Set to true if you want to enforce that a due date must be provided
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the Category model
    required: true,
  },
  
}, { timestamps: true }); // Automatically adds createdAt and updatedAt fields

// Create the Task model
const Task = mongoose.model('Task', taskSchema);

module.exports = Task;
