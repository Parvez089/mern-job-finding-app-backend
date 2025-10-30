import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import cors from "cors";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: process.env.FRONTEND_URL,
}));
dbConnect();
app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/job", jobRoutes);
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map