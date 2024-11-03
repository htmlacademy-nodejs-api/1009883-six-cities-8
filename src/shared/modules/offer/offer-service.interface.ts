import { DocumentType } from '@typegoose/typegoose';
import { CreateOfferDto } from './dto/create-offer.dto.js';
import { UpdateOfferDto } from './dto/update-offer.dto.js';
import { OfferEntity } from './offer.entity.js';
import { Cities } from '../../types/entities/index.js';
import { DocumentExists } from '../../types/index.js';

export interface OfferService extends DocumentExists {
  create(dto: CreateOfferDto): Promise<DocumentType<OfferEntity>>;
  findById(
    offerId: string,
    userId?: string,
  ): Promise<DocumentType<OfferEntity> | null>;
  find(count?: number): Promise<DocumentType<OfferEntity>[]>;
  deleteById(offerId: string): Promise<DocumentType<OfferEntity> | null>;
  updateById(
    offerId: string,
    dto: UpdateOfferDto,
  ): Promise<DocumentType<OfferEntity> | null>;
  findPremiumByCity(city: Cities): Promise<DocumentType<OfferEntity>[]>;
  exists(documentId: string): Promise<boolean>;
  addToFavorite(offerId: string, userId: string): Promise<boolean>;
  removeFromFavorite(offerId: string, userId: string): Promise<boolean>;
  // TODO
  // findFavorite(): Promise<DocumentType<OfferEntity>[]>;
}
