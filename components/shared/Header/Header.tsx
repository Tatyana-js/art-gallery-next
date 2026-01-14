'use client';
import useTheme from '@/hooks/useTheme';
import { FC, useEffect } from 'react';
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
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/navigation';

interface IHeaderProps {
  isAuth: boolean;
}
const Header: FC<IHeaderProps> = ({ isAuth }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();
  const { openModal } = useModalStore();
  const isSearch = false;

  useEffect(() => {
    if (pathname === '/auth/login') {
      openModal('authorization');
    } else if (pathname === '/auth/register') {
      openModal('registration');
    }
  }, [openModal, pathname]);

  const handleAuthClick = (type: 'login' | 'register') => {
    openModal(type === 'login' ? 'authorization' : 'registration');
    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname;
      const match = pathname.match(/\/artists\/static\/([^\/]+)/);
      
      if (match) {
        localStorage.setItem('return_artist_id', match[1]);
      } else {
        localStorage.removeItem('return_artist_id');
      }
    }
    router.push(`/auth/${type}`);
  };

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
                onClick={() => handleAuthClick('login')}
                className={styles.buttonItem}
              >
                LOG IN
              </button>
              <button
                type="button"
                onClick={() => handleAuthClick('register')}
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
