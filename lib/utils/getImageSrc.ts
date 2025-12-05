export const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL;

const getImageSrc = (imageUrl: string): string => {
  return `${NEXT_PUBLIC_API_URL}${imageUrl}`;
};

export default getImageSrc;
