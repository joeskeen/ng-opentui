import { Renderable } from '@opentui/core';
import { Logger } from '../common/logger';

type EventHandler = (e: Event) => void;

const ALL_EVENTS: Array<keyof Renderable> = [
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
  ALL_EVENTS.forEach((eventName) => {
    Logger.instance.log(forwardEvents.name, {source, target, eventName});
    const orig = source[eventName] as EventHandler;
    (source as any)[eventName] = (event: Event) => {
        Logger.instance.log(eventName, {event, target, targetHandler: target[eventName], source, sourceHandler: orig});
        try {
            (target[eventName] as EventHandler)?.(event);
            if (!event.defaultPrevented) {
                orig?.(event);
            }
        } catch(err) {
            Logger.instance.log(`[ERROR] ${err}\n\t${(err as any)?.stack}`);
        }
    };
  });
}
