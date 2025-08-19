const Story = require("../models/Story");
const ApiError = require('../utils/ApiError');
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

  exports.storyGeneration = async (req, res, next) => {
    try {
      const { childName, ageGroup, topic, language, category, isPublic = false } = req.body;
      if (!childName || !ageGroup || !topic || !language || !category) {
        throw new ApiError(400, 'childName, ageGroup, topic, language, and category are required');
      }

      const langCode = languageCodeMap[language] || "en";
      const prompt = promts[category]({ childName, ageGroup, topic, language, langCode });

      const storyText = await generateStory(prompt);

      let storyData;
      try {
        const cleaned = extractValidJSON(storyText);
        storyData = JSON.parse(cleaned);
      } catch (e) {
        console.error("❌ Failed to parse AI JSON:", e.message, "\n--- Raw Response ---\n", storyText);
        throw new ApiError(500, 'AI returned invalid JSON. Try again.');
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
        owner: req.user._id,
        isPublic,
        title: storyData.title || `${childName} and the ${topic}`,
        languageCodes,
        ageGroup: storyData.ageGroup || ageGroup,
        stories: storiesMap,
        promptUsed: prompt,
        generatedBy: "Meta-LLaMA-3-70B"
      });

      const saved = await story.save();

      if (savedStory.stories.get(langCode)) {
             const storyId = savedStory._id;
             const textToSpeech = savedStory.stories.get(langCode);
             const timestamp = new Date().toISOString().replace(/[-:.]/g, '').slice(0,15);
             const fileName = `story_${storyId}_${langCode}_${timestamp}.mp3`;

             console.log(`🚀 Generating speech for [${langCode}] -> ${fileName}`);

             const audioResult = await generateSpeech({
                       text: textToSpeech,
                       lang: langCode,
                       speaker: speaker || 'default',
                       fileName
                     });
             if (audioResult.success) {
                  console.log(`✅ Audio generation complete: ${audioResult.filePath}`);

                  const bucketName = process.env.S3_BUCKET_NAME;
                  const s3Key = `audio/${fileName}`;

                  const s3UploadResult = await uploadFileToS3(audioResult.filePath, bucketName, s3Key);

                  if (s3UploadResult.success) {
                    console.log(`✅ Audio uploaded to S3: ${s3UploadResult.location}`);
                    savedStory.audioUrl = s3UploadResult.location;
                    await savedStory.save();
                  } else {
                    console.error("❌ S3 Upload Failed:", s3UploadResult.error);
                  }

                  fs.unlink(audioResult.filePath, (err) => {
                    if (err) console.error("Error deleting local audio file:", err);
                    else console.log(`Deleted local file: ${audioResult.filePath}`);
                  });

                } else {
                  console.error("❌ TTS generation failed post-story generation:", audioResult.error);
                }
              } else {
                console.warn(`⚠️ Story not available in language code ${langCode} for audio generation.`);
              }
      res.status(201).json(saved);
    } catch (err) {
      next(err);
    }
  };

  exports.createStoryAudio = async (req, res, next) => {
    try {
      const { storyId, langCode = 'en', speaker } = req.body;
      if (!storyId || !langCode) {
        throw new ApiError(400, 'storyId and langCode are required');
      }

      console.log(`🎯 Received audio generation request for story: ${storyId} in lang: ${langCode}`);

      if (!mongoose.Types.ObjectId.isValid(storyId)) {
        throw new ApiError(400, 'Invalid story ID format.');
      }

      const story = await Story.findById(storyId);
      if (!story) {
        throw new ApiError(404, 'Story not found.');
      }

      const storyText = story.stories.get(langCode) || story.stories[langCode];
      if (!storyText) {
        throw new ApiError(400, `Story not available in language code: ${langCode}`);
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
        throw new ApiError(500, 'Text-to-speech generation failed');
      }

      console.log(`✅ Audio generation complete: ${result.filePath}`);
      res.download(result.filePath);

    } catch (err) {
      next(err);
    }
  };

  exports.getStories = async (req, res, next) => {
    try {
      const stories = await Story.find({
        $or: [
          { isPublic: true },
          { owner: req.user._id }
        ]
      }).populate('owner', 'name email').sort({ createdAt: -1 });

      res.json(stories);
    } catch (error) {
      next(error);
    }
  };

  exports.toggleVisibility = async (req, res, next) => {
    try {
      const story = await Story.findOne({ _id: req.params.id, owner: req.user._id });
      if (!story) throw new ApiError(404, 'Story not found or not owned by user');

      story.isPublic = !story.isPublic;
      await story.save();
      res.json(story);
    } catch (error) {
      next(error);
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
