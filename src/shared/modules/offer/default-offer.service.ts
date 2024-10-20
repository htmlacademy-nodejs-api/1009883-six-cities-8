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
import { UpdateOfferDtoOfferDto } from './dto/update-offer.dto.js';
import { Cities } from '../../types/entities/cities.enum.js';
import { Types } from 'mongoose';

@injectable()
export class DefaultOfferService implements OfferService {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.OfferModel)
    private readonly offerModel: types.ModelType<OfferEntity>,
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
  ): Promise<types.DocumentType<OfferEntity> | null> {
    // return this.offerModel.findById(offerId).populate(['author']);

    const offerArray =
      await this.offerModel.aggregate<types.DocumentType<OfferEntity> | null>([
        {
          $match: {
            _id: new Types.ObjectId(offerId),
          },
        },
        // Почему первый вариант далее не работаает?
        // {
        //   $lookup: {
        //     from: 'comments',
        //     let: { offerId: '$_id' },
        //     pipeline: [{ $match: { offer: '$$offerId' } }],
        //     as: 'comments',
        //   },
        // },
        // {
        //   $lookup: {
        //     from: 'comments',
        //     localField: '_id',
        //     foreignField: 'offer',
        //     as: 'comments',
        //   },
        // },
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
          $addFields: {
            id: { $toString: '$_id' },
            commentsCount: { $size: '$comments' },
            rating: { $avg: '$comments.rating' },
          },
        },
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
            { $match: { offer: '$$offerId' } },
            { $project: { rating: 1 } },
            // {
            //   $group: {
            //     _id: null,
            //     totalCount: { $sum: 1 },
            //     averageRating: { $avg: '$rating' },
            //   },
            // },
          ],
          as: 'comments',
        },
      },
      {
        $addFields: {
          id: { $toString: '$_id' },
          commentsCount: { $size: '$comments' },
          rating: { $avg: '$comments.rating' },
          // commentsCount: '$comments[0].totalCount',
          // rating: '$comments[0].averageRating',
        },
      },
      // { $unset: 'comments' },
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
    dto: UpdateOfferDtoOfferDto,
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
}
