import {appendFileSync} from 'fs';
import {inspect} from 'util'

const fileName = `ng-opentui.log`;

export class Logger {
    log(...data: any[]): void {
        const logs = data.map(d => inspect(d, false, 2)).join('\n');
        appendFileSync(fileName, `\n${new Date()}: \t${logs}\n`);
    }
}
