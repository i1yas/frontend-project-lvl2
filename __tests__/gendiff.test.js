import fs from 'fs';
import genDiff from '../src';

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
