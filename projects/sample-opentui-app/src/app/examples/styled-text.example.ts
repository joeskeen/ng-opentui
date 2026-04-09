import { Component, signal, computed, effect, inject, OnInit, OnDestroy } from '@angular/core';
import { IExample } from '../IExample';
import { GlobalKeyboardEventsService, Logger, TuiBox, TuiText, TuiRoot } from 'ng-platform-opentui';
import { KeyEvent, t, bold, underline, italic, fg, bg, link, blue, red, green } from '@opentui/core';

@Component({
  template: `
    <box flexDirection="column" height="100%" [backgroundColor]="'#001122'">
      
      <!-- Example 1: Basic Styled Text -->
      <box 
        [width]="40" 
        [height]="8"
        position="absolute"
        [left]="2"
        [top]="2"
        borderStyle="single"
        [border]="true"
        borderColor="#00FFFF"
        backgroundColor="#001122"
      >
        <text [content]="houseText" fg="#CCCCCC"></text>
      </box>

      <!-- Example 2: Status Messages -->
      <box 
        [width]="55" 
        [height]="8"
        position="absolute"
        [left]="2"
        [top]="11"
        borderStyle="single"
        [border]="true"
        borderColor="#FF6B6B"
        backgroundColor="#001122"
      >
        <text [content]="statusText" fg="#CCCCCC"></text>
      </box>

      <!-- Example 3: Instructions Panel -->
      <box 
        [width]="50" 
        [height]="15"
        position="absolute"
        [left]="45"
        [top]="2"
        borderStyle="single"
        [border]="true"
        borderColor="#7C3AED"
        backgroundColor="#001122"
      >
        <text [content]="instructionsText" fg="#CCCCCC"></text>
      </box>

      <!-- Example 4: System Stats Dashboard -->
      <box 
        [width]="90" 
        [height]="22"
        position="absolute"
        [left]="2"
        [top]="20"
        borderStyle="single"
        [border]="true"
        borderColor="#00FFFF"
        title="COMPLEX REAL-TIME DASHBOARD"
        titleAlignment="center"
        backgroundColor="#001122"
      >
        <text [content]="dashboardText()" fg="#CCCCCC"></text>
      </box>

      <!-- Example 5: Type Examples -->
      <box 
        [width]="40" 
        [height]="8"
        position="absolute"
        [left]="2"
        [top]="43"
        borderStyle="single"
        [border]="true"
        borderColor="#22C55E"
        backgroundColor="#001122"
      >
        <text [content]="typesText" fg="#CCCCCC"></text>
      </box>

    </box>
  `,
  imports: [TuiBox, TuiText],
})
export class StyledTextDemo implements OnInit, OnDestroy {
  private readonly keyboardEvents = inject(GlobalKeyboardEventsService);
  private readonly logger = inject(Logger);
  private subscription: any;
  private intervalId: any;

  readonly updateFrequency = signal(1);
  readonly frameCount = signal(0);
  readonly startTime = signal(Date.now());

  readonly houseText = t`
There's a ${underline(blue('house'))},
With a ${bold(blue('window'))},
And a ${blue('corvette')}
And everything is blue`;

  readonly statusText = t`
${bold(red('ERROR:'))} Connection failed
${bold(green('SUCCESS:'))} Data loaded
${bold(fg('#FFA500')('WARNING:'))} Low memory
${fg('#000000')(bg('#FFA500')('# NOTICE #'))} System update available`;

  readonly instructionsText = t`
${bold('Styled Text Demo')}
${fg('#888')('Arrow keys control update speed')}

${underline('Features demonstrated:')}
- Template literals with ${blue('colors')}
- ${bold('Bold')}, ${underline('underlined')}, ${italic('italic')}
- Background colors like ${fg('#000000')(bg('#FFA500')('this'))}
- Custom hex colors like ${fg('#FF6B6B')('this red')}
- Dynamic updates with ${green('controllable frequency')}
- Complex templates with ${red('many variables')}
- Hyperlinks: ${underline(blue(link('https://opentui.com')('opentui')))}

${fg('#888')('Update frequency:')} ${fg('#00FF00')(String(this.updateFrequency()))}`;

  readonly typesText = t`
${bold('Type Examples:')}
Number: ${green(42)}
Boolean: ${red(true)}
Float: ${blue((3.14159).toFixed(2))}
Calculated: ${fg('#00FFFF')(String(Math.floor(Math.random() * 100)))}`;

  readonly dashboardText = computed(() => {
    const elapsedSeconds = (Date.now() - this.startTime()) / 1000;
    const frame = this.frameCount();
    const freq = this.updateFrequency();

    const cpuLoad = Math.sin(elapsedSeconds * 0.5) * 50 + 50;
    const memoryUsage = Math.cos(elapsedSeconds * 0.3) * 30 + 70;
    const networkSpeed = Math.abs(Math.sin(elapsedSeconds * 2)) * 1000;
    const temperature = Math.sin(elapsedSeconds * 0.1) * 20 + 60;
    const batteryLevel = Math.max(0, 100 - elapsedSeconds * 0.5);
    const randomValue = Math.floor(Math.random() * 9999);
    const waveValue = Math.sin(elapsedSeconds * 3) * 10;
    const progressBar = '█'.repeat(Math.floor(((elapsedSeconds % 10) / 10) * 20));

    const connectionStatus = Math.sin(elapsedSeconds) > 0 ? 'ONLINE' : 'OFFLINE';
    const systemHealth = cpuLoad < 80 ? 'GOOD' : 'HIGH';
    const alertLevel = temperature > 75 ? 'CRITICAL' : 'NORMAL';

    return t`
${bold('System Stats:')} ${fg('#888')(`[Update: ${freq === 1 ? 'Every Frame' : 'Every ' + freq + ' frames'}]`)}
${blue('Uptime:')} ${fg('#00FF00')(elapsedSeconds.toFixed(2))}s ${fg('#666')(`(${Math.floor(elapsedSeconds / 60)}m ${Math.floor(elapsedSeconds % 60)}s)`)}
${red('CPU Load:')} ${cpuLoad > 80 ? red(bold(cpuLoad.toFixed(1) + '%')) : green(cpuLoad.toFixed(1) + '%')} ${fg('#444')('█'.repeat(Math.floor(cpuLoad / 5)))}
${fg('#FF6B6B')('Memory:')} ${memoryUsage > 85 ? red(bold(memoryUsage.toFixed(1) + '%')) : fg('#FFA500')(memoryUsage.toFixed(1) + '%')}
${fg('#9B59B6')('Network:')} ${networkSpeed > 500 ? green(bold(networkSpeed.toFixed(0) + ' KB/s')) : fg('#FFA500')(networkSpeed.toFixed(0) + ' KB/s')}
${fg('#E74C3C')('Temp:')} ${temperature > 75 ? red(bold(temperature.toFixed(1) + '°C')) : blue(temperature.toFixed(1) + '°C')}
${fg('#F39C12')('Battery:')} ${batteryLevel < 20 ? red(bold(batteryLevel.toFixed(0) + '%')) : green(batteryLevel.toFixed(0) + '%')}
${underline('Connection:')} ${connectionStatus === 'ONLINE' ? green(bold(connectionStatus)) : red(bold(connectionStatus))}
${underline('Health:')} ${systemHealth === 'GOOD' ? green(bold(systemHealth)) : red(bold(systemHealth))}
${underline('Alert:')} ${alertLevel === 'NORMAL' ? green(bold(alertLevel)) : fg('#000000')(bg('#FF0000')(red(bold(alertLevel))))}
${fg('#3498DB')('Random ID:')} ${fg('#E67E22')(String(randomValue).padStart(4, '0'))}
${fg('#1ABC9C')('Wave:')} ${waveValue >= 0 ? green('+' + waveValue.toFixed(2)) : red(waveValue.toFixed(2))}
${fg('#9B59B6')('Progress:')} ${fg('#00FF00')(progressBar.padEnd(20, '░'))}
${fg('#34495E')('Frame:')} ${fg('#ECF0F1')(String(frame))} ${fg('#7F8C8D')('(Total: ' + frame + ')')}
${fg('#2ECC71')('Status:')} ${bold(fg('#E74C3C')('●'))} ${alertLevel === 'CRITICAL' ? red('SYSTEM ALERT') : green('ALL SYSTEMS GO')}

${bold(fg('#F1C40F')('Controls:'))} ${fg('#BDC3C7')('↑/↓ = Speed, ESC = Exit')}`;
  });

  ngOnInit() {
    this.subscription = this.keyboardEvents.keyPress$.subscribe((event: KeyEvent) => {
      if (event.name === 'up' || event.name === 'arrowup') {
        this.updateFrequency.update(f => Math.max(1, f - 1));
      } else if (event.name === 'down' || event.name === 'arrowdown') {
        this.updateFrequency.update(f => Math.min(60, f + 1));
      }
    });

    this.intervalId = setInterval(() => {
      const freq = this.updateFrequency();
      if (this.frameCount() % freq === 0) {
        this.startTime.set(Date.now());
      }
      this.frameCount.update(c => c + 1);
    }, 1000 / 30);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

const example: IExample = {
  id: 'styled-text',
  title: 'Styled Text',
  description: 'Demonstrates styled text with colors, bold, underline, and dynamic updates',
  component: StyledTextDemo,
};
export default example;
