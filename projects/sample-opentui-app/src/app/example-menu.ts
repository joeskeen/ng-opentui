import { Component, effect, signal } from '@angular/core';
import { examples } from './app.routes';
import { Logger, TuiText } from 'ng-platform-opentui';
import { RouterLink } from '@angular/router';

@Component({
  template: `
    <text>NG-OPENTUI EXAMPLES</text>
    @for (example of examples(); track example.id) {
      <text [routerLink]="'/examples/' + example.id" [content]="example.title"></text>
    }
  `,
  imports: [RouterLink, TuiText],
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
