import { IsEmail, IsString, Length } from 'class-validator';
import { CreateLoginUserMessage } from './login-user.messages.js';

export class LoginUserDto {
  @IsEmail({}, { message: CreateLoginUserMessage.email.invalidFormat })
  public email: string;

  @IsString({ message: CreateLoginUserMessage.password.invalidFormat })
  @Length(6, 12, { message: CreateLoginUserMessage.password.lengthField })
  public password: string;
}
