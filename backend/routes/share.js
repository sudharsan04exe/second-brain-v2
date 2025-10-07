import express from 'express';
import SharedNote from '../models/SharedNote.js';
import Note from '../models/Note.js';
import crypto from 'crypto';

const router = express.Router();

router.post('/', async (req, res) => {
  const { noteId } = req.body;
  let shared = await SharedNote.findOne({ noteId, isActive: true });
  if (!shared) {
    const shareToken = crypto.randomBytes(16).toString('hex');
    shared = await SharedNote.create({ noteId, shareToken });
  }
  res.json({ shareToken: shared.shareToken });
});

router.get('/:token', async (req, res) => {
  const { token } = req.params;
  const shared = await SharedNote.findOne({ shareToken: token, isActive: true });
  if (!shared) return res.status(404).json({ error: 'Not found' });
  const note = await Note.findById(shared.noteId).populate('tags');
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
});

export default router;
