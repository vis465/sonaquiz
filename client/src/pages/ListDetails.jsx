import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { getuserlist } from "../services/operations/listoperations";
import { apiConnector } from "../services/apiConnector";
import { listEndpoints } from "../services/APIs";
import { addUserToList, deleteuserfromlist } from "../services/operations/listoperations"
const ListDetails = () => {
  const { listId } = useParams(); // Get the listId from the route parameter
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [bulkFile, setBulkFileState] = useState(null); // To hold the bulk file
  const [email, Setemail] = useState("")

  useEffect(() => {
    console.log("listid", listId)
    if (listId) {

      fetchUsers(listId);

    }
  }, []);

  const fetchUsers = async (listId) => {
    try {
      const response = await getuserlist(listId, token);
      if (response) {
        setUsers(response.data.users); // Assuming users are in the 'users' field of the response

      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const data = { userid: userId, listid: listId }

      const response = await deleteuserfromlist(data, token)

      if (response.success) {
        toast.success(
          "User deleted successfully"
        )
      }
      window.location.reload()

    } catch (error) {
      console.log("Error deleting user:", error);
    }
  };

  const handleAddUser = async (email) => {
    console.log("adduser", email)

    try {
      const data = { email: email, listid: listId }
      console.log("posting", data)
      const response = await addUserToList(data, token)
      console.log("response", response)
      toast.success(response.message || 'User added successfully');
      Setemail('');
      window.location.reload()
    } catch (error) {
      console.log('Error adding user:', error);
    }

  };

  // Handle CSV bulk upload
  const handleBulkUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) {
      toast.error('No file selected');
      return;
    }

    setBulkFileState(file);

    Papa.parse(file, {
      complete: async (result) => {
        const usersData = result.data;
        const emailList = usersData.map((user) => user[0]); // Assuming email is in the first column

        try {
          for (const email of emailList) {
            await axios.post(ADD_TO_LIST, { email });
          }

        } catch (error) {
          console.error('Error uploading users:', error);
          toast.error('Failed to upload users');
        }
      },
      header: false,
    });
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster />
      <h1 className="text-4xl font-extrabold text-center text-gradient bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-10">
        Manage List Details
      </h1>

      {/* Add Single User Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add a User</h2>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
          <input
            id="email"
            placeholder="Enter user email"
            className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-200"
            type="email"
            onChange={(e) => Setemail(e.target.value)}
          />
          <button
            onClick={() => handleAddUser(email)}
            className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
          >
            Add User
          </button>
        </div>
      </div>

      {/* Bulk Upload Section */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bulk Upload</h2>
        <div className="flex flex-col space-y-4">
          <label
            htmlFor="file-upload"
            className="flex items-center space-x-4 cursor-pointer"
          >
            <input
              type="file"
              id="file-upload"
              onChange={(e) => setBulkFile(e.target.files[0])}
              className="hidden"
            />
            <div className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-200 bg-gray-100 text-gray-700 text-sm">
              {bulkFile ? bulkFile.name : "Choose CSV File"}
            </div>
            <button
              onClick={handleBulkUpload}
              className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
            >
              Upload
            </button>
          </label>
        </div>
      </div>

      {/* Users List Display */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Users in List</h2>
        {users.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No users in this list yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
              <div
                key={user._id}
                className="bg-gradient-to-r from-gray-800 to-gray-900 text-white rounded-lg p-5 shadow-lg hover:shadow-xl transition duration-300"
              >
                <h4 className="text-xl font-semibold mb-2">{user.username}</h4>
                <p className="text-sm text-gray-300 mb-4">
                  {user.year} year, {user.dept}
                </p>
                <div className="flex justify-end">
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
                    onClick={() => handleDeleteUser(user._id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to List Manager */}
      <div className="flex justify-center">
        <button
          onClick={() => navigate("/dashboard/listmanager")}
          className="bg-gray-700 text-white px-8 py-3 rounded-lg hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
        >
          Back to Lists
        </button>
      </div>
    </div>

  )
}
export default ListDetails;
