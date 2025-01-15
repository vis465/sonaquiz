import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import axios from 'axios';

const DepartmentManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingDept, setEditingDept] = useState(null); // Track department being edited
  const [deptForm, setDeptForm] = useState({ name: "", abbreviation: "" }); // Form state for adding/editing
  const navigate = useNavigate();

  // Fetch departments
  useEffect(() => {
    const fetchDepts = async () => {
      setLoading(true);
      try {
        axios.get("http://localhost:4000/api/v1/departments")
          .then(response => {
            setUsers(response.data);
          });
      } catch (error) {
        toast.error("Failed to load departments.");
      }
      setLoading(false);
    };

    fetchDepts();
  }, [token]);

  // Handle input change in the department form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeptForm({ ...deptForm, [name]: value });
  };

  // Handle add department
  const handleAddDept = async () => {
    // Handle Add department logic (API call)
    if (deptForm.name && deptForm.abbreviation) {
      // Trigger API call here to add department
      toast.success("Department added successfully!");
      setDeptForm({ name: "", abbreviation: "" });
      // Reload or update department list
    } else {
      toast.error("Please fill in both fields.");
    }
  };

  // Handle edit department
  const handleEditDept = async () => {
    if (deptForm.name && deptForm.abbreviation && editingDept) {
      
      let deptname=deptForm.name;
      let abbr=deptForm.abbreviation;
      console.log(editingDept,abbr)
      let response = await axios.post("http://localhost:4000/api/v1/updatedept", { deptid: editingDept,deptname:deptname,abbr:abbr })
      console.log(response)
      toast.success("Department updated successfully!");
      setEditingDept(null);
      setDeptForm({ name: "", abbreviation: "" });
      // Reload or update department list
      window.location.reload()
    } else {
      toast.error("Please fill in both fields.");
    }
  };

  // Handle user deletion
  const handleDelete = async (userId) => {
    console.log("delete called", userId);
    let response = await axios.post("http://localhost:4000/api/v1/deletedept", { deptid: userId });
    toast.success(response.data.message);
    window.location.reload();
  };

  // Handle editing department
  const handleEditClick = (user) => {
    setEditingDept(user._id);
    setDeptForm({ name: user.name, abbreviation: user.abbreviation });
  };

  return (
    <div className="department-management-container p-5 text-white bg-gray-900 rounded-lg shadow-lg w-full">
      <h2 className="text-3xl mb-6 text-center text-blue-500 font-bold">Department Management</h2>

      {loading && <p className="text-center text-white">Loading...</p>}

      {!loading && (
        <>
          {/* Department Form (Add/Edit) */}
          <h3 className="text-3xl mb-4 text-blue-400">
            {editingDept ? "Edit Department" : "Add Department"}
          </h3>
          <div className="department-form mb-5 max-width-4">
            <input
              type="text"
              name="name"
              value={deptForm.name}
              onChange={handleInputChange}
              placeholder="Enter Department Name"
              className="w-full p-2 mb-3 rounded bg-gray-800 border"
            />
            <input
              type="text"
              name="abbreviation"
              value={deptForm.abbreviation}
              onChange={handleInputChange}
              placeholder="Enter Department Abbreviation"
              className="w-full p-2 mb-3 rounded bg-gray-800 border"
            />
            <button
              onClick={editingDept ? handleEditDept : handleAddDept}
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md"
            >
              {editingDept ? "Update Department" : "Add Department"}
            </button>
          </div>

          {/* Department List Section */}
          <h3 className="text-3xl mb-4 text-blue-400">All Departments</h3>
          <div className="department-list grid gap-4 display-flex">
            {users.map((user) => (
              <div
                key={user._id}
                className="department-card bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div className="department-info text-white">
                  <h4 className="text-lg font-semibold">Name: {user.name}</h4>
                  <p className="text-gray-400">Abbreviation: {user.abbreviation}</p>
                </div>
                <div className="actions flex gap-4">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(user._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {!loading && users.length === 0 && (
        <p className="text-center text-white">No departments found.</p>
      )}
    </div>
  );
};

export default DepartmentManagement;
