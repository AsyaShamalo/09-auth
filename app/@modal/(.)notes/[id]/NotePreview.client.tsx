'use client'

import {useQuery} from "@tanstack/react-query";
import { useParams, useRouter } from "next/navigation";
import { fetchNoteById } from "@/lib/api"
import css from './NotePrewiew.module.css'
import Modal from "@/components/Modal/Modal";

type Props = object;

const NotePreviewClient: React.FC<Props> = () => {
    const { id } = useParams<{ id: string }>();
    const { data: note, isLoading, error } = useQuery({
    queryKey: ["note", id],
    queryFn: () => fetchNoteById(id),
    refetchOnMount: false,
  });

  const router = useRouter();

  if (isLoading) return <p>Loading, please wait...</p>;
  if (error || !note) return <p>Something went wrong.</p>;

  return (<Modal onClose={() => {router.back()}}>
    <div className={css.wrapper}>
      <button className={css.backBtn} onClick={() => {router.back()}}>Back</button>
        <div className={css.container}>
          <div className={css.item}>
            <div className={css.header}>
              <h2>{note.title}</h2>
              <p className={css.tag}>{note.tag}</p>
            </div>
            <p className={css.content}>{note.content}</p>
            <p className={css.date}>{note.createdAt}</p>
          </div>
        </div>
    </div>
  </Modal>
)
}

export default NotePreviewClient;