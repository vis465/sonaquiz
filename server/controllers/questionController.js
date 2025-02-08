const { json } = require("express");
const client = require("../config/redis");
const Question = require("../models/Question");
require("dotenv").config();

// ✅
exports.createQuestion = async (req, res) => {
  try {
    const {
      questionText,
      options,
      answers,
      quizId,
      questionType,
      questionImage,
      questionFormat,
      section
    } = req.body;

    // Validate required fields
    if (!questionType || !quizId) {
      return res.status(400).json({
        success: false,
        error: "Please provide all the required fields",
      });
    }

    // Validate MCQ-specific fields
    if (questionType === "MCQ") {
      if (!options || !Array.isArray(options) || options.length < 2) {
        return res.status(400).json({
          success: false,
          error: "Options should be an array with at least two items for MCQ.",
        });
      }
      for (const option of options) {
        if (
          typeof option.text !== "string" ||
          typeof option.isCorrect !== "boolean"
        ) {
          return res.status(400).json({
            success: false,
            error:
              "Each option should have 'text' as string and 'isCorrect' as boolean.",
          });
        }
      }
    }

    // Validate FIB-specific fields
    if (questionType === "FIB") {
      if (!answers || !Array.isArray(answers) || answers.length < 1) {
        return res.status(400).json({
          success: false,
          error: "At least one acceptable answer must be provided for FIB.",
        });
      }
      for (const answer of answers) {
        if (typeof answer.text !== "string") {
          return res.status(400).json({
            success: false,
            error: "Each answer should have 'text' as string.",
          });
        }
      }
    }

    // Validate optional fields
    if (questionImage && typeof questionImage !== "string") {
      return res.status(400).json({
        success: false,
        error: "Image must be provided as a base64 string.",
      });
    }
    if (questionFormat && typeof questionFormat !== "string") {
      return res.status(400).json({
        success: false,
        error: "questionFormat must be a string.",
      });
    }

    // Create question
    const question = await Question.create({
      quizId,
      questionText,
      questionType,
      options: questionType === "MCQ" ? options : undefined,
      answers: questionType === "FIB" ? answers : undefined,
      questionImage, // Optional image field
      questionFormat, // Optional formatting field
      section
    });
    console.log("question");
    return res.status(201).json({
      success: true,
      message: "Question created successfully",
      data: question,
    });
  } catch (e) {
    console.error("ERROR CREATING QUESTION: ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.updateQuestion = async (req, res) => {
  try {
    const { questionText, options } = req.body;
    const { id } = req.params;

    // Check for required fields
    if (!questionText || !options) {
      return res.status(400).json({
        success: false,
        error: "Please provide question text and options.",
      });
    }

    // Validate options structure
    if (!Array.isArray(options) || options.length < 2) {
      return res.status(400).json({
        success: false,
        error: "Options should be an array with at least two items.",
      });
    }

    for (const option of options) {
      if (
        typeof option.text !== "string" ||
        typeof option.isCorrect !== "boolean"
      ) {
        return res.status(400).json({
          success: false,
          error:
            "Each option should have 'text' as string and 'isCorrect' as boolean.",
        });
      }
    }

    // Update the question
    const question = await Question.findByIdAndUpdate(
      id,
      { questionText, options },
      { new: true }
    );

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question updated successfully",
      question,
    });
  } catch (e) {
    console.error("ERROR UPDATING QUESTION:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.deleteQuestion = async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the question
    const question = await Question.findByIdAndDelete(id);

    if (!question) {
      return res.status(404).json({
        success: false,
        error: "Question not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (e) {
    console.error("ERROR DELETING QUESTION:", e.message);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// ✅
exports.getQuizQuestions = async (req, res) => {
  try {
    const ttl = process.env.REDDISTTL;
    const quizId = req.params.id;

    const redisoutput = await client.get(`quiz:${quizId}`);

    let questions;

    if (redisoutput) {
      console.log(`Cache hit for ${quizId}`);
      questions = JSON.parse(redisoutput);
    } else {

      questions = await Question.find({ quizId });
      console.log(`caching questions for quiz ${quizId}`)
      client.setEx(`quiz:${quizId}`, ttl, JSON.stringify(questions));
    }

    return res.status(200).json({
      success: true,
      data: questions,
    });
  } catch (e) {
    console.log("ERROR GETTING QUIZ QUESTIONS: ", e);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

