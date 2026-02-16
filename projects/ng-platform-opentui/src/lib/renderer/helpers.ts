import {
  TextRenderable,
  BoxRenderable,
  ScrollBoxRenderable,
  SelectRenderable,
  InputRenderable,
  TextareaRenderable,
  MarkdownRenderable,
  CodeRenderable,
  DiffRenderable,
  TextNodeRenderable,
  type Renderable,
} from '@opentui/core';

export function isLayoutRenderable(r: any): r is Renderable & { getLayoutNode(): () => any } {
  return !!r && typeof r.getLayoutNode === 'function';
}

export function isBlockContainer(r: any): boolean {
  return (
    r instanceof TextRenderable ||
    r instanceof BoxRenderable ||
    r instanceof ScrollBoxRenderable ||
    r instanceof SelectRenderable ||
    r instanceof InputRenderable ||
    r instanceof TextareaRenderable ||
    r instanceof MarkdownRenderable ||
    r instanceof CodeRenderable ||
    r instanceof DiffRenderable
  );
}

export function isInlineTextNode(r: any): r is TextNodeRenderable {
  return r instanceof TextNodeRenderable;
}
