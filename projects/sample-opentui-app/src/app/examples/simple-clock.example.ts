import { Component, signal, effect, inject, OnInit, OnDestroy } from '@angular/core';
import { IExample } from '../IExample';
import { Logger, TuiBox, TuiText } from 'ng-platform-opentui';

@Component({
  template: `
    <box flexDirection="column">
      <text>Time: </text>
      <text [content]="time()" fg="#00FF00"></text>
    </box>
  `,
  imports: [TuiBox, TuiText],
})
export class SimpleClock implements OnInit, OnDestroy {
  private readonly logger = inject(Logger);
  private intervalId: any;
  
  readonly time = signal(new Date().toLocaleTimeString());

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.time.set(new Date().toLocaleTimeString());
    }, 1000);
  }

  ngOnDestroy() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }
}

const example: IExample = {
  id: 'simple-clock',
  title: 'Simple Clock',
  component: SimpleClock
};
export default example;
