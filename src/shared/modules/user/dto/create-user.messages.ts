export const CreateUserMessages = {
  email: {
    invalidFormat: 'email must be a valid address',
  },
  name: {
    invalidFormat: 'name is required',
    lengthField: 'min length is 1, max is 15',
  },
  avatarPath: {
    invalidFormat: 'avatarPath if present must be a string',
  },
  type: {
    invalid: 'type must be Regular or Pro',
  },
  password: {
    invalidFormat: 'password is required',
    lengthField: 'min length for password is 6, max is 12',
  },
} as const;
