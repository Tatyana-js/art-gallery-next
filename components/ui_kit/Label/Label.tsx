import { FC } from 'react';
import styles from './Label.module.scss';
import ClearIcon from '@/components/icons/ClearIcon';

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  onClick?: (e?: React.MouseEvent) => void;
  showCloseButton?: boolean;
}

const Label: FC<LabelProps> = ({ children, onClick, showCloseButton, ...props }) => {
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onClick?.(e);
  };

  return (
    <div className={styles.label} onClick={handleClick} {...props}>
      <span className={styles.labelText}>{children}</span>
      {showCloseButton && (
        <button
          type="button"
          aria-label="Button close"
          onClick={handleClick}
          className={styles.buttonClose}
        >
          <ClearIcon />
        </button>
      )}
    </div>
  );
};

export default Label;
