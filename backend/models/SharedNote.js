import mongoose from 'mongoose';

const sharedNoteSchema = new mongoose.Schema({
  noteId: { type: mongoose.Schema.Types.ObjectId, ref: 'Note', required: true },
  shareToken: { type: String, unique: true, required: true },
  isActive: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  expiresAt: Date,
}, { timestamps: true });

export default mongoose.model('SharedNote', sharedNoteSchema);
