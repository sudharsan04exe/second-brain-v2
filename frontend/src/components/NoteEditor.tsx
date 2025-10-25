import { useState, useEffect } from 'react';
import { X, Save, Tag as TagIcon, Type, Link2, Lightbulb, FileText } from 'lucide-react';
import { Note, NoteType, Tag } from '../types';
import { useApp } from '../context/AppContext';

interface NoteEditorProps {
  note?: Note;
  onClose: () => void;
  onSave: (note: Note) => void;
}

const NOTE_TYPES: { value: NoteType; label: string; icon: typeof FileText; color: string }[] = [
  { value: 'note', label: 'Note', icon: FileText, color: 'bg-teal-100 text-teal-700' },
  { value: 'link', label: 'Link', icon: Link2, color: 'bg-emerald-100 text-emerald-700' },
  { value: 'resource', label: 'Resource', icon: Type, color: 'bg-amber-100 text-amber-700' },
  { value: 'idea', label: 'Idea', icon: Lightbulb, color: 'bg-rose-100 text-rose-700' },
];

export function NoteEditor({ note, onClose, onSave }: NoteEditorProps) {
  const { tags, createTag, createNote, updateNote } = useApp();
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [noteType, setNoteType] = useState<NoteType>(note?.noteType || 'note');
  const [selectedTags, setSelectedTags] = useState<string[]>(note?.tags || []);
  const [showTagInput, setShowTagInput] = useState(false);
  const [newTagName, setNewTagName] = useState('');

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setNoteType(note.noteType);
      setSelectedTags(note.tags);
    }
  }, [note]);

  const handleSave = async () => {
    if (!title.trim()) return;

    try {
      if (note) {
        await updateNote(note.id, { title, content, noteType, tags: selectedTags });
        onSave({ ...note, title, content, noteType, tags: selectedTags });
      } else {
        const newNote = await createNote(title, content, noteType, selectedTags);
        onSave(newNote);
      }
      onClose();
    } catch (error) {
      console.error('Error saving note:', error);
      alert('Failed to save note. Please try again.');
    }
  };

  const handleAddTag = async () => {
    if (!newTagName.trim()) return;

    try {
      const colors = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];
      const color = colors[Math.floor(Math.random() * colors.length)];
      const tag = await createTag(newTagName, color);
      setSelectedTags([...selectedTags, tag.id]);
      setNewTagName('');
      setShowTagInput(false);
    } catch (error) {
      console.error('Error creating tag:', error);
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags(prev =>
      prev.includes(tagId) ? prev.filter(id => id !== tagId) : [...prev, tagId]
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {note ? 'Edit Note' : 'Create Note'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Note Type
            </label>
            <div className="flex gap-2 flex-wrap">
              {NOTE_TYPES.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  onClick={() => setNoteType(value)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium transition-all shadow-sm ${
                    noteType === value
                      ? color
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="title" className="block text-sm font-semibold text-gray-700 mb-2">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow shadow-sm text-lg text-gray-900"
              placeholder="Enter note title..."
              autoFocus
            />
          </div>

          <div>
            <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow resize-none font-mono text-sm shadow-sm text-gray-900"
              placeholder="Write your note content here... (Supports markdown)"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-semibold text-gray-700">Tags</label>
              <button
                onClick={() => setShowTagInput(!showTagInput)}
                className="text-sm text-teal-600 hover:text-teal-700 font-medium flex items-center gap-1.5 transition-colors"
              >
                <TagIcon size={16} />
                Add Tag
              </button>
            </div>

            {showTagInput && (
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                  className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow text-sm shadow-sm"
                  placeholder="Tag name..."
                  autoFocus
                />
                <button
                  onClick={handleAddTag}
                  className="px-5 py-2.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium transition-all shadow-md hover:shadow-lg"
                >
                  Add
                </button>
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <button
                  key={tag.id}
                  onClick={() => toggleTag(tag.id)}
                  className={`px-3 py-2 rounded-full text-sm font-semibold transition-all shadow-sm ${
                    selectedTags.includes(tag.id)
                      ? 'text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  style={
                    selectedTags.includes(tag.id)
                      ? { backgroundColor: tag.color }
                      : undefined
                  }
                >
                  {tag.name}
                </button>
              ))}
              {tags.length === 0 && (
                <p className="text-sm text-gray-500">No tags yet. Create your first tag!</p>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-6 py-3.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all shadow-sm"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim()}
            className="flex-1 px-6 py-3.5 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
          >
            <Save size={20} />
            {note ? 'Update Note' : 'Create Note'}
          </button>
        </div>
      </div>
    </div>
  );
}
