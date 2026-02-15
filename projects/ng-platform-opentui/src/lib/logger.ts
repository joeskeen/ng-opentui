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
    try {
      const logs = data
        .map((d) => {
          if (typeof d === 'object') {
            const values = Object.entries(d).map(
              ([key, value]) =>
                `${key}: ${this.valueToString(value)}`,
            );
            return `{${values.join(', ')}}`;
          }
          return String(d);
        })
        .join('\n');
      appendFileSync(fileName, `\n${new Date().toLocaleString()}: \t${logs}\n`);
    } catch(err) {
      this.log(`error while logging: ${err}`);
    }
  }

  private valueToString(value: unknown): string {
    if (typeof value === 'object' && value) {
      if (Array.isArray(value)) {
        return `[${value.map(v => this.valueToString(v))}]`;
      } else {
        const typeName = value.constructor.name;
        if (typeName === 'Object') {
          return JSON.stringify(value);
        } else {
          let id = '_id' in value ? value._id : '';
          return `${typeName}${id ? '#' + id : ''}`;
        }
      }
    } else if (typeof value ==='string') {
      return `"${value}"`;
    } else {
      return String(value);
    }
  }
}
