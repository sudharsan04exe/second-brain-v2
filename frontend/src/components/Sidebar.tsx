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
    { id: 'note' as FilterType, label: 'Notes', icon: FileText, color: 'text-blue-600', count: notes.filter(n => n.noteType === 'note' && !n.isArchived).length },
    { id: 'link' as FilterType, label: 'Links', icon: Link2, color: 'text-green-600', count: notes.filter(n => n.noteType === 'link' && !n.isArchived).length },
    { id: 'resource' as FilterType, label: 'Resources', icon: Type, color: 'text-amber-600', count: notes.filter(n => n.noteType === 'resource' && !n.isArchived).length },
    { id: 'idea' as FilterType, label: 'Ideas', icon: Lightbulb, color: 'text-pink-600', count: notes.filter(n => n.noteType === 'idea' && !n.isArchived).length },
  ];

  return (
    <div className="w-72 bg-white border-r border-slate-200 flex flex-col h-screen">
      <div className="p-6 border-b border-slate-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <span className="text-lg font-bold text-white">SB</span>
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-bold text-slate-900">Second Brain</h1>
            <p className="text-xs text-slate-500">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={onNewNote}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm"
        >
          <Plus size={20} />
          New Note
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="mb-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
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
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={20} />
                  <span className="flex-1 text-left">{filter.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === filter.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
                  }`}>
                    {filter.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-2">
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
                      ? 'bg-blue-50 text-blue-700 font-medium'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon size={20} className={type.color} />
                  <span className="flex-1 text-left">{type.label}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    activeFilter === type.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-slate-100 text-slate-600'
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
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <TagIcon size={20} />
            <span className="flex-1 text-left">Manage Tags</span>
          </button>
        </div>
      </div>

      <div className="p-4 border-t border-slate-200 space-y-1">
        {/* <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-700 hover:bg-slate-100 transition-colors">
          <Settings size={20} />
          <span>Settings</span>
        </button> */}
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
