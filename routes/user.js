const router = require("express").Router();
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const { authenticateToken } = require("./authUser");

// sign up
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password, address } = req.body;
    // check username length is more than 3
    if (username.length < 3) {
      return res
        .status(400)
        .json({ massage: "Username must be more than 3 characters" });
    }

    // check username already exists
    const userExist = await User.findOne({ username: username });
    if (userExist) {
      return res.status(400).json({ massage: "Username already exists" });
    }

    // check email already exists
    const emailExist = await User.findOne({ email: email });
    if (emailExist) {
      return res.status(400).json({ massage: "Email already exists" });
    }

    // check password length is more than 6
    if (password.length <= 5) {
      return res
        .status(400)
        .json({ massage: "Password must be more than 5 characters" });
    }

    const bcryptPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      username: username,
      email: email,
      password: bcryptPassword,
      address: address,
    });
    await newUser.save();
    res.status(201).json({ massage: "Sign successfully" });
  } catch (err) {
    res.status(400).json({ massage: "Internal server error", error: err });
  }
});

// login

router.post("/Login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // check if username exists
    const existingUser = await User.findOne({ username: username });
    if (!existingUser) {
      return res.status(400).json({ message: "Username not found" });
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: "Password is incorrect" });
    }

    const authClaims = {
      email: existingUser.email,
      role: existingUser.role,
    };
    const token = jwt.sign(authClaims, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    return res.status(200).json({
      id: existingUser._id,
      role: existingUser.role,
      token: token,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
});

router.get("/get-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const data = await User.findById(id).select("-password");
    return res.status(200).json(data);
  } catch (err) {
    res.status(400).json({ massage: "Internal server error", error: err });
  }
});

router.put("/update-user-information", authenticateToken, async (req, res) => {
  try {
    const { id } = req.headers;
    const { address } = req.body;
    const data = await User.findByIdAndUpdate(id, { address: address });
    return res.status(200).json({ message: "Update successfully" });
  } catch (err) {
    res.status(400).json({ message: "Internal server error", error: err });
  }
});
module.exports = router;
