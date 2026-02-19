import { Component, input } from '@angular/core';
import { BorderCharacters, BorderSides, BorderStyle, BoxRenderable } from '@opentui/core';
import { provideTuiContent, ScreenColor } from './tui-base.component';
import { HorizontalAlignment, ScreenUnit, TuiRenderableComponent } from './tui-renderable.component';
import { Optional } from '../common/optional';
import { clearRenderable, collectRenderableChildren } from '../renderer/render-tree';
import { treeToString } from '../common';

@Component({
  selector: 'box,div', // div is needed as Angular creates <div> by default
  template: `<ng-content></ng-content>`,
  providers: [provideTuiContent(TuiBox)],
})
export class TuiBox extends TuiRenderableComponent<BoxRenderable> {
  readonly customBorderChars = input<Optional<BorderCharacters>>();
  readonly backgroundColor = input<Optional<ScreenColor>>();
  readonly border = input<Optional<boolean | BorderSides[]>>();
  readonly borderStyle = input<Optional<BorderStyle>>();
  readonly borderColor = input<Optional<ScreenColor>>();
  readonly focusedBorderColor = input<Optional<ScreenColor>>();
  readonly title = input<Optional<string>>();
  readonly titleAlignment = input<Optional<HorizontalAlignment>>();
  readonly gap = input<Optional<ScreenUnit>>();
  readonly rowGap = input<Optional<ScreenUnit>>();
  readonly columnGap = input<Optional<ScreenUnit>>();

  protected override readonly createRenderable = () => new BoxRenderable(this.renderer, {});

  protected override renderChildren(): void {
    const renderable = this.renderable();
    if (!renderable) {
      return;
    }

    clearRenderable(renderable);

    const children = this.tuiNode.renderableChildren();
    this.logger.log(this.renderChildren.name, {
      component: TuiBox.name,
      id: this.id(),
      children: children.map((c) => `${c.constructor.name}#${c.id}`).join(', '),
    });
    children.forEach((c) => renderable.add(c));
  }
}
