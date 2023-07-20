import fs from 'fs';

export const convertFileToString = (fileName: string) => {
  if (!fs.existsSync(fileName)) {
    throw new Error(`Unable to open file '${fileName}'`);
  }
  const buffer = fs.readFileSync(fileName);
  return buffer.toString();
};
