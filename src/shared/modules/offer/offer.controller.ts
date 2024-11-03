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
import { AllOffersRequest } from './type/all-offers-request.js';
import { CreateOfferRequest } from './type/create-offer-request.type.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { GetOffersQueryDto } from './dto/get-offers-query.dto.js';
import { StatusCodes } from 'http-status-codes';

@injectable()
export class OfferController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.OfferService)
    protected readonly offerService: OfferService,
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
        path: '/:offerId',
        handler: this.show,
        middlewares: offerIdMiddlewares,
      },
      {
        path: '/:offerId',
        method: HttpMethod.delete,
        handler: this.delete,
        middlewares: offerIdMiddlewares,
      },
      {
        path: '/:offerId',
        method: HttpMethod.patch,
        handler: this.update,
        middlewares: [
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
        middlewares: [new ValidateDtoMiddleware(CreateOfferDto)],
      },
    ]);
  }

  public async show({ params }: Request<ParamOfferId>, res: Response) {
    const { offerId } = params;

    const offer = await this.offerService.findById(offerId);

    this.ok(res, fillDTO(OfferRdo, offer));
  }

  public async index(req: AllOffersRequest, res: Response) {
    const offers = await this.offerService.find(req.query.count);

    this.ok(res, fillDTO(OfferRdo, offers));
  }

  public async create({ body }: CreateOfferRequest, res: Response) {
    const result = await this.offerService.create(body);
    const offer = await this.offerService.findById(result.id);
    this.created(res, fillDTO(OfferRdo, offer));
  }

  public async delete(
    { params }: Request<ParamOfferId>,
    res: Response,
  ): Promise<void> {
    const { offerId } = params;
    const offer = await this.offerService.deleteById(offerId);

    this.noContent(res, offer);
  }

  public async update(
    { body, params }: Request<ParamOfferId, unknown, UpdateOfferDto>,
    res: Response,
  ): Promise<void> {
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
}
