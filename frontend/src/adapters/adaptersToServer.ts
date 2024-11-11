import { CreateCommentDto } from '../dto/comment/create-comment.dto';
import { CreateOfferDto } from '../dto/offer/create-offer.dto';
import { CreateUserDto } from '../dto/user/create-user.dto';
import { CommentAuth, NewOffer, UserRegister } from '../types/types';

const housingTypesToServerMap = {
  apartment: 'Apartment',
  room: 'Room',
  house: 'House',
  hotel: 'Hotel',
};

export const adaptRegisterToServer = (user: UserRegister): CreateUserDto => ({
  email: user.email,
  name: user.name,
  type: user.type,
  password: user.password,
});

export const adaptCreateOfferToServer = (offer: NewOffer): CreateOfferDto => ({
  title: offer.title,
  description: offer.description,
  city: offer.city.name,
  preview: offer.previewImage,
  photos: offer.images,
  isPremium: offer.isPremium,
  housingType: housingTypesToServerMap[offer.type],
  roomsNumber: offer.bedrooms,
  guestsNumber: offer.maxAdults,
  price: offer.price,
  facilities: offer.goods,
  latitude: offer.location.latitude,
  longitude: offer.location.longitude,
});

export const adaptCreateCommentToServer = (
  comment: CommentAuth,
): CreateCommentDto => ({
  text: comment.comment,
  rating: comment.rating,
});
