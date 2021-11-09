import fs from 'fs';
import path from 'path';
import _ from 'lodash';

const parseFile = (filePath) => {
  const extension = path.extname(filePath);
  const fullPath = path.resolve(filePath);

  if (extension === '.json') {
    return JSON.parse(fs.readFileSync(fullPath).toString());
  }

  throw new Error('Unknown file format');
};

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

const genDiff = (oldFilePath, newFilePath) => {
  try {
    const oldObj = parseFile(oldFilePath);
    const newObj = parseFile(newFilePath);
    const diff = getObjectsDiff(oldObj, newObj);
    return ['{', diff, '}'].flat().join('\n');
  } catch (e) {
    return e.message;
  }
};

export default genDiff;
