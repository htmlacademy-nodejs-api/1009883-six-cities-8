export const CreateCommentValidationMessage = {
  text: {
    invalidFormat: 'text must be a string',
    minLength: 'Minimum text length must be 5',
    maxLength: 'Maximum text length must be 1024',
  },
  rating: {
    invalidFormat: 'rating must be an integer',
    minValue: 'Minimum rating is 1',
    maxValue: 'Maximum rating is 5',
  },
};
