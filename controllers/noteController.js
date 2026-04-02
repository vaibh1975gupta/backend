import Note from "../models/Note.js";

export const addNote = async (req, res) => {
  try {
    console.log("BODY:", req.body);
    console.log("FILE:", req.file);

    const { title, subject, branch, semester } = req.body;

    if (!title || !subject || !branch || !semester) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const pdfUrl = `https://backend-llez.onrender.com/uploads/${req.file.filename}`;

    const note = await Note.create({
      title,
      subject,
      branch,
      semester,
      pdfUrl,
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      message: "Note added successfully",
      note,
    });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const getNotes = async (req, res) => {
  try {
    const { branch, semester } = req.query;

    const filter = {};
    if (branch) filter.branch = branch;
    if (semester) filter.semester = semester;

    const notes = await Note.find(filter).sort({ createdAt: -1 });

    res.json(notes);
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};

export const deleteNote = async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    await note.deleteOne();
    res.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.log("ERROR:", error);
    res.status(500).json({ message: error.message });
  }
};