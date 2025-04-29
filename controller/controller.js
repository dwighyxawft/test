const express = require("express");
const user = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const generateToken = function (user) {
    return jwt.sign(
        {
        id: user._id,
        name: user.name,
        email: user.email,
        },
        process.env.JWT_SECRET,
        { expiresIn: "30d" }
    );
}

const register = async function (req, res) {
  const { name, email, password } = req.body;

  // Check if all fields are filled
  if (!name || !email || !password)
    return res.status(400).json({ message: "Please fill all fields" });

  // Check if user already exists
  const existingUser = await user.find({ email: email }).exec();
  if (existingUser.length > 0)
    return res.status(400).json({ message: "User already exists" });

  if (password.length < 6)
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new user({
      name: name,
      email: email,
      password: hashedPassword,
    });
    await newUser.save();
    res.status(201).json({ message: "User registered successfully", user: newUser });
};

const login = async function (req, res) {
    const { email, password } = req.body;
    
    // Check if all fields are filled
    if (!email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    // Check if user exists
    const existingUser = await user.findOne({ email: email }).exec();
    if (existingUser.length === 0)
      return res.status(400).json({ message: "User does not exist" });

    // Check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = generateToken(existingUser);

    // Set cookie with JWT token
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

const find = async function (req, res) {
    const existingUsers = await user.find().exec();
    return res.status(200).json({
        message: "Users found",
        user: existingUser,
    });
};

const update = async function (req, res) {

    const { name, email, password } = req.body;

    // Check if all fields are filled
    if (!name || !email || !password)
      return res.status(400).json({ message: "Please fill all fields" });

    // Check if user exists
    const existingUser = await user.findById(req.user.id).exec();
    if (!existingUser)
      return res.status(400).json({ message: "User does not exist" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);


    // Update user
    await user.findByIdAndUpdate(req.user.id, {
        name: name,
        email: email,
        password: hashedPassword,
    });
    const updatedUser = await user.findById(req.user.id).exec();

    return res.status(200).json({
        message: "User updated successfully",
        user: updatedUser,
    });
};

const terminate = async function (req, res) {
    // Check if user exists
    const existingUser = await user.findById(req.user.id).exec();
    if (!existingUser)
      return res.status(400).json({ message: "User does not exist" });

    // Delete user
    await user.findByIdAndDelete(req.user.id);
    return res.status(200).json({
        message: "User deleted successfully",
    });
};

module.exports = { register, login, find, update, terminate };
