import { Expose, Type } from 'class-transformer';
import {
  Cities,
  Facilities,
  HousingType,
} from '../../../types/entities/index.js';
import { UserRdo } from '../../user/index.js';

export class OfferRdo {
  @Expose()
  id: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  createdAt?: Date;

  @Expose()
  city: Cities;

  @Expose()
  preview: string;

  @Expose()
  photos: string[];

  @Expose()
  isPremium: boolean;

  @Expose()
  commentsCount: number;

  @Expose()
  rating: number;

  @Expose()
  housingType: HousingType;

  @Expose()
  roomsNumber: number;

  @Expose()
  guestsNumber: number;

  @Expose()
  price: number;

  @Expose()
  facilities: Facilities[];

  @Expose()
  @Type(() => UserRdo)
  author: UserRdo;

  @Expose()
  latitude: number;

  @Expose()
  longitude: number;

  @Expose()
  isFavorite: boolean;
}
