// routes/category.js

const express = require('express');
const router = express.Router();

const {
  addCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
} = require('../controllers/categoryController');

// POST: Add a new category
router.route('/').post(addCategory);

// GET: Get all categories
router.route('/').get(getAllCategories);

// PUT: Update a category
router.route('/:id').put(updateCategory);

// DELETE: Delete a category
router.route('/:id').delete(deleteCategory);

module.exports = router;
