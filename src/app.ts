import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import connectDB from './config/db';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes';
import documentRoutes from './routes/documentRoutes';
import cors from "cors";

dotenv.config();

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
  methods: [ "POST", "PUT", "GET", "PATCH" ],
  credentials: true
}))
app.use(cookieParser(process.env.COOKIE_SECRET));

// Define Routes
app.use('/api/auth', authRoutes);
app.use('/api/documents', documentRoutes);
app.get("/", async (req: Request, res: Response) => res.status(200).json({ msg: "Api is live!" }));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));