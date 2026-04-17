const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Registration = require("../models/registerschema");

const JWT_SECRET = process.env.JWT_SECRET || "change_this_secret_in_env";

// --- POST /api/register ---
const createRegistration = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Basic validation
    if (!firstName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Kuch fields khaali hain. Sab bharo."
      });
    }

    // Email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Email sahi nahi hai."
      });
    }

    // Password strength check
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(password)) {
      return res.status(400).json({
        success: false,
        message:
          "Password strong hona chahiye (8+ chars, uppercase, lowercase, number, special char)."
      });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    const newRegistration = new Registration({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    await newRegistration.save();

    res.status(201).json({
      success: true,
      message: "Registration ho gayi! 🎉"
    });

  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: "Yeh email pehle se registered hai."
      });
    }

    console.log("Server error:", error);
    res.status(500).json({
      success: false,
      message: "Server mein kuch problem hai. Baad mein try karo."
    });
  }
};

// --- POST /api/login ---
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email aur password dono chahiye."
      });
    }

    // Find user by email
    const user = await Registration.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Email ya password galat hai."
      });
    }

    // Compare password with stored hash
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Email ya password galat hai."
      });
    }

    // Generate JWT token (expires in 7 days)
    const token = jwt.sign(
      { id: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: `Welcome back, ${user.firstName}! 🎉`,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
      }
    });

  } catch (error) {
    console.log("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Server mein kuch problem hai. Baad mein try karo."
    });
  }
};

// --- GET /api/users ---
const getAllRegistrations = async (req, res) => {
  try {
    const all = await Registration.find({}, { password: 0 }).sort({ createdAt: -1 });
    res.json({
      success: true,
      count: all.length,
      data: all
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error aaya." });
  }
};

module.exports = { createRegistration, loginUser, getAllRegistrations };