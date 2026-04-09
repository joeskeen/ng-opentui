import { Component, input, output, effect } from '@angular/core';
import { SelectRenderable, SelectRenderableEvents, type SelectOption } from '@opentui/core';
import { TuiRenderableComponent } from './tui-renderable.component';
import { ScreenColor } from './tui-base.component';

export type { SelectOption };

@Component({
  selector: 'select',
  template: `<!-- SelectRenderable managed by Angular -->`,
})
export class TuiSelect extends TuiRenderableComponent<SelectRenderable> {
  readonly options = input<SelectOption[]>([]);
  readonly selectedIndex = input(0);
  readonly backgroundColor = input<ScreenColor>();
  readonly textColor = input<ScreenColor>();
  readonly focusedBackgroundColor = input<ScreenColor>();
  readonly focusedTextColor = input<ScreenColor>();
  readonly selectedBackgroundColor = input<ScreenColor>();
  readonly selectedTextColor = input<ScreenColor>();
  readonly descriptionColor = input<ScreenColor>();
  readonly selectedDescriptionColor = input<ScreenColor>();
  readonly showScrollIndicator = input(true);
  readonly wrapSelection = input(true);
  readonly showDescription = input(true);
  readonly fastScrollStep = input(5);

  readonly selectionChanged = output<number>();
  readonly itemSelected = output<number>();

  protected override readonly createRenderable = () => new SelectRenderable(this.renderer, {});

  constructor() {
    super();

    effect(() => {
      const renderable = this.renderable();
      if (!renderable) return;
      
      const opts = this.options();
      if (opts?.length) {
        renderable.options = opts;
      }
    });

    effect(() => {
      const renderable = this.renderable();
      if (!renderable) return;
      
      const idx = this.selectedIndex();
      if (idx !== undefined) {
        renderable.selectedIndex = idx;
      }
    });

    effect(() => {
      const renderable = this.renderable();
      if (!renderable) return;
      
      renderable.showScrollIndicator = this.showScrollIndicator();
      renderable.showDescription = this.showDescription();
      renderable.wrapSelection = this.wrapSelection();
    });

    effect(() => {
      const renderable = this.renderable();
      if (!renderable) return;
      
      const bg = this.backgroundColor();
      if (bg) renderable.backgroundColor = bg;
    });

    effect(() => {
      const renderable = this.renderable();
      if (!renderable) return;
      
      const tc = this.textColor();
      if (tc) renderable.textColor = tc;
    });

    effect(() => {
      const renderable = this.renderable();
      if (!renderable) return;
      
      const sbg = this.selectedBackgroundColor();
      if (sbg) renderable.selectedBackgroundColor = sbg;
    });

    effect(() => {
      const renderable = this.renderable();
      if (!renderable) return;
      
      const stc = this.selectedTextColor();
      if (stc) renderable.selectedTextColor = stc;
    });

    effect(() => {
      const renderable = this.renderable();
      if (!renderable) return;
      
      const dc = this.descriptionColor();
      if (dc) renderable.descriptionColor = dc;
    });

    effect(() => {
      const renderable = this.renderable();
      if (!renderable) return;
      
      const sdc = this.selectedDescriptionColor();
      if (sdc) renderable.selectedDescriptionColor = sdc;
    });

    effect(() => {
      const renderable = this.renderable();
      if (!renderable) return;
      
      renderable.on(SelectRenderableEvents.SELECTION_CHANGED, (index: number) => {
        this.selectionChanged.emit(index);
      });
      renderable.on(SelectRenderableEvents.ITEM_SELECTED, (index: number) => {
        this.itemSelected.emit(index);
      });
    });
  }
}