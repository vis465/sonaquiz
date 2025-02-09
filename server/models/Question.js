const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String, required: false },
  isCorrect: { type: Boolean, required: false },
  imageUrl: { type: String, required: false }, // For image-based options
});

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: false },
});

const questionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  questionText: { type: String, required: false }, // Made optional since we might have image-only questions
  questionImage: { type: String, required: false }, // URL/path to question image
  questionType: { 
    type: String, 
    enum: ["MCQ", "FIB", "IMAGE_MCQ"], // Added IMAGE_MCQ type
    required: true 
  },
  
  options: [optionSchema], // For MCQ and IMAGE_MCQ
  answers: [answerSchema], // For FIB
  questionFormat: {
    type: String,
    enum: ["TEXT", "IMAGE", "BOTH"], // To specify if it's text, image, or both
    required: false
  },
  section: { type: String, required: false },
});

// Updated validation logic
questionSchema.pre("validate", function (next) {
  // Validate question format
  if (this.questionFormat === "TEXT" && !this.questionText) {
    return next(new Error("Text questions require questionText"));
  }
  if (this.questionFormat === "IMAGE" && !this.questionImage) {
    return next(new Error("Image questions require questionImage"));
  }
  if (this.questionFormat === "BOTH" && (!this.questionText || !this.questionImage)) {
    return next(new Error("Combined questions require both questionText and questionImage"));
  }

  // Validate question types
  if (this.questionType === "MCQ") {
    if (!this.options || this.options.length < 2) {
      return next(new Error("For MCQ type, at least two options must be provided."));
    }
    if (this.answers && this.answers.length > 0) {
      return next(new Error("For MCQ type, answers field must be empty."));
    }
  }

  if (this.questionType === "IMAGE_MCQ") {
    if (!this.options || this.options.length < 2) {
      return next(new Error("For IMAGE_MCQ type, at least two options must be provided."));
    }
    if (this.answers && this.answers.length > 0) {
      return next(new Error("For IMAGE_MCQ type, answers field must be empty."));
    }
    // Ensure at least one option has an imageUrl for IMAGE_MCQ
    const hasImageOption = this.options.some(option => option.imageUrl);
    if (!hasImageOption) {
      return next(new Error("IMAGE_MCQ type must have at least one image option."));
    }
  }

  if (this.questionType === "FIB") {
    if (!this.answers || this.answers.length < 1) {
      return next(new Error("For FIB type, at least one answer must be provided."));
    }
    if (this.options && this.options.length > 0) {
      return next(new Error("For FIB type, options field must be empty."));
    }
  }

  next();
});

module.exports = mongoose.model("Question", questionSchema);