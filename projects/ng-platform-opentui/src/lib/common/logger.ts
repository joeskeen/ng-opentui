import { StyledText } from '@opentui/core';
import { appendFileSync, rmSync } from 'fs';
import { inspect } from 'util';

const fileName = `ng-opentui.log`;

export class Logger {
  static readonly instance = new Logger();

  constructor() {
    this.init();
  }
  private init() {
    try {
      rmSync(fileName);
    } catch {}
  }
  log(...data: any[]): void {
    try {
      const logs = data
        .map((d) => {
          if (typeof d === 'object') {
            const values = Object.entries(d).map(([key, value]) => `${key}: ${valueToString(value)}`);
            return `{${values.join(', ')}}`;
          }
          return String(d);
        })
        .join('\n');
      appendFileSync(fileName, `\n${new Date().toLocaleString()}: \t${logs}\n`);
    } catch (err) {
      this.log(`error while logging: ${err}`);
    }
  }
}

export function valueToString(value: unknown): string {
  if (value === null) {
    return 'null';
  }
  if (value === undefined) {
    return 'undefined';
  }
  if (typeof value === 'object' && value) {
    if (value instanceof StyledText) {
      return value.chunks.map((c) => c.text).join('');
    }
    if (value.toString() !== '[object Object]') {
      return value.toString();
    }
    if (Array.isArray(value)) {
      return `[${value.map((v) => valueToString(v))}]`;
    } else {
      const candidates = [
        (value as any).name,
        value.constructor?.name,
        (value as any).type?.name,
        (value as any).type?.constructor?.name,
        Object.getPrototypeOf(value)?.name,
        Object.getPrototypeOf((value as any)?.type ?? {})?.name,
      ];
      const typeName = candidates.find((name) => name && name !== 'Object' && name !== 'Function');
      if (!typeName) {
        return inspect(value, false, 1);
      } else {
        let id = '_id' in value ? value._id : '';
        return `${typeName}${id ? '#' + id : ''}`;
      }
    }
  } else if (typeof value === 'string') {
    return `"${value}"`;
  } else {
    return String(value);
  }
}

function indents(count: number) {
  return String('  ').repeat(count);
}
function defaultToString(obj: unknown) {
  if (!obj || typeof obj !== 'object') {
    return String(obj);
  }

  let str = obj.toString();
  if (str === '[object Object]') {
    str = obj.constructor.name;
  }
  return str;
}
export function treeToString<T>(
  node: T,
  childSelector: (n: T) => Array<T | any>,
  nodeToString: (n: T) => string = defaultToString,
  indent = 0,
  visited = new Set<T>(),
): string[] {
  if (!node || typeof node !== 'object') {
    return [indents(indent) + nodeToString(node)];
  }

  if (visited.has(node)) {
    return [indents(indent) + `[circular reference: ${nodeToString(node)}]`];
  }
  visited.add(node);

  return [
    indents(indent) + nodeToString(node),
    ...childSelector(node).flatMap((child) => treeToString(child, childSelector, nodeToString, indent + 1, visited)),
  ];
}

(globalThis as any)['__logger__'] = Logger.instance;
