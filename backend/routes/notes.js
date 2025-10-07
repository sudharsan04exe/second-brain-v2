import express from 'express';
import Note from '../models/Note.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const notes = await Note.find({ userId: req.userId }).populate('tags');
  res.json(
    notes.map(note => ({
      id: note._id,
      userId: note.userId,
      title: note.title,
      content: note.content,
      noteType: note.noteType,
      isFavorite: note.isFavorite,
      isArchived: note.isArchived,
      tags: note.tags.map(tag => tag._id?.toString() ?? tag),
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    }))
  );
});

router.post('/', async (req, res) => {
  const { title, content, noteType, tags } = req.body;
  const note = await Note.create({
    userId: req.userId,
    title,
    content,
    noteType,
    tags,
  });
  res.status(201).json({
    id: note._id,
    userId: note.userId,
    title: note.title,
    content: note.content,
    noteType: note.noteType,
    isFavorite: note.isFavorite,
    isArchived: note.isArchived,
    tags: note.tags.map(tag => tag.toString()),
    createdAt: note.createdAt,
    updatedAt: note.updatedAt,
  });
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const note = await Note.findOneAndUpdate(
      { _id: id, userId: req.userId },
      updates,
      { new: true }
    ).populate('tags');

    if (!note) return res.status(404).json({ error: 'Note not found' });

    res.json({
      id: note._id,
      userId: note.userId,
      title: note.title,
      content: note.content,
      noteType: note.noteType,
      isFavorite: note.isFavorite,
      isArchived: note.isArchived,
      tags: note.tags.map(tag => tag._id?.toString() ?? tag),
      createdAt: note.createdAt,
      updatedAt: note.updatedAt,
    });
  } catch (error) {
    res.status(400).json({ error: 'Failed to update note' });
  }
});

router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findOneAndDelete({ _id: id, userId: req.userId });

    if (!note) return res.status(404).json({ error: 'Note not found' });

    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: 'Failed to delete note' });
  }
});

router.post('/:id/favorite', async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findOne({ _id: id, userId: req.userId });

    if (!note) return res.status(404).json({ error: 'Note not found' });

    note.isFavorite = !note.isFavorite;
    await note.save();

    res.json({ id: note._id, isFavorite: note.isFavorite });
  } catch (error) {
    res.status(400).json({ error: 'Failed to toggle favorite' });
  }
});

router.post('/:id/archive', async (req, res) => {
  const { id } = req.params;

  try {
    const note = await Note.findOne({ _id: id, userId: req.userId });

    if (!note) return res.status(404).json({ error: 'Note not found' });

    note.isArchived = !note.isArchived;
    await note.save();

    res.json({ id: note._id, isArchived: note.isArchived });
  } catch (error) {
    res.status(400).json({ error: 'Failed to toggle archive' });
  }
});

export default router;
