import { Star, Archive, Trash2, Share2, Edit, FileText, Link2, Type, Lightbulb } from 'lucide-react';
import { Note, NoteType } from '../types';
import { useApp } from '../context/AppContext';

interface NoteCardProps {
  note: Note;
  onEdit: (note: Note) => void;
  onShare: (note: Note) => void;
}

const NOTE_TYPE_CONFIG: Record<NoteType, { icon: typeof FileText; color: string; bg: string }> = {
  note: { icon: FileText, color: 'text-teal-600', bg: 'bg-teal-50' },
  link: { icon: Link2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  resource: { icon: Type, color: 'text-amber-600', bg: 'bg-amber-50' },
  idea: { icon: Lightbulb, color: 'text-rose-600', bg: 'bg-rose-50' },
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
    <div className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-xl transition-all duration-300 overflow-hidden group">
      <div className="p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className={`p-2.5 rounded-xl ${config.bg} shadow-sm`}>
            <Icon size={20} className={config.color} />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 text-lg leading-tight mb-1.5 truncate">
              {note.title}
            </h3>
            <p className="text-sm text-gray-500 font-medium">
              {formatDate(note.updatedAt)}
            </p>
          </div>
          <button
            onClick={() => toggleFavorite(note.id)}
            className={`p-2 rounded-lg transition-all ${
              note.isFavorite
                ? 'text-amber-500 hover:bg-amber-50'
                : 'text-gray-400 hover:bg-gray-100 hover:text-amber-500'
            }`}
          >
            <Star size={18} fill={note.isFavorite ? 'currentColor' : 'none'} />
          </button>
        </div>

        <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
          {note.content || 'No content'}
        </p>

        {noteTags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {noteTags.map((tag) => (
              <span
                key={tag.id}
                className="px-3 py-1 rounded-full text-xs font-semibold text-white shadow-sm"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center gap-2 pt-5 border-t border-gray-100">
          <button
            onClick={() => onEdit(note)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Edit size={16} />
            <span>Edit</span>
          </button>
          <button
            onClick={() => onShare(note)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-all"
          >
            <Share2 size={16} />
            <span>Share</span>
          </button>
          <button
            onClick={() => toggleArchive(note.id)}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-all ml-auto"
          >
            <Archive size={16} />
            <span>{note.isArchived ? 'Unarchive' : 'Archive'}</span>
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-all"
          >
            <Trash2 size={16} />
            <span>Delete</span>
          </button>
        </div>
      </div>
    </div>
  );
}
