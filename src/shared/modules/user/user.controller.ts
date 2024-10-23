import { inject, injectable } from 'inversify';
import { Response } from 'express';
import {
  BaseController,
  HttpError,
  HttpMethod,
} from '../../libs/rest/index.js';
import { Component } from '../../types/component.enum.js';
import { Logger } from '../../libs/logger/index.js';
import { CreateUserRequest } from './create-user-request.type.js';
import { UserService } from './user-service.interface.js';
import { Config, RestSchema } from '../../libs/config/index.js';
import { StatusCodes } from 'http-status-codes';
import { fillDTO } from '../../helpers/common.js';
import { UserRdo } from './rdo/user.rdo.js';
import { LoginUserRequest } from './login-user-request.type.js';

@injectable()
export class UserController extends BaseController {
  constructor(
    @inject(Component.Logger) protected readonly logger: Logger,
    @inject(Component.UserService) private readonly userService: UserService,
    @inject(Component.Config)
    private readonly configService: Config<RestSchema>,
  ) {
    super(logger);

    this.logger.info('Register routes for UserController…');

    this.addRoutes([
      {
        path: '/register',
        method: HttpMethod.post,
        handler: this.create,
      },
      {
        path: '/login',
        method: HttpMethod.post,
        handler: this.login,
      },
    ]);
  }

  public async create(
    { body }: CreateUserRequest,
    res: Response,
  ): Promise<void> {
    const existingUser = await this.userService.findByEmail(body.email);

    if (existingUser) {
      throw new HttpError(
        StatusCodes.CONFLICT,
        `User with email «${body.email}» exists.`,
        'UserController',
      );
    }

    const result = await this.userService.create(
      body,
      this.configService.get('SALT'),
    );

    this.created(res, fillDTO(UserRdo, result));
  }

  public async login({ body }: LoginUserRequest, _res: Response) {
    const user = await this.userService.findByEmail(body.email);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        `User with email ${body.email} not found.`,
        'UserController',
      );
    }

    throw new HttpError(
      StatusCodes.NOT_IMPLEMENTED,
      'Not implemented',
      'UserController',
    );
  }
}
