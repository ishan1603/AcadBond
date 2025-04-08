import mongoose from "mongoose";

const ResearchPaperSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  abstract: {
    type: String,
  },
  authors: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you want to link authors to registered users
    },
  ],
  topics: [
    {
      type: String,
    },
  ],
  publishedDate: {
    type: Date,
    required: true,
  },
  journal: {
    type: String,
  },
  doi: {
    type: String,
    unique: true,
    sparse: true,
  },
  pdfUrl: {
    type: String,
  },
  citationCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.ResearchPaper ||
  mongoose.model("ResearchPaper", ResearchPaperSchema);
