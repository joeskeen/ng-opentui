import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { Logger, MouseEventsService } from 'ng-platform-opentui';

@Component({
  template: `<router-outlet></router-outlet>`,
  imports: [RouterOutlet],
  host: {
    "(document:keydown.escape)": 'onEscape($event)'
  }
})
export class App {
  readonly logger = inject(Logger);
  readonly mouseEvents = inject(MouseEventsService);
  readonly router = inject(Router);
  constructor() {
    this.mouseEvents.allMouseEvent$.subscribe((e) => this.logger.log(App.name, 'mouse event', e));
    this.router.events.subscribe(e => this.logger.log(App.name, 'navigation event', e));
  }
  onEscape(event: Event) {
    this.logger.log(this.onEscape.name, {event})
    this.router.navigateByUrl('/');
  }
}
