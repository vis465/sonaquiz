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
  departmentreport,getAllQuizAttempts
} = require("../controllers/quizController");

const {
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuizQuestions,
} = require("../controllers/questionController");

const { login, register ,getUsersAndAnalytics,deleteUser,searchUser,edituserrole} = require("../controllers/userController");

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
router.get("/getAllQuizAttempts",authMiddleware,staffMiddleware,getAllQuizAttempts)
router.post("/createquizzes", authMiddleware,  staffMiddleware, createQuiz);
router.put("/quizzes/:id", authMiddleware, updateQuiz);
router.delete("/quizzes/:id", authMiddleware, staffMiddleware, deleteQuiz);
router.post("/quizzess/attempted", authMiddleware,Attemptedcnt); // Correct route for attempted quiz
router.post("/attempt/delete", authMiddleware,staffMiddleware,Attemptdelete); // Correct route for attempted quiz

// Question routes
router.get("/questions/:id", authMiddleware, getQuizQuestions);
router.post("/createquestion", authMiddleware, staffMiddleware, createQuestion);
router.put("/questions/:id", authMiddleware, staffMiddleware, updateQuestion);
router.delete("/questions/:id", authMiddleware, staffMiddleware, deleteQuestion);

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
