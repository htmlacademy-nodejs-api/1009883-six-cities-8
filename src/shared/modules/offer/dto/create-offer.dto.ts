import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
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
import { Expose } from 'class-transformer';

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
  @Expose()
  title: string;

  @IsString({ message: CreateOfferValidationMessage.description.invalidFormat })
  @MinLength(20, {
    message: CreateOfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: CreateOfferValidationMessage.description.maxLength,
  })
  @Expose()
  description: string;

  @IsEnum(Cities, { message: CreateOfferValidationMessage.city.invalid })
  @Expose()
  city: Cities;

  @IsString({ message: CreateOfferValidationMessage.preview.invalidFormat })
  @MaxLength(256, { message: CreateOfferValidationMessage.preview.maxLength })
  @Expose()
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
  @Expose()
  photos: string[];

  @IsBoolean({ message: CreateOfferValidationMessage.isPremium.invalid })
  @Expose()
  isPremium: boolean;

  @IsEnum(HousingType, {
    message: CreateOfferValidationMessage.housingType.invalid,
  })
  @Expose()
  housingType: HousingType;

  @IsInt({ message: CreateOfferValidationMessage.roomsNumber.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomsNumber.minValue })
  @Max(8, { message: CreateOfferValidationMessage.roomsNumber.maxValue })
  @Expose()
  roomsNumber: number;

  @IsInt({ message: CreateOfferValidationMessage.roomsNumber.invalidFormat })
  @Min(1, { message: CreateOfferValidationMessage.roomsNumber.minValue })
  @Max(10, { message: CreateOfferValidationMessage.roomsNumber.maxValue })
  @Expose()
  guestsNumber: number;

  @IsNumber({}, { message: CreateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: CreateOfferValidationMessage.price.minValue })
  @Max(100000, { message: CreateOfferValidationMessage.price.maxValue })
  @Expose()
  price: number;

  @IsArray({ message: CreateOfferValidationMessage.facilities.invalidFormat })
  @IsEnum(Facilities, {
    each: true,
    message: CreateOfferValidationMessage.facilities.invalid,
  })
  @Expose()
  facilities: Facilities[];

  author: string;

  @IsNumber(
    {},
    { message: CreateOfferValidationMessage.latitude.invalidFormat },
  )
  @Min(-90, { message: CreateOfferValidationMessage.latitude.minValue })
  @Max(90, { message: CreateOfferValidationMessage.latitude.maxValue })
  @Expose()
  latitude: number;

  @IsNumber(
    {},
    { message: CreateOfferValidationMessage.longitude.invalidFormat },
  )
  @Min(-180, { message: CreateOfferValidationMessage.longitude.minValue })
  @Max(180, { message: CreateOfferValidationMessage.longitude.maxValue })
  @Expose()
  longitude: number;
}
