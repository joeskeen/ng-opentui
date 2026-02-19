import { Component, computed, effect, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { resolveRenderLib } from '@opentui/core';
import { CLI_RENDERER, Logger, TuiBox, TuiText } from 'ng-platform-opentui';

@Component({
  template: `
    <box flexDirection="column" justifyContent="space-between" height="100%" width="100%">
      <router-outlet></router-outlet>
      @if (path() !== '/examples') {
        <text [flexGrow]="1" [alignItems]="'flex-end'">Press [ESC] to return to the main menu</text>
      }
      <text [content]="path()"></text>
    </box>
  `,
  imports: [RouterOutlet, TuiBox, TuiText],
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
  },
})
export class App {
  private readonly renderer = inject(CLI_RENDERER);
  private readonly router = inject(Router);
  private readonly logger = inject(Logger);

  constructor() {
    effect(() => {
      const path = this.path();
      this.logger.log({ path });
    });
  }

  path = computed(() => {
    const navigation = this.router.lastSuccessfulNavigation();
    return navigation?.finalUrl?.toString() ?? null;
  });

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
