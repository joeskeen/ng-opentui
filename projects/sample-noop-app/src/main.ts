import { bootstrapApplication } from 'ng-platform-noop';
import { App } from './app/app';

bootstrapApplication(App, {providers: []})
  .then(app => {
    console.log(app, `
      
      🎉 Congrats! Your minimal Angular app successfully bootstrapped on
      the noop platform! 🎉

      You can inspect the ApplicationRef object printed above.

      Since there is nothing else to do, the process will now exit.
    `);
  })
  .catch((err) => console.error(err));
