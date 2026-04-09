import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { IExample } from '../IExample';
import { GlobalKeyboardEventsService, Logger, TuiBox, TuiText } from 'ng-platform-opentui';
import { KeyEvent } from '@opentui/core';

type LayoutMode = 'horizontal' | 'vertical' | 'centered' | 'three-column';

interface LayoutDemo {
  name: string;
  description: string;
  mode: LayoutMode;
}

const LAYOUT_DEMOS: LayoutDemo[] = [
  { name: 'Horizontal Layout', description: 'Sidebar on left, main content on right', mode: 'horizontal' },
  { name: 'Vertical Layout', description: 'Sidebar on top, main content below', mode: 'vertical' },
  { name: 'Centered Layout', description: 'Content centered with margins', mode: 'centered' },
  { name: 'Three Column', description: 'Left sidebar, center content, right sidebar', mode: 'three-column' },
];

@Component({
  template: `
    <box flexDirection="column" height="100%">
      <!-- Header -->
      <box 
        [height]="3" 
        backgroundColor="#3B82F6" 
        [borderStyle]="'single'" 
        [border]="true"
        alignItems="center"
        justifyContent="center"
      >
        <text [content]="headerContent()" fg="#FFFFFF"></text>
      </box>

      <!-- Content Area -->
      <box 
        [flexGrow]="1" 
        [flexShrink]="1"
        flexDirection="row"
        alignItems="stretch"
        [backgroundColor]="'#001122'"
      >
        <!-- Left Sidebar -->
        @if (currentMode() === 'horizontal' || currentMode() === 'vertical' || currentMode() === 'three-column') {
          <box 
            [width]="currentMode() === 'vertical' ? '100%' : 20"
            [height]="currentMode() === 'vertical' ? 5 : 'auto'"
            backgroundColor="#64748B"
            [borderStyle]="'single'"
            [border]="true"
            alignItems="center"
            justifyContent="center"
            [flexGrow]="currentMode() === 'vertical' ? 0 : 0"
            [flexShrink]="0"
            [minWidth]="currentMode() === 'vertical' ? undefined : 15"
            [title]="currentMode() === 'vertical' ? 'TOP BAR' : 'LEFT SIDEBAR'"
            titleAlignment="center"
          >
            <text [content]="currentMode() === 'vertical' ? 'TOP BAR' : 'LEFT SIDEBAR'" fg="#FFFFFF"></text>
          </box>
        }

        <!-- Main Content -->
        <box 
          [flexGrow]="1" 
          [flexShrink]="1"
          backgroundColor="#919599"
          [borderStyle]="'single'"
          [border]="true"
          alignItems="center"
          justifyContent="center"
          [title]="'MAIN CONTENT'"
          titleAlignment="center"
        >
          <text content="MAIN CONTENT" fg="#1E293B"></text>
        </box>

        <!-- Right Sidebar (only in three-column) -->
        @if (currentMode() === 'three-column') {
          <box 
            [width]="20"
            height="auto"
            backgroundColor="#7C3AED"
            [borderStyle]="'single'"
            [border]="true"
            alignItems="center"
            justifyContent="center"
            [flexGrow]="0"
            [flexShrink]="0"
            [minWidth]="12"
            title="RIGHT"
            titleAlignment="center"
          >
            <text content="RIGHT" fg="#FFFFFF"></text>
          </box>
        }
      </box>

      <!-- Moveable Element -->
      @if (overlayVisible()) {
        <box 
          [position]="'absolute'"
          [left]="moveableX()"
          [top]="moveableY()"
          [width]="10"
          [height]="3"
          backgroundColor="#FF6B6B"
          [borderStyle]="'single'"
          borderColor="#FF4757"
          [border]="true"
          alignItems="center"
          justifyContent="center"
          [zIndex]="100"
        >
          <text content="MOVE" fg="#FFFFFF"></text>
        </box>
      }

      <!-- Absolute Positioned Element (bottom-right) -->
      <box 
        [position]="'absolute'"
        [left]="80"
        [bottom]="2"
        [width]="20"
        [height]="3"
        backgroundColor="#22C55E"
        [borderStyle]="'single'"
        borderColor="#16A34A"
        [border]="true"
        alignItems="center"
        justifyContent="center"
        [zIndex]="150"
      >
        <text content="BOTTOM RIGHT" fg="#FFFFFF"></text>
      </box>

      <!-- Footer -->
      <box 
        [height]="3" 
        backgroundColor="#1E40AF" 
        [borderStyle]="'single'" 
        [border]="true"
        alignItems="center"
        justifyContent="center"
      >
        <text [content]="footerContent()" fg="#FFFFFF"></text>
      </box>
    </box>
  `,
  imports: [TuiBox, TuiText],
})
export class SimpleLayout implements OnInit, OnDestroy {
  private readonly keyboardEvents = inject(GlobalKeyboardEventsService);
  private readonly logger = inject(Logger);
  private autoAdvanceTimeout: any = null;
  private subscription: any;

  readonly currentIndex = signal(0);
  readonly autoplayEnabled = signal(true);
  readonly overlayVisible = signal(true);
  readonly moveableX = signal(40);
  readonly moveableY = signal(12);

  readonly currentMode = computed(() => LAYOUT_DEMOS[this.currentIndex()].mode);
  readonly currentDemo = computed(() => LAYOUT_DEMOS[this.currentIndex()]);

  readonly headerContent = computed(() => {
    const demo = this.currentDemo();
    const autoplayStatus = this.autoplayEnabled() ? 'AUTO' : 'MANUAL';
    return `${demo.name} (${this.currentIndex() + 1}/${LAYOUT_DEMOS.length}) - ${autoplayStatus}`;
  });

  readonly footerContent = computed(() => {
    const autoplayStatus = this.autoplayEnabled() ? 'ON' : 'OFF';
    const overlayStatus = this.overlayVisible() ? 'ON' : 'OFF';
    return `SPACE: next | R: restart | P: autoplay (${autoplayStatus}) | V: overlay (${overlayStatus}) | WASD: move`;
  });

  ngOnInit() {
    this.subscription = this.keyboardEvents.keyPress$.subscribe((event: KeyEvent) => {
      switch (event.name) {
        case 'space':
          this.nextDemo();
          break;
        case 'r':
          this.currentIndex.set(0);
          break;
        case 'p':
          this.toggleAutoplay();
          break;
        case 'v':
          this.overlayVisible.set(!this.overlayVisible());
          break;
        case 'w':
          this.moveElement(0, -1);
          break;
        case 'a':
          this.moveElement(-1, 0);
          break;
        case 's':
          this.moveElement(0, 1);
          break;
        case 'd':
          this.moveElement(1, 0);
          break;
      }
    });

    if (this.autoplayEnabled()) {
      this.scheduleNextDemo();
    }
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.autoAdvanceTimeout) {
      clearTimeout(this.autoAdvanceTimeout);
    }
  }

  private nextDemo() {
    const nextIndex = (this.currentIndex() + 1) % LAYOUT_DEMOS.length;
    this.currentIndex.set(nextIndex);
    this.scheduleNextDemo();
  }

  private toggleAutoplay() {
    this.autoplayEnabled.set(!this.autoplayEnabled());
    if (this.autoplayEnabled()) {
      this.scheduleNextDemo();
    } else if (this.autoAdvanceTimeout) {
      clearTimeout(this.autoAdvanceTimeout);
      this.autoAdvanceTimeout = null;
    }
  }

  private moveElement(deltaX: number, deltaY: number) {
    this.moveableX.update(x => Math.max(0, Math.min(100, x + deltaX)));
    this.moveableY.update(y => Math.max(4, Math.min(30, y + deltaY)));
  }

  private scheduleNextDemo() {
    if (this.autoAdvanceTimeout) {
      clearTimeout(this.autoAdvanceTimeout);
    }
    if (this.autoplayEnabled()) {
      this.autoAdvanceTimeout = setTimeout(() => {
        this.nextDemo();
      }, 4000);
    }
  }
}

const example: IExample = {
  id: 'simple-layout',
  title: 'Simple Layout',
  description: 'Demonstrates flexbox layouts with header, footer, sidebars, and moveable elements',
  component: SimpleLayout,
};
export default example;
