import { UserType } from '../../../types/entities/index.js';

export class UpdateUserDto {
  public name?: string;
  public avatarPath?: string;
  public type?: UserType;
}
