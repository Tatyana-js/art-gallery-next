import clsx from 'clsx';
import { FC, FormEvent } from 'react';
import styles from './Search.module.scss';
import ClearIcon from '@/components/icons/ClearIcon';
import SearchIcon from '@/components/icons/SearchIcon';

import Input from '../Input/Input';

interface ISearchProps {
  error?: boolean;
  value: string;
  closeSearch?: () => void;
  onChange: (value: string) => void;
}

const Search: FC<ISearchProps> = ({
  error = false,
  value,
  closeSearch,
  onChange,
}: ISearchProps) => {
  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  const handleClear = () => {
    onChange('');
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={clsx(styles.searchLine, error && styles.searchLineError)}
    >
      <button
        type="button"
        aria-label="searchIcon"
        className={clsx(styles.searchIcon, value && styles.notSearchIcon)}
        onClick={closeSearch}
      >
        <SearchIcon />
      </button>
      <Input type="text" placeholder="Search" onChange={handleInputChange} value={value} />
      {value && (
        <button
          type="button"
          aria-label="clear button"
          className={styles.clearIcon}
          onClick={handleClear}
        >
          <ClearIcon />
        </button>
      )}
    </form>
  );
};

export default Search;
