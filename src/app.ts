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
  // origin: "http://localhost:3000",
  origin: [ "https://reedr.vercel.app", "http://localhost:3000", "http://http://localhost:5501", "https://reedr-git-master-hycient195s-projects.vercel.app", "https://reedr-5b2ti6ok1-hycient195s-projects.vercel.app" ],
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