const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const User = require("../models/User");

// ✅
exports.createQuiz = async (req, res) => {
  try {
    // console.log(req.body);
    const { title, description, timer, instructions, maxAttempts } = req.body;
    const user = req.user;
    // console.log(maxAttempts);

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

// ✅
exports.updateQuiz = async (req, res) => {
  try {
    const { title, description, timer, instructions, maxAttempts } = req.body;
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) {
      return res
        .status(404)
        .json({ success: false, message: "Quiz not found" });
    }

    quiz.title = title;
    quiz.description = description;
    quiz.timer = timer;
    quiz.instructions = instructions;
    quiz.maxAttempts = maxAttempts;

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

    const quizzes = await Quiz.find().populate("createdBy", "username email");

    // Filter quizzes based on the conditions
    const filteredQuizzes = quizzes.filter((quiz) => {
      const userAttempts = quiz.attemptCounts.get(userId) || 0;
      return userAttempts < quiz.maxAttempts;
    });
    // console.log(filteredQuizzes);
    return res.status(200).json({
      success: true,
      data: filteredQuizzes,
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
    // console.log("get quiz by id");
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
      
          if (userProvidedAnswer && correctAnswers.includes(userProvidedAnswer)) {
              score += 1;
          }
      
          answersArray.push({
              questionId: question._id,
              answer: userAnswer.answer, // Store the original answer (text)
          });
      }
      
      
      }
    }
    
    

    const attempt = new Attempt({
      userId,
      quizId,
      score,
      answers: answersArray,
    });
    await attempt.save();

    const user = await User.findById(userId);

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
    const attempts = await Attempt.find({ quizId }).populate(
      "userId score",
      "username"
    );
    // console.log(attempts);
    const quizname = await Quiz.find({ _id: quizId }).select("title");
    attempts.push(quizname[0].title);
    // console.log(attempts);
    return res.status(200).json({
      success: true,
      data: attempts,
    });
  } catch (e) {
    console.error("ERROR FETCHING QUIZ ATTEMPTS:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
// Make sure to import your Quiz model

exports.Attemptedcnt = async (req, res) => {
  try {
    // Print the payload received
    // console.log("Payload received:", req.body);

    const { quizId, userID } = req.body;

    // Find the quiz by quizId
    const quiz = await Quiz.findById(quizId);

    // If the quiz is not found
    if (!quiz) {
      return res.status(404).json({ error: "Quiz not found" });
    }

    // Add the userID to the attemptedUsers array if not already present
    if (!quiz.attemptedUsers.includes(userID)) {
      quiz.attemptedUsers.push(userID);
    }

    // Check if the user has attempted the quiz already in attemptCounts
    if (quiz.attemptCounts.has(userID)) {
      // Increment the attempt count for the user
      quiz.attemptCounts.set(userID, quiz.attemptCounts.get(userID) + 1);
    } else {
      // Add the user with an initial attempt count of 1
      quiz.attemptCounts.set(userID, 1);
    }

    // Save the updated quiz document
    const updatedQuiz = await quiz.save();

    // Send a response with the updated quiz data
    res.status(200).json({
      message: "User attempt count updated",
      quiz: updatedQuiz,
    });
  } catch (error) {
    console.error("Error in Attemptedcnt function:", error);
    res.status(500).json({ error: "Server error" });
  }
};
