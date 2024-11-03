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
import { UpdateOfferValidationMessage } from './update-offer.messages.js';
import { Expose } from 'class-transformer';

export class UpdateOfferDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: UpdateOfferValidationMessage.createdAt.invalidFormat },
  )
  createdAt?: Date;

  @IsOptional()
  @IsString({ message: UpdateOfferValidationMessage.title.invalidFormat })
  @MinLength(10, { message: UpdateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: UpdateOfferValidationMessage.title.maxLength })
  @Expose()
  title?: string;

  @IsOptional()
  @IsString({ message: UpdateOfferValidationMessage.description.invalidFormat })
  @MinLength(20, {
    message: UpdateOfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: UpdateOfferValidationMessage.description.maxLength,
  })
  @Expose()
  description?: string;

  @IsOptional()
  @IsEnum(Cities, { message: UpdateOfferValidationMessage.city.invalid })
  @Expose()
  city?: Cities;

  @IsOptional()
  @IsString({ message: UpdateOfferValidationMessage.preview.invalidFormat })
  @MaxLength(256, { message: UpdateOfferValidationMessage.preview.maxLength })
  @Expose()
  preview?: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.photos.invalidFormat })
  @IsString({
    each: true,
    message: UpdateOfferValidationMessage.photos.invalidFormat,
  })
  @MaxLength(256, {
    each: true,
    message: UpdateOfferValidationMessage.photos.maxLength,
  })
  @Expose()
  photos?: string[];

  @IsOptional()
  @IsBoolean({ message: UpdateOfferValidationMessage.isPremium.invalid })
  @Expose()
  isPremium?: boolean;

  // rating?: number;

  @IsOptional()
  @IsEnum(HousingType, {
    message: UpdateOfferValidationMessage.housingType.invalid,
  })
  @Expose()
  housingType?: HousingType;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.roomsNumber.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.roomsNumber.minValue })
  @Max(8, { message: UpdateOfferValidationMessage.roomsNumber.maxValue })
  @Expose()
  roomsNumber?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.roomsNumber.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.roomsNumber.minValue })
  @Max(10, { message: UpdateOfferValidationMessage.roomsNumber.maxValue })
  @Expose()
  guestsNumber?: number;

  @IsOptional()
  @IsNumber({}, { message: UpdateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: UpdateOfferValidationMessage.price.minValue })
  @Max(100000, { message: UpdateOfferValidationMessage.price.maxValue })
  @Expose()
  price?: number;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.facilities.invalidFormat })
  @IsEnum(HousingType, {
    each: true,
    message: UpdateOfferValidationMessage.facilities.invalid,
  })
  @Expose()
  facilities?: Facilities[];

  @IsOptional()
  @IsNumber(
    {},
    { message: UpdateOfferValidationMessage.latitude.invalidFormat },
  )
  @Min(-90, { message: UpdateOfferValidationMessage.latitude.minValue })
  @Max(90, { message: UpdateOfferValidationMessage.latitude.maxValue })
  @Expose()
  latitude?: number;

  @IsOptional()
  @IsNumber(
    {},
    { message: UpdateOfferValidationMessage.longitude.invalidFormat },
  )
  @Min(-180, { message: UpdateOfferValidationMessage.longitude.minValue })
  @Max(180, { message: UpdateOfferValidationMessage.longitude.maxValue })
  @Expose()
  longitude?: number;
}
