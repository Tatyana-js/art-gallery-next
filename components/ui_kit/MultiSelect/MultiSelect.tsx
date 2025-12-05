import clsx from "clsx";
import { useState } from "react";
import styles from "./MultiSelect.module.scss";
import type { IGenre } from "@/types/Artist";
import SelectButton from "@/public/icons/SelectButton";
import Checkbox from "../Checkbox";
import Input from "../Input/Input";
import Label from "../Label/Label";

interface IMultiSelectProps extends React.InputHTMLAttributes<HTMLInputElement> {
  genres: IGenre[];
  selectedGenres: string[];
  onGenresChange: (genreIds: string[]) => void;
}

const MultiSelect: React.FC<IMultiSelectProps> = ({
  genres,
  selectedGenres,
  onGenresChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleGenre = (genre: IGenre) => {
    const isCurrentlySelected = selectedGenres.includes(genre._id);
    let newGenres: string[];
    if (isCurrentlySelected) {
      newGenres = selectedGenres.filter((id) => id !== genre._id);
    } else {
      newGenres = [...selectedGenres, genre._id];
    }
    onGenresChange(newGenres);
  };

  const isSelected = (_id: string) => {
    return selectedGenres.includes(_id);
  };

  const selectedGenreObjects = selectedGenres
    .map((id) => genres.find((genre) => genre._id === id))
    .filter((genre): genre is IGenre => genre !== undefined);

  const renderSelect = (genres: IGenre[]) => (
    <div className={styles.genreContainer}>
      {genres?.map((genre) => (
        <div key={genre._id} className={styles.containerGenre}>
          <Checkbox
            text={genre.name}
            checked={isSelected(genre._id)}
            onChange={() => toggleGenre(genre)}
          />
        </div>
      ))}
    </div>
  );

  const renderSelectedLabel = (selectedGenres: IGenre[]) => (
    <div className={styles.selectedGenres}>
      {selectedGenres.map((genre) => (
        <div key={genre._id} className={styles.selectedItem}>
          <Label
            key={genre._id}
            onClick={() => toggleGenre(genre)}
            showCloseButton={true}
          >
            {genre.name}
          </Label>
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.multiContainer}>
      <Input label="Genres*" readOnly />
      <button
        type="button"
        aria-label="Toggle dropdown menu"
        className={clsx(styles.selectButton, isOpen && styles.rotated)}
        onClick={() => setIsOpen(!isOpen)}
      >
        <SelectButton />
      </button>
      {renderSelectedLabel(selectedGenreObjects)}
      {isOpen && renderSelect(genres)}
    </div>
  );
};

export default MultiSelect;
