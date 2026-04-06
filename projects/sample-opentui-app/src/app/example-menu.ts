import { Component, effect, signal, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { examples } from './app.routes';
import { GlobalKeyboardEventsService, Logger, TuiText } from 'ng-platform-opentui';

@Component({
  template: `
    <text>NG-OPENTUI EXAMPLES</text>
    @for (example of examples(); track example.id; let i = $index) {
      <text 
        [content]="example.title" 
        [focusable]="true"
        [fg]="i === selectedIndex() ? '#00FF00' : '#FFFFFF'"
        (focused)="onFocus(i)"
        (blurred)="onBlur()"
      ></text>
    }
  `,
  imports: [TuiText],
})
export class ExampleMenu implements OnInit {
  readonly examples = signal(examples);
  readonly selectedIndex = signal(0);
  private readonly logger = inject(Logger);
  private readonly keyboardEvents = inject(GlobalKeyboardEventsService);
  private readonly router = inject(Router);

  constructor() {
    effect(() => {
      const examples = this.examples();
      this.logger.log(ExampleMenu.name, { examples });
    });
  }

  ngOnInit() {
    this.keyboardEvents.keyPress$.subscribe((event) => {
      const currentIndex = this.selectedIndex();
      const maxIndex = this.examples().length - 1;

      if (event.name === 'down' || event.name === 'j') {
        this.selectedIndex.set(currentIndex < maxIndex ? currentIndex + 1 : 0);
      } else if (event.name === 'up' || event.name === 'k') {
        this.selectedIndex.set(currentIndex > 0 ? currentIndex - 1 : maxIndex);
      } else if (event.name === 'enter' || event.name === 'return' || event.name === 'linefeed') {
        this.navigateToExample(currentIndex);
      }
    });
  }

  onFocus(index: number) {
    this.selectedIndex.set(index);
  }

  onBlur() {
  }

  private navigateToExample(index: number) {
    const example = this.examples()[index];
    if (example) {
      this.router.navigateByUrl(`/examples/${example.id}`);
    }
  }
}