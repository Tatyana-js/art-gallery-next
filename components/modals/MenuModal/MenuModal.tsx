import useTheme from '@/hooks/useTheme';
import { FC } from 'react';
import styles from './MenuModal.module.scss';
import SunIcon from '@/components/icons/SunIcon';
import MoonIcon from '@/components/icons/MoonIcon';
import Button from '@/components/ui_kit/Buttons';
import { useModalStore } from '@/lib/modalStore/modalStore';

const MenuModal: FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { openModal } = useModalStore();

  return (
    <div className={styles.containerInfo}>
      <div className={styles.buttonTheme} onClick={toggleTheme}>
        <div className={styles.iconTheme}>{theme === 'dark' ? <SunIcon /> : <MoonIcon />}</div>
        <Button variant="text">{theme === 'light' ? 'LIGHT MODE' : 'DARK MODE'}</Button>
      </div>
      <button
        type="button"
        onClick={() => openModal('authorization')}
        className={styles.loginbuttons}
      >
        LOG IN
      </button>
      <button
        type="button"
        onClick={() => openModal('registration')}
        className={styles.loginbuttons}
      >
        SIGN UP
      </button>
    </div>
  );
};

export default MenuModal;
