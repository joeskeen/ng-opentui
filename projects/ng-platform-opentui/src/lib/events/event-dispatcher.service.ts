import { inject, Injectable, NgZone } from '@angular/core';
import { merge } from 'rxjs';
import { GlobalKeyboardEventsService } from './global-keyboard-events.service';
import { GlobalMouseEventsService } from './global-mouse-events.service';
import { TUI_ROOT_NODE, TuiNode } from '../renderer';
import { isMatch, parseAngularEventBinding } from './event-translation';

@Injectable({ providedIn: 'root' })
export class EventDispatcherService {
  private readonly rootNodeGetter = inject(TUI_ROOT_NODE).getRoot;
  private readonly ngZone = inject(NgZone);

  constructor(
    private readonly keyboardEvents: GlobalKeyboardEventsService,
    private readonly mouseEvents: GlobalMouseEventsService,
  ) {
    this.setupEventDispatching();
  }

  private setupEventDispatching() {
    const allEvents$ = merge(
      this.keyboardEvents.keyPress$,
      this.mouseEvents.allMouseEvent$,
    );

    allEvents$.subscribe((event) => {
      this.ngZone.run(() => {
        this.dispatchEvent(event);
      });
    });
  }

  private dispatchEvent(event: any) {
    const root = this.rootNodeGetter();
    if (!root) return;

    const allListeners = this.collectAllListeners(root);
    const eventType = (event as any).eventType ?? (event as any).type ?? event.name;
    const eventPattern = parseAngularEventBinding(eventType);

    if (!eventPattern) return;

    for (const { listener } of allListeners) {
      if (isMatch(eventPattern, event as any)) {
        try {
          listener.handler(event);
        } catch (err) {
          console.error('Error in event handler:', err);
        }
      }
    }
  }

  private collectAllListeners(
    node: TuiNode,
    results: { node: TuiNode; listener: { event: string; handler: (e: any) => void } }[] = [],
  ): { node: TuiNode; listener: { event: string; handler: (e: any) => void } }[] {
    const listeners = node.listeners();
    for (const listener of listeners) {
      results.push({ node, listener });
    }

    const children = node.children();
    for (const child of children) {
      this.collectAllListeners(child, results);
    }

    return results;
  }
}