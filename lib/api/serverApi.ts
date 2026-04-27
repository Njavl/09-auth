import axios from 'axios';
import { cookies } from 'next/headers';
import type { Note } from '../../types/note';
import type { User } from '../../types/user';

const baseURL = process.env.NEXT_PUBLIC_API_URL + '/api';

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
  const { data } = await axios.get<FetchNotesResponse>(`${baseURL}/notes`, {
    params,
    headers: { Cookie: cookieHeader },
  });
  return data;
}

export async function fetchNoteById(id: string): Promise<Note> {
  const cookieHeader = await getCookieHeader();
  const { data } = await axios.get<Note>(`${baseURL}/notes/${id}`, {
    headers: { Cookie: cookieHeader },
  });
  return data;
}

export async function getMe(): Promise<User> {
  const cookieHeader = await getCookieHeader();
  const { data } = await axios.get<User>(`${baseURL}/users/me`, {
    headers: { Cookie: cookieHeader },
  });
  return data;
}

export async function checkSession(): Promise<{ success: boolean }> {
  const cookieHeader = await getCookieHeader();
  const { data } = await axios.get<{ success: boolean }>(
    `${baseURL}/auth/session`,
    { headers: { Cookie: cookieHeader } }
  );
  return data;
}
