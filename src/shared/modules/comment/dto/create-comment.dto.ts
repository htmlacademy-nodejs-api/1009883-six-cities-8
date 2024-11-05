import { Expose } from 'class-transformer';
import {
  IsInt,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { CreateCommentValidationMessage } from './create-comment.messages.js';

export class CreateCommentDto {
  @IsString({ message: CreateCommentValidationMessage.text.invalidFormat })
  @MinLength(10, { message: CreateCommentValidationMessage.text.minLength })
  @MaxLength(100, { message: CreateCommentValidationMessage.text.maxLength })
  @Expose()
  public text: string;

  @IsInt({ message: CreateCommentValidationMessage.rating.invalidFormat })
  @Min(1, { message: CreateCommentValidationMessage.rating.minValue })
  @Max(5, { message: CreateCommentValidationMessage.rating.maxValue })
  @Expose()
  public rating: number;

  public author: string;

  public offer: string;
}
