import { Component } from '@angular/core';

@Component({
  template: `Hi: {{ message }}`
})
export class App {
  message = 'Hello World';
}
