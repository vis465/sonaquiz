const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");
const Attempt = require("../models/Attempt");
const User = require("../models/User");
const Eligiblitylist = require("../models/eligiblitylists");
const bcrypt = require("bcrypt");
const { attemptQuiz } = require("./quizController");
const Quiz = require("../models/Quiz");
const usercreationmail = require("../mailers/usercraetionmail");
const Department = require("../models/department");

exports.register = async (req, res) => {
  try {
    const {
      year,
      email,
      username,
      password,
      confirmPassword,
      role,
      registerNumber, // Updated field name
      dept,
      class: userClass,
      marks10,
      marks12,
      arrears,
      cgpa,
      admissionType, // Updated field name
      hostelStatus,
      lateralEntry,
      gender,
    } = req.body;

    

    // Perform validations
    if (!email || !username || !password || !confirmPassword) {
      return res.status(400).json({ error: "Missing required fields." });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match." });
    }
   // Check if required fields are present
    if (
      !username ||
      !email ||
      !password ||
      !confirmPassword ||
      !role ||
      !registerNumber ||
      !year ||
      !dept ||
      !userClass ||
      !arrears ||
      !admissionType ||
      !hostelStatus ||
      lateralEntry === undefined ||
      !gender
    ) {
      return res
        .status(400)
        .json({ success: false, error: "Please fill all the fields" });
    }

    // Check if password and confirmPassword match
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Password and Confirm Password should be the same",
      });
    }

    // Check if email already exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({
        success: false,
        error: "Email is already registered, Please log in",
      });
    }

    // Check if username already exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res
        .status(400)
        .json({ success: false, error: "Username already exists" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user document
    const user = await User.create({
      email,
      username,
      password:hashedPassword,
      year,
      confirmPassword,
      role,
      registerNumber,
      dept,
      class:userClass,
      marks10,
      marks12,
      arrears,
      cgpa,
      admissionType,
      hostelStatus,
      lateralEntry,
      gender
    });

    // Send user creation email (assuming the function is defined elsewhere)
    usercreationmail(user);

    console.log(user);

    return res
      .status(200)
      .json({ success: true, message: "User created successfully" });
  } catch (error) {
    console.log("ERROR WHILE REGISTERING THE NEW USER : ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
exports.adddepartment = async (req, res) => {
  try {
    console.log(req.body)
    // const deptname=req.body.name;
    // const deptabbr=req.body.abbr
    // if (!deptname || !deptabbr) {
    //   throw new Error("Both name and abbreviation are required.");
    // }
    
    
    const testDepartment = await Department.create({ name: "Test Department", abbreviation: "TEST" });
console.log("Created department:", testDepartment);

    if(newDepartment){
      console.log("newdept")
    }
    return res
      .status(200)
      .json({ success: true, message: "Department created successfully" });
  } catch (error) {
    console.log("ERROR WHILE ADDING THE NEW DEPARTMENT : ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
exports.departments = async (req, res) => {
  try {
    const departments = await Department.find();
    res.status(200).json(departments);
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error fetching departments" });
  }
};
exports.deletedept = async (req, res) => {
  const deptid = req.body.deptid;
  try {
    console.log("dept delte called", deptid);
    const department = await Department.deleteOne({ _id: deptid });

    if (department) {
      res
        .status(200)
        .json({ success: true, message: "Department deleted successfully" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ success: false, error: "Error deleting department" });
  }
};
exports.updatedept = async (req, res) => {
  console.log("updatecalled");
  const deptid = req.body.deptid;
  const deptname = req.body.deptname;
  const abbr = req.body.abbr;
  console.log(deptid, deptname, abbr);
  try {
    const reponse = await Department.updateOne(
      { _id: deptid },
      { $set: { name: deptname, abbreviation: abbr } }
    );
    if (reponse) {
      res
        .status(200)
        .json({ success: true, message: "Department updated successfully" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "error updating message" });
  }
};

// ✅
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Please fill all the fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ success: false, error: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // create cookie and send res
    const options = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res
      .cookie("token", token, options)
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        data: {
          token,
          user: {
            id: user._id,
            email: user.email,
            username: user.username,
            role: user.role,
            createdAt: user.createdAt,
            attemptedQuizzes: user?.attemptedQuizes || [],
            year: user.year,
            dept: user.dept,
          },
        },
      });
  } catch (error) {
    console.log("ERROR WHILE LOGGIN IN THE USER : ", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

// Fetch all users and analytics
exports.getUsersAndAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalTrainers = await User.countDocuments({ role: "trainer" });
    const totalStudents = await User.countDocuments({ role: "user" });

    // Aggregate students by year
    const studentsByYear = await User.aggregate([
      { $match: { role: "user" } },
      { $group: { _id: "$year", count: { $sum: 1 } } },
    ]);

    // Aggregate students by department
    const studentsByDepartment = await User.aggregate([
      { $match: { role: "user" } },
      { $group: { _id: "$dept", count: { $sum: 1 } } },
    ]);

    const users = await User.find();

    return res.status(200).json({
      success: true,
      users,
      analytics: {
        totalUsers,
        totalAdmins,
        totalStudents,
        studentsByYear,
        totalTrainers,
        studentsByDepartment,
      },
    });
  } catch (error) {
    console.log("Error fetching users and analytics:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

// Delete a user
exports.deleteUser = async (req, res) => {
  console.log("delete server call");
  console.log(req.body);
  const userId = req.body.user_id;
  // generatedid=new ObjectId(userId)
  console.log(userId);
  try {
    const user = await User.findById(userId);
    console.log(user);
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    await User.deleteOne({ _id: userId });

    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.log("Error deleting user:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};

exports.searchUser = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res
        .status(400)
        .json({ success: false, error: "Username is required" });
    }

    // Find user by username
    const user = await User.findOne({ email: username });

    if (!user) {
      return res.status(404).json({ success: false, error: "User not found" });
    }

    // Fetch the user's attempted quizzes and corresponding scores
    const attempts = await Attempt.find({ userId: user._id })
      .populate("quizId") // Populate quiz details (name, etc.)
      .exec();

    // Prepare the attempted quizzes data
    const attemptedQuizzes = attempts.map((attempt) => ({
      quizTitle: attempt.quizId?.title, // Assuming 'title' is a field in the Quiz model
      score: attempt.score,
      attemptedAt: attempt.attemptedAt, // Include timestamp if needed
    }));

    return res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.dept,
        year: user.year,
        attemptedQuizzes, // Include quiz details with score
      },
    });
  } catch (error) {
    console.error("Error searching user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

exports.edituserrole = async (req, res) => {
  console.log(req.body);
  try {
    const { userid, data } = req.body;
    const user = User.findOne(userid);
    const roletoupdate = req.body.data;
    console.log(roletoupdate);
    await User.updateOne({ _id: userid }, { $set: { role: roletoupdate } });
    return res.status(200).json({
      success: true,
      message: `user changed as ${roletoupdate}`,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};
