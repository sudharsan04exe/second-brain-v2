import express from 'express';
import Tag from '../models/Tag.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const tags = await Tag.find({ userId: req.userId });
  res.json(
    tags.map(tag => ({
      id: tag._id,
      userId: tag.userId,
      name: tag.name,
      color: tag.color,
      createdAt: tag.createdAt,
    }))
  );
});

router.post('/', async (req, res) => {
  const { name, color } = req.body;
  const tag = await Tag.create({ userId: req.userId, name, color });
  res.status(201).json({
    id: tag._id,
    userId: tag.userId,
    name: tag.name,
    color: tag.color,
    createdAt: tag.createdAt,
  });
});

// Add delete endpoint similarly

export default router;
