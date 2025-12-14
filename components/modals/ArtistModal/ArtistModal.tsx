// import useTheme from '@/hooks/useTheme';
// import {
//   useCreateArtistMutation,
//   useGetArtistByIdQuery,
//   useUpdateArtistMutation,
// } from '@/store/api/artistsApi';
// import { yupResolver } from '@hookform/resolvers/yup';
// import clsx from 'clsx';
// import { FC, useEffect, useState } from 'react';
// import { FormProvider, useForm } from 'react-hook-form';
// import { useLocation, useNavigate } from 'react-router-dom';

// import styles from './ArtistModal.module.scss';

// import EmptyCard from '@/components/EmptyCard';

// import { ICreateArtistRequest } from '@/types/Artist';

// import getImageSrc from '@/utils/getImageSrc';
// import router from '@/utils/routes';

// import ArtistForm from './ArtistForm/ArtistForm';
// import addArtistSchema from './validate';

// interface IArtistModal {
//   closeModal: (value: boolean) => void;
// }

// const ArtistModal: FC<IArtistModal> = ({ closeModal }) => {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [previewUrl, setPreviewUrl] = useState<string | null>(null);
//   const [isDragOver, setIsDragOver] = useState(false);

//   const { theme } = useTheme();
//   const location = useLocation();
//   const isEditMode = location.pathname.includes('/artists/');
//   const id = location.pathname.split('/')[2];
//   const { data: artist } = useGetArtistByIdQuery(id!, {
//     skip: !isEditMode,
//   });

//   const [createArtistMutation, { isLoading: isCreating }] = useCreateArtistMutation();
//   const [updateArtistMutation, { isLoading: isUpdating }] = useUpdateArtistMutation();
//   const navigate = useNavigate();

//   const isLoading = isCreating || isUpdating;

//   const methods = useForm<ICreateArtistRequest>({
//     mode: 'onChange',
//     resolver: yupResolver(addArtistSchema),
//     defaultValues: artist
//       ? {
//           name: artist.name,
//           yearsOfLife: artist.yearsOfLife,
//           description: artist.description,
//           genres: artist.genres?.map((genre) => genre._id) || [],
//           location: artist.location || '',
//         }
//       : {
//           name: '',
//           yearsOfLife: '',
//           description: '',
//           genres: [],
//           location: '',
//         },
//   });

//   useEffect(() => {
//     if (artist?.avatar?.src) {
//       const avatarUrl = getImageSrc(artist.avatar.src);
//       setPreviewUrl(avatarUrl);
//     }
//   }, [artist]);

//   const onSubmit = async (formData: ICreateArtistRequest) => {
//     try {
//       const formDataToSend = new FormData();
//       formDataToSend.append('name', formData.name);
//       formDataToSend.append('yearsOfLife', formData.yearsOfLife);
//       formDataToSend.append('description', formData.description);

//       formData.genres.forEach((genreId: string) => {
//         formDataToSend.append('genres', genreId);
//       });
//       if (selectedFile) {
//         formDataToSend.append('avatar', selectedFile);
//       }
//       let responseArtist;

//       if (isEditMode && id) {
//         responseArtist = await updateArtistMutation({
//           id: id,
//           data: formDataToSend,
//         }).unwrap();
//       } else {
//         responseArtist = await createArtistMutation(formDataToSend).unwrap();
//       }
//       methods.reset();
//       closeModal(false);
//       navigate(router.artist_profile(responseArtist._id));
//     } catch (err) {
//       if (err instanceof Error) {
//         methods.setError('root.serverError', {
//           type: 'server',
//           message: err.message || 'Authorization failed',
//         });
//       }
//     }
//   };

//   const handleFilesDrop = (files: File[]) => {
//     if (files.length > 0) {
//       const file = files[0];
//       setSelectedFile(file);
//       const objectUrl = URL.createObjectURL(file);
//       setPreviewUrl(objectUrl);
//     }
//   };
//   const handleDragOver = (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragOver(true);
//   };

//   const handleClearImage = () => {
//     setSelectedFile(null);
//     setPreviewUrl(null);
//   };

//   return (
//     <FormProvider {...methods}>
//       <div
//         className={clsx(styles.containerInfo, styles[`containerInfo--${theme}`])}
//         onDragOver={handleDragOver}
//       >
//         <EmptyCard
//           theme={theme}
//           onFilesDrop={handleFilesDrop}
//           previewUrl={previewUrl}
//           isDragOver={isDragOver}
//           setIsDragOver={setIsDragOver}
//           handleClearImage={handleClearImage}
//         />
//         <ArtistForm theme={theme} onSubmit={methods.handleSubmit(onSubmit)} isLoading={isLoading} />
//       </div>
//     </FormProvider>
//   );
// };

// export default ArtistModal;
