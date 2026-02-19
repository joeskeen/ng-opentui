import { inject, Injectable } from '@angular/core';
import { MouseEvent, RootRenderable } from '@opentui/core';
import { fromEventPattern, merge } from 'rxjs';
import { CLI_RENDERER } from '../renderer/cli-renderer';

@Injectable({ providedIn: 'root' })
export class GlobalMouseEventsService {
  private readonly cliRenderer = inject(CLI_RENDERER);
  readonly mouse$ = this.registerMouseEvent('onMouse');
  readonly mouseDown$ = this.registerMouseEvent('onMouseDown');
  readonly mouseDrag$ = this.registerMouseEvent('onMouseDrag');
  readonly mouseDragEnd$ = this.registerMouseEvent('onMouseDragEnd');
  readonly mouseDrop$ = this.registerMouseEvent('onMouseDrop');
  readonly mouseMove$ = this.registerMouseEvent('onMouseMove');
  readonly mouseOut$ = this.registerMouseEvent('onMouseOut');
  readonly mouseOver$ = this.registerMouseEvent('onMouseOver');
  readonly mouseScroll$ = this.registerMouseEvent('onMouseScroll');
  readonly mouseUp$ = this.registerMouseEvent('onMouseUp');
  readonly allMouseEvent$ = merge(
    this.mouse$,
    this.mouseDown$,
    this.mouseDrag$,
    this.mouseDragEnd$,
    this.mouseDrop$,
    this.mouseMove$,
    this.mouseOut$,
    this.mouseOver$,
    this.mouseScroll$,
    this.mouseUp$,
  );

  private registerMouseEvent(propName: keyof RootRenderable) {
    const target = this.cliRenderer.root as any;
    return fromEventPattern<MouseEvent>(
      (handler) => (target[propName] = handler),
      () => (target[propName] = undefined),
    );
  }
}
