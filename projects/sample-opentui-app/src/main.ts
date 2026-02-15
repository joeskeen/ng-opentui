import 'zone.js';
import '@angular/compiler';
import { bootstrapApplication } from 'ng-platform-opentui';
import { App } from './app/app';
import { provideZoneChangeDetection } from '@angular/core';

bootstrapApplication(App, { providers: [provideZoneChangeDetection()] })
  .catch((err) => console.error(err));
