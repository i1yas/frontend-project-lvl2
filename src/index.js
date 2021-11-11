import fs from 'fs';
import path from 'path';
import _ from 'lodash';
import getParser from './parsers.js';

const getValuesDiff = (oldObj, newObj) => {
  const space = ' ';
  const indent = space.repeat(4);

  const isPrimitive = (value) => !(value instanceof Object);

  const getIndent = (depth, symbol = ' ') => space.repeat(4 * (depth - 1)) + space.repeat(2) + symbol + space;

  const getKVPair = (key, value) => `${key}: ${value}`;

  const stringify = (value, depth) => {
    if (isPrimitive(value)) return value;
    const obj = value;
    const keys = Object.keys(obj).sort();
    const lines = keys.map((key) => {
      const nestedValue = stringify(obj[key], depth + 1);
      return getIndent(depth) + getKVPair(key, nestedValue);
    });
    return ['{', ...lines, `${indent.repeat(depth - 1)}}`].join('\n');
  };

  const iter = (obj1, obj2, depth) => {
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    const allKeys = [].concat(keys1, keys2);
    const uniqKeys = _.uniq(allKeys).sort();

    const diffLines = uniqKeys.flatMap((key) => {
      const v1 = obj1[key];
      const v2 = obj2[key];
      const isBothPrimitive = isPrimitive(v1) && isPrimitive(v2);
      const isBothObjects = !isPrimitive(v1) && !isPrimitive(v2);

      if (isBothPrimitive && v1 === v2) { return getIndent(depth) + getKVPair(key, v1); }

      if (!isBothObjects) {
        return [
          _.has(obj1, key) && getIndent(depth, '-') + getKVPair(key, stringify(v1, depth + 1)),
          _.has(obj2, key) && getIndent(depth, '+') + getKVPair(key, stringify(v2, depth + 1)),
        ].filter(Boolean);
      }

      return getIndent(depth) + getKVPair(key, iter(v1, v2, depth + 1));
    });

    return ['{', ...diffLines, `${indent.repeat(depth - 1)}}`].join('\n');
  };

  return iter(oldObj, newObj, 1);
};

const readFile = (filePath) => {
  const fullPath = path.resolve(filePath);
  return fs.readFileSync(fullPath).toString();
};

const genDiff = (oldFilePath, newFilePath) => {
  const parse = getParser(path.extname(oldFilePath));

  const oldObj = parse(readFile(oldFilePath));
  const newObj = parse(readFile(newFilePath));
  const diff = getValuesDiff(oldObj, newObj);
  return diff;
};

export default genDiff;
