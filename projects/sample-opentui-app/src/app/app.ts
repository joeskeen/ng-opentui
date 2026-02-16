import { Component, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { resolveRenderLib } from '@opentui/core';
import { Logger, MouseEventsService, CLI_RENDERER } from 'ng-platform-opentui';

@Component({
  template: `<router-outlet></router-outlet>`,
  imports: [RouterOutlet],
  host: {
    '(document:keydown.escape)': 'onEscape()',
    '(document:keydown.`)': 'toggleConsole()',
    '(document:keydown.")': 'toggleConsole()',
    '(document:keydown.dot)': 'toggleDebugOverlay()',
    '(document:keydown.control.g)': 'dumpHitGrid()',
    '(document:keydown.shift.l)': 'startRenderer()',
    '(document:keydown.shift.s)': 'stopRenderer()',
    '(document:keydown.shift.a)': 'autoRenderer()',
    '(document:keydown.control.a)': 'showArenaBytes()',
  }
})
export class App {
  private readonly renderer = inject(CLI_RENDERER);
  private readonly router = inject(Router);
  private readonly logger = inject(Logger);

  onEscape() {
    this.router.navigateByUrl('/');
  }

  toggleConsole() {
    this.renderer.console.toggle();
  }

  toggleDebugOverlay() {
    this.renderer.toggleDebugOverlay();
  }

  dumpHitGrid() {
    console.log('dumping hit grid');
    this.renderer.dumpHitGrid();
  }

  startRenderer() {
    this.renderer.start();
  }

  stopRenderer() {
    this.renderer.stop();
  }

  autoRenderer() {
    this.renderer.auto();
  }

  showArenaBytes() {
    const lib = resolveRenderLib();
    const rawBytes = lib.getArenaAllocatedBytes();
    const formatted = `${(rawBytes / 1024 / 1024).toFixed(2)} MB`;
    console.log('arena allocated bytes:', formatted);
  }
}
