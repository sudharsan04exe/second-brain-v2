import { useState } from 'react';
import { X, Plus, Trash2, Tag as TagIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TagManagerProps {
  onClose: () => void;
}

const PRESET_COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899',
  '#06b6d4', '#14b8a6', '#f97316', '#dc2626', '#7c3aed', '#db2777',
];

export function TagManager({ onClose }: TagManagerProps) {
  const { tags, createTag, deleteTag, notes } = useApp();
  const [newTagName, setNewTagName] = useState('');
  const [selectedColor, setSelectedColor] = useState(PRESET_COLORS[0]);

  const handleCreateTag = async () => {
    if (!newTagName.trim()) return;

    try {
      await createTag(newTagName, selectedColor);
      setNewTagName('');
      setSelectedColor(PRESET_COLORS[0]);
    } catch (error) {
      console.error('Error creating tag:', error);
      alert('Failed to create tag. Please try again.');
    }
  };

  const handleDeleteTag = async (tagId: string) => {
    const tagNoteCount = notes.filter(n => n.tags.includes(tagId)).length;
    const confirmMessage = tagNoteCount > 0
      ? `This tag is used in ${tagNoteCount} note(s). Are you sure you want to delete it?`
      : 'Are you sure you want to delete this tag?';

    if (confirm(confirmMessage)) {
      try {
        await deleteTag(tagId);
      } catch (error) {
        console.error('Error deleting tag:', error);
        alert('Failed to delete tag. Please try again.');
      }
    }
  };

  const getTagUsageCount = (tagId: string) => {
    return notes.filter(n => n.tags.includes(tagId)).length;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <TagIcon size={24} className="text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Manage Tags</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Create New Tag</h3>
            <div className="bg-slate-50 rounded-xl p-4 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter tag name..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-10 h-10 rounded-lg transition-all ${
                        selectedColor === color
                          ? 'ring-2 ring-offset-2 ring-slate-400 scale-110'
                          : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleCreateTag}
                disabled={!newTagName.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus size={20} />
                Create Tag
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-700 mb-3">Your Tags</h3>
            {tags.length === 0 ? (
              <div className="text-center py-12">
                <TagIcon size={48} className="text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500">No tags yet. Create your first tag above!</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tags.map((tag) => {
                  const usageCount = getTagUsageCount(tag.id);
                  return (
                    <div
                      key={tag.id}
                      className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      <div
                        className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ backgroundColor: tag.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900">{tag.name}</p>
                        <p className="text-sm text-slate-500">
                          Used in {usageCount} {usageCount === 1 ? 'note' : 'notes'}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteTag(tag.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="p-6 border-t border-slate-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
