import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      branch,
      semester,
      enrollmentNo,
      childId,
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      branch,
      semester,
      enrollmentNo,
      childId: childId || null,
    });

    const token = generateToken(user);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        semester: user.semester,
        enrollmentNo: user.enrollmentNo,
        childId: user.childId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = generateToken(user);

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        branch: user.branch,
        semester: user.semester,
        enrollmentNo: user.enrollmentNo,
        childId: user.childId,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    res.status(200).json({
      user: req.user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const adminOnly = async (req, res) => {
  try {
    res.status(200).json({ message: "Welcome Admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const teacherOnly = async (req, res) => {
  try {
    res.status(200).json({ message: "Welcome Teacher" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const studentOnly = async (req, res) => {
  try {
    res.status(200).json({ message: "Welcome Student" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const parentOnly = async (req, res) => {
  try {
    res.status(200).json({ message: "Welcome Parent" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};