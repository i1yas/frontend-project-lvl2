#!/usr/bin/env node

import fs from 'fs';
import { program } from 'commander';

const packageInfo = JSON.parse(fs.readFileSync('./package.json').toString());

program
  .version(packageInfo.version)
  .description('Compares two configuration files and shows a difference.')
  .option('-f, --format [type]', 'output format');

program.parse();
