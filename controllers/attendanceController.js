import Attendance from "../models/Attendance.js";
import User from "../models/User.js";

export const markAttendance = async (req, res) => {
  try {
    const { studentId, subject, branch, semester, date, status } = req.body;

    if (!studentId || !subject || !branch || !semester || !date || !status) {
      return res.status(400).json({
        message: "studentId, subject, branch, semester, date and status are required",
      });
    }

    const student = await User.findById(studentId);

    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    const existingAttendance = await Attendance.findOne({
      studentId,
      subject,
      date,
    });

    if (existingAttendance) {
      existingAttendance.status = status;
      await existingAttendance.save();

      return res.status(200).json({
        message: "Attendance updated successfully",
        attendance: existingAttendance,
      });
    }

    const attendance = await Attendance.create({
      studentId,
      teacherId: req.user._id,
      subject,
      branch,
      semester,
      date,
      status,
    });

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getStudentAttendance = async (req, res) => {
  try {
    const studentId = req.user._id;

    const attendance = await Attendance.find({ studentId })
      .sort({ createdAt: -1 })
      .populate("teacherId", "name email");

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getChildAttendance = async (req, res) => {
  try {
    const { childId } = req.params;

    const attendance = await Attendance.find({ studentId: childId })
      .sort({ createdAt: -1 })
      .populate("teacherId", "name email")
      .populate("studentId", "name email");

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getClassAttendance = async (req, res) => {
  try {
    const { branch, semester, subject, date } = req.query;

    const filter = {};

    if (branch) filter.branch = branch;
    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;
    if (date) filter.date = date;

    const attendance = await Attendance.find(filter)
      .sort({ createdAt: -1 })
      .populate("studentId", "name email enrollmentNo")
      .populate("teacherId", "name email");

    res.status(200).json(attendance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};