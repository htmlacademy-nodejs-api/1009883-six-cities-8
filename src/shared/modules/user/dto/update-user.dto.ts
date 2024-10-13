import { UserType } from '../../../types/entities/index.js';

export class updateUserDto {
  public name?: string;
  public avatarPath?: string;
  public type?: UserType;
}
