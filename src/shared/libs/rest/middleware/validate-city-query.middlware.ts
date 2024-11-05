import { NextFunction, Request, Response } from 'express';
import { Middleware } from './middleware.interface.js';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { Cities } from '../../../types/entities/index.js';

export class ValidateCityQueryMiddleware implements Middleware {
  constructor(private param: string = 'city') {}

  public execute(
    { params }: Request,
    _res: Response,
    next: NextFunction,
  ): void {
    const city = params[this.param];

    if (!Object.values(Cities).includes(city as Cities)) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        `The city ${params.city} is not supported`,
        'OfferController',
      );
    }

    return next();
  }
}
