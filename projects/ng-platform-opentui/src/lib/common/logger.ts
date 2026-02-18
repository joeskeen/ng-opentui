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
            const values = Object.entries(d).map(
              ([key, value]) => `${key}: ${valueToString(value)}`,
            );
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
    if (typeof value === 'object' && value) {
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


export function dumpRenderableTree(
  node: any,
  indent: string = '',
  seen = new Set<any>()
) {
  if (!node || typeof node !== 'object') {
    Logger.instance.log(indent + String(node));
    return;
  }

  if (seen.has(node)) {
    Logger.instance.log(indent + `[CYCLE: ${node.constructor?.name}]`);
    return;
  }
  seen.add(node);

  const name = node.constructor?.name ?? typeof node;
  const id = (node as any)._id ?? (node as any).id ?? '(no-id)';
  const layout = typeof node.getLayoutNode === 'function'
    ? node.getLayoutNode()
    : '(no getLayoutNode)';

  Logger.instance.log(
    `${indent}${name}#${id} layout=${layout ? 'OK' : 'null'}`
  );

  // Try to get children from OpenTUI’s API
  let children: any[] = [];
  try {
    children = [
      ...node.getChildren?.(),
      ...node.rootTextNode?.getChildren?.(),
      ...node._childrenInLayoutOrder ?? [],
    ];
  } catch {}

  for (const child of children) {
    dumpRenderableTree(child, indent + '  ', seen);
  }
}

(globalThis as any)['__logger__'] = Logger.instance;