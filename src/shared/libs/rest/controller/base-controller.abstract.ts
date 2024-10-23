import { injectable } from 'inversify';
import { Controller } from './controller.interface.js';
import { Response, Router } from 'express';
import { Logger } from '../../logger/index.js';
import { Route } from '../types/route.interface.js';
import { StatusCodes } from 'http-status-codes';
import aAsyncHandler from 'express-async-handler';
import { HttpMethod } from '../types/http-method.enum.js';

@injectable()
export abstract class BaseController implements Controller {
  private readonly DEFAULT_CONTENT_TYPE = 'application/json';
  private readonly _router: Router = Router();

  constructor(protected readonly logger: Logger) {}

  get router() {
    return this._router;
  }

  public addRoutes(routes: Route | Route[]) {
    for (const route of [routes].flat(2)) {
      this.addRoute(route);
    }
  }

  public addRoute(route: Route) {
    route.method ??= HttpMethod.get;
    const wrapperAsyncHandler = aAsyncHandler(route.handler.bind(this));
    this._router[route.method](route.path, wrapperAsyncHandler);
    this.logger.info(
      `Route registered: ${route.method.toUpperCase()} ${route.path}`,
    );
  }

  public send<T>(res: Response, statusCode: number, data: T) {
    res.type(this.DEFAULT_CONTENT_TYPE).status(statusCode).json(data);
  }

  public created<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.CREATED, data);
  }

  public noContent<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.NO_CONTENT, data);
  }

  public ok<T>(res: Response, data: T): void {
    this.send(res, StatusCodes.OK, data);
  }
}
