import { RootRenderable } from '@opentui/core';
import { Logger, treeToString } from '../common';
import { CLI_RENDERER, TuiNode } from '../renderer';
import { TuiBaseComponent } from './tui-base.component';
import { computed, Directive, effect, inject, InputSignal, OnDestroy, OnInit } from '@angular/core';
import { collectRenderableChildren } from '../renderer/render-tree';

@Directive() // decorated to enable DI
export class TuiRoot implements Partial<TuiBaseComponent<RootRenderable>>, OnInit, OnDestroy {
  readonly logger = inject(Logger);
  readonly renderer = inject(CLI_RENDERER);
  readonly tuiNode = inject<TuiNode<RootRenderable>>(TuiNode);
  readonly renderable = this.tuiNode.renderable;
  readonly children = this.tuiNode.children;
  readonly id = computed(() => {
    return this.tuiNode.renderable()!.id;
  }) as InputSignal<string>;

  constructor() {
    effect(() => {
      const children = collectRenderableChildren(this.tuiNode);
      const renderable = this.renderable()!;
      this.logger.log(`${TuiRoot.name}:effect:children`, {
        children: children.map((c) => `${c.constructor.name}#${c.id}`).join(', '),
      });
      if (children.length) {
        renderable
          .getChildren()
          .map((c) => c.id)
          .forEach((c) => renderable.remove(c));
        children.forEach((c) => renderable.add(c));
      }
    });
  }
  visible?: InputSignal<boolean> | undefined;
  ngOnInit(): void {
    // TODO: hook up events
  }
  ngOnDestroy(): void {
    this.renderable()?.destroyRecursively();
  }
  toString(): string {
    return 'root node component';
  }
}
