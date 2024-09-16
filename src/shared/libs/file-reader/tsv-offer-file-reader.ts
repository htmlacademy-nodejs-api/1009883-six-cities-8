import { readFileSync } from 'node:fs';
import {
  Cities,
  Facilities,
  HousingType,
  Offer,
  Photos,
  User,
  UserType,
} from '../../types/entities/index.js';
import { FileReader } from './file-reader.interface.js';

export class TSVOfferFileReader implements FileReader {
  private rawData = '';

  constructor(private readonly filename: string) {}

  private validateRawData(): void {
    if (!this.rawData) {
      throw new Error('File was not read');
    }
  }

  private parseRawDataToOffers(): Offer[] {
    return this.rawData
      .split('\n')
      .filter((row, index) => row.trim().length > 0 && index > 0)
      .map((line) => this.parseLineToOffer(line));
  }

  private parseLineToOffer(line: string): Offer {
    const [
      title,
      description,
      dateAdded,
      city,
      preview,
      photos,
      isPremium,
      isFavorite,
      rating,
      housingType,
      roomsNumber,
      guestsNumber,
      price,
      facilities,
      commentsCount,
      latitude,
      longitude,
      authorName,
      authorEmail,
      authorType,
    ] = line.split('\t');

    return {
      title,
      description,
      dateAdded: new Date(dateAdded),
      city: city as Cities,
      preview,
      photos: this.parsePhotos(photos),
      isPremium: !!isPremium,
      isFavorite: !!isFavorite,
      rating: this.parseRating(rating),
      housingType: housingType as HousingType,
      roomsNumber: this.parseRoomsNumber(roomsNumber),
      guestsNumber: this.parseGuestsNumber(guestsNumber),
      price: this.parsePrice(price),
      facilities: this.parseFacilities(facilities),
      author: this.parseUser(authorName, authorEmail, authorType as UserType),
      commentsCount: this.parseCommentsCount(commentsCount),
      coordinates: {
        latitude: this.parseCoord(latitude),
        longitude: this.parseCoord(longitude),
      },
    };
  }

  private parsePhotos(photosString: string): Photos {
    return photosString.split('; ') as Photos;
  }

  private parseRating(ratingString: string): number {
    return Number.parseFloat(ratingString);
  }

  private parseRoomsNumber(roomsString: string): number {
    return Number.parseInt(roomsString, 10);
  }

  private parseGuestsNumber(guestsString: string): number {
    return Number.parseInt(guestsString, 10);
  }

  private parsePrice(priceString: string): number {
    return Number.parseInt(priceString, 10);
  }

  private parseFacilities(facilitiesString: string): Facilities[] {
    return facilitiesString.split('; ') as Facilities[];
  }

  private parseUser(name: string, email: string, type: UserType): User {
    return { name, email, type };
  }

  private parseCommentsCount(commentsCountString: string): number {
    return Number.parseInt(commentsCountString, 10);
  }

  private parseCoord(coordString: string): number {
    return Number.parseFloat(coordString);
  }

  public read(): void {
    this.rawData = readFileSync(this.filename, { encoding: 'utf-8' });
  }

  public toArray(): Offer[] {
    this.validateRawData();
    return this.parseRawDataToOffers();
  }
}
