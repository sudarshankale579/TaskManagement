// controllers/taskController.js

const Task = require('../models/task');

// Add a new task
const addTask = async (req, res) => {
  const { title, description, category, dueDate, status, user } = req.body;

  if (!title || !description || !category) {
    return res.status(400).json({ msg: "Please provide title, description, and category." });
  }

  try {
    const newTask = new Task({ title, description, category, dueDate, status, user });
    await newTask.save();
    return res.status(201).json({ msg: "Task added successfully!", task: newTask });
  } catch (error) {
    return res.status(500).json({ msg: "Error adding task", error });
  }
};

// Get all tasks
const getAllTasks = async (req, res) => {
  try {
    
    const { userId } = req.params; 
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    // Fetch tasks for the specific user
    const tasks = await Task.find({ user: userId }).populate('category'); // Assuming 'user' references the User model
    return res.status(200).json({ tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error); // Log the error for debugging
    return res.status(500).json({ msg: "Error fetching tasks", error: error.message });
  }
};


// Update a task
const updateTask = async (req, res) => {
  const { id } = req.params;
  const { title, description, category } = req.body;

  if (!title && !description && !category) {
    return res.status(400).json({ msg: "Please provide at least one field to update." });
  }

  try {
    const updatedTask = await Task.findByIdAndUpdate(
      id,
      { title, description, category },
      { new: true, runValidators: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ msg: "Task not found." });
    }

    return res.status(200).json({ msg: "Task updated successfully!", task: updatedTask });
  } catch (error) {
    return res.status(500).json({ msg: "Error updating task", error });
  }
};

// Delete a task
const deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const deletedTask = await Task.findByIdAndDelete(taskId);

    if (!deletedTask) {
      return res.status(404).json({ msg: "Task not found." });
    }

    return res.status(200).json({ msg: "Task deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ msg: "Error deleting task", error });
  }
};

const updateTaskStatus = async (req, res) => {

    const { taskId } = req.params; // Get taskId from the URL parameter
    const { status } = req.body; // Get new status from the request body

    // Check if status is provided
    if (!status) {
        return res.status(400).json({ msg: "Status is required." });
    }

    try {
        // Find and update the task status
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { status },
            { new: true, runValidators: true } // Return the updated task and apply validators
        );

        if (!updatedTask) {
            return res.status(404).json({ msg: "Task not found." });
        }

        res.status(200).json({ msg: "Task status updated successfully!", task: updatedTask });
    } catch (error) {
        console.error("Error updating task status:", error);
        res.status(500).json({ msg: "Error updating task status.", error: error.message });
    }
};



module.exports = {
  addTask,
  getAllTasks,
  updateTask,
  deleteTask,
  updateTaskStatus
};
