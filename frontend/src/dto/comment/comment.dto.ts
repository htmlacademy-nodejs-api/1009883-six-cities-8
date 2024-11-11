import { UserDto } from '../user/user.dto';

export class CommentDto {
  text!: string;

  rating!: number;

  author!: UserDto;

  createdAt!: string;
}
