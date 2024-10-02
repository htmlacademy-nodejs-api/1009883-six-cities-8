import EventEmitter from 'node:events';
import {
  Cities,
  Facilities,
  HousingType,
  Offer,
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
      createdAt,
      city,
      preview,
      photos,
      isPremium,
      rating,
      housingType,
      roomsNumber,
      guestsNumber,
      price,
      facilities,
      latitude,
      longitude,
      authorName,
      authorEmail,
      authorType,
    ] = line.split('\t');

    return {
      title,
      description,
      createdAt: new Date(createdAt),
      city: city as Cities,
      preview,
      photos: photos.split('; '),
      isPremium: isPremium.toLowerCase() === 'true',
      rating: Number(rating),
      housingType: housingType as HousingType,
      roomsNumber: Number(roomsNumber),
      guestsNumber: Number(guestsNumber),
      price: Number(price),
      facilities: facilities.split('; ') as Facilities[],
      author: {
        name: authorName,
        email: authorEmail,
        type: authorType as UserType,
      },
      latitude: Number(latitude),
      longitude: Number(longitude),
    };
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
      nextLinePosition = remainingData.indexOf('\n');

      while (nextLinePosition >= 0) {
        const line = remainingData.slice(0, nextLinePosition);
        remainingData = remainingData.slice(++nextLinePosition);
        importedRowCount++;

        const parsedOffer = this.parseLineToOffer(line);
        this.emit('line', parsedOffer);

        nextLinePosition = remainingData.indexOf('\n');
      }
    }

    this.emit('end', importedRowCount);
  }
}
