export const UpdateOfferValidationMessage = {
  createdAt: {
    invalidFormat: 'createdAt must be a valid ISO date',
  },
  title: {
    invalidFormat: 'title must be a string',
    minLength: 'Minimum title length must be 10',
    maxLength: 'Maximum title length must be 100',
  },
  description: {
    invalidFormat: 'description must be a string',
    minLength: 'Minimum description length must be 20',
    maxLength: 'Maximum description length must be 1024',
  },
  city: {
    invalid: 'The city specified is not supported',
  },
  preview: {
    invalidFormat: 'description must be a string',
    maxLength: 'preview field must not be longer than 256 characters',
  },
  photos: {
    invalidFormat: 'photos field must be an array of strings',
    maxLength:
      'All photos in photos array must not be longer than 256 characters',
  },
  isPremium: {
    invalid: 'isPremium field must be boolean',
  },
  housingType: {
    invalid: 'The housingType specified is not supported',
  },
  roomsNumber: {
    invalidFormat: 'roomsNumber must be an integer',
    minValue: 'Minimum roomsNumber is 1',
    maxValue: 'Maximum roomsNumber is 8',
  },
  guestsNumber: {
    invalidFormat: 'guestsNumber must be an integer',
    minValue: 'Minimum guestsNumber is 1',
    maxValue: 'Maximum guestsNumber is 10',
  },
  price: {
    invalidFormat: 'Price must be a number',
    minValue: 'Minimum price is 100',
    maxValue: 'Maximum price is 100000',
  },
  facilities: {
    invalidFormat: 'facilities field must be an array',
    invalid: 'One or more facilities specified is not supported.',
  },
  author: {
    invalidId: 'author field must be a valid id',
  },
  latitude: {
    invalidFormat: 'latitude field must be a number',
    minValue: 'Minimum latitude is -90',
    maxValue: 'Maximum latitude is 90',
  },
  longitude: {
    invalidFormat: 'longitude field must be a number',
    minValue: 'Minimum longitude is -180',
    maxValue: 'Maximum longitude is 180',
  },
} as const;
