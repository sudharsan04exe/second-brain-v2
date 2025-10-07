import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();


import authRoutes from './routes/auth.js';
import noteRoutes from './routes/notes.js';
import tagRoutes from './routes/tags.js';
import shareRoutes from './routes/share.js';

const app = express();
app.use(cors({
  origin: 'http://localhost:5173', // Ensure this matches the frontend URL
  credentials: true, // Allow credentials (cookies)
}));
app.use(express.json());
app.use(cookieParser());

mongoose.connect(process.env.DATABASE_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/share', shareRoutes); 

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.listen(4000, () => {
  console.log('Backend running on http://localhost:4000');
});
