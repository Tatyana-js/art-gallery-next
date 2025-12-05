export interface IImage {
  _id: string;
  src: string;
  webp: string;
  src2x: string;
  webp2x: string;
  original: string;
}

export interface IMainPainting {
  _id: string;
  name: string;
  yearOfCreation: string;
  image: IImage;
  artist: string;
}

export interface IPainting {
  _id: string;
  name: string;
  yearOfCreation: string;
  image: IImage;
}

export interface IGenre {
  _id: string;
  name: string;
}

export default interface IArtist {
  paintings: IMainPainting[];
  genres: IGenre[];
  _id: string;
  name: string;
  description: string;
  yearsOfLife: string;
  mainPainting: IMainPainting;
  avatar?: IImage;
  __v?: number;
  location?: string;
}

export interface ICreateArtistRequest {
  name: string;
  yearsOfLife: string;
  description: string;
  genres: string[];
  location: string;
  avatar?: string;
}

export interface ICreatePaintRequest {
  id: string;
  name: string;
  yearOfCreation: number;
}
