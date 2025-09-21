import css from './NoteList.module.css'
import type {Note} from '@/types/note';
import { deleteNote } from '@/lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Link from 'next/link'

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
    
  const client = useQueryClient();
  const deleteNoteMutation = useMutation({
    mutationFn: deleteNote,
    onSuccess: () => {
      client.invalidateQueries({ queryKey: ['notes'] })
    }
  });
  const handleDeleteNote = (id: string) =>{
    deleteNoteMutation.mutate(id);
  }

    return (
    <ul className={css.list}>
    {notes.map(note => (<li key={note.id} className={css.listItem}>
    <h2 className={css.title}>{note.title}</h2>
    <p className={css.content}>{note.content}</p>
    <div className={css.footer}>
      <span className={css.tag}>{note.tag}</span>
       <Link href={`/notes/${note.id}`} className={css.button}>View details</Link>
      <button className={css.button} onClick={() => handleDeleteNote(note.id)}>Delete</button>
    </div>
  </li>))}
</ul>
    )
}   