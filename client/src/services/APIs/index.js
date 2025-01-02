const BASE_URL = import.meta.env.VITE_BASE_URL;

export const authEndpoints = {
  SIGNUP: `${BASE_URL}/register`,
  LOGIN: `${BASE_URL}/login`,
};
export const analyticsendpoints ={
  GET_ANALYTICS: `${BASE_URL}/users`,
  DELETE_USER: `${BASE_URL}/delete`,
  UPDATE_USER:`${BASE_URL}/updateuserrole`,
  SEARCH_USER:`${BASE_URL}/searchUser`
  
}


export const listEndpoints = {
  CREATE_LIST: `${BASE_URL}/createlist`,
  DELETE_LIST: `${BASE_URL}/deletelist`,
  ADD_TO_LIST: `${BASE_URL}/addusertolist`,
  REMOVE_FROM_LIST: `${BASE_URL}/deleteuserfromlist`,
  GET_LISTS: `${BASE_URL}/getalllists`,
  GET_USERS_FROM_LIST: `${BASE_URL}/getlistusers`,
};

export const quizEndpoints = {
  CREATE_QUIZ: `${BASE_URL}/createquizzes`,
  UPDATE_QUIZ: `${BASE_URL}/quizzes`,
  DELETE_QUIZ: `${BASE_URL}/quizzes`,
  DELETE_ATTEMPT:`${BASE_URL}/attempt/delete`,
  GET_ADMIN_QUIZES: `${BASE_URL}/admin-quizzes`,
  GET_SCORES: `${BASE_URL}/attempts`,
  GET_ALL_QUIZES: `${BASE_URL}/quizzes`,
  GET_QUIZ_DETAILS: `${BASE_URL}/quizzes`,
  ATTEMMP_QUIZ: `${BASE_URL}/quizzes`,
  GET_USER_ATTEMPS: `${BASE_URL}/attempts`,
  POST_USER_ATTEMPTS:`${BASE_URL}/quizzess/attempted`,
  GET_ALL_QUIZESS: `${BASE_URL}/quizzess`,
  GET_FOR_DASHBOARD:  `${BASE_URL}/getAllQuizAttempts`,
  NOTIFICATION:`${BASE_URL}/quiznotification`
};

export const questionEndpoints = {
  CREATE_QUESTION: `${BASE_URL}/createquestion`,
  UPDATE_QUESTION: `${BASE_URL}/questions`,
  DELETE_QUESTION: `${BASE_URL}/questions`,
  GET_QUIZ_QUESTIONS: `${BASE_URL}/questions`,
};
