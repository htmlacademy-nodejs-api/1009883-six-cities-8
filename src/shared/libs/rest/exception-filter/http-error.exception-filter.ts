import { inject, injectable } from 'inversify';
import { ExceptionFilter } from './exception-filter.interface.js';
import { Component } from '../../../types/index.js';
import { Logger } from '../../logger/index.js';
import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../errors/index.js';
import { StatusCodes } from 'http-status-codes';
import { createErrorObject } from '../../../helpers/index.js';
import { ApplicationError } from '../types/application-error.enum.js';

@injectable()
export class HttpErrorExceptionFilter implements ExceptionFilter {
  constructor(@inject(Component.Logger) private readonly logger: Logger) {
    this.logger.info('Register HttpErrorExceptionFilter');
  }

  public catch(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction,
  ): void {
    if (!(error instanceof HttpError)) {
      return next(error);
    }

    this.logger.error(
      `[HttpErrorException]: ${req.path} # ${error.message}`,
      error,
    );

    res
      .status(StatusCodes.BAD_REQUEST)
      .json(createErrorObject(ApplicationError.CommonError, error.message));
  }
}
