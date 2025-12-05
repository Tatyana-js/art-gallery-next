"use client";
import useTheme from "@/hooks/useTheme";
import { FC } from "react";
import styles from "./Header.module.scss";
import Link from "next/link";
import IconLogo from "@/public/icons/IconLogo";
import SunIcon from "@/public/icons/SunIcon";
import MoonIcon from "@/public/icons/MoonIcon";
import Search from "@/components/ui_kit/Search";
import SearchIcon from "@/public/icons/SearchIcon";
import IconMenu from "@/public/icons/IconMenu";

const Header: FC = ({}) => {
  const { theme, toggleTheme } = useTheme();
  const isAuth = false;
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
              // onClick={handleClick}
            >
              LOG OUT
            </button>
          ) : (
            <div className={styles.buttonContainer}>
              <Link href="/" className={styles.buttonItem}>
                LOG IN
              </Link>
              <Link href="/" className={styles.buttonItem}>
                SIGN UP
              </Link>
            </div>
          )}
          <div className={styles.themeContainer} onClick={toggleTheme}>
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </div>
        </div>
        <div className={styles.buttons}>
          {isSearch ? (
            <div className={styles.search}>
              <Search
                error={false}
                value={""}
                onChange={() => {}}
                closeSearch={() => {}}
              />
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
            // onClick={() => setMenuIsOpen(true)}
          >
            <IconMenu />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
