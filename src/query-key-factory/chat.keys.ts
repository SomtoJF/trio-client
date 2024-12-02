export const chatKeys = {
  all: ['chat'],
  getOne: (id: string) => [...chatKeys.all, id] as const,
  getMany: () => [...chatKeys.all, 'many'] as const,
};
