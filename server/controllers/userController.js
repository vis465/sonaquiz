const jwt = require("jsonwebtoken");
const { ObjectId } = require('mongodb');

const User = require("../models/User");
const bcrypt = require("bcrypt");

// ✅
exports.register = async (req, res) => {
  try {
    const { email, username, password, confirmPassword, role, regnNumber, year, dept, class: userClass } = req.body;

    if (!username || !email || !password || !confirmPassword || !role || !regnNumber || !year || !dept || !userClass) {
      return res
        .status(400)
        .json({ success: false, error: "Please fill all the fields" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        error: "Password and Confirm Password should be same",
      });
    }

    const emailExists = await User.findOne({ email });
    
    if (emailExists) {
      return res
        .status(400)
        .json({ success: false, error: "Email is already registered, Please log in" });
    }

    const usernameExists = await User.findOne({ username });

    if (usernameExists) {
      return res
        .status(400)
        .json({ success: false, error: "Username already exists" });
    }

    const hashedPasssword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPasssword,
      role,
      regnNumber,
      year,
      dept,
      class: userClass,
    });

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

    return res.cookie("token", token, options).status(200).json({
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
        },
      },
    });
  } catch (error) {
    console.log("ERROR WHILE LOGGIN IN THE USER : ", e);
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
  console.log("delete server call")
  console.log(req.body)
  const userId = req.body.user_id;
  // generatedid=new ObjectId(userId)
  console.log(userId)
  try {
    const user = await User.findById(userId);
    console.log(user)
    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    await User.deleteOne({_id:userId})

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

// Update user details
exports.updateUser = async (req, res) => {
  const { userId } = req.params;
  const { username, email, role, year, dept, class: userClass } = req.body;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(400).json({
        success: false,
        error: "User not found",
      });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role = role || user.role;
    user.year = year || user.year;
    user.dept = dept || user.dept;
    user.class = userClass || user.class;

    await user.save();

    return res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    console.log("Error updating user:", error);
    return res.status(500).json({
      success: false,
      error: "Internal server error",
    });
  }
};
