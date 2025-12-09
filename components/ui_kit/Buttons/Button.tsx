import { FC } from 'react';
import styles from './Button.module.scss';

type ButtonVariant = 'defaultButton' | 'text' | 'icon' | 'circleIcon';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: ButtonVariant;
}

const Button: FC<ButtonProps> = ({ variant, children, type = 'button', ...props }) => (
  <button className={styles[variant]} type={type} {...props}>
    {children}
  </button>
);

export default Button;
