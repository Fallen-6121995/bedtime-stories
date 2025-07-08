const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const storyRoutes = require("./routes/stories");
const cors = require('cors');
const bodyParser = require('body-parser');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
// app.use(morgan('dev'));
app.use(bodyParser.json());
app.use("/api/stories", storyRoutes);

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));