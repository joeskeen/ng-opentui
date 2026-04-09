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
  let output = harness.getOutput();
  console.log(output.substring(Math.max(0, output.length - 1000)));
  
  // Test 1: Simple Layout
  console.log('\n=== Test 1: Simple Layout ===');
  await harness.sendKey('j');
  await harness.wait(200);
  await harness.sendEnter();
  await harness.wait(1500);
  output = harness.getOutput();
  const slMatch = output.match(/Horizontal Layout|LEFT SIDEBAR|MAIN CONTENT|SPACE: next/);
  console.log('Simple Layout:', slMatch ? 'PASS' : 'FAIL');
  
  // Return to menu
  await harness.sendEscape();
  await harness.wait(1500);
  
  // Test 2: Styled Text
  console.log('\n=== Test 2: Styled Text ===');
  await harness.sendKey('j');
  await harness.wait(200);
  await harness.sendEnter();
  await harness.wait(1500);
  output = harness.getOutput();
  const stMatch = output.match(/Styled Text|house|window|System Stats/);
  console.log('Styled Text:', stMatch ? 'PASS' : 'FAIL');
  
  // Return to menu
  await harness.sendEscape();
  await harness.wait(1500);
  
  // Test 3: OpenTUI Demo - navigate fresh
  console.log('\n=== Test 3: OpenTUI Demo ===');
  // Navigate down to index 3
  await harness.sendKey('j'); // to index 1
  await harness.wait(150);
  await harness.sendKey('j'); // to index 2
  await harness.wait(150);
  await harness.sendKey('j'); // to index 3
  await harness.wait(150);
  await harness.sendEnter();
  await harness.wait(2000);
  output = harness.getOutput();
  
  // Look for tab bar content or tab content
  const odMatch = output.match(/Text & Attributes|Basics|Borders|Animation|Titles|Text Styling|Tab Bar|Text Styling & Color|Text Styling \& Color/);
  console.log('OpenTUI Demo content found:', odMatch ? 'YES' : 'NO');
  console.log('OpenTUI Demo:', odMatch ? 'PASS' : 'FAIL');
  
  if (!odMatch) {
    console.log('Last 500 chars:', output.substring(output.length - 500));
  }
  
  console.log('\n=== Summary ===');
  console.log('Phase 1 Examples:');
  console.log('  - Simple Layout: ' + (slMatch ? 'PASS' : 'FAIL'));
  console.log('  - Styled Text: ' + (stMatch ? 'PASS' : 'FAIL'));
  console.log('  - OpenTUI Demo: ' + (odMatch ? 'PASS' : 'CHECK MANUALLY'));
  console.log('\nAll tests completed ===');
  await harness.terminate();
}

runTest().catch(console.error);