import { TextBufferRenderable } from '@opentui/core';
import { TuiRenderableComponent } from './tui-renderable.component';
import { booleanAttribute, Directive, input } from '@angular/core';
import { Optional } from '../common/optional';
import { ScreenColor } from './tui-base.component';

export type WrapMode = 'none' | 'char' | 'word';

@Directive()
export abstract class TextBufferComponent<T extends TextBufferRenderable> extends TuiRenderableComponent<T> {
  readonly scrollY = input<Optional<number>>();
  readonly scrollX = input<Optional<number>>();
  readonly fg = input<Optional<ScreenColor>>();
  readonly selectionBg = input<Optional<ScreenColor>>();
  readonly selectionFg = input<Optional<ScreenColor>>();
  readonly bg = input<Optional<ScreenColor>>();
  readonly attributes = input<Optional<number>>();
  readonly wrapMode = input<Optional<WrapMode>>();
  readonly tabIndicator = input<Optional<string | number>>();
  readonly tabIndicatorColor = input<Optional<ScreenColor>>();
  readonly truncate = input(undefined, { transform: booleanAttribute });
}
