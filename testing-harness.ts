import { spawn, ChildProcess } from 'child_process';
import { Writable } from 'stream';
import { open } from 'fs/promises';

class MockWritable extends Writable {
  private buffer = '';
  _write(chunk: any, _encoding: any, callback: any) {
    this.buffer += chunk.toString();
    callback();
  }
  getBuffer() { return this.buffer; }
}

export class OpenTUIHarness {
  private process: ChildProcess | null = null;
  private output = '';
  
  static async launch(): Promise<OpenTUIHarness> {
    const harness = new OpenTUIHarness();
    await harness.start();
    return harness;
  }

  private async start(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.process = spawn('bun', ['./dist/sample-opentui-app-ngc/main.js'], {
        cwd: '/opt/code/pet/ng-platform-opentui',
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      this.process.stdout?.on('data', (data) => {
        this.output += data.toString();
      });

      this.process.stderr?.on('data', (data) => {
        this.output += data.toString();
      });

      this.process.on('spawn', () => {
        setTimeout(resolve, 1000);
      });

      this.process.on('error', reject);
    });
  }

  async sendKey(key: string): Promise<void> {
    if (!this.process?.stdin) return;
    this.process.stdin.write(key);
  }

  async sendKeys(keys: string): Promise<void> {
    for (const key of keys) {
      await this.sendKey(key);
      await new Promise(r => setTimeout(r, 50));
    }
  }

  async sendEnter(): Promise<void> {
    await this.sendKey('\n');
  }

  async sendEscape(): Promise<void> {
    await this.sendKey('\x1b');
  }

  async wait(ms: number): Promise<void> {
    return new Promise(r => setTimeout(r, ms));
  }

  getOutput(): string {
    return this.output;
  }

  getDebugLog(): string {
    try {
      return require('fs').readFileSync('/tmp/opentui-debug.log', 'utf8');
    } catch {
      return '';
    }
  }

  async terminate(): Promise<void> {
    if (this.process) {
      this.process.kill();
      this.process = null;
    }
  }
}

async function runTest() {
  console.log('Starting harness...');
  const harness = await OpenTUIHarness.launch();
  
  await harness.wait(2000);
  console.log('=== Initial output (examples menu) ===');
  const output = harness.getOutput();
  // Extract visible text lines
  const lines = output.split('\n').filter(l => l.includes('Examples') || l.includes('Simple') || l.includes('clock') || l.includes('navigate'));
  console.log(lines.join('\n'));
  
  await harness.terminate();
}

runTest().catch(console.error);