export class CreateOfferDto {
  title!: string;

  description!: string;

  city!: string;

  preview!: string;

  photos!: string[];

  isPremium!: boolean;

  housingType!: string;

  roomsNumber!: number;

  guestsNumber!: number;

  price!: number;

  facilities!: string[];

  latitude!: number;

  longitude!: number;
}
