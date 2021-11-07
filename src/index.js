import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const parseFile = (filePath) => {
  const extension = path.extname(filePath);

  if (extension === '.json') {
    return JSON.parse(fs.readFileSync(filePath).toString());
  }

  throw new Error('Unknown file format');
};

const keyExists = (obj, key) => Object.hasOwnProperty.call(obj, key);

const genDiff = (file1Path, file2Path) => {
  let content1;
  let content2;

  try {
    content1 = parseFile(file1Path);
    content2 = parseFile(file2Path);
  } catch (e) {
    return e.message;
  }

  const keys1 = Object.keys(content1);
  const keys2 = Object.keys(content2);
  const allKeys = _.uniq(keys1.concat(keys2)).sort();

  const diff = [];

  for (const key of allKeys) {
    const value1 = content1[key];
    const value2 = content2[key];

    if (keyExists(content1, key) && !keyExists(content2, key)) {
      diff.push(`  - ${key}: ${value1}`);
      continue;
    }
    if (!keyExists(content1, key) && keyExists(content2, key)) {
      diff.push(`  + ${key}: ${value2}`);
      continue;
    }
    if (value1 === value2) {
      diff.push(`    ${key}: ${value1}`);
      continue;
    }
    diff.push(`  - ${key}: ${value1}`);
    diff.push(`  + ${key}: ${value2}`);
  }

  return ['{'].concat(diff, '}').join('\n');
};

export default genDiff;
