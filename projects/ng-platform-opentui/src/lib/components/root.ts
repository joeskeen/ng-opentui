import { Directive, output } from '@angular/core';
import { KeyEvent, RootRenderable } from '@opentui/core';
import { TuiBaseComponent } from './tui-base.component';

export const ROOT_SELECTOR = '__tui-root__';

// this won't be rendered directly by Angular, but it is used as the root component for the OpenTUI render tree, 
// so that global events can be handled consistently with component-level events at the Renderer level
@Directive()
export class TuiRoot extends TuiBaseComponent<RootRenderable> {
  protected override createRenderable = () => this.renderer.root;
  readonly keypress = output<KeyEvent>();

  constructor() {
    super();
    
    // This makes global key events handled the same way as component-level key events
    // so you can do things like @Component({ host: { '(document:keypress.escape)': 'onKeyPress($event)' } })
    // and have it work for key presses anywhere in the app
    this.renderer.keyInput.addListener('keypress', (e) => {
      this.renderer.root.emit('keypress', e);
    });

    // TODO: I'm not sure whether there would be any value in marshalling other global
    // events like mouse or paste events in a similar way, but it would be easy to add if needed in the future
    // I'd normally expect host bindings to be used for keyboard events more often than mouse events, since 
    // mouse events are often more tied to specific components, and consumers can always use the GlobalMouseEventsService
    // to listen for global mouse events if needed
  }
}
