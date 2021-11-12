const stylish = (diff) => {
  const diffSymbols = {
    same: ' ',
    removed: '-',
    added: '+',
  };

  const space = ' ';

  const getIndent = (itemType, depth) => {
    const diffSymbol = diffSymbols[itemType];
    return space.repeat(4 * (depth - 1)) + space.repeat(2) + diffSymbol + space;
  };

  const wrapWithBrackets = (value, depth) => ['{', value, `${space.repeat(4 * (depth - 1))}}`].join('\n');

  const stringify = (obj, depth) => {
    const isPrimitive = !(obj instanceof Object);
    if (isPrimitive) return obj;

    const lines = Object.keys(obj).flatMap((key) => {
      const value = obj[key];
      return `${getIndent('same', depth)}${key}: ${stringify(value, depth + 1)}`;
    });

    return wrapWithBrackets(lines.join('\n'), depth);
  };

  const iter = (value, depth) => {
    const lines = value.map((item) => {
      if (item.children) {
        const nestedValue = iter(item.children, depth + 1);
        return `${getIndent(item.type, depth)}${item.key}: ${nestedValue}`;
      }

      return `${getIndent(item.type, depth)}${item.key}: ${stringify(item.value, depth + 1)}`;
    });

    return wrapWithBrackets(lines.join('\n'), depth);
  };

  return iter(diff, 1);
};

const getFormatter = (type = 'stylish') => {
  if (type === 'stylish') return stylish;

  throw new Error('Unknown formatter type');
};

export default getFormatter;
