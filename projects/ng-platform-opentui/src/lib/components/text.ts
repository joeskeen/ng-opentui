import { Component, contentChildren, Directive, effect, input } from '@angular/core';
import { TextRenderable, StyledText, t } from '@opentui/core';
import { TextBufferComponent } from './text-buffer.component';
import { provideTuiContent } from './tui-base.component';
import { Optional } from '../common/optional';

export type TextValue = Optional<string | StyledText>;

@Component({
  selector: 'text',
  template: `<ng-content></ng-content>`,
  providers: [provideTuiContent(TuiText)],
})
export class TuiText extends TextBufferComponent<TextRenderable> {
  readonly content = input<TextValue>();
  protected override createRenderable = () => new TextRenderable(this.renderer, {});
  constructor() {
    super();
    effect(() => {
      const value = this.tuiNode.value();
      const renderable = this.renderable();
      this.logger.log('effect:value', { component: this, value, renderable });
      if (value && renderable) {
        renderable.content = value;
      }
    });
    effect(() => {
      const children = this.tuiNode
        .children()
        .map((c) => c.value())
        .filter((v) => !!v);
      const renderable = this.renderable();
      this.logger.log('effect:children', { component: this, children, renderable });
      if (children.length && renderable) {
        const content = children.join('');
        renderable.content = t`${content}`;
        this.logger.log('effect:children:end', { component: this, content: renderable.content });
      }
    });
  }
}
