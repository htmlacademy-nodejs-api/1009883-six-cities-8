import dayjs from 'dayjs';
import {
  generateRandomNumber,
  getRandomItem,
  getRandomItems,
} from '../../helpers/index.js';
import { MockServerData } from '../../types/index.js';
import { OfferGenerator } from './index.js';

const FIRST_WEEK_DAY = 1;
const LAST_WEEK_DAY = 7;

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

    const dateAdded = dayjs()
      .subtract(generateRandomNumber(FIRST_WEEK_DAY, LAST_WEEK_DAY), 'day')
      .toISOString();

    const isPremium = getRandomItem(['true', 'false']);
    const isFavorite = getRandomItem(['true', 'false']);

    const rating = generateRandomNumber(1, 5, 1);
    const roomsNumber = generateRandomNumber(1, 8);
    const guestsNumber = generateRandomNumber(1, 10);
    const price = generateRandomNumber(100, 1e5);
    const commentsCount = generateRandomNumber(0, 500);
    const latitude = generateRandomNumber(-90, 90, 5);
    const longitude = generateRandomNumber(-180, 180, 5);

    return [
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
    ].join('\t');
  }
}
