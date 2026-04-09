import { Component, effect, signal, inject, OnInit, computed } from '@angular/core';
import { Router } from '@angular/router';
import { examples } from './app.routes';
import { GlobalKeyboardEventsService, Logger, TuiBox, TuiSelect, TuiText } from 'ng-platform-opentui';

@Component({
  template: `
    <box flexDirection="column" height="100%" borderStyle="single" borderColor="#475569" title="Examples" titleAlignment="center">
      <select 
        [flexGrow]="1"
        [options]="selectOptions()"
        [selectedIndex]="selectedIndex()"
        selectedBackgroundColor="#1E3A5F"
        selectedTextColor="#38BDF8"
        textColor="#E2E8F0"
        descriptionColor="#64748B"
        selectedDescriptionColor="#94A3B8"
        [showScrollIndicator]="true"
        [showDescription]="true"
        [wrapSelection]="true"
        (itemSelected)="onSelect($event)"
      ></select>
      <text content="↑↓/j/k navigate | Enter run | Esc return | ctrl+c quit" fg="#94A3B8" alignSelf="center"></text>
    </box>
  `,
  imports: [TuiBox, TuiSelect, TuiText],
})
export class ExampleMenu implements OnInit {
  readonly examples = signal(examples);
  readonly selectedIndex = signal(0);
  private readonly logger = inject(Logger);
  private readonly keyboardEvents = inject(GlobalKeyboardEventsService);
  private readonly router = inject(Router);

  readonly selectOptions = computed(() => 
    this.examples().map(e => ({
      name: e.title,
      description: e.id,
      value: e,
    }))
  );

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

  onSelect(index: number) {
    this.navigateToExample(index);
  }

  private navigateToExample(index: number) {
    const example = this.examples()[index];
    if (example) {
      this.router.navigateByUrl(`/examples/${example.id}`);
    }
  }
}