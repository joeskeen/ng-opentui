import { inject, Injectable } from '@angular/core';
import { filter, fromEvent, map, Observable } from 'rxjs';
import { KeyEvent } from '@opentui/core';
import { isMatch, EventPattern, parseAngularEventBinding } from './event-translation';
import { CLI_RENDERER } from '../renderer/cli-renderer';

@Injectable({ providedIn: 'root' })
export class GlobalKeyboardEventsService {
  private readonly cliRenderer = inject(CLI_RENDERER);

  readonly keyPress$ = fromEvent(this.cliRenderer.keyInput, 'keypress').pipe(
    map((event) => event as KeyEvent),
  );

  keyBind(keyBinding: EventPattern<KeyEvent> | string | null): Observable<KeyEvent> {
    if (typeof keyBinding === 'string') {
      keyBinding = parseAngularEventBinding(keyBinding);
    }
    if (!keyBinding) {
      throw new Error(`Invalid key binding: ${keyBinding}`);
    }

    return this.keyPress$.pipe(filter((event) => isMatch(keyBinding, event)));
  }
}
