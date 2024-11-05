import { createHmac } from 'node:crypto';

export const createSHA256 = (line: string, salt: string): string => {
  const shaHasher = createHmac('sha256', salt);
  return shaHasher.update(line).digest('hex');
};
