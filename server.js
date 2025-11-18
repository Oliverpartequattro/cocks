// server.js
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 4100;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
const MONGODB_URI = "mongodb+srv://ronczoliver:nigger@cluster0.hmkrhja.mongodb.net/?appName=Cluster0";

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Schema & Model
const cockSchema = new mongoose.Schema({
  name: String,
  size: Number,
  color: String,
});

const Cock = mongoose.model("Cock", cockSchema, "cocks");

// Routes

// 1️⃣ GET - összes dokumentum
app.get("/cocks", async (req, res) => {
  try {
    const cocks = await Cock.find();
    res.json(cocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2️⃣ GET /:id - egy adott dokumentum
app.get("/cocks/:id", async (req, res) => {
  try {
    const cock = await Cock.findById(req.params.id);
    if (!cock) return res.status(404).json({ message: "Not found" });
    res.json(cock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3️⃣ POST - új dokumentum létrehozása
app.post("/cocks", async (req, res) => {
  try {
    const newCock = new Cock(req.body);
    await newCock.save();
    res.status(201).json(newCock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 4️⃣ PUT /:id - meglévő frissítése
app.put("/cocks/:id", async (req, res) => {
  try {
    const updatedCock = await Cock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedCock) return res.status(404).json({ message: "Not found" });
    res.json(updatedCock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 5️⃣ DELETE /:id - törlés
app.delete("/cocks/:id", async (req, res) => {
  try {
    const deletedCock = await Cock.findByIdAndDelete(req.params.id);
    if (!deletedCock) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
