const mongoose = require("mongoose");

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
      enum: ["admin", "user", "trainer"],
      required: true,
    },
    registerNumber: {
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
      required: true,
    },
    class: {
      type: String,
      required: true,
    },
    cgpa: {
      type: [Number],
      validate: {
        validator: function (v) {
          return v.every(c => c >= 0 && c <= 10);
        },
        message: "CGPA values must be between 0 and 10",
      },
      default: [],
    },
    arrears: {
      type: Number,
      required: true,
      default: 0,
    },
    admissionType: {
      type: String,
      enum: ["sws", "mgmt"],
      required: true,
    },
    hostelStatus: {
      type: String,
      enum: ["hosteler", "dayscholar"],
      required: true,
    },
    lateralEntry: {
      type: Boolean,
      required: true,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: true,
    },
    marks10: {
      type: Number,
      required: true,
    },
    marks12: {
      type: Number,
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
