import dayjs from 'dayjs';
import {
  generateRandomNumber,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import { MockServerData } from '../../types/index.js';
import { OfferGenerator } from './index.js';
import { FIRST_WEEK_DAY, LAST_WEEK_DAY } from '../../constants/index.js';

export class TSVOfferGenerator implements OfferGenerator {
  constructor(private readonly mockData: MockServerData) {}

  public generate(): string {
    const title = getRandomItem(this.mockData.titles);
    const description = getRandomItem(this.mockData.descriptions);
    const city = getRandomItem(this.mockData.cities);
    const preview = getRandomItem(this.mockData.previews);
    const photos = getRandomItems(this.mockData.photos);
    const housingType = getRandomItem(this.mockData.housingTypes);
    const facilities = getRandomItems(this.mockData.facilities);
    const authorName = getRandomItem(this.mockData.authorNames);
    const authorEmail = getRandomItem(this.mockData.authorEmails);
    const authorType = getRandomItem(this.mockData.authorTypes);

    const createdAt = dayjs()
      .subtract(generateRandomNumber(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const isPremium = getRandomItem(['true', 'false']);

    const rating = generateRandomNumber(1, 5, 1);
    const roomsNumber = generateRandomNumber(1, 8);
    const guestsNumber = generateRandomNumber(1, 10);
    const price = generateRandomNumber(100, 1e5);
    const latitude = generateRandomNumber(-90, 90, 5);
    const longitude = generateRandomNumber(-180, 180, 5);

    return [
      title,
      description,
      createdAt,
      city,
      preview,
      photos.join('; '),
      isPremium,
      rating,
      housingType,
      roomsNumber,
      guestsNumber,
      price,
      facilities.join('; '),
      latitude,
      longitude,
      authorName,
      authorEmail,
      authorType,
    ].join('\t');
  }
}
