import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { asapScheduler, interval, map, share } from 'rxjs';

@Component({
  template: `<span>Time: <strong fg="#00FF00">{{ time() | date: 'medium' }}</strong></span>`,
  imports: [DatePipe],
})
export class App {
  readonly time = toSignal(
    interval(1000, asapScheduler).pipe(
      share(),
      map(() => new Date()),
    ),
    {
      initialValue: new Date(),
    },
  );
}
