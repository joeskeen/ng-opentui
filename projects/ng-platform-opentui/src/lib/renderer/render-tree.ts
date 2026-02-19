import { BaseRenderable, RenderContext, TextRenderable } from '@opentui/core';
import { TuiNode } from './tui-node';
import { Logger } from '../common';

export function collectRenderableChildren(node: TuiNode): BaseRenderable[] {
  const results: BaseRenderable[] = [];

  for (const child of node.children()) {
    let r = child.renderable();
    const value = child.value();
    if (!r && value) {
      const renderableParent = getRenderableParent(child);
      if (!renderableParent) {
        continue;
      }

      if (!(renderableParent instanceof TextRenderable)) {
        r = new TextRenderable(node.context, { content: value });
      }
    }

    if (r) {
      // This child is a renderable boundary — include it and stop
      results.push(r);
    } else {
      // No renderable here — recurse into its children
      const nested = collectRenderableChildren(child);
      results.push(...nested);
    }
  }

  return results;
}

export function getRenderableParent(node: TuiNode): BaseRenderable | null {
  const parent = node.parent();
  const parentRenderable = parent?.renderable();
  if (parent === null) {
    return null;
  }

  return parentRenderable ?? getRenderableParent(parent);
}

export function clearRenderable(renderable: BaseRenderable) {
  if (!renderable) {
    return;
  }
  Logger.instance.log('nuking kids', `${renderable.constructor.name}#${renderable.id}`);
  renderable.getChildren().forEach((c) => renderable.remove(c.id));
}
