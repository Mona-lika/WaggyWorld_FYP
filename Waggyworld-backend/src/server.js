import express from "express";
import { ENV } from "./config/env.js";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import petRoutes from "./routes/petRoutes.js";
import donationRoutes from "./routes/donationRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import { upload } from './config/cloudinary.js';

const app = express();
const PORT = ENV.PORT || 5001;

app.use(cors({
  origin: "*", // Allow every connection (including your local web browser)
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

// Log requests to terminal (Helpful for your presentation)
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} to ${req.url}`);
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/pets", petRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/applications", applicationRoutes)
app.use("/api/admin", adminRoutes)

// Route to handle image upload
app.post('/api/upload', upload.array('images', 5), (req, res) => {
  try {
    const urls = req.files.map(file => file.path); // 'path' is the Cloudinary URL
    console.log("✅ Images uploaded to Cloudinary:", urls);
    // This sends back the Cloudinary URL
    res.status(200).json({ urls });
  } catch (error) {
    console.error("Cloudinary Error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

app.get("/api/health", (req, res) => {
  res.status(200).json({ success: true });
});

app.listen(PORT, () => {
  console.log("Server is running on PORT:", PORT);
  console.log(`🚀 API: http://localhost:${PORT}/api/auth`);
});
