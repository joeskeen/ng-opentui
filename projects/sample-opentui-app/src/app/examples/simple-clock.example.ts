import { Component, signal, effect, inject, OnInit, OnDestroy } from '@angular/core';
import { IExample } from '../IExample';
import { Logger, TuiBox, TuiText } from 'ng-platform-opentui';
import { interval, map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';

@Component({
  template: `
    <box flexDirection="column">
      <text>Time: </text>
      <text [content]="now() | date: 'HH:mm:ss'" fg="#00FF00"></text>
    </box>
  `,
  imports: [TuiBox, TuiText, DatePipe],
})
export class SimpleClock implements OnDestroy {
  private readonly logger = inject(Logger);
  private intervalId: any;
  readonly now$ = interval(1000).pipe(map(() => new Date()));
  readonly now = toSignal(this.now$, { initialValue: new Date() });

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
