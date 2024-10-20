/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import '../styles/AddCategory.css';
import { AgGridReact } from 'ag-grid-react';
import DeleteButton from './DeleteButton'; // Import DeleteButton

const AddCategory = () => {
  const [categoryName, setCategoryName] = useState('');
  const [token] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  // Function to fetch categories
  const fetchCategories = async () => {
    try {
      const userId = sessionStorage.getItem('_id');
      if (!userId) {
        console.log("No userId found in session storage.");
        return;
      }

      const axiosConfig = {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      };
      const response = await axios.get(`http://localhost:3000/api/v1/getallcategories/${userId}`);
      setCategories(response.data.categories); // Update categories
    } catch (error) {
      // toast.error(error.response?.data?.message || error.message);
    }
  };

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoryName) {
      toast.warn("Category name is required!");
      return;
    }

    const axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Add any other headers if required, similar to AddTask
      },
    };

    try {
      let loginUser = sessionStorage.getItem('_id');
      const newCategory = { 
        name: categoryName, 
        user: loginUser,
        // Add any other properties here if your AddTask page has them
      };

      console.log(newCategory);
      debugger;

      // Adjusted POST request structure to match AddTask
      const response = await axios.post("http://localhost:3000/api/v1/addcategory", newCategory);
      // toast.success(response.data.message);
      setCategoryName(''); // Clear input field after submission

      // Fetch categories again to update the grid
      await fetchCategories(); // Call the fetch function here
    } catch (error) {
      // toast.error(error.response?.data?.message || error.message);
    }
  };

  // Function to delete a category
  const deleteCategory = async (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) { // Confirmation prompt
      try {
        const axiosConfig = {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        };
        await axios.delete(`http://localhost:3000/api/v1/deletecategory/${categoryId}`, axiosConfig);
        setCategories(prevCategories => prevCategories.filter(category => category._id !== categoryId));
        toast.success("Category deleted successfully!");
      } catch (error) {
        toast.error("Failed to delete category.");
      }
    }
  };

  return (
    <div className="full-page-container">
      <h1>Add Category</h1>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="categoryName">Category Name:</label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="category-button">Add Category</button>

        <button type="button" className="back-button" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
      </form>

      {/* Displaying categories in a grid format */}
      {categories.length > 0 && ( // Conditional rendering for categories
        <div className="ag-theme-alpine" style={{ marginTop: '20px', height: '400px', width: '50%' }}>
          <AgGridReact
            rowData={categories}
            columnDefs={[
              {
                headerName: 'SR',
                valueGetter: (params) => params.node.rowIndex + 1,
                sortable: false,
              },
              { headerName: 'Category Name', field: 'name' },
              {
                headerName: 'Actions',
                cellRenderer: (params) => (
                  <DeleteButton data={params.data} onDelete={deleteCategory} />
                ),
                editable: false,
              },
            ]}
            pagination={true}
            paginationPageSize={10}
          />
        </div>
      )}

      {/* Logout Button */}
      <Link to="/logout" className="logout-button" style={{ marginTop: '20px', display: 'inline-block' }}>
        Logout
      </Link>
    </div>
  );
};

export default AddCategory;
