import { TextNodeRenderable } from '@opentui/core';
import { provideTuiContent, ScreenColor, TuiBaseComponent } from './tui-base.component';
import { Directive, input } from '@angular/core';
import { Optional } from '../common/optional';

@Directive({
  providers: [provideTuiContent(TuiTextNode)],
})
export class TuiTextNode extends TuiBaseComponent<TextNodeRenderable> {
  readonly children = input<Optional<string | TextNodeRenderable[]>>();
  readonly fg = input<Optional<ScreenColor>>();
  readonly bg = input<Optional<ScreenColor>>();
  readonly attributes = input<Optional<number>>();
  readonly link = input<Optional<{link: string}>>();
  protected override createRenderable = () => new TextNodeRenderable({});
}
