import {create} from 'zustand';
import {persist} from 'zustand/middleware';
import { CreateNoteParams } from '../api/clientApi';

type NoteDraftStore = {
    draft: CreateNoteParams;
    setDraft: (draft: CreateNoteParams) => void;
    clearDraft: () => void;
}

const initialDraft: CreateNoteParams = {
    title: '',
    content: '',
    tag: "Todo",
};

export const useNoteDraftStore = create<NoteDraftStore>()(persist(
    (set) => ({
        draft: initialDraft,
        setDraft: (draft) => set({ draft }),
        clearDraft: () => set({ draft: initialDraft }),
    }),
    {
        name: 'note-draft',
        partialize: (state) => ({ draft: state.draft }),
    }
));