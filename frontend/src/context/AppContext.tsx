import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { Note, Tag, User, AppState, NoteType } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


axios.defaults.baseURL = API_BASE_URL;

axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    if (!config.headers) {
      config.headers = {};
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

interface AppContextType extends AppState {
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, fullName?: string) => Promise<void>;
  logout: () => Promise<void>;
  createNote: (title: string, content: string, noteType: NoteType, tags: string[]) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  createTag: (name: string, color: string) => Promise<Tag>;
  deleteTag: (id: string) => Promise<void>;
  addTagToNote: (noteId: string, tagId: string) => Promise<void>;
  removeTagFromNote: (noteId: string, tagId: string) => Promise<void>;
  shareNote: (noteId: string) => Promise<string>;
  getSharedNote: (token: string) => Promise<Note | null>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    user: null,
    notes: [],
    tags: [],
    sharedNotes: [],
    isLoading: true,
  });

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await axios.get('/api/auth/session');
      const user = res.data as User | null;
      setState(prev => ({ ...prev, user, isLoading: false }));
      await loadNotes();
      await loadTags();
    } catch (error) {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const loadNotes = async () => {
    try {
      const res = await axios.get('/api/notes');
      const notes = (res.data as any[]).map((note: any) => ({
        id: note.id,
        userId: note.userId,
        title: note.title,
        content: note.content,
        noteType: note.noteType as NoteType,
        isFavorite: note.isFavorite,
        isArchived: note.isArchived,
        tags: note.tags || [],
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt),
      }));
      setState(prev => ({ ...prev, notes }));
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  };

  const loadTags = async () => {
    try {
      const res = await axios.get('/api/tags');
      const tags = (res.data as any[]).map((tag: any) => ({
        id: tag.id,
        userId: tag.userId,
        name: tag.name,
        color: tag.color,
        createdAt: new Date(tag.createdAt),
      }));
      setState(prev => ({ ...prev, tags }));
    } catch (error) {
      console.error('Error loading tags:', error);
    }
  };

  const login = async (email: string, password: string) => {
    const res = await axios.post<{ token: string; id: string; email: string; fullName: string }>('/api/auth/login', { email, password });
    const { token, id, email: userEmail, fullName } = res.data;
    localStorage.setItem('token', token);
    setState((prev) => ({ ...prev, user: { id, email: userEmail, fullName } }));
    await loadNotes();
    await loadTags();
  };

  const signup = async (email: string, password: string, fullName?: string) => {
    try {
      const res = await axios.post<{ token: string; id: string; email: string; fullName: string }>('/api/auth/signup', { email, password, fullName });
      const { token, id, email: userEmail, fullName: userFullName } = res.data;
      localStorage.setItem('token', token);
      setState((prev) => ({ ...prev, user: { id, email: userEmail, fullName: userFullName } }));
      await loadNotes();
      await loadTags();
    } catch (error: any) {
      if (error.response?.status === 400) {
        throw new Error(
          error.response.data.errors
            ? error.response.data.errors.map((e: any) => e.msg).join(', ')
            : error.response.data.error || 'Signup failed'
        );
      }
      throw new Error('An unexpected error occurred');
    }
  };

  const logout = async () => {
    localStorage.removeItem('token');
    setState({
      user: null,
      notes: [],
      tags: [],
      sharedNotes: [],
      isLoading: false,
    });
  };

  const createNote = async (title: string, content: string, noteType: NoteType, tags: string[]) => {
    const res = await axios.post('/api/notes', { title, content, noteType, tags });
    const data = res.data as any;
    const note: Note = {
      id: data.id,
      userId: data.userId,
      title: data.title,
      content: data.content,
      noteType: data.noteType as NoteType,
      isFavorite: data.isFavorite,
      isArchived: data.isArchived,
      tags: data.tags || [],
      createdAt: new Date(data.createdAt),
      updatedAt: new Date(data.updatedAt),
    };
    setState(prev => ({ ...prev, notes: [note, ...prev.notes] }));
    return note;
  };

  const updateNote = async (id: string, updates: Partial<Note>) => {
    await axios.put(`/api/notes/${id}`, updates);
    setState(prev => ({
      ...prev,
      notes: prev.notes.map(note =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
      ),
    }));
  };

  const deleteNote = async (id: string) => {
    await axios.delete(`/api/notes/${id}`);
    setState(prev => ({
      ...prev,
      notes: prev.notes.filter(note => note.id !== id),
    }));
  };

  const toggleFavorite = async (id: string) => {
    const note = state.notes.find(n => n.id === id);
    if (!note) return;

    await updateNote(id, { isFavorite: !note.isFavorite });
  };

  const toggleArchive = async (id: string) => {
    const note = state.notes.find(n => n.id === id);
    if (!note) return;

    await updateNote(id, { isArchived: !note.isArchived });
  };

  const createTag = async (name: string, color: string) => {
    const res = await axios.post('/api/tags', { name, color });
    const data = res.data as any;
    const tag: Tag = {
      id: data.id,
      userId: data.userId,
      name: data.name,
      color: data.color,
      createdAt: new Date(data.createdAt),
    };
    setState(prev => ({ ...prev, tags: [...prev.tags, tag] }));
    return tag;
  };

  const deleteTag = async (id: string) => {
    await axios.delete(`/api/tags/${id}`);
    setState(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag.id !== id),
      notes: prev.notes.map(note => ({
        ...note,
        tags: note.tags.filter(tagId => tagId !== id),
      })),
    }));
  };

  const addTagToNote = async (noteId: string, tagId: string) => {
    try {
      await axios.post('/api/note_tags', { noteId, tagId });
      setState(prev => ({
        ...prev,
        notes: prev.notes.map(note =>
          note.id === noteId && !note.tags.includes(tagId)
            ? { ...note, tags: [...note.tags, tagId] }
            : note
        ),
      }));
    } catch (error) {
      console.error('Error adding tag to note:', error);
    }
  };

  const removeTagFromNote = async (noteId: string, tagId: string) => {
    try {
      await axios.delete('/api/note_tags', { params: { noteId, tagId } });
      setState(prev => ({
        ...prev,
        notes: prev.notes.map(note =>
          note.id === noteId
            ? { ...note, tags: note.tags.filter(id => id !== tagId) }
            : note
        ),
      }));
    } catch (error) {
      console.error('Error removing tag from note:', error);
    }
  };

  const shareNote = async (noteId: string) => {
    const res = await axios.post('/api/share', { noteId });
    const data = res.data as { shareToken: string };
    return data.shareToken;
  };

  const getSharedNote = async (token: string) => {
    const res = await axios.get(`/api/share/${token}`);
    const noteData = res.data as any;
    return {
      id: noteData.id,
      userId: noteData.userId,
      title: noteData.title,
      content: noteData.content,
      noteType: noteData.noteType as NoteType,
      isFavorite: noteData.isFavorite,
      isArchived: noteData.isArchived,
      tags: noteData.tags || [],
      createdAt: new Date(noteData.createdAt),
      updatedAt: new Date(noteData.updatedAt),
    };
  };

  const value: AppContextType = {
    ...state,
    login,
    signup,
    logout,
    createNote,
    updateNote,
    deleteNote,
    toggleFavorite,
    toggleArchive,
    createTag,
    deleteTag,
    addTagToNote,
    removeTagFromNote,
    shareNote,
    getSharedNote,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}



