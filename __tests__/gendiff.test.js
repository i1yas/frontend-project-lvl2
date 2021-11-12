import fs from 'fs';
import genDiff from '../src';
import getParser from '../src/parsers';

test('fixtures equal', () => {
  const read = (n, ext) => {
    const fileContent = fs.readFileSync(`./__fixtures__/file${n}${ext}`).toString();
    const parse = getParser(ext);
    return parse(fileContent);
  };

  expect(read(1, '.json')).toEqual(read(1, '.yml'));
  expect(read(2, '.json')).toEqual(read(2, '.yml'));
});

test('diff of 2 json files', () => {
  const filePath1 = './__fixtures__/file1.json';
  const filePath2 = './__fixtures__/file2.json';

  const diff = genDiff(filePath1, filePath2);

  const expectedDiff = fs.readFileSync('./__fixtures__/diff.1.2.txt').toString();

  expect(diff).toBe(expectedDiff);
});

test('diff of 2 yaml files', () => {
  const filePath1 = './__fixtures__/file1.yml';
  const filePath2 = './__fixtures__/file2.yml';

  const diff = genDiff(filePath1, filePath2);

  const expectedDiff = fs.readFileSync('./__fixtures__/diff.1.2.txt').toString();
  expect(diff).toBe(expectedDiff);
});

test('plain formatter', () => {
  const filePath1 = './__fixtures__/file1.yml';
  const filePath2 = './__fixtures__/file2.yml';

  const diff = genDiff(filePath1, filePath2, 'plain');

  const expectedDiff = fs.readFileSync('./__fixtures__/diff.plain.1.2.txt').toString();
  expect(diff).toBe(expectedDiff);
});
