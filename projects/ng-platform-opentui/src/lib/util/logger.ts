import { appendFileSync, rmSync } from 'fs';

const fileName = `ng-opentui.log`;

export class Logger {
  constructor() {
    this.init();
  }
  private init() {
    try {
      rmSync(fileName);
    } catch {}
  }
  log(...data: any[]): void {
    const logs = data
      .map((d) => {
        if (typeof d === 'object') {
          const values = Object.entries(d).map(
            ([key, value]) =>
              `${key}: ${
                value instanceof Object
                  ? value.constructor.name + '#' + (value as any)._id
                  : typeof value === 'string'
                    ? `"${value}"`
                    : value
              }`,
          );
          return `{${values.join(', ')}}`;
        }
        return String(d);
      })
      .join('\n');
    appendFileSync(fileName, `\n${new Date().toLocaleString()}: \t${logs}\n`);
  }
}
