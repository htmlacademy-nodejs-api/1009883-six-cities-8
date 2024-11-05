import { Expose, Type } from 'class-transformer';
import { IsInt, IsOptional } from 'class-validator';
import { GetOffersQueryValidationMessage } from './get-offers-query-params.messages.js';

export class GetOffersQueryDto {
  @IsOptional()
  @IsInt({ message: GetOffersQueryValidationMessage.count.invalidFormat })
  @Type(() => Number)
  @Expose()
  count?: number;
}
