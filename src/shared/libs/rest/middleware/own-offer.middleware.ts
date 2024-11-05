import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { OfferEntity, OfferService } from '../../../modules/offer/index.js';
import { DocumentType } from '@typegoose/typegoose';

export class OwnOfferMiddleware implements Middleware {
  constructor(private readonly offerService: OfferService) {}

  public async execute(
    { params, tokenPayload }: Request,
    _res: Response,
    next: NextFunction,
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

    return next();
  }
}
