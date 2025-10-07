import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator'; // Add validation middleware
import User from '../models/User.js';

const router = express.Router();
const JWT_SECRET = 'your_jwt_secret'; // Use env var in production

router.post(
  '/signup',
  [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('fullName').notEmpty().withMessage('Full name is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password, fullName } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    try {
      const user = await User.create({ email, passwordHash, fullName });
      const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
      res.status(201).json({ token, id: user._id, email: user.email, fullName: user.fullName });
    } catch (e) {
      res.status(400).json({ error: 'Email already exists' });
    }
  }
);

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, id: user._id, email: user.email, fullName: user.fullName });
});

router.post('/logout', (req, res) => {
  res.json({ ok: true }); // No cookies to clear, just return success
});

router.get('/session', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No session token provided' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId);
    if (!user) return res.status(401).json({ error: 'User not found' });

    res.json({ id: user._id, email: user.email, fullName: user.fullName });
  } catch (error) {
    res.status(401).json({ error: 'Invalid or expired session token' });
  }
});

export default router;
