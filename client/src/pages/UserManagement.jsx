import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { analyticsendpoints } from "../services/APIs";

const UserManagement = () => {
  const { token } = useSelector((state) => state.auth);
  const [users, setUsers] = useState([]);
  const [analytics, setAnalytics] = useState({});
  const [aggregate, setAggregate] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch users and analytics
  useEffect(() => {
    const fetchUsersAndAnalytics = async () => {
      setLoading(true);
      try {
        const response = await apiConnector("GET", analyticsendpoints.GET_ANALYTICS, null, {
          Authorization: `Bearer ${token}`,
        });
        setUsers(response.data.users);
        setAnalytics(response.data.analytics);
        setAggregate({
          studentsByYear: response.data.analytics.studentsByYear,
          studentsByDepartment: response.data.analytics.studentsByDepartment,
        });
      } catch (error) {
        toast.error("Failed to load users and analytics.");
      }
      setLoading(false);
    };

    fetchUsersAndAnalytics();
  }, [token]);

  // Handle user deletion
  const handleDelete = async (userId) => {
    try {
      const response = await apiConnector(
        "POST",
        analyticsendpoints.DELETE_USER,
        { user_id: userId },
        { Authorization: `Bearer ${token}` }
      );
      toast.success(response.data.message);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      toast.error("Failed to delete user.");
    }
  };

  return (
    <div className="user-management-container p-5 text-white bg-gray-900 rounded-lg shadow-lg">
      <h2 className="text-3xl mb-6 text-center text-blue-500 font-bold">User Management</h2>

      {loading && <p className="text-center text-white">Loading...</p>}

      {!loading && (
        <>
          {/* Analytics Section */}
          <div className="analytics mb-6">
            <h3 className="text-xl mb-4 text-blue-400">Platform Analytics</h3>
            <div className="analytics-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="analytics-card bg-gray-800 p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold">Total Users</h4>
                <p className="text-xl">{analytics.totalUsers || 0}</p>
              </div>
              <div className="analytics-card bg-gray-800 p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold">Total Admins</h4>
                <p className="text-xl">{analytics.totalAdmins || 0}</p>
              </div>
              <div className="analytics-card bg-gray-800 p-4 rounded-lg shadow-md">
                <h4 className="text-lg font-semibold">Total Students</h4>
                <p className="text-xl">{analytics.totalStudents || 0}</p>
              </div>
            </div>

            {/* Dynamic Analytics Section */}
           
{/* Students by Year */}
<div className="students-by-year mb-6">
  <h3 className="text-xl mb-4 text-blue-400">Students by Year</h3>
  <div className="analytics-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {aggregate.studentsByYear?.length > 0 ? (
      aggregate.studentsByYear.map(({ _id: year, count }) => (
        <div key={year} className="analytics-card bg-gray-800 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Year {year}</h4>
          <p className="text-xl">{count} students</p>
        </div>
      ))
    ) : (
      <p className="text-gray-400">No data available for students by year.</p>
    )}
  </div>
</div>

{/* Students by Department */}
<div className="students-by-department mb-6">
  <h3 className="text-xl mb-4 text-blue-400">Students by Department</h3>
  <div className="analytics-grid grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
    {aggregate.studentsByDepartment?.length > 0 ? (
      aggregate.studentsByDepartment.map(({ _id: department, count }) => (
        <div key={department} className="analytics-card bg-gray-800 p-4 rounded-lg shadow-md">
          <h4 className="text-lg font-semibold">Department {department}</h4>
          <p className="text-xl">{count} students</p>
        </div>
      ))
    ) : (
      <p className="text-gray-400">No data available for students by department.</p>
    )}
  </div>
</div>


          </div>

          {/* User List Section */}
          <h3 className="text-xl mb-4 text-blue-400">All Users</h3>
          <div className="user-list grid gap-4">
            {users.map((user) => (
              <div
                key={user._id}
                className="user-card bg-gray-800 p-4 rounded-lg shadow-md flex justify-between items-center"
              >
                <div className="user-info text-white">
                  <h4 className="text-lg font-semibold">{user.username}</h4>
                  <p className="text-gray-400">Role: {user.role}</p>
                  <p className="text-gray-400">Department: {user.dept}</p>
                  <p className="text-gray-400">Year: {user.year}</p>
                </div>
                <div className="actions flex gap-4">
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

export default UserManagement;
