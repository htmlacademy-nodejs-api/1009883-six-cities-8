import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  DocumentExistsMiddleware,
  HttpError,
  HttpMethod,
  PrivateRouteMiddleware,
  ValidateDtoMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { OfferService } from './offer-service.interface.js';
import { fillDTO } from '../../helpers/common.js';
import { OfferRdo } from './rdo/offer.rdo.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { GetOffersQueryDto } from './dto/get-offers-query.dto.js';
import { StatusCodes } from 'http-status-codes';
import { UserService } from '../user/index.js';
import { DocumentType } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    protected readonly offerService: OfferService,
    @inject(Component.UserService)
    protected readonly userService: UserService,
  ) {
    super(logger);

    this.logger.info('Register routes for OfferController…');

    const offerIdMiddlewares = [
      new ValidateObjectIdMiddleware('offerId'),
      new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
    ];

    this.addRoutes([
      {
        path: '/:offerId/favorites',
        method: HttpMethod.post,
        handler: this.addToFavorite,
        middlewares: [new PrivateRouteMiddleware(), ...offerIdMiddlewares],
      },
      {
        path: '/:offerId/favorites',
        method: HttpMethod.delete,
        handler: this.removeFromFavorite,
        middlewares: [new PrivateRouteMiddleware(), ...offerIdMiddlewares],
      },
      {
        path: '/favorites',
        handler: this.getFavorite,
        middlewares: [new PrivateRouteMiddleware()],
      },
      {
        path: '/:offerId',
        handler: this.show,
        middlewares: offerIdMiddlewares,
      },
      {
        path: '/:offerId',
        method: HttpMethod.delete,
        handler: this.delete,
        middlewares: [new PrivateRouteMiddleware(), ...offerIdMiddlewares],
      },
      {
        path: '/:offerId',
        method: HttpMethod.patch,
        handler: this.update,
        middlewares: [
          new PrivateRouteMiddleware(),
          ...offerIdMiddlewares,
          new ValidateDtoMiddleware(UpdateOfferDto),
        ],
      },
      {
        path: '/',
        handler: this.index,
        middlewares: [new ValidateDtoMiddleware(GetOffersQueryDto, 'query')],
      },
      {
        path: '/',
        method: HttpMethod.post,
        handler: this.create,
        middlewares: [
          new PrivateRouteMiddleware(),
          new ValidateDtoMiddleware(CreateOfferDto),
        ],
      },
    ]);
  }

  public async show(
    { params, tokenPayload }: Request<ParamOfferId>,
    res: Response,
  ) {
    const { offerId } = params;

    const offer = await this.offerService.findById(offerId, tokenPayload?.id);

    // if (offer) {
    //   offer.isFavorite = false;

    //   if (tokenPayload) {
    //     const user = await this.userService.findById(tokenPayload.id);

    //     if (user) {
    //       offer.isFavorite =
    //         user.favorites.findIndex((fav) => fav.toString() === offer.id) !==
    //         -1;
    //     }
    //   }
    // }

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async index(
    {
      query,
      tokenPayload,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      Record<string, unknown>,
      GetOffersQueryDto
    >,
    res: Response,
  ) {
    const offers = await this.offerService.find(query?.count, tokenPayload?.id);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create(
    {
      body,
      tokenPayload,
    }: Request<
      Record<string, unknown>,
      Record<string, unknown>,
      CreateOfferDto
    >,
    res: Response,
  ) {
    const result = await this.offerService.create({
      ...body,
      author: tokenPayload.id,
    });
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params, tokenPayload }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const offer = (await this.offerService.findById(
      params.offerId,
    )) as DocumentType<OfferEntity>;

    if (!(offer.author._id.toString() === tokenPayload.id)) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'OfferController',
      );
    }

    const { offerId } = params;
    const deletedOffer = await this.offerService.deleteById(offerId);

    this.noContent(res, `Offer with id ${deletedOffer?.id} was deleted`);
  }

  public async update(
    {
      body,
      params,
      tokenPayload,
    }: Request<ParamOfferId, unknown, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {
    const offer = (await this.offerService.findById(
      params.offerId,
    )) as DocumentType<OfferEntity>;

    if (!(offer.author._id.toString() === tokenPayload.id)) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Unauthorized',
        'OfferController',
      );
    }

    const result = await this.offerService.updateById(params.offerId, body);
    const updatedOffer = await this.offerService.findById(result?.id);

    this.ok(res, fillDTO(OfferRdo, updatedOffer));
  }

  public async addToFavorite(
    { params, tokenPayload }: Request<ParamOfferId, unknown>,
    res: Response,
  ) {
    const result = await this.offerService.addToFavorite(
      params.offerId,
      tokenPayload.id,
    );

    if (!result) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Adding offer with id "${params.offerId}" to favorites failed`,
        'OfferController',
      );
    }

    this.created(
      res,
      `Offer with id "${params.offerId}" was added to favorites`,
    );
  }

  public async removeFromFavorite(
    { params, tokenPayload }: Request<ParamOfferId, unknown>,
    res: Response,
  ) {
    const result = await this.offerService.removeFromFavorite(
      params.offerId,
      tokenPayload.id,
    );

    if (!result) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `Removing offer with id "${params.offerId}" from favorites failed`,
        'OfferController',
      );
    }

    this.created(
      res,
      `Offer with id "${params.offerId}" was removed from favorites`,
    );
  }

  public async getPremiumOfferByCity() {}

  public async getFavorite({ tokenPayload }: Request, res: Response) {
    const offers = await this.offerService.findFavorite(tokenPayload?.id);

    this.ok(res, fillDTO(OfferRdo, offers));
  }
}
