import { booleanAttribute, Directive, input, output } from '@angular/core';
import {
  Renderable,
  PositionTypeString,
  OverflowString,
  FlexDirectionString,
  WrapString,
  AlignString,
  JustifyString,
  MouseEvent,
  PasteEvent,
  KeyEvent,
} from '@opentui/core';
import { TuiBaseComponent } from './tui-base.component';
import { Optional } from '../common/optional';

export type Auto = 'auto';
export type ScreenUnit = number | `${number}%`;
export type ScreenUnitOrAuto = ScreenUnit | Auto;
export type HorizontalAlignment = 'left' | 'center' | 'right';

@Directive()
export abstract class TuiRenderableComponent<T extends Renderable = Renderable> extends TuiBaseComponent<T> {
  readonly focusable = input(undefined, { transform: booleanAttribute });
  readonly opacity = input<Optional<number>>();
  readonly live = input(undefined, { transform: booleanAttribute });
  readonly translateX = input<Optional<number>>();
  readonly translateY = input<Optional<number>>();
  readonly x = input<Optional<number>>();
  readonly y = input<Optional<number>>();
  readonly top = input<Optional<ScreenUnitOrAuto>>();
  readonly right = input<Optional<ScreenUnitOrAuto>>();
  readonly bottom = input<Optional<ScreenUnitOrAuto>>();
  readonly left = input<Optional<ScreenUnitOrAuto>>();
  readonly width = input<Optional<ScreenUnitOrAuto>>();
  readonly height = input<Optional<ScreenUnitOrAuto>>();
  readonly zIndex = input<Optional<number>>();
  readonly position = input<Optional<PositionTypeString>>();
  readonly overflow = input<Optional<OverflowString>>();
  readonly flexGrow = input<Optional<number>>();
  readonly flexShrink = input<Optional<number>>();
  readonly flexDirection = input<Optional<FlexDirectionString>>();
  readonly flexWrap = input<Optional<WrapString>>();
  readonly alignItems = input<Optional<AlignString>>();
  readonly justifyContent = input<Optional<JustifyString>>();
  readonly alignSelf = input<Optional<AlignString>>();
  readonly flexBasis = input<Optional<number | Auto>>();
  readonly minWidth = input<Optional<ScreenUnit>>();
  readonly maxWidth = input<Optional<ScreenUnit>>();
  readonly minHeight = input<Optional<ScreenUnit>>();
  readonly maxHeight = input<Optional<ScreenUnit>>();
  readonly margin = input<Optional<ScreenUnitOrAuto>>();
  readonly marginX = input<Optional<ScreenUnitOrAuto>>();
  readonly marginY = input<Optional<ScreenUnitOrAuto>>();
  readonly marginTop = input<Optional<ScreenUnitOrAuto>>();
  readonly marginRight = input<Optional<ScreenUnitOrAuto>>();
  readonly marginBottom = input<Optional<ScreenUnitOrAuto>>();
  readonly marginLeft = input<Optional<ScreenUnitOrAuto>>();
  readonly padding = input<Optional<ScreenUnit>>();
  readonly paddingX = input<Optional<ScreenUnit>>();
  readonly paddingY = input<Optional<ScreenUnit>>();
  readonly paddingTop = input<Optional<ScreenUnit>>();
  readonly paddingRight = input<Optional<ScreenUnit>>();
  readonly paddingBottom = input<Optional<ScreenUnit>>();
  readonly paddingLeft = input<Optional<ScreenUnit>>();

  readonly mouse = output<MouseEvent>();
  readonly mouseDown = output<MouseEvent>();
  readonly mouseUp = output<MouseEvent>();
  readonly mouseMove = output<MouseEvent>();
  readonly mouseDrag = output<MouseEvent>();
  readonly mouseDragEnd = output<MouseEvent>();
  readonly mouseDrop = output<MouseEvent>();
  readonly mouseOver = output<MouseEvent>();
  readonly mouseOut = output<MouseEvent>();
  readonly mouseScroll = output<MouseEvent>();
  readonly paste = output<PasteEvent>();
  readonly keyDown = output<KeyEvent>();
  readonly sizeChange = output();
  readonly focused = output();
  readonly blurred = output();
}
