import yaml from 'js-yaml';

const getParser = (extension) => {
  if (extension === '.json') return JSON.parse;
  if (extension === '.yml' || extension === '.yaml') return yaml.load;

  throw new Error('Unknown file format');
};

export default getParser;
