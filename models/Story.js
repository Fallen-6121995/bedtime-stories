const mongoose = require("mongoose");

const storySchema = new mongoose.Schema({
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  isPublic: { type: Boolean, default: false },
  title: String,
  languageCodes: [String], // e.g., ['en', 'hi', 'bn']
  ageGroup: String,
  stories: {
    type: Map,
    of: String // Each key is a lang code, value is the story
  },
  promptUsed: String,
  generatedBy: String,
  audioUrl: String,
  imageUrls: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Story", storySchema);
