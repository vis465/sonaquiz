const mongoose = require("mongoose");

const optionSchema = new mongoose.Schema({
  text: { type: String, required: false },
  isCorrect: { type: Boolean, required: false },
});

const answerSchema = new mongoose.Schema({
  text: { type: String, required: true },
  isCorrect: { type: Boolean, required: false },
});

const questionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  questionText: { type: String, required: true },
  questionType: { type: String, enum: ["MCQ", "FIB"], required: true }, // Type of question
  options: [optionSchema], // For MCQ
  answers: [answerSchema], // For FIB
});

// Add validation to ensure only one of options or answers is populated
questionSchema.pre("validate", function (next) {
  if (this.questionType === "MCQ") {
    if (!this.options || this.options.length < 2) {
      return next(
        new Error("For MCQ type, at least two options must be provided.")
      );
    }
    if (this.answers && this.answers.length > 0) {
      return next(new Error("For MCQ type, answers field must be empty."));
    }
  }

  if (this.questionType === "FIB") {
    
    if (!this.answers || this.answers.length < 1) {
      return next(
        new Error("For FIB type, at least one answer must be provided.")
      );
    }
    if (this.options && this.options.length > 0) {
      return next(new Error("For FIB type, options field must be empty."));
    }
  }

  next();
});

module.exports = mongoose.model("Question", questionSchema);
