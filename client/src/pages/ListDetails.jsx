import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { getuserlist, addUserToList, deleteuserfromlist } from "../services/operations/listoperations";
import Papa from "papaparse";
import * as XLSX from "xlsx";

const ListDetails = () => {
  const { listId } = useParams();
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [bulkFile, setBulkFileState] = useState(null);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const localuser = JSON.parse(localStorage.getItem("user"));
  const[userlen,Setuserlen]=useState(0)

  useEffect(() => {
    if (listId) {
      fetchUsers(listId);
    }
  }, [listId]);

  const fetchUsers = async (listId) => {
    try {
      const response = await getuserlist(listId, token);
      Setuserlen(response.data.users.length)
      
      if (response) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error("Failed to fetch users.");
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      const data = { userid: userId, listid: listId };
      const response = await deleteuserfromlist(data, token);
      if (response.success) {
        toast.success("User deleted successfully");
        fetchUsers(listId); // Refresh users list after deletion
      }
    } catch (error) {
      console.log("Error deleting user:", error);
      toast.error("Failed to delete user.");
    }
  };

  const handleAddUser = async (email) => {
    try {
      const data = { email: email, listid: listId };
      await addUserToList(data, token);
      
      toast.success( "User added successfully");
      setEmail("");
      fetchUsers(listId); // Refresh users list after adding a new user
    } catch (error) {
      console.log("Error adding user:", error);
      toast.error("Failed to add user.");
    }
  };

  const handleFileChange = (e) => {
    setError(null);
    const selectedFile = e.target.files[0];
    const allowedTypes = [
      "text/csv",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];

    if (selectedFile && allowedTypes.includes(selectedFile.type)) {
      setBulkFileState(selectedFile);
    } else {
      setError("Please upload a valid CSV or Excel file.");
    }
  };
 const handleSampleDownload = () => {
    const sampleData = [
      {
        email:"samplemail@mail.com"
      }
    ];

    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "sampleemailfile");

    XLSX.writeFile(workbook, "sampleemailfile.xlsx");
  };
  const handleBulkUpload = async () => {
    if (!bulkFile) {
      toast.error("No file selected");
      return;
    }

    const reader = new FileReader();

    if (bulkFile.type === "text/csv") {
      reader.onload = () => {
        Papa.parse(reader.result, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              const emails=results.data
              // Handle bulk data (e.g., adding users to the list)
              emails.forEach(email =>{
                // console.log(email.email)
                handleAddUser(email.email)
              })
              // You can add logic here to add parsed users to the list.
            } else {
              setError("No valid data found in the CSV file.");
            }
          },
        });
      };
      reader.readAsText(bulkFile);
    } else if (
      bulkFile.type === "application/vnd.ms-excel" ||
      bulkFile.type === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      reader.onload = () => {
        const workbook = XLSX.read(reader.result, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = XLSX.utils.sheet_to_json(sheet);
        if (data.length > 0) {
          const emails=data
          // Handle bulk data (e.g., adding users to the list)
          emails.forEach(email =>{
            
            handleAddUser(email.email)
          })
          // You can add logic here to add parsed users to the list.
        } else {
          setError("No valid data found in the Excel file.");
        }
      };
      reader.readAsBinaryString(bulkFile);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster />
      {localuser.role === "admin" || localuser.role === "trainer" ? (
        <h1 className="text-4xl text-center text-white mb-10">Manage List Details</h1>
      ) : (
        <h1 className="text-4xl text-center text-white mb-10">View List Details</h1>
      )}

      {/* Add a User */}
      {localuser.role === "admin" || localuser.role === "trainer" ? (
        <div>
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add a User</h2>
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4">
              <input
                id="email"
                placeholder="Enter user email"
                className="flex-1 py-3 px-4 rounded-lg border-2 border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-200"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                onClick={() => handleAddUser(email)}
                className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
              >
                Add User
              </button>
            </div>
          </div>

          {/* Bulk Upload */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Bulk Upload</h2>
            <div className="flex flex-col space-y-4">
            <button
      onClick={handleSampleDownload}
      className="bg-purple-500 hover:bg-purple-600 text-white px-6 py-3 rounded-md mb-4 transition-all duration-300"
    >
      Download Sample File
    </button>
              <label htmlFor="file-upload" className="flex items-center space-x-4 cursor-pointer">
                <input
                  type="file"
                  accept=".csv, .xls, .xlsx"
                  onChange={handleFileChange}
                  className="block mb-4 w-full p-3 bg-gray-700 text-white rounded-md border-2 border-blue-500"
                />
                <button
                  onClick={handleBulkUpload}
                  className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-300"
                >
                  Upload
                </button>
              </label>
              {error && <p className="text-red-500 text-sm">{error}</p>}
            </div>
          </div>
        </div>
      ) : (
        <></>
      )}

      {/* Users List */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4"> Users in List</h2>
        <p className="text-l font-semibold text-gray-800 mb-4"> {userlen} Users in total</p>
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
                {localuser.role === "admin" || localuser.role === "trainer" ? (
                  <div className="flex justify-end">
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded-md text-sm hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 transition duration-200"
                      onClick={() => handleDeleteUser(user._id)}
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <></>
                )}
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
  );
};

export default ListDetails;
