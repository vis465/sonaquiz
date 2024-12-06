const Quiz = require("../models/Quiz");
const Question = require("../models/Question");
const Attempt = require("../models/Attempt");
const User = require("../models/User");

// ✅ Create Quiz (with maxAttempts and instructions)
exports.createQuiz = async (req, res) => {
  try {
    console.log(req.body);
    const { title, description, timer, instructions, maxAttempts } = req.body;
    const user = req.user;

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
      maxAttempts,
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

// ✅ Update Quiz (with maxAttempts and instructions)
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

// ✅ Delete Quiz
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

// ✅ Get All Quizzes
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

// ✅ Get Quiz by Id
exports.getQuizById = async (req, res) => {
  try {
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

// ✅ Attempt Quiz (with maxAttempts check)
exports.attemptQuiz = async (req, res) => {
  try {    
    const userId = req.user.id;

    const { quizId, answers } = req.body;


    // Find the quiz
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    const questions = await Question.find({ quizId });
    console.log("attempt logic start")
    // Check if the user has already attempted the quiz
    const userAttempts = await Attempt.find({ quizId, userId });

    // Check if the user has reached the max attempts
    if (userAttempts.length >= quiz.maxAttempts) {
      return res.status(400).json({
        success: false,
        message: `You have reached the maximum attempts for this quiz.`,
      });
    }
    console.log("attempt logic end")
    
    let score = 0;
    const answersArray = [];

    for (const question of questions) {
      const userAnswer = answers.find(
        (ans) => ans.questionId === question._id.toString()
      );
      if (userAnswer) {
        const selectedOption = question.options.id(userAnswer.selectedOption);
        if (selectedOption && selectedOption.isCorrect) {
          score += 1;
        }
        answersArray.push({
          questionId: question._id,
          selectedOption: userAnswer.selectedOption,
        });
      }
    }
    console.log("scoring end")
    // If user has not reached max attempts, allow the quiz attempt to continue
    const attempt = new Attempt({
      userId,
      quizId,
      score,
      answers: answersArray,
    });

    await attempt.save();
    console.log("new attempt saved")
    const user = await User.findById(userId);

    if(!user.attemptedQuizes.includes(quizId)) {
      user.attemptedQuizes.push(quizId);
      await user.save();
    }    return res.status(200).json({
      success: true,
      message: 'Quiz attempted successfully.',
      score,
    });
  } catch (e) {
    console.error("ERROR ATTEMPTING QUIZ:", e.message); // Logs the actual error message
    return res.status(500).json({
        success: false,
        error: e.message || "Internal server error", // Send the error message back
    });
}

};

// ✅ Get User Attempts
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

// ✅ Get Admin Quizzes
exports.getAdminQuizzes = async (req, res) => {
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

// ✅ Get Quiz Attempts
exports.getQuizAttempts = async (req, res) => {
  try {
    const quizId = req.params.id;
    const userId = req.user.id;

    // Find all attempts for the quiz by the user
    const attempts = await Attempt.find({ quizId }).populate(
      "userId score",
      "username"
    );
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
