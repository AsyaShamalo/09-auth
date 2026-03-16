import axios from "axios"
import type { Note } from "../../types/note"

export interface FetchNotes {
	notes: Note[]
	totalPages: number
}

export const getBaseURL = () => {
	return process.env.NEXT_PUBLIC_API_URL
}

export const nextServer = axios.create({
	baseURL: `${getBaseURL()}/api/`,
	withCredentials: true,
})