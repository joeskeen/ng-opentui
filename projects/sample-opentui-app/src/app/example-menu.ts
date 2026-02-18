import { Component, effect, signal } from '@angular/core';
import { examples } from './app.routes';
import { Logger } from 'ng-platform-opentui';
import { RouterLink } from '@angular/router';

@Component({
  template: `
    <span>NG-OPENTUI EXAMPLES</span>
    @for (example of examples(); track example.id) {
      <a [routerLink]="'/examples/' + example.id">{{ example.title }}</a>
    }
  `,
  imports: [RouterLink],
})
export class ExampleMenu {
  readonly examples = signal(examples);
  constructor(logger: Logger) {
    effect(() => {
      const examples = this.examples();
      logger.log(ExampleMenu.name, { examples });
    });
  }
}
