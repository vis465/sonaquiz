// models/Department.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const departmentSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  abbreviation: {
    type: String,
    required: true,
    unique: true,
  },
});

module.exports = mongoose.model("Department", departmentSchema);
