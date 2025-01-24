const express = require("express");
const router = express.Router();
const { authMiddleware, adminMiddleware,trainerMiddleware,staffMiddleware } = require("../middleware/Auth");

// Import Controllers
const {
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getAllQuizzes,getAllQuizzess,
  getQuizById,
  attemptQuiz,
  getUserAttempts,
  getAdminQuizes,
  getQuizAttempts,
  Attemptedcnt,
  Attemptdelete,
  departmentreport,getAllQuizAttempts,newquiznotification,
  attemptnotcomplete
} = require("../controllers/quizController");

const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuizQuestions,
} = require("../controllers/questionController");
const {
  createList,
  addUserToList,
  deleteUserFromList,
  getAllLists,
  getUsersOfList,
  deleteList,
} = require("../controllers/listcontrollers");

const {adddepartment, login, register ,getUsersAndAnalytics,deleteUser,searchUser,edituserrole,departments,updatedept,deletedept} = require("../controllers/userController");
router.post('/deletedept',authMiddleware,staffMiddleware,deletedept);
router.post('/updatedept',authMiddleware,staffMiddleware,updatedept);
router.get("/departments",authMiddleware,staffMiddleware,departments);
router.post("/adddept",authMiddleware,staffMiddleware,adddepartment);
// User Authentication
router.post("/login", login);
router.post("/register", register);
router.get("/users", getUsersAndAnalytics);
router.post("/updateuserrole",authMiddleware,adminMiddleware,edituserrole)
// Delete a user
router.post("/delete",authMiddleware,adminMiddleware, deleteUser);
router.post('/searchUser',authMiddleware,searchUser)
// Update user details

router.post("/departmentreport",authMiddleware,staffMiddleware,departmentreport);
router.get("/admin-quizzes", authMiddleware, staffMiddleware, getAdminQuizes);
router.get("/attempts/:id", authMiddleware, staffMiddleware, getQuizAttempts);
router.get("/getAllQuizAttempts",authMiddleware,getAllQuizAttempts)
router.post("/createquizzes", authMiddleware,  staffMiddleware, createQuiz);
router.put("/quizzes/:id", authMiddleware, updateQuiz);
router.delete("/quizzes/:id", authMiddleware, staffMiddleware, deleteQuiz);
router.post("/quizzess/attempted", authMiddleware,Attemptedcnt); // Correct route for attempted quiz
router.post("/attempt/delete", authMiddleware,staffMiddleware,Attemptdelete); // Correct route for attempted quiz
router.get("/attemptnotcomplete",authMiddleware,attemptnotcomplete)
// Question routes
router.get("/questions/:id", getQuizQuestions);
// router.get("/questions/:id", authMiddleware, getQuizQuestions);
router.post("/createquestion", authMiddleware, staffMiddleware, createQuestion);
router.put("/questions/:id", authMiddleware, staffMiddleware, updateQuestion);
router.delete("/questions/:id", authMiddleware, staffMiddleware, deleteQuestion);


// Create a new list
router.post("/createlist", authMiddleware, staffMiddleware, createList);

// Delete a list
router.delete("/deletelist/:listid", authMiddleware, staffMiddleware, deleteList);

// Add a user to a list
router.post("/addusertolist", authMiddleware, staffMiddleware, addUserToList);

// Delete a user from a list
router.post("/deleteuserfromlist", authMiddleware, staffMiddleware, deleteUserFromList);

// Get all lists with user metadata
router.get("/getalllists", authMiddleware, getAllLists);

// Get users of a specific list
router.post("/getlistusers", authMiddleware, getUsersOfList);

router.post("/quiznotification",authMiddleware,staffMiddleware,newquiznotification)

// Data routes
router.get("/quizzes", authMiddleware, getAllQuizzes);
router.get("/quizzess/:id", authMiddleware, getAllQuizzess);
router.get("/quizzes/:id", authMiddleware, getQuizById);
router.post("/quizzes/:id/attempt", authMiddleware, attemptQuiz);
router.get("/attempts", authMiddleware, getUserAttempts);
router.post("/checkattemps", authMiddleware, (req, res) => {
  // Implement the check attempts logic here
  res.send("Check Attempts Route");
});


module.exports = router;
