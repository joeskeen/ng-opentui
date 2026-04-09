import { Component, signal, computed, inject, OnInit, OnDestroy } from '@angular/core';
import { IExample } from '../IExample';
import { GlobalKeyboardEventsService, Logger, TuiBox, TuiText } from 'ng-platform-opentui';
import { KeyEvent, t, bold, fg, underline, TextAttributes, StyledText, TextChunk, hsvToRgb, rgbToHex } from '@opentui/core';

type TabName = 'text' | 'basics' | 'borders' | 'animation' | 'titles';

interface Tab {
  name: TabName;
  title: string;
}

const TABS: Tab[] = [
  { name: 'text', title: 'Text & Attributes' },
  { name: 'basics', title: 'Basics' },
  { name: 'borders', title: 'Borders' },
  { name: 'animation', title: 'Animation' },
  { name: 'titles', title: 'Titles' },
];

@Component({
  template: `
    <box flexDirection="column" height="100%" backgroundColor="#000028">
      <!-- Tab Bar -->
      <box
        [height]="3"
        backgroundColor="#1E293B"
        borderStyle="single"
        [border]="true"
        borderColor="#475569"
      >
        <text [content]="tabBarContent()" fg="#FFFFFF"></text>
      </box>

      <!-- Tab Content -->
      @switch (currentTab()) {
        @case ('text') {
          <!-- Text & Attributes Tab -->
          <box
            position="absolute"
            [left]="5"
            [top]="5"
            [borderStyle]="'single'"
            [border]="true"
            [width]="40"
            [height]="8"
            backgroundColor="#1E293B"
          >
            <text
              content="Text Styling & Color Gradients"
              fg="#FFFF00"
              [attributes]="textAttrBoldUnderline"
            ></text>
          </box>

          <box position="absolute" [left]="5" [top]="14" [width]="50" [height]="3">
            <text [content]="colorGradient()" fg="#CCCCCC"></text>
          </box>

          <box position="absolute" [left]="5" [top]="20" [width]="25">
            <text [content]="attributeExamples()" fg="#FFFFFF"></text>
          </box>
        }

        @case ('basics') {
          <!-- Basics Tab -->
          <box
            position="absolute"
            [left]="5"
            [top]="5"
            [width]="20"
            [height]="8"
            backgroundColor="#333366"
            borderStyle="single"
            [border]="true"
            borderColor="#FFFFFF"
          >
            <text content="Simple Box" position="absolute" [left]="2" [top]="2" fg="#FFFFFF"></text>
          </box>

          <box
            position="absolute"
            [left]="30"
            [top]="8"
            [width]="25"
            [height]="6"
            backgroundColor="#663333"
            borderStyle="double"
            [border]="true"
            borderColor="#FFFF00"
          >
            <text
              content="Double Border"
              position="absolute"
              [left]="2"
              [top]="2"
              fg="#FFFFFF"
            ></text>
          </box>

          <text
            content="This tab demonstrates basic box and text rendering with different border styles."
            position="absolute"
            [left]="5"
            [top]="20"
            fg="#CCCCCC"
          ></text>
        }

        @case ('borders') {
          <!-- Borders Tab -->
          <box
            position="absolute"
            [left]="5"
            [top]="5"
            [width]="15"
            [height]="5"
            backgroundColor="#222244"
            borderStyle="single"
            [border]="true"
            borderColor="#FFFFFF"
          >
            <text content="Single" position="absolute" [left]="2" [top]="2" [fg]="'#FFFFFF'"></text>
          </box>

          <box
            position="absolute"
            [left]="25"
            [top]="5"
            [width]="15"
            [height]="5"
            backgroundColor="#224422"
            borderStyle="double"
            [border]="true"
            borderColor="#FFFFFF"
          >
            <text content="Double" position="absolute" [left]="2" [top]="2" [fg]="'#FFFFFF'"></text>
          </box>

          <box
            position="absolute"
            [left]="45"
            [top]="5"
            [width]="15"
            [height]="5"
            backgroundColor="#442222"
            borderStyle="rounded"
            [border]="true"
            borderColor="#FFFFFF"
          >
            <text
              content="Rounded"
              position="absolute"
              [left]="2"
              [top]="2"
              [fg]="'#FFFFFF'"
            ></text>
          </box>

          <!-- Partial Borders -->
          <text
            content="Partial Borders:"
            position="absolute"
            [left]="5"
            [top]="12"
            fg="#CCCCCC"
            [attributes]="textAttrUnderline"
          ></text>

          <box
            position="absolute"
            [left]="5"
            [top]="14"
            [width]="12"
            [height]="4"
            backgroundColor="#222244"
            borderStyle="single"
            [border]="true"
            borderColor="#FFFFFF"
          >
            <text content="Left Only" position="absolute" [left]="2" [top]="1" fg="#FFFFFF"></text>
          </box>

          <box
            position="absolute"
            [left]="22"
            [top]="14"
            [width]="20"
            [height]="4"
            backgroundColor="#334455"
            borderStyle="single"
            [border]="true"
            borderColor="#FFFFFF"
          >
            <text
              content="Animated Borders"
              position="absolute"
              [left]="2"
              [top]="1"
              fg="#FFFFFF"
            ></text>
          </box>

          <text
            [content]="borderPhaseText()"
            position="absolute"
            [left]="22"
            [top]="19"
            fg="#AAAAAA"
          ></text>
        }

        @case ('animation') {
          <!-- Animation Tab -->
          <text
            content="Animation Demonstrations"
            position="absolute"
            [left]="5"
            [top]="5"
            fg="#FFFF00"
            [attributes]="textAttrBoldUnderline"
          ></text>

          <box
            position="absolute"
            [left]="animPosition()"
            [top]="8"
            [width]="15"
            [height]="3"
            backgroundColor="#550055"
            borderStyle="rounded"
            [border]="true"
            borderColor="#FF00FF"
          >
            <text content="Moving Box" fg="#00FF00"></text>
          </box>

          <box
            position="absolute"
            [left]="50"
            [top]="12"
            [width]="18"
            [height]="5"
            [backgroundColor]="animatedColor()"
            borderStyle="double"
            [border]="true"
            borderColor="#FFFFFF"
          >
            <text
              content="Animated Color"
              position="absolute"
              [left]="2"
              [top]="2"
              fg="#FFFFFF"
            ></text>
          </box>

          <text
            content="Use ↑↓ to control animation speed"
            position="absolute"
            [left]="5"
            [top]="20"
            fg="#AAAAAA"
          ></text>
        }

        @case ('titles') {
          <!-- Titles Tab -->
          <text
            content="Box Titles"
            position="absolute"
            [left]="5"
            [top]="5"
            fg="#FFFF00"
            [attributes]="textAttrBoldUnderline"
          ></text>

          <box
            position="absolute"
            [left]="5"
            [top]="8"
            [width]="20"
            [height]="5"
            backgroundColor="#222244"
            borderStyle="single"
            [border]="true"
            title="Left Aligned"
            titleAlignment="left"
            borderColor="#FFFFFF"
          >
          </box>

          <box
            position="absolute"
            [left]="30"
            [top]="8"
            [width]="20"
            [height]="5"
            backgroundColor="#442222"
            borderStyle="double"
            [border]="true"
            title="Centered Title"
            titleAlignment="center"
            borderColor="#FFFFFF"
          >
          </box>

          <box
            position="absolute"
            [left]="55"
            [top]="8"
            [width]="20"
            [height]="5"
            backgroundColor="#224422"
            borderStyle="rounded"
            [border]="true"
            title="Right Aligned"
            titleAlignment="right"
            borderColor="#FFFFFF"
          >
          </box>

          <text
            content="Boxes can have titles with different alignments"
            position="absolute"
            [left]="5"
            [top]="18"
            fg="#CCCCCC"
          ></text>
        }
      }

      <!-- Instructions -->
      <box
        position="absolute"
        [left]="0"
        [bottom]="0"
        width="100%"
        [height]="3"
        backgroundColor="#1E293B"
        borderStyle="single"
        [border]="true"
        borderColor="#475569"
      >
        <text
          content="←/→ or [/]: Switch tabs | ESC: Return to menu"
          fg="#94A3B8"
          alignItems="center"
        ></text>
      </box>
    </box>
  `,
  imports: [TuiBox, TuiText],
})
export class OpentuiDemo implements OnInit, OnDestroy {
  private readonly keyboardEvents = inject(GlobalKeyboardEventsService);
  private readonly logger = inject(Logger);
  private subscription: any;
  private animationInterval: any;

  readonly currentTab = signal<TabName>('text');
  readonly animSpeed = signal(1);
  readonly animPosition = signal(5);
  readonly borderPhase = signal(0);

  readonly textAttrBold = TextAttributes.BOLD;
  readonly textAttrUnderline = TextAttributes.UNDERLINE;
  readonly textAttrBoldUnderline = TextAttributes.BOLD | TextAttributes.UNDERLINE;

  readonly tabBarContent = computed(() => {
    const items = TABS.map((tab) => {
      const isActive = tab.name === this.currentTab();
      const prefix = isActive ? '▶ ' : '  ';
      const styled = isActive ? bold(fg('#00FF00')(prefix + tab.title)) : fg('#666666')(prefix + tab.title);
      return t`${styled}  `;
    });
    
    if (items.length === 0) {
      return t``;
    }
    
    // Combine all StyledText objects by spreading their chunks
    const allChunks = items.flatMap(item => item.chunks);
    return new StyledText(allChunks);
  });

  readonly colorGradient = computed(() => {
    const chunks: TextChunk[] = [
      { __isChunk: true, text: 'Rainbow Gradient: ', attributes: 0 }
    ];
    
    for (let i = 0; i < 40; i++) {
      const hue = (i / 40) * 360;
      const rgb = hsvToRgb(hue, 1, 1);
      const hexColor = rgbToHex(rgb);
      const styled = fg(hexColor)('█');
      chunks.push(styled);
    }
    
    return new StyledText(chunks);
  });

  readonly attributeExamples = computed(
    () => t`
${bold('Bold Text')}
${fg('#888888')('Dim Text')}
${fg('#FF6464')(bold(underline('Combined Styles')))}
`,
  );

  readonly borderPhaseText = computed(() => `Phase: ${this.borderPhase() + 1}/8`);

  readonly animatedColor = computed(() => {
    const hue = (Date.now() / 100) % 360;
    const rgb = this.hsvToRgb(hue, 1, 0.7);
    return this.rgbToHex(rgb);
  });

  ngOnInit() {
    this.subscription = this.keyboardEvents.keyPress$.subscribe((event: KeyEvent) => {
      if (event.name === 'left' || event.name === '[') {
        this.prevTab();
      } else if (event.name === 'right' || event.name === ']') {
        this.nextTab();
      } else if (event.name === 'up' || event.name === 'arrowup') {
        this.animSpeed.update((s) => Math.min(5, s + 1));
      } else if (event.name === 'down' || event.name === 'arrowdown') {
        this.animSpeed.update((s) => Math.max(1, s - 1));
      }
    });

    this.animationInterval = setInterval(() => {
      // Animate moving box
      this.animPosition.update((pos) => {
        const speed = this.animSpeed();
        const newPos = pos + speed * 0.5;
        if (newPos > 50) return 5;
        return newPos;
      });

      // Animate border phase
      this.borderPhase.update((phase) => (phase + 1) % 8);
    }, 50);
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    if (this.animationInterval) {
      clearInterval(this.animationInterval);
    }
  }

  private nextTab() {
    const currentIndex = TABS.findIndex((t) => t.name === this.currentTab());
    const nextIndex = (currentIndex + 1) % TABS.length;
    this.currentTab.set(TABS[nextIndex].name);
  }

  private prevTab() {
    const currentIndex = TABS.findIndex((t) => t.name === this.currentTab());
    const prevIndex = currentIndex === 0 ? TABS.length - 1 : currentIndex - 1;
    this.currentTab.set(TABS[prevIndex].name);
  }

  private hsvToRgb(h: number, s: number, v: number): { r: number; g: number; b: number } {
    const c = v * s;
    const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
    const m = v - c;
    let r = 0,
      g = 0,
      b = 0;

    if (h >= 0 && h < 60) {
      r = c;
      g = x;
      b = 0;
    } else if (h >= 60 && h < 120) {
      r = x;
      g = c;
      b = 0;
    } else if (h >= 120 && h < 180) {
      r = 0;
      g = c;
      b = x;
    } else if (h >= 180 && h < 240) {
      r = 0;
      g = x;
      b = c;
    } else if (h >= 240 && h < 300) {
      r = x;
      g = 0;
      b = c;
    } else {
      r = c;
      g = 0;
      b = x;
    }

    return {
      r: Math.round((r + m) * 255),
      g: Math.round((g + m) * 255),
      b: Math.round((b + m) * 255),
    };
  }

  private rgbToHex(rgb: { r: number; g: number; b: number }): string {
    return '#' + [rgb.r, rgb.g, rgb.b].map((x) => x.toString(16).padStart(2, '0')).join('');
  }
}

const example: IExample = {
  id: 'opentui-demo',
  title: 'OpenTUI Demo',
  description: 'Demonstrates boxes, borders, titles, colors, and animations',
  component: OpentuiDemo,
};
export default example;
