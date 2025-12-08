"use client";
import { FC, memo } from "react";
import styles from "./ToggleTheme.module.scss";
import MoonIcon from "@/components/icons/MoonIcon";
import SunIcon from "@/components/icons/SunIcon";
import Button from "../Buttons";
import useTheme from "@/hooks/useTheme";

const ToggleTheme: FC = memo(() => {
  const { theme, toggleTheme } = useTheme();
  return (
    <div
      className={styles.buttonTheme}
      onClick={toggleTheme}
    >
      <div className={styles.iconTheme}>
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </div>
      <Button variant="text">
        {theme === "light" ? "LIGHT MODE" : "DARK MODE"}
      </Button>
    </div>
  );
});

ToggleTheme.displayName = 'ToggleTheme';

export default ToggleTheme;
