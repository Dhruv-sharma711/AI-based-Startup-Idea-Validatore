const mongoose = require("mongoose");

const ideaSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    targetAudience: { type: String, default: "" },
    problemStatement: { type: String, default: "" },
    validation: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Idea", ideaSchema);
