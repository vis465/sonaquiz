import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { getuserlist } from "../services/operations/listoperations";

const ListDetails = () => {
  const { listId } = useParams(); // Get the listId from the route parameter
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [bulkFile, setBulkFileState] = useState(null); // To hold the bulk file

  
  useEffect(() => {
  console.log("listid",listId)
    if (listId) {
        
      fetchUsers(listId);
      
    }
  }, []);

  const fetchUsers = async (listId) => {
    try {
        console.log("fetchUsers")
      const response = await getuserlist(listId, token);
      console.log("response",response.data.users);
      if (response) {
        setUsers(response.data.users); // Assuming users are in the 'users' field of the response
      } else {
        toast.error("Failed to fetch users.");
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      // Add your delete user logic here
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error("Failed to remove user.");
    }
  };

  const handleAddUser = async () => {
    if (!newUserEmail) {
      toast.error('Please enter an email address');
      return;
    }

    try {
      const response = await axios.post(ADD_TO_LIST, { email: newUserEmail });
      toast.success(response.data.message || 'User added successfully');
      setNewUserEmail('');
    } catch (error) {
      console.error('Error adding user:', error);
      toast.error('Failed to add user');
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
          toast.success('Users added successfully');
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
      <h1 className="text-3xl font-bold text-center text-indigo-500 mb-6">List Details</h1>

      {/* Bulk Upload Section */}
      <div className="mb-6 flex flex-col items-center">
        <input
          type="file"
          onChange={(e) => setBulkFile(e.target.files[0])}
          className="border rounded-md p-2 mb-4"
        />
        <button
          onClick={handleBulkUpload}
          className="bg-indigo-500 text-white px-6 py-3 rounded-md hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
        >
          Upload Users (Bulk)
        </button>
      </div>

      {/* Users List Display */}
      {users.length === 0 ? (
        <p className="text-center text-gray-500">No users in this list.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user) => (
            <div key={user._id} className="bg-gray-800 text-white rounded-lg p-4 shadow-md hover:shadow-xl transition duration-300">
              <h4 className="text-xl font-semibold">{user.username}</h4>
              <p className="text-sm text-gray-400">{user.year} year, {user.dept}</p>
              
              <div className="flex justify-end gap-2 mt-4">
                <button
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition duration-200"
                  onClick={() => handleDeleteUser(user._id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Back to List Manager */}
      <div className="flex justify-center mt-6">
        <button
          onClick={() => navigate("/")} // Go back to ListManager
          className="bg-gray-500 text-white px-6 py-3 rounded-md hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
        >
          Back to Lists
        </button>
      </div>
    </div>
  );
};

export default ListDetails;
