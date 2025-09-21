import { User } from '@/types/user';
import type {Note} from '@/types/note';
import { nextServer } from './api';


export interface NoteResponse {
    notes: Note[];
    totalPages: number;
}

export interface CreateNoteParams {
    title: string;
    content: string;
    tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

export type RegisterRequest = {
    email: string,
    password: string,
}

export type LoginRequest =  {
    email: string,
    password: string,
}

export type UpdateMeRequest = {
    username?: string,
}

export const checkSession = async () => {
    const res = await nextServer.get('/auth/session');
    return res;
};

export const getMe = async () => {
  const res = await nextServer.get<User>('users/me');
  return res.data;
};

export const updateMe = async (data: UpdateMeRequest): Promise<User> => {
    const res = await nextServer.patch<User>('users/me', data);
    return res.data;
}

export const register = async (data: RegisterRequest) => {
    const res = await nextServer.post<User>('auth/register', data);
    return res.data
}

export const login = async (data: LoginRequest) => {
    const res = await nextServer.post<User>('auth/login', data);
    return res.data
}

export const logout = async (): Promise<void> => {
    await nextServer.post('auth/logout');
}

export const fetchNotes = async (page: number, query: string, tag?: string): Promise<NoteResponse> => {
    const params = {
        params: {
            search: query,
            tag: tag,
            page: page,
            perPage: 12,
        },
        headers: {
            'Content-Type': 'application/json',
        }
    }
    const response = await nextServer.get<NoteResponse>('/notes', params);
    return response.data;
}

export const fetchNoteById = async (id: string): Promise<Note> => {
    const res = await nextServer.get<Note>(`/notes/${id}`, {headers: {
        'Content-Type': 'application/json',
    }});
    return res.data;
}

export const createNote = async (newNote: CreateNoteParams): Promise<Note> => {
    
    const res = await nextServer.post<Note>('/notes', newNote, {headers: {
        'Content-Type': 'application/json',
    }});
    return res.data;
}

export const deleteNote = async (id: string): Promise<Note> => {
    const res = await nextServer.delete<Note>(`/notes/${id}`, {headers: {
        'Content-Type': 'application/json',
    }})
    return res.data;
}