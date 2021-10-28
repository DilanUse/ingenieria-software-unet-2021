export const generateMongoObjectId = () => {
  // eslint-disable-next-line no-bitwise
  const timestamp = (new Date().getTime() / 1000 | 0).toString(16);
  // eslint-disable-next-line no-bitwise
  return timestamp + 'xxxxxxxxxxxxxxxx'.replace(/[x]/g, () => (Math.random() * 16 | 0).toString(16)).toLowerCase();
};
