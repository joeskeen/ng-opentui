import {
  computed,
  contentChildren,
  Directive,
  effect,
  ElementRef,
  inject,
  InjectionToken,
  Injector,
  input,
  InputSignal,
  OnDestroy,
  OnInit,
  OutputEmitterRef,
  runInInjectionContext,
  Type,
} from '@angular/core';
import { BaseRenderable, RGBA } from '@opentui/core';
import type { TuiNode } from '../renderer/tui-node';
import { SIGNAL } from '@angular/core/primitives/signals';
import { CLI_RENDERER } from '../renderer/cli-renderer';
import { Logger } from '../common';
import { randomUUID } from 'crypto';

export const TUI_CONTENT = new InjectionToken<TuiBaseComponent>('TUI_CONTENT');
export function provideTuiContent(componentType: Type<TuiBaseComponent>) {
  return [{ provide: TUI_CONTENT, useExisting: componentType }];
}

export type ScreenColor = RGBA | string;

export function isInputSignal(value: any): value is InputSignal<any> {
  const signalKey = (value as InputSignal<any>)?.[SIGNAL];
  const applyFn = (signalKey as any)?.['applyValueToInputSignal'];
  return typeof applyFn === 'function';
}

export function isOutput(value: any): value is OutputEmitterRef<any> {
  return (
    typeof value === 'object' &&
    'emit' in value &&
    'subscribe' in value &&
    typeof value.emit === 'function' &&
    typeof value.subscribe === 'function'
  );
}

@Directive()
export abstract class TuiBaseComponent<T extends BaseRenderable = BaseRenderable> implements OnInit, OnDestroy {
  private readonly injector = inject(Injector);
  protected readonly logger = inject(Logger);
  protected readonly renderer = inject(CLI_RENDERER);
  protected readonly tuiNode = inject(ElementRef).nativeElement as TuiNode<T>;
  protected readonly renderable = this.tuiNode.renderable;
  protected readonly renderableType = computed(() => this.renderable()?.constructor?.name ?? '');
  protected readonly contentChildren = contentChildren(TUI_CONTENT);

  readonly id = input<string>(randomUUID());
  readonly visible = input<boolean>(true);

  constructor() {
    this.tuiNode.component.set(this);
    effect(() => {
      const children = this.tuiNode.renderableChildren();
      this.logger.log(this.renderChildren.name, { component: this, children });
      this.renderChildren();
    });
  }

  ngOnInit(): void {
    this.logger.log(this.ngOnInit.name, { component: this });
    runInInjectionContext(this.injector, () => {
      const renderable = this.createRenderable();
      this.renderable.set(renderable);
      this.synchronizeInputs(renderable);
      this.synchronizeEvents(renderable);
    });
  }

  ngOnDestroy(): void {
    try {
      this.logger.log(this.ngOnDestroy.name, { component: this });
      // this.renderable()?.parent?.remove(this.id());
      // this.tuiNode.children.set([]);
      // this.renderable()?.destroy();
    } catch {}
  }

  protected abstract readonly createRenderable: () => T;
  protected renderChildren(): void {}

  private synchronizeInputs(renderable: T) {
    for (const key of Object.keys(this)) {
      const value = (this as any)[key];
      if (isInputSignal(value) && key in renderable) {
        effect(() => {
          const v = value();
          if (v !== undefined && v !== null) {
            this.logger.log(`synchronizing "${key}"="${v}"`, { component: this, renderable });
            (renderable as any)[key] = v;
          }
        });
      }
    }
  }

  private synchronizeEvents(renderable: T) {
    for (const key of Object.keys(this)) {
      const value = (this as any)[key];
      const renderableKey = 'on' + key.charAt(0).toUpperCase() + key.slice(1);
      if (isOutput(value)) {
        if (renderableKey in renderable) {
          (renderable as any)[renderableKey] = (event: any) => value.emit(event);
        } else {
          renderable.on(key, (event: any) => value.emit(event));
        }
      }
    }
  }

  toString(): string {
    return `${this.constructor.name}(id: ${this.id()}, type: ${this.renderableType})`;
  }
}
