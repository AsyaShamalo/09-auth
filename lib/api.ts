import axios from 'axios';
import type {Note} from '@/types/note';

export interface NoteResponse {
    notes: Note[];
    totalPages: number;
}

export interface CreateNoteParams {
    title: string;
    content: string;
    tag: 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';
}

export const fetchNotes = async (page: number, query: string, tag?: string): Promise<NoteResponse> => {
    const params = {
        params:{
        search: query,
        page: page,
        perPage: 12,
        tag: tag,
    },
    headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    }
    }
    const response = await axios.get<NoteResponse>('https://notehub-public.goit.study/api/notes', params);
    return response.data;
}

export const fetchNoteById = async (id: string): Promise<Note> => {
    const res = await axios.get<Note>(`https://notehub-public.goit.study/api/notes/${id}`, {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`
    }});
    return res.data;
}

export const createNote = async (newNote: CreateNoteParams): Promise<Note> => {
    
    const res = await axios.post<Note>('https://notehub-public.goit.study/api/notes', newNote, {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    }});
    return res.data;
}

export const deleteNote = async (id: string): Promise<Note> => {
    const res = await axios.delete<Note>(`https://notehub-public.goit.study/api/notes/${id}`, {headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_NOTEHUB_TOKEN}`,
    }})
    return res.data;
}