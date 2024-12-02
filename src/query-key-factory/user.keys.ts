export const userKeys = {
  all: ['user'],
  currentUser: () => [...userKeys.all, 'current-user'] as const,
};
