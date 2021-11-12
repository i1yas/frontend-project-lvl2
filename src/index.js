import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parsers.js';
import getFormatter from './formatters.js';

const getValuesDiff = (oldObj, newObj) => {
  const isPrimitive = (value) => !(value instanceof Object);

  const iter = (obj1, obj2, depth) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const allKeys = [].concat(keys1, keys2);
    const uniqKeys = _.uniq(allKeys).sort();

    return uniqKeys.flatMap((key) => {
      const v1 = obj1[key];
      const v2 = obj2[key];

      const isEqual = isPrimitive(v1) && isPrimitive(v2) && v1 === v2;
      if (isEqual) {
        return { key, value: v1, type: 'same' };
      }

      const isBothObjects = !isPrimitive(v1) && !isPrimitive(v2);
      const isChanged = !isBothObjects;
      if (isChanged) {
        return [
          _.has(obj1, key) && { key, value: v1, type: 'removed' },
          _.has(obj2, key) && { key, value: v2, type: 'added' },
        ].filter(Boolean);
      }

      return { key, children: iter(v1, v2, depth + 1), type: 'same' };
    });
  };

  return iter(oldObj, newObj, 1);
};

const readFile = (filePath) => {
  const fullPath = path.resolve(filePath);
  return fs.readFileSync(fullPath).toString();
};

const genDiff = (oldFilePath, newFilePath, formatterType) => {
  const parse = getParser(path.extname(oldFilePath));

  const oldObj = parse(readFile(oldFilePath));
  const newObj = parse(readFile(newFilePath));
  const diff = getValuesDiff(oldObj, newObj);

  const format = getFormatter(formatterType);
  return format(diff);
};

export default genDiff;
