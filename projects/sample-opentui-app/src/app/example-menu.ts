import { Component, signal } from '@angular/core';
import { examples } from './app.routes';
import { RouterLink } from '@angular/router';

@Component({
  template: `
    <span>Examples</span>
    @for (example of examples(); track example.id) {
      <span>
        <a [routerLink]="['/examples/', example.id]">{{ example.title }}</a>
      </span>
    }
  `,
  imports: [RouterLink],
})
export class ExampleMenu {
  readonly examples = signal(examples);
}
