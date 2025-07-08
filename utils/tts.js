const fs = require("fs");
const path = require("path");
const googleTTS = require("google-tts-api");
const axios = require("axios");

// Ensure tts_audio folder exists
const ttsDir = path.join(__dirname, "tts_audio");
if (!fs.existsSync(ttsDir)) {
  fs.mkdirSync(ttsDir, { recursive: true });
}

async function generateSpeech({ text, lang = "en", fileName }) {
  try {
    // Google TTS has a 200 character limit per request, so split if needed
    const parts = googleTTS.getAllAudioUrls(text, {
      lang,
      slow: false,
      host: "https://translate.google.com",
      splitPunct: ".?!,，、。"
    });

    const filePath = path.join(ttsDir, fileName.endsWith(".mp3") ? fileName : fileName + ".mp3");
    const writeStream = fs.createWriteStream(filePath);

    for (const part of parts) {
      const response = await axios.get(part.url, { responseType: "arraybuffer" });
      writeStream.write(Buffer.from(response.data));
    }
    writeStream.end();

    // Wait for the stream to finish
    await new Promise((resolve) => writeStream.on("finish", resolve));

    return { success: true, filePath };
  } catch (err) {
    console.error("❌ generateSpeech failed:", err.message);
    return { success: false, error: err.message };
  }
}

module.exports = { generateSpeech };