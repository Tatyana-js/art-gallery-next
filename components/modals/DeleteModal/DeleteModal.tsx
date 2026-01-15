'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { deleteArtist } from '@/lib/api/artists';
import { deleteArtistPainting } from '@/lib/api/paintings';
import styles from './DeleteModal.module.scss';
import IArtist, { IPainting } from '@/types/Artist';
import Button from '@/components/ui_kit/Buttons';
import DeleteIcon from '@/components/icons/DeleteIcon';

interface IDeleteModalProps {
  artist?: IArtist;
  painting?: IPainting;
  closeModal?: () => void;
  type: string;
}

const DeleteModal: FC<IDeleteModalProps> = ({ artist, painting, closeModal, type }) => {
  const router = useRouter();

  const handleDelete = async () => {
    try {
      if (type === 'artist' && artist) {
        await deleteArtist(artist._id);
        closeModal?.();
        router.push('/artists');
      } else if (type === 'painting' && painting && artist?._id) {
        await deleteArtistPainting(artist._id, painting._id);
        closeModal?.();
        router.refresh();
      }
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  const getDeleteText = () => {
    if (type === 'artist') {
      return {
        question: 'Do you want to delete this artist profile?',
        warning: 'You will not be able to recover this profile afterwards.',
      };
    } else {
      return {
        question: 'Do you want to delete this painting?',
        warning: 'You will not be able to recover this painting afterwards.',
      };
    }
  };

  const { question, warning } = getDeleteText();

  return (
    <div className={styles.container}>
      <div className={styles.deleteButton}>
        <Button variant="icon" onClick={handleDelete}>
          <DeleteIcon />
        </Button>
      </div>
      <p className={styles.deleteQuestion}>{question}</p>
      <p className={styles.textWarning}>{warning}</p>
      <Button variant="defaultButton" onClick={handleDelete}>
        DELETE
      </Button>
      <Button variant="text" onClick={closeModal}>
        CANCEL
      </Button>
    </div>
  );
};

export default DeleteModal;
