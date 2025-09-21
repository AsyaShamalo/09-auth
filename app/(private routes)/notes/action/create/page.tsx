import { Metadata } from 'next'
import css from './CreateNote.module.css'
import NoteForm from '@/components/NoteForm/NoteForm'

export const metadata: Metadata = {
    title: "Create Note - NoteHub",
    description: "Create a new note in NoteHub",
    openGraph: {
        title: "Create Note - NoteHub",
        description: "Create a new note in NoteHub",
        url: "/notes/action/create",
        siteName: "NoteHub",
        images: [
                {
                    url: "https://ac.goit.global/fullstack/react/notehub-og-meta.jpg",
                    width: 1200,
                    height: 630,
                    alt: "Create Note - NoteHub",
                }
            ]
    }
}

const CreateNote = () => {
    
    return (
        <main className={css.main}>
            <div className={css.container}>
               <h1 className={css.title}>Create note</h1>
	   <NoteForm />
  </div>
</main>

)
}

export default CreateNote;