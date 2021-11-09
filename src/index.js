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

const genDiff = (oldFilePath, newFilePath) => {
  let oldContent;
  let newContent;

  try {
    oldContent = parseFile(oldFilePath);
    newContent = parseFile(newFilePath);
  } catch (e) {
    return e.message;
  }

  const oldKeys = Object.keys(oldContent);
  const newKeys = Object.keys(newContent);
  const allKeys = _.uniq([].concat(oldKeys, newKeys)).sort();

  const diff = allKeys.reduce((acc, key) => {
    const oldValue = oldContent[key];
    const newValue = newContent[key];

    if (_.has(oldContent, key) && !_.has(newContent, key)) {
      return acc.concat(`  - ${key}: ${oldValue}`);
    }
    if (!_.has(oldContent, key) && _.has(newContent, key)) {
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

  return ['{', diff, '}'].flat().join('\n');
};

export default genDiff;
