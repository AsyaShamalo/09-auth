'use client'

import css from './NoteForm.module.css';
import { useRouter } from 'next/navigation';
import type { CreateNoteParams } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createNote } from '@/lib/api';
import { useNoteDraftStore } from '@/lib/store/noteStore';



export default function NoteForm() {
  const router = useRouter();
  const {draft,setDraft,clearDraft} = useNoteDraftStore();
    const client = useQueryClient();
    const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setDraft({
      ...draft,
      [event.target.name]: event.target.value,
    });
  };
    const createNoteMutation = useMutation({
    mutationFn: createNote,
    onSuccess: () => {
      clearDraft()
      client.invalidateQueries({ queryKey: ['notes'] });
      router.back();
    },
  })
    const createNewNote = (formData: FormData) => {
      const newNote: CreateNoteParams = {
        title: String(formData.get('title') ?? ''),
        content: String(formData.get('content') ?? ''),
        tag: String(formData.get('tag')) as CreateNoteParams['tag'],
      };
    createNoteMutation.mutate(newNote);
}
    
    return (
        <form className={css.form} action={createNewNote}>
            <div className={css.formGroup}>
              <label htmlFor="title">Title</label>
              <input id="title" type="text" name="title" className={css.input}
              value={draft?.title} onChange={handleChange}/>
              {}
            </div>

            <div className={css.formGroup}>
              <label htmlFor="content">Content</label>
              <textarea
                id="content"
                name="content"
                rows={8}
                className={css.textarea}
                value={draft?.content}
                onChange={handleChange}
                required
              />
              {}
            </div>

            <div className={css.formGroup}>
              <label htmlFor="tag">Tag</label>
              <select id="tag" name="tag" className={css.select} onChange={handleChange} value={draft?.tag} required>
                <option value="Todo">Todo</option>
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Meeting">Meeting</option>
                <option value="Shopping">Shopping</option>
              </select>
             {}
            </div>

            <div className={css.actions}>
              <button type="button" className={css.cancelButton} onClick={() => router.back()}>
                Cancel
              </button>
              <button
                type="submit"
                className={css.submitButton}
                disabled={false}
              >
                Create note
              </button>
            </div>
        </form>
    )
}