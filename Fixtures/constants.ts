export const AUTH_ERRORS = {
  emptyName: 'Please enter a name.',
  tooShort: 'Name must be at least 2 characters.',
  exists: 'This name is already taken',
  notFound: 'No account with this name',
} as const;

export const PROFILE_MESSAGES = {
  saved: 'Saved',
} as const;
