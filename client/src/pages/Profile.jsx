import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import Button from "../components/Button";
import { FaHome, FaUserAlt } from "react-icons/fa";

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  console.log(user)
  // Array of user details for dynamic rendering
  // {user.role==="user"?():()}
  const userDetails = [
    { label: "Username", value: user.username },
    { label: "Email", value: user.email },
    { label: "Account active since", value: formatDistanceToNow(new Date(user.createdAt), { addSuffix: true }) },
    { label: "Joined on", value: new Date(user.createdAt).toLocaleDateString() },
    { label: "Role", value: user.role },
    { label: "year", value: user.year},
    { label: "dept", value: user.dept },
  ];

  return (
    <section className="search-container p-6 bg-gray-900 text-white rounded-lg shadow-lg ">
      <h1 className="text-2xl md:text-4xl text-blue-800 font-bold text-center mt-4 mb-9">My Profile</h1>
      <div className="w-full py-5 px-5 grid grid-cols-1 md:grid-cols-2 gap-6 text-base md:text-lg bg-white border border-gray-300 rounded-lg shadow-md">
        {userDetails.map((detail, index) => (
          <div key={index} className="flex flex-col">
            <span className="font-medium text-gray-600">{detail.label}:</span>
            <span className="font-semibold text-gray-800">{detail.value}</span>
          </div>
        ))}
      </div>

      <div className="w-full flex flex-col md:flex-row items-center justify-center gap-4 mt-6">
        <button
          onClick={() => navigate('/')}
          className="flex gap-2 items-center px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md transition-all duration-300"
        >
          <FaHome /> Return to Home
        </button>
        <button
          onClick={() => navigate('/dashboard/userlookup')}
          className="flex gap-2 items-center px-6 py-2 text-white bg-green-600 hover:bg-green-700 rounded-lg shadow-md transition-all duration-300"
        >
          <FaUserAlt /> User Lookup
        </button>
        {user.role === "admin" && (
          <button
            onClick={() => navigate('/dashboard/usermanagemnt')}
            className="flex gap-2 items-center px-6 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-md transition-all duration-300"
          >
            <FaUserAlt /> User Management
          </button>
        )}
      </div>
    </section>
  );
};

export default Profile;
