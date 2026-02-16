import { Component, effect, signal } from '@angular/core';
import { examples } from './app.routes';
import { Logger } from 'ng-platform-opentui';

@Component({
  template: `
    <span>Examples</span>
    <span>{{examples().length}}</span>
    <span>Before</span>
    @for (example of examples(); track example.id) {
      <span>{{ example.title }}</span>
    }
    <span>After</span>
  `,
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
