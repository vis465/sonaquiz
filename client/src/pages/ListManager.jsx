import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast, { Toaster } from "react-hot-toast";
import { apiConnector } from "../services/apiConnector";
import { listEndpoints } from "../services/APIs";
import {createList,getLists,deleteList,addUserToList} from "../services/operations/listoperations"

const ListManager = () => {
  const { token } = useSelector((state) => state.auth); // Token from Redux store
  const [lists, setLists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await getLists(token)
      // console.log(response)
      if (response) {
        setLists(response); // Assuming lists are returned in the 'lists' field
      } else {
        // toast.error("Failed to fetch lists.");
      }
    } catch (error) {
      console.error("Error fetching lists:", error);
      // toast.error("Failed to fetch lists.");
    }
  };

  const handleCreateList = async () => {
    if (!newListName.trim()) {
      toast.error("List name cannot be empty!");
      return;
    }

    try {
        const data={ listname: newListName,createdBy:"676a7fc31b4cb35b4d69cb38" }
      const response = await createList(data,token)
      console.log(response)
      if (response.listname) {
        toast.success(`List ${response.listname} created successfully!`);
        setNewListName(""); // Reset list name input
        window.location.reload();
 // Fetch updated list
      } 
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  const handleDeleteList = async (listId) => {
    try {
      const response = await deleteList(listId,token)
      if (response) {
        toast.success(`List deleted successfully!`);
        window.location.reload();
 
      } else {
        toast.error("Failed to delete list.");
      }
    } catch (error) {
      console.error("Error deleting list:", error);
      // toast.error("Failed to delete listtttt.");
    }
  };

  const handleNavigateToListDetails = (listId) => {
    navigate(`/dashboard/listdetails/${listId}`);
  };

  return (
    <div className="container mx-auto p-6">
      <Toaster />
      <h1 className="text-3xl font-bold text-center text-indigo-500 mb-6">Manage Lists</h1>

      {/* Create List Section */}
      <div className="flex items-center justify-center mb-6">
        <input
          type="text"
          placeholder="Enter list name"
          className="border rounded-l-md px-4 py-2 w-2/3 focus:outline-none focus:ring focus:ring-indigo-300"
          value={newListName}
          onChange={(e) => setNewListName(e.target.value)}
        />
        <button
          className="bg-indigo-500 text-white px-4 py-2 rounded-r-md hover:bg-indigo-600"
          onClick={handleCreateList}
        >
          Create List
        </button>
      </div>

      {/* Lists Display Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {lists.map((list) => (
          <div key={list._id} className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
            <h3 className="text-lg font-semibold">{list.listname}</h3>
            <div className="flex justify-end gap-2 mt-4">
              <button
                className="bg-green-500 px-3 py-1 rounded-md text-sm hover:bg-green-600"
                onClick={() => handleNavigateToListDetails(list._id)}
              >
                View
              </button>
              <button
                className="bg-red-500 px-3 py-1 rounded-md text-sm hover:bg-red-600"
                onClick={() => handleDeleteList(list._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListManager;
