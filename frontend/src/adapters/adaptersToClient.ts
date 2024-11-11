import { CityLocation, UserType } from '../const';
import { CommentDto } from '../dto/comment/comment.dto';
import { OfferDto } from '../dto/offer/offer.dto';
import { UserDto } from '../dto/user/user.dto';
import { Comment, Offer, Type, User } from '../types/types';

export const adaptUserToClient = (user: UserDto): User => ({
  name: user.name,
  type: user.type.toLowerCase() as UserType,
  email: user.email,
  avatarUrl: user.avatarPath || '',
});

export const adaptOfferToClient = (offer: OfferDto): Offer => ({
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
  type: offer.housingType.toLowerCase() as Type,
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
});

export const adaptOffersToClient = (offers: OfferDto[]): Offer[] =>
  offers
    .filter((offer) => offer.author !== null)
    .map((offer) => adaptOfferToClient(offer));

export const adaptCommentToClient = (comment: CommentDto): Comment => ({
  id: '',
  comment: comment.text,
  date: comment.createdAt,
  rating: comment.rating,
  user: adaptUserToClient(comment.author),
});

export const adaptCommentsToClient = (comments: CommentDto[]): Comment[] =>
  comments.map((comment) => adaptCommentToClient(comment));
