import type { User } from '@/types/user';
import { cookies } from 'next/headers';
import { nextServer } from './api';
import type { NoteResponse } from './clientApi';
import type{ Note } from '@/types/note';



export const checkServerSession = async () => {
  const cookieStore = cookies();
  const res = await nextServer.get('/auth/session', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

export const getServerMe = async () => {
  const cookieStore = cookies();
  const res = await nextServer.get<User>('/users/me', {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
    return res.data
}

export const fetchServerNotes = async (page: number, query: string, tag?: string): Promise<NoteResponse> => {
  const cookieStore = cookies();
    const params = {
        params: {
            search: query,
            tag: tag,
            page: page,
            perPage: 12,
        },
        headers: {
            'Content-Type': 'application/json',
            Cookie: cookieStore.toString(),
        }
    }
    const response = await nextServer.get<NoteResponse>('/notes', params);
    return response.data;
}

export const fetchServerNoteById = async (id: string): Promise<Note> => {
  const cookieStore = cookies();
    const res = await nextServer.get<Note>(`/notes/${id}`, {headers: {
        'Content-Type': 'application/json',
        Cookie: cookieStore.toString(),
    }});
    return res.data;
}