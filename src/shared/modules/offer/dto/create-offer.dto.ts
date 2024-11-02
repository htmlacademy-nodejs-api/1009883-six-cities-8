import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  Cities,
  Facilities,
  HousingType,
} from '../../../types/entities/index.js';
import { CreateOfferValidationMessage } from './create-offer.messages.js';

export class CreateOfferDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: CreateOfferValidationMessage.createdAt.invalidFormat },
  )
  createdAt?: Date;

  @IsString({ message: CreateOfferValidationMessage.title.invalidFormat })
  @MinLength(10, { message: CreateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: CreateOfferValidationMessage.title.maxLength })
  title: string;

  @IsString({ message: CreateOfferValidationMessage.description.invalidFormat })
  @MinLength(20, {
    message: CreateOfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: CreateOfferValidationMessage.description.maxLength,
  })
  description: string;

  @IsEnum(Cities, { message: CreateOfferValidationMessage.city.invalid })
  city: Cities;

  @IsString({ message: CreateOfferValidationMessage.preview.invalidFormat })
  @MaxLength(256, { message: CreateOfferValidationMessage.preview.maxLength })
  preview: string;

  @IsArray({ message: CreateOfferValidationMessage.photos.invalidFormat })
  @IsString({
    each: true,
    message: CreateOfferValidationMessage.preview.invalidFormat,
  })
  @MaxLength(256, {
    each: true,
    message: CreateOfferValidationMessage.photos.maxLength,
  })
  photos: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalid })
  isPremium: boolean;

  // rating: number;

  @IsEnum(HousingType, {
    message: CreateOfferValidationMessage.housingType.invalid,
  })
  housingType: HousingType;

  @IsInt({ message: CreateOfferValidationMessage.roomsNumber.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomsNumber.minValue })
  @Max(8, { message: CreateOfferValidationMessage.roomsNumber.maxValue })
  roomsNumber: number;

  @IsInt({ message: CreateOfferValidationMessage.roomsNumber.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomsNumber.minValue })
  @Max(10, { message: CreateOfferValidationMessage.roomsNumber.maxValue })
  guestsNumber: number;

  @IsNumber({}, { message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  price: number;

  @IsArray({ message: CreateOfferValidationMessage.facilities.invalidFormat })
  @IsEnum(HousingType, {
    each: true,
    message: CreateOfferValidationMessage.facilities.invalid,
  })
  facilities: Facilities[];

  @IsMongoId({ message: CreateOfferValidationMessage.author.invalidId })
  author: string;

  @IsNumber(
    {},
    { message: CreateOfferValidationMessage.latitude.invalidFormat },
  )
  @Min(-90, { message: CreateOfferValidationMessage.latitude.minValue })
  @Max(90, { message: CreateOfferValidationMessage.latitude.maxValue })
  latitude: number;

  @IsNumber(
    {},
    { message: CreateOfferValidationMessage.longitude.invalidFormat },
  )
  @Min(-180, { message: CreateOfferValidationMessage.longitude.minValue })
  @Max(180, { message: CreateOfferValidationMessage.longitude.maxValue })
  longitude: number;
}
