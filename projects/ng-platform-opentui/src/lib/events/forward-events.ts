import { Renderable } from '@opentui/core';
import { Logger, valueToString } from '../common/logger';

type EventHandler = (e: Event) => void;

const ALL_EVENTS: Array<keyof Renderable & string> = [
  'onMouse',
  'onMouseDown',
  'onMouseDrag',
  'onMouseDragEnd',
  'onMouseDrop',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseScroll',
  'onMouseUp',
  'onKeyDown',
  'onPaste',
  'onSelectionChanged',
  'onSizeChange',
];

export function forwardEvents(source: Renderable, target: Renderable) {
  if (source === target) {
    return;
  }
  
  ALL_EVENTS.forEach((eventName: string) => {
    const orig = (source as any)[eventName] as EventHandler;
    (source as any)[eventName] = (event: Event) => {
      try {
        ((target as any)[eventName] as EventHandler)?.(event);
      } catch (err) {
        Logger.instance.log(`[WARN] Error thrown while executing event handler for ${eventName} on ${valueToString(target)}: ${err}\n\t${(err as any)?.stack}`);
      }
      if (!event?.defaultPrevented) {
        try {
          orig?.(event);
        } catch (error) {
          Logger.instance.log(`[WARN] Error thrown while executing event handler for ${eventName} on ${valueToString(source)}: ${error}\n\t${(error as any)?.stack}`);
        }
      }
    };
  });
}
