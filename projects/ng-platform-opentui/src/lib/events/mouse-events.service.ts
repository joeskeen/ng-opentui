import { EventEmitter, inject, Injectable } from '@angular/core';
import { CLI_RENDERER } from '../renderer/opentui-renderer';
import { MouseEvent } from '@opentui/core';
import { merge } from 'rxjs';


@Injectable({ providedIn: 'root' })
export class MouseEventsService {
  private readonly cliRenderer = inject(CLI_RENDERER);
  readonly mouse$ = new EventEmitter<MouseEvent>();
  readonly mouseDown$ = new EventEmitter<MouseEvent>();
  readonly mouseDrag$ = new EventEmitter<MouseEvent>();
  readonly mouseDragEnd$ = new EventEmitter<MouseEvent>();
  readonly mouseDrop$ = new EventEmitter<MouseEvent>();
  readonly mouseMove$ = new EventEmitter<MouseEvent>();
  readonly mouseOut$ = new EventEmitter<MouseEvent>();
  readonly mouseOver$ = new EventEmitter<MouseEvent>();
  readonly mouseScroll$ = new EventEmitter<MouseEvent>();
  readonly mouseUp$ = new EventEmitter<MouseEvent>();
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

  constructor() {
    this.registerMouseEvents();
  }

  registerMouseEvents() {
    this.cliRenderer.root.onMouse = (e) => this.mouse$.emit(e);
    this.cliRenderer.root.onMouseDown = (e) => this.mouseDown$.emit(e);
    this.cliRenderer.root.onMouseDrag = (e) => this.mouseDrag$.emit(e);
    this.cliRenderer.root.onMouseDragEnd = (e) => this.mouseDragEnd$.emit(e);
    this.cliRenderer.root.onMouseDrop = (e) => this.mouseDrop$.emit(e);
    this.cliRenderer.root.onMouseMove = (e) => this.mouseMove$.emit(e);
    this.cliRenderer.root.onMouseOut = (e) => this.mouseOut$.emit(e);
    this.cliRenderer.root.onMouseOver = (e) => this.mouseOver$.emit(e);
    this.cliRenderer.root.onMouseScroll = (e) => this.mouseScroll$.emit(e);
    this.cliRenderer.root.onMouseUp = (e) => this.mouseUp$.emit(e);
  }
}
