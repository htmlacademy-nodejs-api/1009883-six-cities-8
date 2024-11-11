import { CityLocation, UserType } from '../const';
import { OfferDto } from '../dto/offer/offer.dto';
import { UserDto } from '../dto/user/user.dto';
import { Offer, Type, User } from '../types/types';

export const adaptUserToClient = (user: UserDto): User => ({
  name: user.name,
  type: user.type.toLowerCase() as UserType,
  email: user.email,
  avatarUrl: user.avatarPath || '',
});

export const adaptOffersToClient = (offers: OfferDto[]): Offer[] =>
  offers
    .filter((offer) => offer.author !== null)
    .map((offer) => ({
      id: offer.id,
      price: offer.price,
      rating: offer.rating,
      title: offer.title,
      isPremium: offer.isPremium,
      isFavorite: offer.isFavorite,
      location: {
        latitude: offer.latitude,
        longitude: offer.longitude,
      },
      previewImage: offer.preview,
      type: offer.housingType as Type,
      bedrooms: offer.roomsNumber,
      description: offer.description,
      goods: offer.facilities,
      images: offer.photos,
      maxAdults: offer.guestsNumber,
      host: adaptUserToClient(offer.author),
      city: {
        name: offer.city,
        location: CityLocation[offer.city],
      },
    }));
