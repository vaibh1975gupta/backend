import Video from "../models/Video.js";

export const addVideo = async (req, res) => {
  try {
    const { title, subject, branch, semester, videoUrl, thumbnail } = req.body;

    if (!title || !subject || !branch || !semester || !videoUrl) {
      return res.status(400).json({
        message: "Title, subject, branch, semester and videoUrl are required",
      });
    }

    const video = await Video.create({
      title,
      subject,
      branch,
      semester,
      videoUrl,
      thumbnail: thumbnail || "",
      uploadedBy: req.user._id,
    });

    res.status(201).json({
      message: "Video added successfully",
      video,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getVideos = async (req, res) => {
  try {
    const { branch, semester, subject } = req.query;

    const filter = {};

    if (branch) filter.branch = branch;
    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;

    const videos = await Video.find(filter)
      .sort({ createdAt: -1 })
      .populate("uploadedBy", "name email role");

    res.status(200).json(videos);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;

    const video = await Video.findById(id);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    await video.deleteOne();

    res.status(200).json({
      message: "Video deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};