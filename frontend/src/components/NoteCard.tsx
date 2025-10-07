import { Star, Archive, Trash2, Share2, Edit, FileText, Link2, Type, Lightbulb } from 'lucide-react';
import { Note, NoteType } from '../types';
import { useApp } from '../context/AppContext';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onShare: (note: Note) => void;
}

const NOTE_TYPE_CONFIG: Record<NoteType, { icon: typeof FileText; color: string; bg: string }> = {
  note: { icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
  link: { icon: Link2, color: 'text-green-600', bg: 'bg-green-50' },
  resource: { icon: Type, color: 'text-amber-600', bg: 'bg-amber-50' },
  idea: { icon: Lightbulb, color: 'text-pink-600', bg: 'bg-pink-50' },
};

export function NoteCard({ note, onEdit, onShare }: NoteCardProps) {
  const { toggleFavorite, toggleArchive, deleteNote, tags } = useApp();
  const config = NOTE_TYPE_CONFIG[note.noteType];
  const Icon = config.icon;

  const noteTags = tags.filter(tag => note.tags.includes(tag.id));

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(note.id);
      } catch (error) {
        console.error('Error deleting note:', error);
        alert('Failed to delete note. Please try again.');
      }
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-lg transition-all duration-200 overflow-hidden group">
      <div className="p-5">
        <div className="flex items-start gap-3 mb-3">
          <div className={`p-2 rounded-lg ${config.bg}`}>
            <Icon size={20} className={config.color} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-slate-900 text-lg leading-tight mb-1 truncate">
              {note.title}
            </h3>
            <p className="text-sm text-slate-500">
              {formatDate(note.updatedAt)}
            </p>
          </div>
          <button
            onClick={() => toggleFavorite(note.id)}
            className={`p-1.5 rounded-lg transition-colors ${
              note.isFavorite
                ? 'text-yellow-500 hover:bg-yellow-50'
                : 'text-slate-400 hover:bg-slate-100 hover:text-yellow-500'
            }`}
          >
            <Star size={18} fill={note.isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-3">
          {note.content || 'No content'}
        </p>

        {noteTags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {noteTags.map((tag) => (
              <span
                key={tag.id}
                className="px-2 py-1 rounded-full text-xs font-medium text-white"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-4 border-t border-slate-100">
          <button
            onClick={() => onEdit(note)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Edit size={16} />
            Edit
          </button>
          <button
            onClick={() => onShare(note)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Share2 size={16} />
            Share
          </button>
          <button
            onClick={() => toggleArchive(note.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-100 rounded-lg transition-colors ml-auto"
          >
            <Archive size={16} />
            {note.isArchived ? 'Unarchive' : 'Archive'}
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <Trash2 size={16} />
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
