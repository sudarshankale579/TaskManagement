const express = require("express");
const router = express.Router();

const { login, register, dashboard, getAllUsers } = require("../controllers/user");
const { addCategory, getAllCategories, updateCategory, deleteCategory } = require("../controllers/category");
const { addTask, getAllTasks, updateTask, deleteTask, updateTaskStatus } = require("../controllers/task");

const authMiddleware = require('../middleware/auth')

router.route("/login").post(login);
router.route("/register").post(register);
router.route("/dashboard").get(authMiddleware, dashboard);
router.route("/users").get(getAllUsers);

router.route("/addcategory").post(addCategory);
router.route("/updatecategory").post(updateCategory);
router.route("/getallcategories/:userId").get(getAllCategories);
router.delete('/deletecategory/:categoryId',deleteCategory);

router.route("/addtask").post(addTask);
router.route("/updatetask").post(updateTask);
router.route("/getalltasks/:userId").get(getAllTasks);

router.delete('/deletetask/:taskId', deleteTask);

router.route("/updatetaskstatus/:taskId").patch(updateTaskStatus);


module.exports = router;