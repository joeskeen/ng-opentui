import { Route, Routes } from '@angular/router';
import { readdirSync } from 'fs';
import { join } from 'path';
import { IExample } from './IExample';
import { Logger } from 'ng-platform-opentui';

const __dirname = import.meta.dirname;
const examplesDir = join(__dirname, 'examples');
const exampleFiles = readdirSync(examplesDir).filter((f) => /\.example\.[^\.]+$/.test(f));
export const examples = await Promise.all(
  exampleFiles.map((f) => import(`./examples/${f}`).then((x) => x.default as IExample)),
);
Logger.instance.log('app.routes.ts', {__dirname, examplesDir, exampleFiles, examples});

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'examples' },
  {
    path: 'examples',
    pathMatch: 'full',
    loadComponent: () => import('./example-menu').then((m) => m.ExampleMenu),
  },
  ...examples.map((e) => ({ path: `examples/${e.id}`, component: e.component }) as Route)
];
