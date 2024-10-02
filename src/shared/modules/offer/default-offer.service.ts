import { inject, injectable } from 'inversify';
import { OfferService } from './offer-service.interface.js';
import { Component } from '../../types/index.js';
import { Logger } from '../../libs/logger/index.js';
import { types } from '@typegoose/typegoose';
import { OfferEntity } from './offer.entity.js';
import { CreateOfferDto } from './dto/create-offer.dto.js';

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
    return await this.offerModel.findById(offerId).exec();
  }
}
