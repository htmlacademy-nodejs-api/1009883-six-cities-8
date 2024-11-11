import { UserDto } from '../user/user.dto';

export class OfferDto {
  id!: string;

  title!: string;

  description!: string;

  createdAt!: Date;

  city!: string;

  preview!: string;

  photos!: string[];

  isPremium!: boolean;

  commentsCount!: number;

  rating!: number;

  housingType!: string;

  roomsNumber!: number;

  guestsNumber!: number;

  price!: number;

  facilities!: string[];

  author!: UserDto;

  latitude!: number;

  longitude!: number;

  isFavorite!: boolean;
}
