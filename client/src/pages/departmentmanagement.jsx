import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { analyticsendpoints, authEndpoints } from "../services/APIs";
import axios from 'axios';

const DepartmentManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [aggregate, setAggregate] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch users and analytics
  useEffect(() => {
    const fetchdept = async () => {
      setLoading(true);
      try {
        // console.log("getacious")
        axios.get("http://localhost:4000/api/v1/departments")
          .then(response => {
            setUsers(response.data)
            // console.log("response",response)
          })


      } catch (error) {
        toast.error("Failed to load users and analytics.");
      }
      setLoading(false);
    };

    fetchdept();
    // console.log(users)
  }, [token]);

  // Handle user deletion
  const handleDelete = async (userId) => {
    console.log(userId)
  };
  const handleedit = async (userId, data) => {
    console.log(userId)
  };

  return (
    <div className="user-management-container p-5 text-white bg-gray-900 rounded-lg shadow-lg w-full">
      <h2 className="text-3xl mb-6 text-center text-blue-500 font-bold">
        Department Management
      </h2>

      {loading && <p className="text-center text-white">Loading...</p>}

      {!loading && (
        <>
          {/* User List Section */}
          <h3 className="text-xl mb-4 text-blue-400">All Users</h3>
          <button className={"bg-green-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md mb-5"}>
            add dept
          </button>
          <div className="user-list grid gap-4 w-full">
            {users.map((user) => (
              <div
                key={user._id}
                className="user-card bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center analytics-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                <div className="user-info text-white ">
                  <h4 className="text-lg font-semibold">{user.name}</h4>
                  <p className="text-gray-400">Role: {user.abbreviation}</p>
                </div>
                <div className="actions flex gap-4">
                  <button
                    onClick={() => handleedit(user._id, user.role)}
                    className={`${user.role === "user"
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-blue-500 hover:bg-blue-600"
                      } text-white px-6 py-2 rounded-md`}
                  >
                    edit
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
        <p className="text-center text-white">No users found.</p>
      )}
    </div>
  );
};

export default DepartmentManagement;
