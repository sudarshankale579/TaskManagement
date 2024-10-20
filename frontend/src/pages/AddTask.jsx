/* eslint-disable no-debugger */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-unused-vars */

import '../styles/AddTask.css';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom'; // Import Link for logout

const AddTask = () => {
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [status, setStatus] = useState('Pending'); // Default status
    const [dueDate, setDueDate] = useState('');
    const [associatedCategory, setAssociatedCategory] = useState('');
    const [categories, setCategories] = useState([]); // State for categories

    const navigate = useNavigate(); // Initialize useNavigate

    const userId = sessionStorage.getItem('_id');
    if (!userId) {
      console.log("No userId found in session storage.");
      return;
    }

    // Fetch categories from the database
    const fetchCategories = async () => {
        try {
            const response = await axios.get(`http://localhost:3000/api/v1/getallcategories/${userId}`);
            // const response = await axios.get('http://localhost:3000/api/v1/getallcategories');
            debugger;
            console.log('Fetched categories:', response.data.categories); // Log fetched data
            setCategories(response.data.categories); // Access the categories array
        } catch (error) {
            // toast.error('Failed to fetch categories: ' + error.message);
        }
    };

    useEffect(() => {
        fetchCategories(); // Fetch categories when the component mounts
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent form submission

        // Log current state values for debugging
        console.log('Current state before submit:', {
            taskTitle,
            taskDescription,
            status,
            dueDate,
            associatedCategory,
        });

        let loginUser = sessionStorage.getItem('_id');
        const newTask = { 
            title: taskTitle, 
            description: taskDescription, 
            status,
            dueDate, 
            category: associatedCategory,
            user: loginUser
        };

        console.log(newTask);

        try {
            // Replace with your API endpoint
            console.log('Submitting new task:', newTask); // 
            await axios.post('http://localhost:3000/api/v1/addtask', newTask);
            toast.success('Task added successfully!');

            // Reset form
            setTaskTitle('');
            setTaskDescription('');
            setStatus('Pending'); // Reset to default status
            setDueDate('');
            setAssociatedCategory('');

            // Navigate to the dashboard after adding the task
            navigate('/dashboard'); // Replace with your actual dashboard route
        } catch (error) {
            toast.error('Failed to add task: ' + error.message);
        }
    };

    return (
        <div className="full-page-container">
            <h1>Add Task</h1>
            <form onSubmit={handleSubmit} className="task-form">
                <div className="form-group">
                    <label htmlFor="taskTitle">Task Title:</label>
                    <input
                        type="text"
                        id="taskTitle"
                        value={taskTitle}
                        onChange={(e) => setTaskTitle(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="taskDescription">Task Description:</label>
                    <textarea
                        id="taskDescription"
                        value={taskDescription}
                        onChange={(e) => setTaskDescription(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="status">Status:</label>
                    <select
                        id="status"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)} // Ensure this is being called correctly
                    >
                        <option value="Completed">Completed</option>
                        <option value="In-Progress">In Progress</option>
                        <option value="Pending">Pending</option>
                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="dueDate">Due Date:</label>
                    <input
                        type="date"
                        id="dueDate"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        required
                    />
                </div>

                <div className="form-group">
                    <label htmlFor="associatedCategory">Associated Category:</label>
                    <select
                        id="associatedCategory"
                        value={associatedCategory}
                        onChange={(e) => setAssociatedCategory(e.target.value)}
                        required
                    >
                        <option value="">Select a category</option>
                        {Array.isArray(categories) && categories.length > 0 ? (
                            categories.map((category) => (
                                <option key={category._id} value={category._id}> {/* Use category ID for value */}
                                    {category.name}
                                </option>
                            ))
                        ) : (
                            <option value="">No categories available</option>
                        )}
                    </select>
                </div>

                <button type="submit" className="submit-button">Add Task</button>
                <button className="back-button" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
            </form>

            {/* Logout Button */}
            <Link to="/logout" className="logout-button" style={{ marginTop: '20px', display: 'inline-block' }}>
                Logout
            </Link>
        </div>
    );
};

export default AddTask;
