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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 rounded-xl shadow-sm">
              <TagIcon size={24} className="text-teal-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900">Manage Tags</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-8">
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Create New Tag</h3>
            <div className="bg-gray-50 rounded-xl p-5 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tag Name
                </label>
                <input
                  type="text"
                  value={newTagName}
                  onChange={(e) => setNewTagName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreateTag()}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow shadow-sm text-gray-900"
                  placeholder="Enter tag name..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {PRESET_COLORS.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`w-11 h-11 rounded-lg transition-all shadow-md ${
                        selectedColor === color
                          ? 'ring-2 ring-offset-2 ring-teal-500 scale-110'
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
                className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
              >
                <Plus size={20} />
                Create Tag
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-4">Your Tags</h3>
            {tags.length === 0 ? (
              <div className="text-center py-16">
                <TagIcon size={48} className="text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 font-medium">No tags yet. Create your first tag above!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {tags.map((tag) => {
                  const usageCount = getTagUsageCount(tag.id);
                  return (
                    <div
                      key={tag.id}
                      className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all shadow-sm"
                    >
                      <div
                        className="w-5 h-5 rounded-full flex-shrink-0 shadow-sm"
                        style={{ backgroundColor: tag.color }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{tag.name}</p>
                        <p className="text-sm text-gray-500 font-medium">
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

        <div className="p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-all shadow-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
