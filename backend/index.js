import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
dotenv.config();

const app = express();

// 1. CORS origin from env
const allowedOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';
app.use(cors({
  origin: allowedOrigin,
  credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

// 2. MongoDB connection using env
mongoose.connect(process.env.DATABASE_URL, {
  // these options are no longer required in mongoose 6+
});

// 3. Route registrations unchanged
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/share', shareRoutes);

// Health check unchanged
app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// 4. Listen on env port
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
