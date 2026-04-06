import { Component, computed, effect, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { resolveRenderLib } from '@opentui/core';
import { CLI_RENDERER, GlobalKeyboardEventsService, Logger, TuiBox, TuiText } from 'ng-platform-opentui';

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
})
export class App implements OnInit {
  private readonly renderer = inject(CLI_RENDERER);
  private readonly router = inject(Router);
  private readonly logger = inject(Logger);
  private readonly keyboardEvents = inject(GlobalKeyboardEventsService);

  constructor() {
    effect(() => {
      const path = this.path();
      this.logger.log({ path });
    });
  }

  ngOnInit() {
    this.keyboardEvents.keyPress$.subscribe((event) => {
      if (event.name === 'escape') {
        this.router.navigateByUrl('/');
      } else if (event.name === '`') {
        this.toggleConsole();
      } else if (event.name === '.') {
        this.toggleDebugOverlay();
      } else if (event.ctrl && event.name === 'g') {
        this.dumpHitGrid();
      } else if (event.shift && event.name === 'l') {
        this.startRenderer();
      } else if (event.shift && event.name === 's') {
        this.stopRenderer();
      } else if (event.shift && event.name === 'a') {
        this.autoRenderer();
      } else if (event.ctrl && event.name === 'a') {
        this.showArenaBytes();
      }
    });
  }

  path = computed(() => {
    const navigation = this.router.lastSuccessfulNavigation();
    return navigation?.finalUrl?.toString() ?? null;
  });

  toggleConsole() {
    this.renderer.console.toggle();
  }

  toggleDebugOverlay() {
    this.renderer.toggleDebugOverlay();
  }

  dumpHitGrid() {
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
