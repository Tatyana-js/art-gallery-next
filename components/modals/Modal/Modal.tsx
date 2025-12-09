'use client';

import clsx from 'clsx';
import { FC, useLayoutEffect } from 'react';
import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useRouter, useSearchParams } from 'next/navigation';
import { useOnClickOutside } from 'usehooks-ts';
import styles from './Modal.module.scss';
import ClearIcon from '@/components/icons/ClearIcon';
import { ModalVariant } from '@/types/types';
import { useModalStore } from '@/lib/modalStore/modalStore';
import MenuModal from '../MenuModal';
import AuthModal from '../AuthModal';
import RegisterModal from '../RegisterModal';

const Modal: FC = () => {
  const [isActive, setIsActive] = useState(true);
  const { currentModal, closeModal } = useModalStore();

  const drawerRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const background = searchParams.get('background');
  const router = useRouter();

  useLayoutEffect(() => {
    if (currentModal.variant) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [currentModal.variant]);

  // useEffect(() => {
  //   lock();
  //   return () => {
  //     unlock();
  //   };
  // }, [lock, unlock]);

  useOnClickOutside(drawerRef as React.RefObject<HTMLElement>, () => {
    const activeToasts = document.querySelectorAll('[data-toast]');
    if (activeToasts.length > 0) {
      return;
    }
    setIsActive(false);
  });

  const handleClose = () => {
    setIsActive(false);
  };

  const handleAnimationEnd = () => {
    if (isActive) {
      return;
    }
    const isAuthModal =
      currentModal.variant === 'authorization' || currentModal.variant === 'registeration';

    if (isAuthModal && background) {
      router.replace(background);
    } else if (isAuthModal) {
      router.replace('/');
    }
    setIsActive(false);
    closeModal();
  };

  if (!currentModal.variant) return null;

  const variantClassMap: Record<ModalVariant, string> = {
    menuModal: [styles.menuModal, isActive && styles.activeMenuModal].filter(Boolean).join(' '),
    filter: [styles.menuModal, isActive && styles.activeMenuModal].filter(Boolean).join(' '),
    authorization: styles.authModal,
    registeration: styles.authModal,
    addArtist: styles.addArtist,
    deleteArtist: styles.deleteArtist,
    painting: styles.paintingModal,
    slider: styles.sliderModal,
  };

  const getModalContent = () => {
    switch (currentModal.variant) {
      case 'menuModal':
        return <MenuModal />;
      case 'authorization':
        return <AuthModal />;
      case 'registeration':
        return <RegisterModal />;
    }
  };

  return createPortal(
    <div className={clsx(styles.modal_overlay, isActive && styles.active)}>
      <div
        ref={drawerRef}
        className={variantClassMap[currentModal.variant]}
        // onClick={(e) => e.stopPropagation()}
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
        {getModalContent()}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
