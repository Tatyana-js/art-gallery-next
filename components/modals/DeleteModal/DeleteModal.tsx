// import { useDeleteArtistMutation, useDeleteArtistPaintingMutation } from '@/store/api/artistsApi';
// import clsx from 'clsx';
// import { FC } from 'react';
// import { useNavigate } from 'react-router-dom';

// import styles from './DeleteModal.module.scss';

// import IArtist, { IPainting } from '@/types/Artist';
// import type { theme } from '@/types/types';

// import Button from '@/ui_kit/Buttons';

// import routes from '@/utils/routes';

// import DeleteIcon from '@/assets/icons/DeleteIcon';

// interface IDeleteModaleProps {
//   theme: theme;
//   artist?: IArtist;
//   painting?: IPainting;
//   closeModal?: (value: boolean) => void;
//   type: string;
// }

// const DeleteModale: FC<IDeleteModaleProps> = ({ theme, artist, painting, closeModal, type }) => {
//   const [deleteArtist] = useDeleteArtistMutation();
//   const [deleteArtistPainting] = useDeleteArtistPaintingMutation();
//   const navigate = useNavigate();

//   const artistId = artist?._id;

//   const handleDelete = async () => {
//     try {
//       if (type === 'artist' && artist) {
//         navigate(routes.artists());
//         await deleteArtist(artist._id).unwrap();
//         closeModal?.(false);
//       } else if (type === 'painting' && painting && artistId) {
//         await deleteArtistPainting({
//           id: artistId,
//           paintingId: painting._id,
//         }).unwrap();
//         closeModal?.(false);
//       }
//     } catch (error) {
//       console.error('Failed to delete artist:', error);
//     }
//   };

//   const getDeleteText = () => {
//     if (type === 'artist') {
//       return {
//         question: 'Do you want to delete this artist profile?',
//         warning: 'You will not be able to recover this profile afterwards.',
//       };
//     } else {
//       return {
//         question: 'Do you want to delete this painting?',
//         warning: 'You will not be able to recover this painting afterwards.',
//       };
//     }
//   };

//   const { question, warning } = getDeleteText();

//   return (
//     <div className={styles.container}>
//       <div className={styles.deleteButton}>
//         <Button variant="icon" theme={theme} onClick={handleDelete}>
//           <DeleteIcon />
//         </Button>
//       </div>
//       <p className={clsx(styles.deleteQuestion, styles[`deleteQuestion--${theme}`])}>{question}</p>
//       <p className={styles.textWarning}>{warning}</p>
//       <Button variant="defaultButton" theme={theme} onClick={handleDelete}>
//         DELETE
//       </Button>
//       <Button
//         variant="text"
//         theme={theme}
//         onClick={() => {
//           if (closeModal) {
//             closeModal(false);
//           }
//         }}
//       >
//         CANCEL
//       </Button>
//     </div>
//   );
// };

// export default DeleteModale;
