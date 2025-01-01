import { apiConnector } from "../apiConnector";
import { listEndpoints } from "../APIs";
import toast from "react-hot-toast";

// Create a new list
export const createList = async (data, token) => {
  try {
    const response = await apiConnector("POST", listEndpoints.CREATE_LIST, data, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.success) throw new Error(response.message);
    
    return response.data.list;
  } catch (error) {
    toast.error("Failed to create list.");
    throw error;
  }
};
export const deleteuserfromlist = async(data,token)=>{
  try {
    console.log("listoperrations calls",data)
    const response = await apiConnector("POST", listEndpoints.REMOVE_FROM_LIST, data, {
      Authorization: `Bearer ${token}`,
      });
      
      console.log(response)
      return response

}
catch(error){
  console.log(error)
}
}
// Get all lists
export const getLists = async (token) => {
  try {
    const response = await apiConnector("GET", listEndpoints.GET_LISTS, null, {
      Authorization: `Bearer ${token}`,
    });
    if (!response?.success) throw new Error(response.message);
    return response.data.lists;
  } catch (error) {
    toast.error("Failed to fetch lists.");
    throw error;
  }
};

// Delete a list
export const deleteList = async (listId, token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${listEndpoints.DELETE_LIST}/${listId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );
    if (!response?.success) throw new Error(response.message);
    
    

    return true;
  } catch (error) {
    toast.error("Failed to delete list.");
    throw error;
  }
};
export const getuserlist = async (listid,token)=>{
    const data={listid:listid}
    console.log(listid)
    try {
        const response=await apiConnector("POST",listEndpoints.GET_USERS_FROM_LIST,data,{
            Authorization:`Bearer ${token}`,
        })
        return response
    }
    catch(error){
        toast.error("Failed to fetch user list");
    }
}
// Add a user to a list
export const addUserToList = async (data, token) => {
  try {
    const response = await apiConnector("POST", listEndpoints.ADD_TO_LIST, data, {
      Authorization: `Bearer ${token}`,
    });
    console.log("Response on services",response)
   if(response.success){
    toast.success("User added to list successfully!");}
    return response.data;
  } catch (error) {
    toast.error("Failed to add user to list.");
    throw error;
  }
};
