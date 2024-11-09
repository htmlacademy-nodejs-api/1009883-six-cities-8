import { inject, injectable } from 'inversify';
import express, { Express } from 'express';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import {
  Controller,
  ExceptionFilter,
  ParseTokenMiddleware,
} from '../shared/libs/rest/index.js';

@injectable()
export class RestApplication {
  private readonly server: Express;

  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Component.ExceptionFilter)
    private readonly appExceptionFilter: ExceptionFilter,
    @inject(Component.UserController)
    private readonly userController: Controller,
    @inject(Component.OfferController)
    private readonly offerController: Controller,
    @inject(Component.CommentController)
    private readonly commentController: Controller,
    @inject(Component.AuthExceptionFilter)
    private readonly authExceptionFilter: ExceptionFilter,
    @inject(Component.HttpExceptionFilter)
    private readonly httpExceptionFilter: ExceptionFilter,
    @inject(Component.ValidationExceptionFilter)
    private readonly validationExceptionFilter: ExceptionFilter,
  ) {
    this.server = express();
  }

  private async initDb() {
    this.logger.info('Init database…');

    const mongoUri = getMongoURI(
      this.config.get('DB_USER'),
      this.config.get('DB_PASSWORD'),
      this.config.get('DB_HOST'),
      this.config.get('DB_PORT'),
      this.config.get('DB_NAME'),
    );

    await this.databaseClient.connect(mongoUri);

    this.logger.info('Init database completed');
  }

  private initServer() {
    this.logger.info('Try to init server…');

    const port = this.config.get('PORT');
    this.server.listen(port);

    this.logger.info(`🚀 Server started on http://localhost:${port}`);
  }

  private initControllers() {
    this.logger.info('Init controllers');
    this.server.use('/users', this.userController.router);
    this.server.use('/offers', this.offerController.router);
    this.server.use('/comments', this.commentController.router);
    this.logger.info('Controller initialization completed');
  }

  private initMiddleware() {
    this.logger.info('Init app-level middleware');

    const authenticateMiddleware = new ParseTokenMiddleware(
      this.config.get('JWT_SECRET'),
    );

    this.server.use(express.json());
    this.server.use(
      '/upload',
      express.static(this.config.get('UPLOAD_DIRECTORY')),
    );
    this.server.use(
      authenticateMiddleware.execute.bind(authenticateMiddleware),
    );
    this.logger.info('App-level middleware initialization completed');
  }

  private initExceptionFilters() {
    this.logger.info('Init exception filters');
    this.server.use(
      this.authExceptionFilter.catch.bind(this.authExceptionFilter),
    );
    this.server.use(
      this.validationExceptionFilter.catch.bind(this.validationExceptionFilter),
    );
    this.server.use(
      this.httpExceptionFilter.catch.bind(this.httpExceptionFilter),
    );
    this.server.use(
      this.appExceptionFilter.catch.bind(this.appExceptionFilter),
    );
    this.logger.info('Exception filters initialization compleated');
  }

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    await this.initDb();

    this.initMiddleware();

    this.initControllers();

    this.initExceptionFilters();

    this.initServer();
  }
}
