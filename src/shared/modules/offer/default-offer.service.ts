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
import { UserService } from '../user/index.js';
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
  ): Promise<types.DocumentType<OfferEntity>[]> {
    // return this.offerModel
    //   .find({}, {}, { limit, sort: { createdAt: SortType.Down } })
    //   .populate(['author']);

    return this.offerModel.aggregate([
      {
        $lookup: {
          from: 'comments',
          let: { offerId: '$_id' },
          pipeline: [
            { $match: { $expr: { $eq: ['$offer', '$$offerId'] } } },
            { $project: { rating: 1 } },
          ],
          as: 'comments',
        },
      },
      {
        $lookup: {
          from: 'users',
          let: { authorId: '$author' },
          pipeline: [{ $match: { $expr: { $eq: ['$_id', '$$authorId'] } } }],
          as: 'authorlookup',
        },
      },
      {
        $addFields: {
          id: { $toString: '$_id' },
          commentsCount: { $size: '$comments' },
          rating: { $avg: '$comments.rating' },
          author: { $arrayElemAt: ['$authorlookup', 0] },
        },
      },
      { $unset: 'comments' },
      { $unset: 'authorlookup' },
      { $limit: count },
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
