import {
  defaultClasses,
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from '@typegoose/typegoose';
import { Cities, Facilities, HousingType } from '../../types/entities/index.js';
import { UserEntity } from '../user/user.entity.js';

// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export interface OfferEntity extends defaultClasses.Base {}

@modelOptions({
  schemaOptions: {
    collection: 'offers',
    timestamps: true,
  },
})
// eslint-disable-next-line @typescript-eslint/no-unsafe-declaration-merging
export class OfferEntity extends defaultClasses.TimeStamps {
  @prop({ trim: true, required: true })
  public title: string;

  @prop({ trim: true, required: true })
  public description: string;

  @prop({ type: () => String, enum: Cities, required: true })
  public city: Cities;

  @prop({ required: true })
  public preview: string;

  @prop({ type: () => String, required: true })
  public photos: string[];

  @prop({ required: true, default: false })
  public isPremium: boolean;

  // @prop({ required: true })
  // public rating: number;

  @prop({ type: () => String, enum: HousingType, required: true })
  public housingType: HousingType;

  @prop({ required: true })
  public roomsNumber: number;

  @prop({ required: true })
  public guestsNumber: number;

  @prop({ required: true })
  public price: number;

  @prop({ type: () => String, enum: Facilities, required: true })
  public facilities: Facilities[];

  @prop({ ref: UserEntity, required: true })
  public author: Ref<UserEntity>;

  @prop({ required: true })
  public latitude: number;

  @prop({ required: true })
  public longitude: number;

  public isFavorite: boolean;
}

export const OfferModel = getModelForClass(OfferEntity);
