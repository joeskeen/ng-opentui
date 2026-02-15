import 'zone.js'; // necessary for Zone change detection (haven't figured out how to go Zoneless yet)
import '@angular/compiler'; // necessary for JIT mode (haven't figure out how to get AOT working yet)
import { provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { bootstrapApplication } from 'ng-platform-opentui';
import { App } from './app/app';
import { routes } from './app/app.routes';

bootstrapApplication(App, {
  providers: [provideZoneChangeDetection(), provideRouter(routes)],
}).catch((err) => console.error(err));
