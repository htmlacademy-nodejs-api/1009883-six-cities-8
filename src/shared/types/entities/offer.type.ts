import { Cities } from './cities.enum.js';
import { Facilities } from './facilities.enum.js';
import { HousingType } from './housing-type.enum.js';
import { User } from './user.type.js';

export type Photos = [string, string, string, string, string, string];

export type Offer = {
  title: string;
  description: string;
  dateAdded: Date;
  city: Cities;
  preview: string;
  photos: Photos;
  isPremium: boolean;
  isFavorite: boolean;
  rating: number;
  housingType: HousingType;
  roomsNumber: number;
  guestsNumber: number;
  price: number;
  facilities: Facilities[];
  author: User;
  commentsCount: number;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};
