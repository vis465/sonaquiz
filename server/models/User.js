const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["admin", "user","trainer"],
      required: true,
    },
    regnNumber: {
      type: String,
      required: true,
    },
    year: {
      type: Number,
      enum: [1, 2, 3, 4],
      required: true,
    },
    dept: {
      type: String,
      enum: ["CSE", "IT", "EEE", "CE","ECE","MCT","BME","ADS",'FT','CSD','AIML', "MECH"],
      required: true,
    },
    class: {
      type: String,
      enum: ["A", "B", "C", "D", "E"],
      required: true,
    },
    attemptedQuizes: [
      
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
