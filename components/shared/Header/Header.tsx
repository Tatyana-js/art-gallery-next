'use client';
import useTheme from '@/hooks/useTheme';
import { FC } from 'react';
import styles from './Header.module.scss';
import Link from 'next/link';
import IconLogo from '@/components/icons/IconLogo';
import SunIcon from '@/components/icons/SunIcon';
import MoonIcon from '@/components/icons/MoonIcon';
import Search from '@/components/ui_kit/Search';
import SearchIcon from '@/components/icons/SearchIcon';
import IconMenu from '@/components/icons/IconMenu';
import { useModalStore } from '@/lib/modalStore/modalStore';
import { logoutAction } from '@/app/actions/auth-actions';

interface IHeaderProps {
  isAuth: boolean;
}
const Header: FC<IHeaderProps> = ({ isAuth }) => {
  const { theme, toggleTheme } = useTheme();
  const { openModal } = useModalStore();
  const isSearch = false;

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link href="/" className={styles.iconLogo}>
          <IconLogo />
        </Link>
        <div className={styles.containerButtons}>
          {isAuth ? (
            <button
              type="button"
              className={styles.buttonItem}
              onClick={async () => await logoutAction()}
            >
              LOG OUT
            </button>
          ) : (
            <div className={styles.buttonContainer}>
              <button
                type="button"
                onClick={() => openModal('authorization')}
                className={styles.buttonItem}
              >
                LOG IN
              </button>
              <button
                type="button"
                onClick={() => openModal('registration')}
                className={styles.buttonItem}
              >
                SIGN UP
              </button>
            </div>
          )}
          <div className={styles.themeContainer} onClick={toggleTheme}>
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </div>
        </div>
        <div className={styles.buttons}>
          {isSearch ? (
            <div className={styles.search}>
              <Search error={false} value={''} onChange={() => {}} closeSearch={() => {}} />
            </div>
          ) : (
            <button
              aria-label="searchIcon"
              type="button"
              className={styles.searchButton}
              // onClick={onSearch}
            >
              <SearchIcon />
            </button>
          )}
          <button
            type="button"
            aria-label="menuButton"
            className={styles.containerMenu}
            onClick={() => openModal('menuModal')}
          >
            <IconMenu />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
