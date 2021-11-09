import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parsers.js';

const getObjectsDiff = (oldObj, newObj) => {
  const oldKeys = Object.keys(oldObj);
  const newKeys = Object.keys(newObj);
  const allKeys = [].concat(oldKeys, newKeys);
  const uniqKeys = _.uniq(allKeys).sort();

  const diff = uniqKeys.reduce((acc, key) => {
    const oldValue = oldObj[key];
    const newValue = newObj[key];

    if (_.has(oldObj, key) && !_.has(newObj, key)) {
      return acc.concat(`  - ${key}: ${oldValue}`);
    }
    if (!_.has(oldObj, key) && _.has(newObj, key)) {
      return acc.concat(`  + ${key}: ${newValue}`);
    }
    if (oldValue === newValue) {
      return acc.concat(`    ${key}: ${oldValue}`);
    }

    return acc.concat(
      `  - ${key}: ${oldValue}`,
      `  + ${key}: ${newValue}`,
    );
  }, []);

  return diff;
};

const readFile = (filePath) => {
  const fullPath = path.resolve(filePath);
  return fs.readFileSync(fullPath).toString();
};

const genDiff = (oldFilePath, newFilePath) => {
  const parse = getParser(path.extname(oldFilePath));

  try {
    const oldObj = parse(readFile(oldFilePath));
    const newObj = parse(readFile(newFilePath));
    const diff = getObjectsDiff(oldObj, newObj);
    return ['{', diff, '}'].flat().join('\n');
  } catch (e) {
    return e.message;
  }
};

export default genDiff;
