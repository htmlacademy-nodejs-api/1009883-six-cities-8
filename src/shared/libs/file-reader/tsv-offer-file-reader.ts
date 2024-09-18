import EventEmitter from 'node:events';
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
import { createReadStream } from 'node:fs';

export class TSVOfferFileReader extends EventEmitter implements FileReader {
  private CHUNK_SIZE = 16384; // 16KB

  constructor(private readonly filename: string) {
    super();
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

  public async read(): Promise<void> {
    const readStream = createReadStream(this.filename, {
      highWaterMark: this.CHUNK_SIZE,
      encoding: 'utf-8',
    });

    let remainingData = '';
    let nextLinePosition = -1;
    let importedRowCount = 0;

    for await (const chunk of readStream) {
      remainingData += chunk.toString();

      while ((nextLinePosition = remainingData.indexOf('\n')) >= 0) {
        const line = remainingData.slice(0, nextLinePosition);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(line);
        this.emit('line', parsedOffer);
      }
    }

    this.emit('end', importedRowCount);
  }
}
