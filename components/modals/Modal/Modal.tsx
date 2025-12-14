'use client';

import clsx from 'clsx';
import { FC, Suspense, useEffect } from 'react';
import { useRef } from 'react';
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
  const { currentModal, closeModal } = useModalStore();
  const isActive = !!currentModal.variant;

  const drawerRef = useRef<HTMLDivElement>(null);

  const searchParams = useSearchParams();
  const background = searchParams.get('background');
  const router = useRouter();

  useEffect(() => {
    if (currentModal.variant) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [currentModal.variant]);

  useOnClickOutside(drawerRef as React.RefObject<HTMLElement>, () => {
    const activeToasts = document.querySelectorAll('[data-toast]');
    if (activeToasts.length > 0) return;
    closeModal();
    if (background) {
      router.replace(background);
    }
  });

  const handleClose = () => {
    closeModal();
    if (background) {
      router.replace(background);
    }
  };

  const handleAnimationEnd = () => {
    if (!isActive) {
      const isAuthModal =
        currentModal.variant === 'authorization' || currentModal.variant === 'registration';

      if (isAuthModal && background) {
        router.replace(background);
      } else if (isAuthModal) {
        router.replace('/');
      }

      closeModal();
      document.body.style.overflow = '';
    }
  };

  if (!currentModal.variant) return null;

  const variantClassMap: Record<ModalVariant, string> = {
    menuModal: [styles.menuModal, isActive && styles.activeMenuModal].filter(Boolean).join(' '),
    filter: [styles.menuModal, isActive && styles.activeMenuModal].filter(Boolean).join(' '),
    authorization: styles.authModal,
    registration: styles.authModal,
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
      case 'registration':
        return <RegisterModal />;
    }
  };

  return createPortal(
    <div className={clsx(styles.modal_overlay, isActive && styles.active)}>
      <div
        ref={drawerRef}
        className={variantClassMap[currentModal.variant]}
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
        <Suspense fallback={<div>Loading...</div>}>{getModalContent()}</Suspense>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
