// import useScrollLock from "@/hooks/useScrollLock";
import useTheme from "../../../hooks/useTheme";
import clsx from "clsx";
import { FC } from "react";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import { useOnClickOutside } from "usehooks-ts";
import styles from "./Modal.module.scss";
import ClearIcon from "@/components/icons/ClearIcon";

type ModalVariant =
  | "menuModal"
  | "authorization"
  | "register"
  | "addArtist"
  | "deleteArtist"
  | "painting"
  | "slider"
  | "filter";

export interface IModal {
  children: React.ReactNode;
  variant: ModalVariant;
  closeModal?: () => void;
}

const Modal: FC<IModal> = ({ children, variant, closeModal }) => {
  const [isActive, setIsActive] = useState(true);
  const drawerRef = useRef<HTMLDivElement>(null);
  // const { lock, unlock } = useScrollLock();

  const searchParams = useSearchParams();
  const background = searchParams.get("background");
  const router = useRouter();

  // useEffect(() => {
  //   lock();
  //   return () => {
  //     unlock();
  //   };
  // }, [lock, unlock]);

  useOnClickOutside(drawerRef as React.RefObject<HTMLElement>, () => {
    const activeToasts = document.querySelectorAll("[data-toast]");
    if (activeToasts.length > 0) {
      return;
    }
    setIsActive(false);
    closeModal?.();
    router.replace("/");
  });

  const handleCloseNavigation = () => {
    if (variant === "authorization" || variant === "register") {
      if (background) {
        router.replace(background);
      } else {
        router.replace("/");
      }
    } else if (closeModal) {
      closeModal();
    }
  };

  const handleClose = () => {
    setIsActive(false);
    handleCloseNavigation();

    if (closeModal && variant !== "menuModal") {
      closeModal();
    }
  };

  const handleAnimationEnd = () => {
    if (!isActive) {
      // unlock();
      handleCloseNavigation();
    } else {
      router.replace("/");
    }
  };

  const getVariantClasses = (variant: ModalVariant) => {
    switch (variant) {
      case "menuModal":
      case "filter":
        return [styles.menuModal, isActive && styles.activeMenuModal]
          .filter(Boolean)
          .join(" ");

      case "authorization":
      case "register":
        return styles.authModal;

      case "addArtist":
        return styles.addArtist;

      case "deleteArtist":
        return styles.deleteArtist;

      case "painting":
        return styles.paintingModal;

      case "slider":
        return styles.sliderModal;
    }
  };

  return createPortal(
    <div className={clsx(styles.modal_overlay, isActive && styles.active)}>
      <div
        ref={drawerRef}
        className={getVariantClasses(variant)}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={handleAnimationEnd}
      >
        <button
          type="button"
          aria-label="Close modal"
          className={styles.clearButton}
          onClick={handleClose}
        >
          <ClearIcon />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
