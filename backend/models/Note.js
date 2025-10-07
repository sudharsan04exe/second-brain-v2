import mongoose from 'mongoose';

const noteSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title: String,
  content: String,
  noteType: { type: String, enum: ['note', 'link', 'resource', 'idea'], default: 'note' },
  isFavorite: { type: Boolean, default: false },
  isArchived: { type: Boolean, default: false },
  tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
}, { timestamps: true });

export default mongoose.model('Note', noteSchema);
