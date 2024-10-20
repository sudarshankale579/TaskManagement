/* eslint-disable no-debugger */
/* eslint-disable no-unused-vars */
import "../styles/Dashboard.css";
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from 'axios';
import { AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

import DeleteButton from './DeleteButton';

const Dashboard = () => {
  const [token] = useState(JSON.parse(localStorage.getItem("auth")) || "");
  const [rowData, setRowData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchTaskData = async () => {
    const userId = sessionStorage.getItem('_id');
    if (!userId) {
      console.log("No userId found in session storage.");
      return;
    }

    const axiosConfig = {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    };

    try {
      const response = await axios.get(`http://localhost:3000/api/v1/getalltasks/${userId}`, axiosConfig);
      console.log("Fetched tasks successfully:", response.data.tasks);
      setRowData(response.data.tasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      if (error.response) {
        toast.error(`Error: ${error.response.data.message || error.response.statusText}`);
      } else if (error.request) {
        toast.error("No response from server.");
      } else {
        toast.error(`Request error: ${error.message}`);
      }
    } finally {
      setLoading(false); // Ensure loading state is set to false
    }
  };

  const statusOptions = ["Pending", "In-Progress", "Completed"];

  const updateTaskStatus = async (taskId, newStatus) => {
    try {
      await axios.patch(`http://localhost:3000/api/v1/updatetaskstatus/${taskId}`, { status: newStatus }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Status updated successfully!");
    } catch (error) {
      toast.error("Failed to update status.");
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`http://localhost:3000/api/v1/deletetask/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRowData((prevRowData) => prevRowData.filter(task => task._id !== taskId));
      toast.success("Task deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  const columnDefs = [
    { headerName: "Task", field: "title", editable: false },
    { headerName: "Task Description", field: "description", editable: false },
    { headerName: "Category", field: "category.name", valueGetter: params => params.data.category?.name || "N/A", editable: false },
    {
      headerName: "Status",
      field: "status",
      cellEditor: 'agSelectCellEditor',
      cellEditorParams: {
        values: statusOptions,
      },
      editable: (params) => params.data.status !== "Completed",
    },
    {
      headerName: "Due Date",
      field: "dueDate",
      valueFormatter: params => {
        const date = new Date(params.value);
        return isNaN(date) ? "N/A" : `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
      },
      editable: false,
    },
    {
      headerName: "Actions",
      field: "actions",
      cellRenderer: (params) => (
        <DeleteButton data={params.data} onDelete={deleteTask} />
      ),
      editable: false,
    },
  ];

  const onCellValueChanged = (event) => {
    if (event.colDef.field === "status" && event.newValue !== event.oldValue) {
      updateTaskStatus(event.data._id, event.newValue);
    }
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
      toast.warn("Please login first to access the dashboard");
      return;
    }
    fetchTaskData();
  }, [token, navigate]);

  return (
    <div className='dashboard-main'>
      <h1>Dashboard</h1>

      <div className="dashboard-container">
        <div className="button-row">
          <button className="add-task-button" onClick={() => navigate("/add-task")}>
            Add Task
          </button>
          <button className="add-category-button" onClick={() => navigate("/add-category")}>
            Add Category
          </button>
        </div>

        {/* Task Grid */}
        <div className="ag-theme-alpine" style={{ height: 400, width: '100%' }}>
          {loading ? (
            <p>Loading tasks...</p> // Improved loading state message
          ) : (
            <AgGridReact
              columnDefs={columnDefs}
              rowData={rowData}
              pagination={true}
              paginationPageSize={10}
              onCellValueChanged={onCellValueChanged}
            />
          )}
        </div>
      </div>

      <Link to="/logout" className="logout-button">Logout</Link>
    </div>
  );
}

export default Dashboard;
