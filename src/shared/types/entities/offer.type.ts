import { Cities } from './cities.enum.js';
import { Facilities } from './facilities.enum.js';
import { HousingType } from './housing-type.enum.js';
import { User } from './user.type.js';

export type Offer = {
  title: string;
  description: string;
  createdAt: string;
  city: Cities;
  preview: string;
  photos: string[];
  isPremium: boolean;
  rating: number;
  housingType: HousingType;
  roomsNumber: number;
  guestsNumber: number;
  price: number;
  facilities: Facilities[];
  author: User;
  coordinates: {
    latitude: number;
    longitude: number;
  };
};
