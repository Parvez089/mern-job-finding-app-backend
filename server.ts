import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import dbConnect from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import jobApplicationRouter from './routes/applicationRoutes.js';

dotenv.config();
dbConnect();

const app = express();
const PORT = process.env.PORT || 5000;

// ✅ Body parser middleware should be before routes
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS middleware
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
}));

// ✅ Routes
app.use("/api/auth", userRoutes);
app.use("/api/job", jobRoutes);
app.use('/api/applications', jobApplicationRouter);
// ✅ Default route
app.get('/test', (req, res) => {
  res.send('Welcome to my server!');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
