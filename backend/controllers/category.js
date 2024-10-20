// controllers/categoryController.js

const Category = require('../models/Category');

// Add a new category
const addCategory = async (req, res) => {
  const { name, user } = req.body;

  // Log the incoming data for debugging

  // Validate the input
  if (!name) {
    return res.status(400).json({ msg: "Please provide a category name." });
  }

  try {
    // Check if the category already exists
    const foundCategory = await Category.findOne({ name, user });
    if (foundCategory) {
      return res.status(400).json({ msg: "Category already exists." });
    }

    // Create a new category
    const newCategory = new Category({ name, user });

    // Log the new category for debugging

    // Save the category to the database
    await newCategory.save();

    // Respond with success message and the newly created category
    return res.status(201).json({ msg: "Category added successfully!", category: newCategory });
  } catch (error) {
    // Log the error for debugging
    console.error("Error adding category:", error);
    return res.status(500).json({ msg: "Error adding category", error: error.message });
  }
};

// Get all categories
const getAllCategories = async (req, res) => {
  try {

    const { userId } = req.params; 
    console.log("User ID:", userId);

    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    const categories = await Category.find({ user: userId });
    
    return res.status(200).json({ categories });
  } catch (error) {
    return res.status(500).json({ msg: "Error fetching categories", error });
  }
};

// Update a category
const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ msg: "Please provide a category name." });
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      id,
      { name },
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return res.status(404).json({ msg: "Category not found." });
    }

    return res.status(200).json({ msg: "Category updated successfully!", category: updatedCategory });
  } catch (error) {
    return res.status(500).json({ msg: "Error updating category", error });
  }
};

// Delete a category
const deleteCategory = async (req, res) => {
  const { categoryId } = req.params;

  try {
    const deletedCategory = await Category.findByIdAndDelete(categoryId);

    if (!deletedCategory) {
      return res.status(404).json({ msg: "Category not found." });
    }

    return res.status(200).json({ msg: "Category deleted successfully!" });
  } catch (error) {
    return res.status(500).json({ msg: "Error deleting category", error });
  }
};

module.exports = {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
};
