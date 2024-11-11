export class CreateUserDto {
  public email!: string;

  public name!: string;

  public avatarPath?: string;

  public type!: string;

  public password!: string;
}
