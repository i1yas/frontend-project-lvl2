const stylish = (diff) => {
  const diffSymbols = {
    same: ' ',
    remove: '-',
    add: '+',
  };

  const space = ' ';

  const getIndent = (itemType, depth, diffSymbol = space) => {
    const nestedIndent = space.repeat(4 * (depth - 1));
    return nestedIndent + space.repeat(2) + diffSymbol + space;
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
    const lines = value.flatMap((item) => {
      if (item.children) {
        const nestedValue = iter(item.children, depth + 1);
        return `${getIndent(item.type, depth)}${item.key}: ${nestedValue}`;
      }

      if (item.change === 'update') {
        return [
          `${getIndent(item.type, depth, '-')}${item.key}: ${stringify(item.removedValue, depth + 1)}`,
          `${getIndent(item.type, depth, '+')}${item.key}: ${stringify(item.addedValue, depth + 1)}`,
        ];
      }

      if (item.change) {
        const symbol = diffSymbols[item.change];
        return `${getIndent(item.type, depth, symbol)}${item.key}: ${stringify(item.value, depth + 1)}`;
      }

      return `${getIndent(item.type, depth)}${item.key}: ${stringify(item.value, depth + 1)}`;
    });

    return wrapWithBrackets(lines.join('\n'), depth);
  };

  return iter(diff, 1);
};

const plain = (diff) => {
  const stringify = (value) => {
    if (value instanceof Object) return '[complex value]';
    if (typeof value === 'string') return `'${value}'`;
    return value;
  };

  const iter = (value, path) => {
    const lines = value.map((item) => {
      const newPath = path.concat(item.key);
      const pathStr = newPath.join('.');

      if (item.change === 'update') {
        return `Property '${pathStr}' was updated. From ${stringify(item.removedValue)} to ${stringify(item.addedValue)}`;
      }

      if (item.change === 'remove') {
        return `Property '${pathStr}' was removed`;
      }

      if (item.change === 'add') {
        return `Property '${pathStr}' was added with value: ${stringify(item.value)}`;
      }

      if (item.children) {
        return iter(item.children, newPath);
      }

      return null;
    });

    return lines.filter(Boolean).join('\n');
  };

  return iter(diff, []);
};

const getFormatter = (type = 'stylish') => {
  if (type === 'stylish') return stylish;
  if (type === 'plain') return plain;

  throw new Error(`Unknown formatter type '${type}'`);
};

export default getFormatter;
