import { getErrorMessage } from '../../shared/helpers/index.js';
import {
  DatabaseClient,
  MongoDatabaseClient,
} from '../../shared/libs/database-client/index.js';
import { TSVOfferFileReader } from '../../shared/libs/file-reader/index.js';
import { ConsoleLogger } from '../../shared/libs/logger/console.logger.js';
import { Logger } from '../../shared/libs/logger/index.js';
import {
  DefaultOfferService,
  OfferModel,
  OfferService,
} from '../../shared/modules/offer/index.js';
import {
  DefaultUserService,
  UserModel,
  UserService,
} from '../../shared/modules/user/index.js';
import { Offer } from '../../shared/types/entities/index.js';
import { DEFAULT_USER_PASSWORD } from './command.constant.js';
import { Command } from './command.interface.js';

export class ImportCommand implements Command {
  public readonly name: string = '--import';
  private userService: UserService;
  private offerService: OfferService;
  private databaseClient: DatabaseClient;
  private logger: Logger;
  private salt: string;

  constructor() {
    this.onImportedOffer = this.onImportedOffer.bind(this);
    this.onCompleteImport = this.onCompleteImport.bind(this);

    this.logger = new ConsoleLogger();
    this.userService = new DefaultUserService(this.logger, UserModel);
    this.offerService = new DefaultOfferService(
      this.logger,
      OfferModel,
      this.userService,
    );
    this.databaseClient = new MongoDatabaseClient(this.logger);
  }

  private async onImportedOffer(offer: Offer, resolve: () => void) {
    await this.saveOffer(offer);
    resolve();
  }

  private async saveOffer(offer: Offer) {
    const user = await this.userService.findOrCreate(
      {
        ...offer.author,
        password: DEFAULT_USER_PASSWORD,
      },
      this.salt,
    );

    await this.offerService.create({
      createdAt: offer.createdAt,
      title: offer.title,
      description: offer.description,
      city: offer.city,
      preview: offer.preview,
      photos: offer.photos,
      isPremium: offer.isPremium,
      // rating: offer.rating,
      housingType: offer.housingType,
      roomsNumber: offer.roomsNumber,
      guestsNumber: offer.guestsNumber,
      price: offer.price,
      facilities: offer.facilities,
      author: user.id,
      latitude: offer.latitude,
      longitude: offer.longitude,
    });
  }

  private onCompleteImport(count: number) {
    console.info(`${count} rows imported.`);

    this.databaseClient.disconnect();
  }

  public async execute(...parameters: string[]): Promise<void> {
    const [filename, mongoUri, salt] = parameters;

    if (!filename || !mongoUri || !salt) {
      console.error(`Filename, mongo uri or salt were not specified`);
      return;
    }

    this.salt = salt;

    this.databaseClient.connect(mongoUri);

    const fileReader = new TSVOfferFileReader(filename.trim());

    fileReader.on('line', this.onImportedOffer);
    fileReader.on('end', this.onCompleteImport);

    try {
      await fileReader.read();
    } catch (error) {
      console.error(`Can't import data from file: ${filename}`);
      console.error(getErrorMessage(error));
    }
  }
}
