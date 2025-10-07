export type NoteType = 'note' | 'link' | 'resource' | 'idea';

export interface Note {
  id: string;
  userId: string;
  title: string;
  content: string;
  noteType: NoteType;
  isFavorite: boolean;
  isArchived: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Tag {
  id: string;
  userId: string;
  name: string;
  color: string;
  createdAt: Date;
}

export interface SharedNote {
  id: string;
  noteId: string;
  shareToken: string;
  isActive: boolean;
  viewCount: number;
  createdAt: Date;
  expiresAt?: Date;
}

export interface User {
  id: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
}

export interface AppState {
  user: User | null;
  notes: Note[];
  tags: Tag[];
  sharedNotes: SharedNote[];
  isLoading: boolean;
}

export type FilterType = 'all' | 'favorites' | 'archived' | NoteType;
