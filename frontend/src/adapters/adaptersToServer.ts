import { CreateUserDto } from '../dto/user/create-user.dto';
import { UserRegister } from '../types/types';

export const adaptRegisterToServer = (user: UserRegister): CreateUserDto => ({
  email: user.email,
  name: user.name,
  type: user.type,
  password: user.password,
});
