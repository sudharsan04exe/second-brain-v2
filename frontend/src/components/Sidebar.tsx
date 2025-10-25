import {
  LayoutDashboard,
  Star,
  Archive,
  FileText,
  Link2,
  Type,
  Lightbulb,
  Tag as TagIcon,
  LogOut,
  Settings,
  Plus
} from 'lucide-react';
import { FilterType } from '../types';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  activeFilter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onNewNote: () => void;
  onManageTags: () => void;
}

export function Sidebar({ activeFilter, onFilterChange, onNewNote, onManageTags }: SidebarProps) {
  const { user, logout, notes } = useApp();

  const filters = [
    { id: 'all' as FilterType, label: 'All Notes', icon: LayoutDashboard, count: notes.filter(n => !n.isArchived).length },
    { id: 'favorites' as FilterType, label: 'Favorites', icon: Star, count: notes.filter(n => n.isFavorite && !n.isArchived).length },
    { id: 'archived' as FilterType, label: 'Archived', icon: Archive, count: notes.filter(n => n.isArchived).length },
  ];

  const noteTypes = [
    { id: 'note' as FilterType, label: 'Notes', icon: FileText, color: 'text-teal-600', count: notes.filter(n => n.noteType === 'note' && !n.isArchived).length },
    { id: 'link' as FilterType, label: 'Links', icon: Link2, color: 'text-emerald-600', count: notes.filter(n => n.noteType === 'link' && !n.isArchived).length },
    { id: 'resource' as FilterType, label: 'Resources', icon: Type, color: 'text-amber-600', count: notes.filter(n => n.noteType === 'resource' && !n.isArchived).length },
    { id: 'idea' as FilterType, label: 'Ideas', icon: Lightbulb, color: 'text-rose-600', count: notes.filter(n => n.noteType === 'idea' && !n.isArchived).length },
  ];

  return (
    <div className="w-72 bg-white border-r border-gray-200 flex flex-col h-screen">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-11 h-11 bg-gradient-to-br from-teal-600 to-teal-700 rounded-xl flex items-center justify-center shadow-md">
            <span className="text-lg font-bold text-white">SB</span>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Second Brain</h1>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={onNewNote}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg"
        >
          <Plus size={20} />
          New Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Views
          </h2>
          <div className="space-y-1">
            {filters.map((filter) => {
              const Icon = filter.icon;
              return (
                <button
                  key={filter.id}
                  onClick={() => onFilterChange(filter.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    activeFilter === filter.id
                      ? 'bg-teal-50 text-teal-700 font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="flex-1 text-left text-sm">{filter.label}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    activeFilter === filter.id
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3 px-2">
            Note Types
          </h2>
          <div className="space-y-1">
            {noteTypes.map((type) => {
              const Icon = type.icon;
              return (
                <button
                  key={type.id}
                  onClick={() => onFilterChange(type.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                    activeFilter === type.id
                      ? 'bg-teal-50 text-teal-700 font-medium shadow-sm'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={20} className={type.color} />
                  <span className="flex-1 text-left text-sm">{type.label}</span>
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    activeFilter === type.id
                      ? 'bg-teal-100 text-teal-700'
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {type.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <button
            onClick={onManageTags}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <TagIcon size={20} />
            <span className="flex-1 text-left text-sm">Manage Tags</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-gray-200 space-y-1">
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
        >
          <LogOut size={20} />
          <span className="text-sm">Logout</span>
        </button>
      </div>
    </div>
  );
}
