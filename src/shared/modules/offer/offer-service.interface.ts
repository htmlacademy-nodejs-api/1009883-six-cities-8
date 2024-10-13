import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDtoOfferDto } from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { Cities } from '../../types/entities/index.js';

export interface OfferService {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateOfferDtoOfferDto,
  ): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: Cities): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
  // TODO
  // findFavorite(): Promise<DocumentType<OfferEntity>[]>;
}
