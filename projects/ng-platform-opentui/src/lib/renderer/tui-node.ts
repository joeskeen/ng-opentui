import { computed, signal } from '@angular/core';
import type { TuiBaseComponent } from '../components/tui-base.component';
import { BaseRenderable, RenderContext } from '@opentui/core';
import { collectRenderableChildren } from './render-tree';

export type EventHandler = (e: Event) => void;
export type EventListener = { event: string; handler: EventHandler };
export type Decorated<T extends BaseRenderable | never = never> = { ɵtuiNode: TuiNode<T> };
export type DecoratedRenderable<T extends BaseRenderable> = T & Decorated<T>;

export class TuiNode<T extends BaseRenderable = BaseRenderable> {
  readonly parent = signal<TuiNode | null>(null);
  readonly component = signal<TuiBaseComponent<T> | null>(null);
  readonly renderable = signal<T | null>(null);
  readonly children = signal<TuiNode<BaseRenderable>[]>([]);
  readonly value = signal<any>(null);
  readonly attributes = signal<Record<string, any>>({});
  readonly attachedListeners = signal<EventListener[]>([]);
  readonly listeners = signal<EventListener[]>([]);
  readonly unattachedListeners = computed(() => {
    const listeners = this.listeners();
    const attached = this.attachedListeners();
    return listeners.filter(
      ({ event, handler }) =>
        !attached.find(({ event: aEvent, handler: aHandler }) => aEvent === event && aHandler === handler),
    );
  });
  readonly renderableChildren = computed(() => collectRenderableChildren(this));

  constructor(
    public readonly context: RenderContext,
    public readonly selector?: string,
    value?: string,
  ) {
    this.value.set(value);
  }

  toString(): string {
    const renderableType = this.renderable()?.constructor?.name;
    const renderableId = this.renderable()?.id;
    const componentType = this.component()?.constructor?.name;
    return `TuiNode[${this.selector}](renderable: ${
      renderableType ?? ''
    }${renderableId ? `#${renderableId}` : ''}, component: ${componentType ?? 'null'}, value: ${this.value})`;
  }
}
