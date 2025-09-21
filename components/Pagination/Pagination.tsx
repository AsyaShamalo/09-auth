import css from './Pagination.module.css';
import ReactPaginate from 'react-paginate';


interface PaginationProps {
    totalPages: number; 
    page: number;
    setPage: (page: number) => void;
}

export default function Pagination( { totalPages, setPage, page}: PaginationProps) {
    return (

        <ReactPaginate
	    pageCount={totalPages}
        pageRangeDisplayed={4}
        marginPagesDisplayed={1}
        onPageChange={({selected}) => setPage(selected + 1)}
        forcePage={page -1}
        containerClassName={css.pagination}
        activeClassName={css.active}
        nextLabel="→"
        previousLabel="←"
      />
    );
}