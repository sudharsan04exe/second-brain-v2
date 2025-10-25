import { useState, useMemo } from 'react';
import { Search, SortAsc, SortDesc, Calendar } from 'lucide-react';
import { Note, FilterType } from '../types';
import { useApp } from '../context/AppContext';
import { Sidebar } from './Sidebar';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';
import { ShareModal } from './ShareModal';
import { TagManager } from './TagManager';

export function Dashboard() {
  const { notes } = useApp();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [showEditor, setShowEditor] = useState(false);
  const [showTagManager, setShowTagManager] = useState(false);
  const [editingNote, setEditingNote] = useState<Note | undefined>();
  const [sharingNote, setSharingNote] = useState<Note | undefined>();

  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes;

    if (activeFilter === 'favorites') {
      filtered = filtered.filter(n => n.isFavorite && !n.isArchived);
    } else if (activeFilter === 'archived') {
      filtered = filtered.filter(n => n.isArchived);
    } else if (activeFilter === 'all') {
      filtered = filtered.filter(n => !n.isArchived);
    } else {
      filtered = filtered.filter(n => n.noteType === activeFilter && !n.isArchived);
    }

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        n =>
          n.title.toLowerCase().includes(query) ||
          n.content.toLowerCase().includes(query)
      );
    }

    return filtered.sort((a, b) => {
      const dateA = new Date(a.updatedAt).getTime();
      const dateB = new Date(b.updatedAt).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });
  }, [notes, activeFilter, searchQuery, sortOrder]);

  const handleNewNote = () => {
    setEditingNote(undefined);
    setShowEditor(true);
  };

  const handleEditNote = (note: Note) => {
    setEditingNote(note);
    setShowEditor(true);
  };

  const handleShareNote = (note: Note) => {
    setSharingNote(note);
  };

  const handleCloseEditor = () => {
    setShowEditor(false);
    setEditingNote(undefined);
  };

  const handleSaveNote = () => {
    setShowEditor(false);
    setEditingNote(undefined);
  };

  const getFilterTitle = () => {
    switch (activeFilter) {
      case 'all':
        return 'All Notes';
      case 'favorites':
        return 'Favorites';
      case 'archived':
        return 'Archived';
      case 'note':
        return 'Notes';
      case 'link':
        return 'Links';
      case 'resource':
        return 'Resources';
      case 'idea':
        return 'Ideas';
      default:
        return 'All Notes';
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        onNewNote={handleNewNote}
        onManageTags={() => setShowTagManager(true)}
      />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="bg-white border-b border-gray-200 p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-semibold text-gray-900 tracking-tight">{getFilterTitle()}</h1>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')}
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all text-gray-700 font-medium shadow-sm"
                title={`Sort by date ${sortOrder === 'desc' ? 'ascending' : 'descending'}`}
              >
                <Calendar size={18} />
                {sortOrder === 'desc' ? <SortDesc size={18} /> : <SortAsc size={18} />}
              </button>
            </div>
          </div>

          <div className="relative">
            <Search
              size={20}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes by title or content..."
              className="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-shadow shadow-sm text-gray-900 placeholder:text-gray-400"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {filteredAndSortedNotes.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <Search size={48} className="text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">
                {searchQuery ? 'No notes found' : 'No notes yet'}
              </h3>
              <p className="text-gray-600 mb-8 max-w-md text-lg">
                {searchQuery
                  ? 'Try adjusting your search terms or filters'
                  : 'Start building your second brain by creating your first note'}
              </p>
              {!searchQuery && (
                <button
                  onClick={handleNewNote}
                  className="px-8 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-medium rounded-lg transition-all shadow-md hover:shadow-lg"
                >
                  Create Your First Note
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAndSortedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onEdit={handleEditNote}
                  onShare={handleShareNote}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {showEditor && (
        <NoteEditor note={editingNote} onClose={handleCloseEditor} onSave={handleSaveNote} />
      )}

      {sharingNote && (
        <ShareModal note={sharingNote} onClose={() => setSharingNote(undefined)} />
      )}

      {showTagManager && <TagManager onClose={() => setShowTagManager(false)} />}
    </div>
  );
}
