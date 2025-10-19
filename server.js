import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './config/database.js';
import userRoutes from './routes/userRoutes.js';
import cors from "cors";
dotenv.config();

const app = express();
const port = 5000;


app.use(cors({
    origin: "http://localhost:3000",
}));
dbConnect();

app.get('/', (req, res) => {
    res.send('Welcome to my server!');
});

app.use(express.json());
app.use("/api/auth", userRoutes)

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
