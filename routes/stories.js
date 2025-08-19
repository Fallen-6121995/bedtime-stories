const express = require('express');
const router = express.Router();
const { storyGeneration, createStoryAudio, getSpeakers, getStories, toggleVisibility } = require('../controllers/StoryController');
const { auth } = require('../middleware/auth');

router.post('/generate-story', auth, storyGeneration);
router.post('/create-audio', auth, createStoryAudio);
router.get('/', auth, getStories);
router.patch('/:id/visibility', auth, toggleVisibility);

module.exports = router;
