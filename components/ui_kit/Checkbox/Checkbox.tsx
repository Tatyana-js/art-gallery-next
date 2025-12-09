import { FC } from 'react';
import styles from './Checkbox.module.scss';
import Success from '@/components/icons/Success';

export interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  text?: string;
}

const Checkbox: FC<CheckboxProps> = ({ text, ...props }) => (
  <label className={styles.checkboxContainer}>
    <div className={styles.checkedContainer}>
      <input type="checkbox" className={styles.checkbox} {...props} />
      {props.checked && <Success />}
    </div>
    {text}
  </label>
);

export default Checkbox;
