import { apiConnector } from "../apiConnector";
import { quizEndpoints } from "../APIs";
import toast from "react-hot-toast";

const { CREATE_QUIZ, UPDATE_QUIZ, DELETE_QUIZ,DELETE_ATTEMPT,NOTIFICATION } = quizEndpoints;

export const deleteattempt = async (attemptid, token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_ATTEMPT}/${attemptid}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response.data.error);
    }

    console.log("DELETE_ATTEMPT_RESPONSE : ", response);
    toast.success("ATTEMPT deleted successfully");
    return true
  } catch (e) {
    console.log("ERROR WHILE DELETING Attempt : ", e);
  }
  return false;
};
export const newquiznotification = async(data,token)=>{
  console.log(data)
  try {
    const response = await apiConnector("POST",NOTIFICATION,{quizId:data.quizId},{
      Authorization: `Bearer ${token}`,
    })
    if(response.data.success){
      
      toast.success(response.data.message)
    }
    
    
}
catch(e){
  console.log("ERROR WHILE SENDING NOTIFICATION : ",e)
}
}

export const createQuiz = async (data, token) => {
  console.log(data)
  try {
    const response = await apiConnector("POST", CREATE_QUIZ, data, {
      Authorization: `Bearer ${token}`,
    });

    if (!response?.data?.success) {
      throw new Error(response.data.error);
    }

    console.log("CREATE_QUIZ_RESPONSE : ", response);

    return response?.data?.data;
  } catch (e) {
    console.log("ERROR WHILE CREATING QUIZ : ", e);
  }
  return null;
};

export const updateQuiz = async (data, token, quizId) => {
  try {
    const response = await apiConnector(
      "PUT",
      `${UPDATE_QUIZ}/${quizId}`,
      data,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response.data.error);
    }

    console.log("UPDATE_QUIZ_RESPONSE : ", response);
    toast.success("Quiz updated successfully");
    return response.data.data;
  } catch (e) {
    console.log("ERROR WHILE UPDATING QUIZ : ", e);
  }
  return null;
};

export const deleteQuiz = async (quizId, token) => {
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_QUIZ}/${quizId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    );

    if (!response?.data?.success) {
      throw new Error(response.data.error);
    }

    console.log("DELETE_QUIZ_RESPONSE : ", response);
    toast.success("Quiz deleted successfully");
    return true
  } catch (e) {
    console.log("ERROR WHILE DELETING QUIZ : ", e);
  }
  return false;
};
