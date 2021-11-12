#!/usr/bin/env node

import fs from 'fs';
import { program } from 'commander';
import genDiff from '../src/index.js';

const packageInfo = JSON.parse(fs.readFileSync('./package.json').toString());

program
  .version(packageInfo.version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format', 'stylish')
  .argument('<file1>')
  .argument('<file2>')
  .action((file1, file2) => {
    console.log(genDiff(file1, file2));
  });

program.parse();
