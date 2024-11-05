import { Expose, Type } from 'class-transformer';
import { UserRdo } from '../../user/index.js';

export class CommentRdo {
  @Expose()
  text: string;

  @Expose()
  rating: number;

  @Expose()
  @Type(() => UserRdo)
  author: UserRdo;

  @Expose()
  createdAt?: Date;
}
