const User = require("../models/User");
const Eligiblitylist = require("../models/eligiblitylists");

// Create a new list
exports.createList = async (req, res) => {
  try {
    const { listname, createdBy } = req.body;

    // Check if a list with the same name exists
    const existingList = await Eligiblitylist.findOne({ listname, createdBy });
    if (existingList) {
      return res
        .status(400)
        .json({
          success: false,
          message: "List with this name already exists",
        });
    }

    // Create a new list
    const list = await Eligiblitylist.create({ listname, createdBy });
    console.log("LIST",list)
    return res.status(201).json({ success: true, list });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a list
exports.deleteList = async (req, res) => {
  try {
    const { listid } = req.params;

    const list = await Eligiblitylist.findByIdAndDelete(listid);
    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }

    return res.status(200).json({ success: true, message: "List deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Add a user to a list by email
exports.addUserToList = async (req, res) => {
  try {
    const { email, listid } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const userID = user._id;
    const list = await Eligiblitylist.findById(listid);
    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }

    if (!list.users.includes(userID)) {
      list.users.push(user._id);
      await list.save();
    }

    return res
      .status(200)
      .json({ success: true, message: "User added to list", list });
  } catch (error) {
    res.status(500).json({ success: false, error: "user mail not found" });
  }
};
exports.getAllLists = async (req, res) => {
  try {
    console.log("All lists");
    const lists = await Eligiblitylist.find()
      .populate({
        path: "users",
        select: "-password -__v", // Exclude sensitive fields
      })
      .populate({
        path: "createdBy",
        select: "name email", // Optionally include metadata about the creator
      });

    if (!lists.length) {
      return res
        .status(404)
        .json({ success: false, message: "No lists found" });
    }

    return res.status(200).json({ success: true, lists });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Get users of a specific list
exports.getUsersOfList = async (req, res) => {
  try {
    const { listid } = req.body;
    console.log("listid", listid);
    const list = await Eligiblitylist.findById(listid).populate({
      path: "users",
      select: "-password -__v", // Exclude sensitive fields
    });

    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }

    if (!list.users.length) {
      return res
        .status(404)
        .json({ success: false, message: "No users found in this list" });
    }

    return res.status(200).json({ success: true, users: list.users });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};

// Delete a user from a list
exports.deleteUserFromList = async (req, res) => {
  try {
    const { userid, listid } = req.body;
    console.log(userid, listid);

    const list = await Eligiblitylist.findById(listid);
    if (!list) {
      return res
        .status(404)
        .json({ success: false, message: "List not found" });
    }

    list.users = list.users.filter((id) => id.toString() !== userid);
    await list.save();

    return res
      .status(200)
      .json({ success: true, message: "User removed from list", list });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
};
