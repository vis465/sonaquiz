const { ObjectId } = require("mongodb");
const Lists = require("../models/eligiblitylists");
const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const User = require("../models/User");
const newquizaltertr = require("../mailers/newquizaltertr");
const quizcreationalert = require("../mailers/newquizaltertr");
const axios = require("axios");

// ✅

// Helper function to convert UTC to IST
const convertToIST = (date) => {
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000);
};

exports.createQuiz = async (req, res) => {
  console.log("servercreate");
  try {
    const {
      title,
      description,
      timer,
      instructions,
      maxAttempts,
      year,
      department,
      endtime,
      list,
    } = req.body;

    // Convert endtime to IST before saving
    const istEndTime = endtime ? convertToIST(new Date(endtime)) : null;

    const user = req.user;
    console.log(year, department);

    if (!title || !description || !timer) {
      return res.status(400).json({
        success: false,
        error: "Please provide all the required fields",
      });
    }

    const quiz = await Quiz.create({
      title,
      description,
      timer,
      instructions,
      maxAttempts: maxAttempts,
      createdBy: user.id,
      year: year,
      department: department,
      endtime: istEndTime,
      lists: list,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz created successfully",
      data: quiz,
    });
  } catch (e) {
    console.log("ERROR CREATING QUIZ: ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
// Helper function to convert UTC to IST

exports.updateQuiz = async (req, res) => {
  try {
    const {
      title,
      description,
      timer,
      instructions,
      maxAttempts,
      year,
      department,
      endtime,
      list,
    } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    // Convert endtime to IST before saving
    const istEndTime = endtime ? convertToIST(new Date(endtime)) : null;

    quiz.title = title;
    quiz.description = description;
    quiz.timer = timer;
    quiz.instructions = instructions;
    quiz.maxAttempts = maxAttempts;
    quiz.year = year;
    quiz.department = department;
    quiz.endtime = istEndTime;
    quiz.lists = list;

    console.log("wedit call - IST time:", quiz.endtime);
    await quiz.save();

    return res.status(200).json({
      success: true,
      message: "Quiz updated successfully",
      data: quiz,
    });
  } catch (e) {
    console.log("ERROR UPDATING QUIZ : ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
// ✅
exports.deleteQuiz = async (req, res) => {
  try {
    const quizId = req.params.id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    const questions = await Question.find({ quiz: quizId });

    for (const question of questions) {
      await Question.findByIdAndDelete(question._id);
    }

    await Quiz.findByIdAndDelete(quizId);

    return res.status(200).json({
      success: true,
      message: "Quiz deleted successfully",
    });
  } catch (e) {
    console.log("ERROR DELETING QUIZ : ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getAllQuizzes = async (req, res) => {
  try {
    const quizzes = await Quiz.find().populate("createdBy", "username email");
    return res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (e) {
    console.log("ERROR GETTING QUIZZES : ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
exports.getAllQuizzess = async (req, res) => {
  try {
    const userId = req.params.id; // Get the user ID from request parameters

    if (!userId) {
      return res.status(400).json({
        success: false,
        error: "User ID is required",
      });
    }
    const user = await User.findById(userId);
    const useryear = user.year;
    const userdept = user.dept;
    const quizzes = await Quiz.find().populate("createdBy", "username email");

    // Filter quizzes based on the conditions
    const filteredQuizzes = await Promise.all(
      quizzes.map(async (quiz) => {
        const userAttempts = quiz.attemptCounts.get(userId) || 0;

        let isUserEligible = true;
        // console.log("IF ELSE")
        // If lists are specified, validate user eligibility
        if (quiz.lists && quiz.lists.length > 0) {
          const eligibilityChecks = await Promise.all(
            quiz.lists.map(async (listId) => {
              const list = await Lists.findOne({ _id: listId });
              return list && list.users.includes(userId);
            })
          );
          isUserEligible = eligibilityChecks.some((isEligible) => isEligible);
        }

        console.log(quiz.year, quiz.department);
        // console.log("isUserEligible", isUserEligible);

        // Return the quiz object if all conditions are met
        return userAttempts < quiz.maxAttempts &&
          quiz.year.includes(useryear) &&
          quiz.department.includes(userdept) &&
          Date.now() < quiz.endtime &&
          isUserEligible
          ? quiz
          : null; // Return null if conditions are not met
      })
    );
    // console.log("Userdept",userdept)
    // Remove `null` values to get the final list of quiz objects
    const finalFilteredQuizzes = filteredQuizzes.filter(
      (quiz) => quiz !== null
    );

    console.log(finalFilteredQuizzes)

    // console.log(filteredQuizzes);
    return res.status(200).json({
      success: true,
      data: finalFilteredQuizzes,
    });
  } catch (e) {
    console.log("ERROR GETTING QUIZZES: ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getQuizById = async (req, res) => {
  try {
    console.log("get quiz by id");
    const quizId = req.params.id;
    const quiz = await Quiz.findById(quizId).populate(
      "createdBy",
      "username email"
    );
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }
    console.log("quiz", quiz);
    return res.status(200).json({
      success: true,
      data: quiz,
    });
  } catch (e) {
    console.log("ERROR GETTING QUIZ : ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
vara_answer = [];
// ✅
exports.attemptQuiz = async (req, res) => {
  try {
    const userId = req.user.id;
    const { quizId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ success: false, error: "Quiz not found" });
    }

    const questions = await Question.find({ quizId });
    // console.log(quiz, " ", questions);
    let score = 0;
    const answersArray = [];
    // console.log("questions recieved",questions)
    for (const question of questions) {
      const userAnswer = answers.find(
        (ans) => ans.questionId === question._id.toString()
      );

      if (userAnswer) {
        if (question.questionType === "MCQ") {
          // Handle MCQ
          // console.log("enter MCQ");
          const selectedOption = question.options.id(userAnswer.selectedOption);
          if (selectedOption && selectedOption.isCorrect) {
            score += 1;
          }
          
          answersArray.push({
            questionId: question._id,
            selectedOption: userAnswer.selectedOption,
          });
          // console.log("answersArray", answersArray);
        } else if (question.questionType === "FIB") {
          // console.log("enter FIB");

          // Extract correct answers (normalized)
          const correctAnswers = question.answers
            .filter((ans) => ans.isCorrect)
            .map((ans) => ans.text.toLowerCase().trim());

          // Normalize the user-provided answer (ensure it’s text)
          const userProvidedAnswer = userAnswer.answer
            ? userAnswer.answer.toLowerCase().trim()
            : null;

          // console.log(
          //     "useranswer in FIB",
          //     userProvidedAnswer,
          //     "machine answer",
          //     correctAnswers
          // );

          if (
            userProvidedAnswer &&
            correctAnswers.includes(userProvidedAnswer)
          ) {
            score += 1;
          }

          answersArray.push({
            questionId: question._id,
            answer: userAnswer.answer, // Store the original answer (text)
          });
        }
      }
    }
    console.log(score)
    const attempt = new Attempt({
      userId,
      quizId,
      score,
      answers: answersArray,
    });
    
    await attempt.save();

    const user = await User.findById(userId);
    console.log(user)
    if (!user.attemptedQuizes.includes(quizId)) {
      user.attemptedQuizes.push(quizId);
      await user.save();
    }

    return res.status(200).json({
      success: true,
      message: "Quiz attempted successfully",
      score,
    });
  } catch (e) {
    console.error("ERROR ATTEMPTING QUIZ:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getUserAttempts = async (req, res) => {
  try {
    const userId = req.user.id;

    const attempts = await Attempt.find({ userId }).populate(
      "quizId",
      "title description"
    );

    return res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch (e) {
    console.error("ERROR FETCHING USER ATTEMPTS:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getAdminQuizes = async (req, res) => {
  try {
    const userId = req.user.id;

    const quizzes = await Quiz.find({ createdBy: userId });

    return res.status(200).json({
      success: true,
      data: quizzes,
    });
  } catch (e) {
    console.error("ERROR FETCHING ADMIN QUIZZES:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getQuizAttempts = async (req, res) => {
  try {
    const quizId = req.params.id;

    // Fetch attempts with populated user details
    const attempts = await Attempt.find({ quizId }).populate(
      "userId",
      "username"
    );
    const quizDetails = await Quiz.findById(quizId);

    // Prepare a response with user details and scores for each attempt
    const totalusers = await Promise.all(
      attempts.map(async (attempt) => {
        const user = await User.findById(attempt.userId._id);
        return {
          username: user.username,
          userId: attempt.userId._id,
          year: user.year,
          attemptid: attempt._id,
          department: user.dept,
          class: user.class, // Include class if available
          score: attempt.score, // Score for this specific attempt
          attemptDate: attempt.createdAt, // Optional: Include attempt date
        };
      })
    );

    // Send the final response
    return res.status(200).json({
      success: true,
      quizTitle: quizDetails.title,
      createdAt: quizDetails.createdAt,
      attempts: totalusers, // Rename for clarity
    });
  } catch (e) {
    console.error("ERROR FETCHING QUIZ ATTEMPTS:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

exports.getAllQuizAttempts = async (req, res) => {
  try {
    const { usid } = req.query;
    let userData = null;
    let department = null;
    let year1 = null;
    if (usid) {
      userData = await User.findById(usid);
      const { dept, year } = userData;
      department = dept;
      year1 = year;
    }
    let year = year1;
    // Fetch all attempts with populated quiz and user details
    const attempts = await Attempt.find()
      .populate("quizId", "title department year createdAt") // Populating quizId with title, department, year, and createdAt
      .populate("userId", "username dept year class"); // Populating userId with username, dept, year, and class

    // Debugging: Log all attempts
    console.log("Fetched Attempts:", attempts);

    // Filter attempts by department and/or year if provided
    const filteredAttempts = attempts.filter((attempt) => {
      const user = attempt.userId; // Populated user
      const quiz = attempt.quizId; // Populated quiz

      // Ensure user and quiz exist
      if (!user || !quiz) return false;

      // Debug: Log filtering fields
      console.log(
        "Filtering User Dept:",
        user.dept,
        quiz.department.includes(department)
      );
      console.log("Quiz Dept:", quiz.department);
      console.log(
        "Filtering User Year:",
        user.year,
        quiz.year.includes(Number(year))
      );
      console.log("Quiz Year:", quiz.year);

      // Check if department matches (use includes to match array)
      const matchesDepartment = department
        ? Array.isArray(quiz.department) && quiz.department.includes(department)
        : true;

      // Check if year matches (use includes to match array)
      const matchesYear = year
        ? Array.isArray(quiz.year) && quiz.year.includes(Number(year)) // Ensure year is matched as a number
        : true;

      // Apply filter based on department and/or year
      return matchesDepartment && matchesYear;
    });

    // Debugging: Log filtered attempts
    console.log("Filtered Attempts:", filteredAttempts);

    // Group attempts by quizId
    const groupedAttempts = {};
    filteredAttempts.forEach((attempt) => {
      const quiz = attempt.quizId; // Populated quiz
      const quizId = quiz._id.toString(); // Convert ObjectId to string

      if (!groupedAttempts[quizId]) {
        groupedAttempts[quizId] = {
          quizTitle: quiz.title || "Unknown Quiz",
          createdAt: quiz.createdAt,
          attempts: [],
        };
      }

      groupedAttempts[quizId].attempts.push({
        username: attempt.userId?.username || "Unknown User",
        userId: attempt.userId?._id || "Unknown",
        year: attempt.userId?.year || "Unknown",
        department: attempt.userId?.dept || "Unknown",
        class: attempt.userId?.class || "Not Specified",
        score: attempt.score,
        attemptDate: attempt.createdAt,
      });
    });

    // Convert grouped attempts to an array
    const result = Object.values(groupedAttempts);

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (e) {
    console.error("ERROR FETCHING GROUPED QUIZ ATTEMPTS:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Make sure to import your Quiz model

exports.Attemptedcnt = async (req, res) => {
  try {

    const { quizId, userID } = req.body;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Ensure valid data for the year field
    if (!Array.isArray(quiz.year)) {
      quiz.year = [];
    }

    // Avoid duplicate userIDs in attemptedUsers
    if (!quiz.attemptedUsers.includes(userID)) {
      quiz.attemptedUsers.push(userID);
    }

    // Update or initialize attemptCounts for the user
    const currentCount = quiz.attemptCounts.get(userID) || 0;
    quiz.attemptCounts.set(userID, currentCount + 1);

    // Save the updated quiz document
    const updatedQuiz = await quiz.save();
    res.status(200).json({
      message: "User attempt count updated",
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error("Error in Attemptedcnt function:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.Attemptdelete = async (req, res) => {
  console.log("deletion of attempt", req.body);
  const { attemptID, userId, quizID } = req.body;

  if (!attemptID || !userId) {
    return res.status(400).json({ error: "attemptID and userID are required" });
  }
  console.log("AB");
  try {
    // Validate if userId is a valid ObjectId format
    if (!ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid userId format" });
    }

    // Delete the attempt from the "attempts" collection
    await Attempt.deleteOne({ _id: new ObjectId(attemptID) });

    // Update the quiz document

    await Quiz.updateOne(
      { _id: new ObjectId(quizID) },
      {
        $inc: { [`attemptCounts.${userId}`]: -1 }, // Decrement attempt count by 1
        $pull: { attemptedUsers: new ObjectId(userId) }, // Convert userId to ObjectId
      }
    );

    res.status(200).json({ message: "Attempt deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete the attempt" });
  }
};

exports.departmentreport = async (req, res) => {
  try {
    const { userId, quizId } = req.body;
    const quiz = await Quiz.findById(quizId);
    const user = await User.findById(userId);
    const attempts = await Attempt.find({ userId }).populate(
      "quizId",
      "title description"
    );

    const scores = [];
    const departmentreport = [];

    attempts.forEach((attempt) => {
      scores.push(attempt.score);
    });
    const maxscore = Math.max(...scores);
    departmentreport.push({
      quizname: quiz.title,
      username: user.username,
      score: maxscore,
      department: user.dept,
      class: user.class,
    });
    console.log(departmentreport);

    res
      .status(200)
      .json({ message: "data fetch success", data: departmentreport });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "failed to get report" });
  }
};

exports.newquiznotification = async (req, res) => {
  try {
    const { quizId } = req.body;
    console.log("quizId", quizId);
    // Fetch the quiz by ID
    const quiz = await Quiz.findById(quizId);

    // Fetch all users from the same department, excluding admins
    const users = await User.find({ department: quiz.dept });
    const usersWithoutAdmin = users.filter((user) => user.role !== "admin");

    let eligibleUsers = [];

    if (quiz.lists && quiz.lists.length > 0) {
      // Fetch users from all lists
      const usersFromLists = await Promise.all(
        quiz.lists.map(async (listId) => {
          const list = await Lists.findById(listId); // Ensure this fetches correctly
          return list ? list.users : [];
        })
      );

      // Flatten and deduplicate the list of users
      const allUsersFromLists = new Set(usersFromLists.flat().map(String));

      // Filter non-admin users based on list eligibility
      eligibleUsers = usersWithoutAdmin.filter((user) =>
        allUsersFromLists.has(user._id.toString())
      );
    } else {
      // If no lists are specified, all non-admin users are eligible
      eligibleUsers = usersWithoutAdmin;
    }

    // Log eligible users for debugging
    console.log("Eligible users:", eligibleUsers);
    const totaleligibleusers = eligibleUsers;
    console.log(totaleligibleusers.length);
    // Send notifications to eligible users
    for (const user of eligibleUsers) {
      quizcreationalert(quiz, user.email);
      const bodyFormData = {
        quizTitle: quiz.title,
        quizLink: "www.google.com",
        messageText: `New Test Creation alert: ${quiz.title} has been created. You will receive an email if you are eligible for the test.`,
      };
      
      console.log("BODY", bodyFormData);
      
      await axios({
        method: "post",
        url: `${process.env.BOTURL}/notify-quiz`,
        data: bodyFormData,
        headers: { "Content-Type": "application/json" }, // Use application/json
      })
        .then(function (response) {
          console.log(response.data);
        })
        .catch(function (response) {
          console.log(response.body);
        });
    }

    return res
      .status(200)
      .json({
        success: true,
        message: `Mail sent to ${totaleligibleusers.length} users `,
      });
  } catch (e) {
    console.error("Error in newquiznotification:", e);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

exports.attemptnotcomplete = async (req, res) => {
  try {
    const  quizid  = req.params.id;
    // console.log(quizid)
    const quiz = await Quiz.findById(quizid);
    // console.log(quiz)
    if (!quiz) {
      return res.status(404).json({ success: false, message: "Quiz not found" });
    }
    const attemptCounts = Array.from(quiz.attemptCounts.keys()); 
    const completedAttempts = await Attempt.find({ quizId: quizid }).select("userId"); 
    const completedUserIds = completedAttempts.map((attempt) => attempt.userId.toString());
    const usersNotCompleted = attemptCounts.filter((userId) => !completedUserIds.includes(userId));
    console.log(usersNotCompleted)
    const datatosend = await Promise.all(
      usersNotCompleted.map(async (user) => {
        return await User.findById(user); // Fetch detailed user data
      })
    );
    
    res.status(200).json({
      success: true,
      data: datatosend,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
