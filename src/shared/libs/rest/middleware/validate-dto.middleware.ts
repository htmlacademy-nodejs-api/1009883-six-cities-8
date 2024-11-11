import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';

import { Middleware } from './middleware.interface.js';
import { ValidationError } from '../errors/index.js';
import { reduceValidationErrors } from '../../../helpers/index.js';

export class ValidateDtoMiddleware implements Middleware {
  constructor(
    private dto: ClassConstructor<object>,
    private type: 'body' | 'query' | 'params' = 'body',
  ) {}

  public async execute(
    req: Request,
    _res: Response,
    next: NextFunction,
  ): Promise<void> {
    const plain = req[this.type];
    const dtoInstance = plainToInstance(this.dto, plain, {
      excludeExtraneousValues: true,
    });
    const errors = await validate(dtoInstance);

    if (errors.length > 0) {
      throw new ValidationError(
        `Validation error: ${req.path}`,
        reduceValidationErrors(errors),
      );
    }

    req[this.type] = dtoInstance;

    next();
  }
}
