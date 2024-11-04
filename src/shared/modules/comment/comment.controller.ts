import { inject, injectable } from 'inversify';
import { Request, Response } from 'express';
import {
  BaseController,
  DocumentExistsMiddleware,
  ValidateObjectIdMiddleware,
} from '../../libs/rest/index.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { CommentService } from './comment-service.interface.js';
import { OfferService } from '../offer/offer-service.interface.js';
import { ParamOfferId } from './type/param-offerid.type.js';
import { fillDTO } from '../../helpers/index.js';
import { CommentRdo } from './rdo/comment.rdo.js';

@injectable()
export class CommentController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.CommentService)
    protected readonly commentService: CommentService,
    @inject(Component.OfferService)
    protected readonly offerService: OfferService,
  ) {
    super(logger);

    this.logger.info('Register routes for CommentController');

    const offerIdMiddlewares = [
      new ValidateObjectIdMiddleware('offerId'),
      new DocumentExistsMiddleware(this.offerService, 'Offer', 'offerId'),
    ];

    this.addRoutes([
      {
        path: '/:offerId',
        handler: this.getByOfferId,
        middlewares: offerIdMiddlewares,
      },
    ]);
  }

  public async getByOfferId({ params }: Request<ParamOfferId>, res: Response) {
    const comments = await this.commentService.findByOfferId(params?.offerId);

    this.ok(res, fillDTO(CommentRdo, comments));
  }
}
