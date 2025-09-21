'use client'
import NoteList from "@/components/NoteList/NoteList";
import Pagination from "@/components/Pagination/Pagination";
import SearchBox from "@/components/SearchBox/SearchBox";
import {useQuery, keepPreviousData} from "@tanstack/react-query";
import {useDebouncedCallback} from 'use-debounce';
import {fetchNotes, type NoteResponse } from '@/lib/api';
import {useState} from 'react';
import css from './NotesPage.module.css';
import { useRouter } from 'next/navigation';

type NoteListClientProps = {
  tag?: string;
};

const NoteListClient = ({ tag }: NoteListClientProps) => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [page, setPage] = useState(1);
  const router = useRouter();
  const debouncedSetQuery = useDebouncedCallback((value: string) => {
    setDebouncedQuery(value);
  }, 300);
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setPage(1);
    debouncedSetQuery(e.target.value)
  };
  const { data } = useQuery<NoteResponse>({
    queryKey: ['notes', {query: debouncedQuery, page: page, tag: tag}],
    queryFn: () => fetchNotes(page, debouncedQuery, tag),
    placeholderData: keepPreviousData,
    refetchOnMount: false,
  });


  const totalPages = data?.totalPages || 0;
  return (
    <div className={css.app}>
      <header className={css.toolbar}>
          <SearchBox searchQuery={query} onUpdate={handleInputChange}/>
          {totalPages> 1 && <Pagination totalPages={totalPages} page={page} setPage={setPage}/>}
          <button className={css.button} onClick={() => router.push('/notes/action/create')}>Create note +</button>
      </header>
      {data?.notes && <NoteList notes={data?.notes}/>}
    </div>
  );
}

export default NoteListClient;