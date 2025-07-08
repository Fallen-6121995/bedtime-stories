const express = require('express');
const router = express.Router();
const { storyGeneration, createStoryAudio, getSpeakers } = require('../controllers/StoryController');

router.post('/generate-story', storyGeneration);
router.post('/create-audio', createStoryAudio);
router.get('/get-speakers', getSpeakers);


module.exports = router;