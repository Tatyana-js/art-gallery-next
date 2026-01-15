import clsx from 'clsx';
import { useCallback, useId } from 'react';
import styles from './Pagination.module.scss';

interface IPageProps {
  currentIndex: number;
  setCurrentIndex: (currentPageNumber: number) => void;
  totalPages: number;
}

const Pagination = ({ currentIndex, setCurrentIndex, totalPages }: IPageProps) => {
  const id = useId();

  const handlePageClick = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentIndex(page);
    }
  };

  const isActive = (index: number) => (currentIndex === index ? styles.active : '');

  const getPageNumbers = useCallback((): (number | '...')[] => {
    const visiblePages = new Set<number>();

    visiblePages.add(0);
    visiblePages.add(totalPages - 1);

    let offset = 1; // кол-во следующих видимых элементов

    if (currentIndex === 0 || currentIndex === totalPages - 1) {
      offset = 2;
    }
    // записываем массив номера страниц
    for (let i = currentIndex - offset; i <= currentIndex + offset; i++) {
      if (i > 0 && i < totalPages - 1) {
        visiblePages.add(i);
      }
    }

    const sortedPages = Array.from(visiblePages).sort((a, b) => a - b);
    // вставляем многоточие между номерами
    const finalPages: (number | '...')[] = [];
    for (let i = 0; i < sortedPages.length; i++) {
      finalPages.push(sortedPages[i]);
      if (i < sortedPages.length - 1 && sortedPages[i] + 1 !== sortedPages[i + 1]) {
        finalPages.push('...');
      }
    }

    return finalPages;
  }, [currentIndex, totalPages]);

  return (
    <div className={styles.container}>
      <button
        type="button"
        className={styles.pagePrevious}
        onClick={() => handlePageClick(currentIndex - 1)}
        disabled={currentIndex === 0}
      >
        &lt;
      </button>
      {getPageNumbers().map((pageIndex, idx) =>
        pageIndex === '...' ? (
          <span key={`${id}-ellipsis-${idx}`} className={styles.pageEllipsis}>
            {'...'}
          </span>
        ) : (
          <button
            type="button"
            key={pageIndex}
            className={clsx(styles.pageItem, isActive(pageIndex))}
            onClick={() => handlePageClick(pageIndex)}
          >
            {pageIndex + 1}
          </button>
        )
      )}
      <button
        type="button"
        className={styles.pageNext}
        onClick={() => handlePageClick(currentIndex + 1)}
        disabled={currentIndex === totalPages - 1}
      >
        &gt;
      </button>
    </div>
  );
};

export default Pagination;
