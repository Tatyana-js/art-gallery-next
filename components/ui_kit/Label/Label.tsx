import { FC } from 'react';
import styles from './Label.module.scss';
import ClearIcon from '@/components/icons/ClearIcon';

export interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  onClick?: () => void;
  showCloseButton?: boolean;
}

const Label: FC<LabelProps> = ({ children, onClick, showCloseButton, ...props }) => (
  <div className={styles.label} {...props}>
    <span className={styles.labelText}>{children}</span>
    {showCloseButton && (
      <button
        type="button"
        aria-label="Button close"
        onClick={onClick}
        className={styles.buttonClose}
      >
        <ClearIcon />
      </button>
    )}
  </div>
);

export default Label;
