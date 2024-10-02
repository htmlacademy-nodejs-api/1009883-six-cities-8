import {
  Cities,
  Facilities,
  HousingType,
} from '../../../types/entities/index.js';

export class CreateOfferDto {
  createdAt?: Date;
  title: string;
  description: string;
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
  author: string;
  latitude: number;
  longitude: number;
}
