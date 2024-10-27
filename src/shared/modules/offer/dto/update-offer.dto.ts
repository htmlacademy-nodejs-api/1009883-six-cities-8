import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
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

export class UpdateOfferDto {
  @IsOptional()
  @IsDateString(
    {},
    { message: UpdateOfferValidationMessage.createdAt.invalidFormat },
  )
  createdAt?: Date;

  @IsOptional()
  @MinLength(10, { message: UpdateOfferValidationMessage.title.minLength })
  @MaxLength(100, { message: UpdateOfferValidationMessage.title.maxLength })
  title?: string;

  @IsOptional()
  @MinLength(20, {
    message: UpdateOfferValidationMessage.description.minLength,
  })
  @MaxLength(1024, {
    message: UpdateOfferValidationMessage.description.maxLength,
  })
  description?: string;

  @IsOptional()
  @IsEnum(Cities, { message: UpdateOfferValidationMessage.city.invalid })
  city?: Cities;

  @IsOptional()
  @MaxLength(256, { message: UpdateOfferValidationMessage.preview.maxLength })
  preview?: string;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.photos.invalidFormat })
  @MaxLength(256, {
    each: true,
    message: UpdateOfferValidationMessage.photos.maxLength,
  })
  photos?: string[];

  @IsOptional()
  @IsBoolean({ message: UpdateOfferValidationMessage.isPremium.invalid })
  isPremium?: boolean;

  // rating?: number;

  @IsOptional()
  @IsEnum(HousingType, {
    message: UpdateOfferValidationMessage.housingType.invalid,
  })
  housingType?: HousingType;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.roomsNumber.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.roomsNumber.minValue })
  @Max(8, { message: UpdateOfferValidationMessage.roomsNumber.maxValue })
  roomsNumber?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.roomsNumber.invalidFormat })
  @Min(1, { message: UpdateOfferValidationMessage.roomsNumber.minValue })
  @Max(10, { message: UpdateOfferValidationMessage.roomsNumber.maxValue })
  guestsNumber?: number;

  @IsOptional()
  @IsInt({ message: UpdateOfferValidationMessage.price.invalidFormat })
  @Min(100, { message: UpdateOfferValidationMessage.price.minValue })
  @Max(100000, { message: UpdateOfferValidationMessage.price.maxValue })
  price?: number;

  @IsOptional()
  @IsArray({ message: UpdateOfferValidationMessage.facilities.invalidFormat })
  @IsEnum(HousingType, {
    each: true,
    message: UpdateOfferValidationMessage.facilities.invalid,
  })
  facilities?: Facilities[];

  @IsOptional()
  @IsNumber(
    {},
    { message: UpdateOfferValidationMessage.latitude.invalidFormat },
  )
  @Min(-90, { message: UpdateOfferValidationMessage.latitude.minValue })
  @Max(90, { message: UpdateOfferValidationMessage.latitude.maxValue })
  latitude?: number;

  @IsOptional()
  @IsNumber(
    {},
    { message: UpdateOfferValidationMessage.longitude.invalidFormat },
  )
  @Min(-180, { message: UpdateOfferValidationMessage.longitude.minValue })
  @Max(180, { message: UpdateOfferValidationMessage.longitude.maxValue })
  longitude?: number;
}
