const cors = require("cors");
const dotenv = require("dotenv");
const express = require("express");
const mongoose = require("mongoose");
const Idea = require("./models/Idea");
const registrationRoutes = require("./routes/registrationroutes");
const { validateIdeaWithGemini } = require("./services/validator");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
 
app.use(cors());
app.use(express.json());


app.use("/api", registrationRoutes);


const connectMongo = async () => {
  if (!MONGO_URI) {
    console.warn("MONGO_URI is not set. Ideas will not be persisted.");
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 5000 });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
  }
};

app.post("/api/ideas/validate", async (req, res) => {
  const { title, description, targetAudience, problemStatement } = req.body;

  if (!title || !description) {
    return res.status(400).json({
      message: "title and description are required.",
    });
  }

  try {
    const validation = await validateIdeaWithGemini({
      title,
      description,
      targetAudience,
      problemStatement,
    });

    let savedIdea = null;
    if (mongoose.connection.readyState === 1) {
      savedIdea = await Idea.create({
        title,
        description,
        targetAudience,
        problemStatement,
        validation,
      });
    }

    return res.status(200).json({
      message: "Idea analyzed successfully",
      validation,
      idea: savedIdea,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Could not analyze startup idea.",
      error: error.message,
    });
  }
});

app.get("/api/ideas", async (_req, res) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(200).json([]);
  }

  const ideas = await Idea.find().sort({ createdAt: -1 }).limit(20);
  return res.json(ideas);
});

app.get("/", (req, res) => {
  res.send("Backend running...");
});

connectMongo().then(() => {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});