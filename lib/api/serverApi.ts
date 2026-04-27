import type { AxiosResponse } from 'axios';
import { cookies } from 'next/headers';
import api from './api';
import type { Note } from '../../types/note';
import type { User } from '../../types/user';

async function getCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore.toString();
}

export interface FetchNotesParams {
  page?: number;
  perPage?: number;
  search?: string;
  tag?: string;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export async function fetchNotes(
  params: FetchNotesParams
): Promise<FetchNotesResponse> {
  const cookieHeader = await getCookieHeader();
  const { data } = await api.get<FetchNotesResponse>('/notes', {
    params,
    headers: { Cookie: cookieHeader },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await getCookieHeader();
  const { data } = await api.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });
  return data;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();
  const { data } = await api.get<User>('/users/me', {
    headers: { Cookie: cookieHeader },
  });
  return data;
}

export async function checkSession(): Promise<
  AxiosResponse<{ success: boolean }>
> {
  const cookieHeader = await getCookieHeader();
  const response = await api.get<{ success: boolean }>('/auth/session', {
    headers: { Cookie: cookieHeader },
  });
  return response;
}
