import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component, SortType } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import {
  DEFAULT_OFFER_COUNT,
  DEFAULT_PREMIUM_OFFER_COUNT,
} from './offer.constant.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { Cities } from '../../types/entities/cities.enum.js';
import { Types } from 'mongoose';
import { UserEntity, UserService } from '../user/index.js';
import {
  generalOfferAggregation,
  getIsFavoriteAggregation,
} from './helpers.js';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
    @inject(Component.UserService) private readonly userService: UserService,
  ) {}

  public async create(
    dto: CreateOfferDto,
  ): Promise<types.DocumentType<OfferEntity>> {
    const result = await this.offerModel.create(dto);
    this.logger.info(`New offer created: ${result.title}`);

    return result;
  }

  public async findById(
    offerId: string,
    userId?: string,
  ): Promise<types.DocumentType<OfferEntity> | null> {
    const favAggregation = getIsFavoriteAggregation(userId);

    const offerArray =
      await this.offerModel.aggregate<types.DocumentType<OfferEntity> | null>([
        {
          $match: {
            _id: new Types.ObjectId(offerId),
          },
        },
        ...generalOfferAggregation,
        ...favAggregation,
      ]);

    return offerArray[0];
  }

  public async find(
    count = DEFAULT_OFFER_COUNT,
    userId: string,
  ): Promise<types.DocumentType<OfferEntity>[]> {
    // return this.offerModel
    //   .find({}, {}, { limit, sort: { createdAt: SortType.Down } })
    //   .populate(['author']);

    const favAggregation = getIsFavoriteAggregation(userId);

    return this.offerModel.aggregate([
      ...generalOfferAggregation,
      ...favAggregation,
      { $limit: count },
      { $sort: { createdAt: SortType.Down } },
    ]);
  }

  public async findFavorite(
    userId: string,
  ): Promise<types.DocumentType<OfferEntity>[]> {
    const currentUser = (await this.userService.findById(
      userId,
    )) as types.DocumentType<UserEntity>;

    return this.offerModel.aggregate([
      // {
      //   $addFields: {
      //     currentUser: currentUser,
      //   },
      // },
      { $match: { $expr: { $in: ['$_id', currentUser.favorites] } } },
      ...generalOfferAggregation,
      {
        $addFields: {
          isFavorite: true,
        },
      },
      { $limit: DEFAULT_OFFER_COUNT },
      { $sort: { createdAt: SortType.Down } },
    ]);
  }

  public async deleteById(
    offerId: string,
  ): Promise<types.DocumentType<OfferEntity> | null> {
    return this.offerModel.findByIdAndDelete(offerId);
  }

  public async updateById(
    offerId: string,
    dto: UpdateOfferDto,
  ): Promise<types.DocumentType<OfferEntity> | null> {
    return this.offerModel
      .findByIdAndUpdate(offerId, dto, { new: true })
      .populate(['author']);
  }

  public async findPremiumByCity(
    city: Cities,
  ): Promise<types.DocumentType<OfferEntity>[]> {
    return this.offerModel
      .find({ city, isPremium: true })
      .sort({ createdAt: SortType.Down })
      .limit(DEFAULT_PREMIUM_OFFER_COUNT)
      .populate(['author']);
  }

  public async exists(documentId: string): Promise<boolean> {
    const offerExists = await this.offerModel.exists({ _id: documentId });

    return offerExists !== null;
  }

  public async addToFavorite(
    offerId: string,
    userId: string,
  ): Promise<boolean> {
    const user = await this.userService.findById(userId);

    if (!user) {
      return false;
    }

    if (!user.favorites.find((id) => id.toString() === offerId)) {
      user.favorites.push(new Types.ObjectId(offerId));
    }

    const updatedUser = await this.userService.updateById(userId, user);

    return !!updatedUser;
  }

  public async removeFromFavorite(
    offerId: string,
    userId: string,
  ): Promise<boolean> {
    const user = await this.userService.findById(userId);

    if (!user) {
      return false;
    }

    const index = user.favorites.findIndex((id) => id.toString() === offerId);

    if (!(index === -1)) {
      user.favorites.splice(index, 1);
    }

    const updatedUser = await this.userService.updateById(userId, user);

    return !!updatedUser;
  }
}
