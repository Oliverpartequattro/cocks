const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
 
const app = express();

app.use(express.json());
app.use(cors());

const cockSchema = new mongoose.Schema({
  _id: Number,
  nev: String,
  kor: Number,
  fogadas_osszeg: Number,
  kedvenc_kakas: String,
  battle_id: Number,
});

const Cock = mongoose.model("Cock", cockSchema, "cocks");

module.exports = { app, Cock };


app.get("/cocks", async (req, res) => {
  try {
    const cocks = await Cock.find().select('_id nev kor fogadas_osszeg kedvenc_kakas battle_id');
    res.json(cocks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/cocks/:id", async (req, res) => {
  try {
    const cock = await Cock.findById(req.params.id);
    if (!cock) return res.status(404).json({ message: "Not found" });
    res.json(cock);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/cocks", async (req, res) => {
  try {
    console.log("POST BODY >>>", req.body); 
    const newCock = new Cock(req.body);
    await newCock.save();
    res.status(201).json(newCock);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.put("/cocks/:id", async (req, res) => {
  try {
    const updated = await Cock.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete("/cocks/:id", async (req, res) => {
  try {
    const deleted = await Cock.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

if (require.main === module) {
  const PORT = 4100;

  const MONGODB_URI = "mongodb+srv://ronczoliver:nigger@cluster0.hmkrhja.mongodb.net/cock";

  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
      app.listen(PORT, () =>
        console.log(`Server running on http://localhost:${PORT}`)
      );
    })
    .catch((err) => console.error(err));
}
