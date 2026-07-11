export const contractTemplate = {
  get: ({ type }: { type: string }) => `/contract-template/${type}`,

  update: ({ type }: { type: string }) => `/contract-template/${type}`,

  pdf: ({ type }: { type: string }) => `/contract-template/${type}/pdf`,
};
