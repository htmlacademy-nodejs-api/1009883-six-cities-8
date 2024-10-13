import { inject, injectable } from 'inversify';
import { Config, RestSchema } from '../shared/libs/config/index.js';
import { Logger } from '../shared/libs/logger/index.js';
import { Component } from '../shared/types/index.js';
import { DatabaseClient } from '../shared/libs/database-client/index.js';
import { getMongoURI } from '../shared/helpers/index.js';
import { OfferService } from '../shared/modules/offer/offer-service.interface.js';

@injectable()
export class RestApplication {
  constructor(
    @inject(Component.Logger) private readonly logger: Logger,
    @inject(Component.Config) private readonly config: Config<RestSchema>,
    @inject(Component.DatabaseClient)
    private readonly databaseClient: DatabaseClient,
    @inject(Component.OfferService) private readonly offerService: OfferService,
  ) {}

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

  public async init() {
    this.logger.info('Application initialization');
    this.logger.info(`Get value from env $PORT: ${this.config.get('PORT')}`);

    await this.initDb();

    const offers = await this.offerService.find();

    console.log(offers);
  }
}
