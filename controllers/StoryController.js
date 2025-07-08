const Story = require("../models/Story");
const { generateStory } = require("../services/togetherAI");
const { languageCodeMap } = require("../utils/utils")
const { generateSpeech } = require("../utils/tts");
const mongoose = require('mongoose');
const promts = require("../prompts/prompts");
const fs = require('fs');
const path = require('path');
const axios =  require('axios');

// Ensure tts_audio directory exists
const ttsDir = path.join(__dirname, '..', 'tts_audio');
if (!fs.existsSync(ttsDir)) {
  fs.mkdirSync(ttsDir, { recursive: true });
}

// Generate & store a new story
const extractValidJSON = (text) => {
    const jsonMatch = text.match(/{[\s\S]*?}/); // grab first {} block only
    if (!jsonMatch) {
      throw new Error("No valid JSON object found in AI response.");
    }
    return jsonMatch[0];
  };
  
  exports.storyGeneration = async (req, res) => {
    try {
      const { childName, ageGroup, topic, language, category } = req.body;
      const langCode = languageCodeMap[language] || "en";
      const prompt = promts[category]({ childName, ageGroup, topic, language, langCode });
  
      const storyText = await generateStory(prompt);
  
      let storyData;
      try {
        const cleaned = extractValidJSON(storyText);
        storyData = JSON.parse(cleaned);
      } catch (e) {
        console.error("❌ Failed to parse AI JSON:", e.message, "\n--- Raw Response ---\n", storyText);
        return res.status(500).json({ error: "AI returned invalid JSON. Try again." });
      }
  
      const storiesMap = {};
      const languageCodes = [];
  
      for (const key of Object.keys(storyData)) {
        if (key.startsWith("story_")) {
          const code = key.replace("story_", "");
          storiesMap[code] = storyData[key];
          languageCodes.push(code);
        }
      }
  
      const story = new Story({
        title: storyData.title || `${childName} and the ${topic}`,
        languageCodes,
        ageGroup: storyData.ageGroup || ageGroup,
        stories: storiesMap,
        promptUsed: prompt,
        generatedBy: "Meta-LLaMA-3-70B"
      });
  
      const saved = await story.save();
      res.status(201).json(saved);
    } catch (err) {
      console.error("🚨 Server Error:", err.message);
      res.status(500).json({ error: "Story generation failed." });
    }
  };

  exports.createStoryAudio = async (req, res) => {
    try {
      const { storyId, langCode = 'en', speaker } = req.body;
      console.log(`🎯 Received audio generation request for story: ${storyId} in lang: ${langCode}`);
  
      if (!mongoose.Types.ObjectId.isValid(storyId)) {
        return res.status(400).json({ error: 'Invalid story ID format.' });
      }
  
      const story = await Story.findById(storyId);
      if (!story) {
        return res.status(404).json({ error: 'Story not found.' });
      }
  
      const storyText = story.stories.get(langCode) || story.stories[langCode];
      if (!storyText) {
        return res.status(400).json({ error: `Story not available in language code: ${langCode}` });
      }
  
      // Timestamp
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0,15);
      const fileName = `story_${storyId}_${langCode}_${timestamp}.wav`;
  
      console.log(`🚀 Generating speech for [${langCode}] -> ${fileName}`);
  
      // Now pass speaker as well
      const result = await generateSpeech({
        text: storyText,
        lang: langCode,
        speaker,
        fileName
      });
  
      if (!result.success) {
        console.error("❌ TTS generation failed:", result.error);
        return res.status(500).json({ error: 'Text-to-speech generation failed', details: result.error });
      }
  
      console.log(`✅ Audio generation complete: ${result.filePath}`);
      res.download(result.filePath);
  
    } catch (err) {
      console.error("🚨 Narration error:", err);
      res.status(500).json({ error: 'Narration failed.', details: err.message });
    }
  };

  exports.getSpeakers = async (req, res) => {
    try {
      const response = await axios.post("http://localhost:8400/speakers");
  
      const speakers = response.data.speakers;
      console.log("Speakers received:", speakers);
      
      res.status(200).json({ speakers });
    } catch (err) {
      console.error("🚨 Error getting speakers:", err);
      res.status(500).json({ error: 'Narration failed.', details: err.message });
    }
  };
// // 📚 Get all stories
// router.get("/", async (req, res) => {
//   const stories = await Story.find().sort({ createdAt: -1 });
//   res.json(stories);
// });

// // 🔍 Filter by language or age group
// router.get("/search", async (req, res) => {
//   const { language, ageGroup } = req.query;
//   const filter = {};
//   if (language) filter.language = language;
//   if (ageGroup) filter.ageGroup = ageGroup;

//   const stories = await Story.find(filter).sort({ createdAt: -1 });
//   res.json(stories);
// });