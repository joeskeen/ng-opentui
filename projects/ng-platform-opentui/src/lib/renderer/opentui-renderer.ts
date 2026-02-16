import {
  Renderer2,
  InjectionToken,
  Type,
} from '@angular/core';

import {
  type CliRenderer,
  type Renderable,
  TextRenderable,
  BoxRenderable,
  CodeRenderable,
  DiffRenderable,
  InputRenderable,
  LineNumberRenderable,
  MarkdownRenderable,
  ScrollBoxRenderable,
  SelectRenderable,
  TabSelectRenderable,
  TextareaRenderable,
  BaseRenderable,
  TextNodeRenderable,
  RootTextNodeRenderable,
} from '@opentui/core';
import { dumpRenderableTree, Logger } from '../common/logger';
import {
  BoldSpanRenderable,
  ItalicSpanRenderable,
  LineBreakRenderable,
  LinkRenderable,
  SpanRenderable,
  UnderlineSpanRenderable,
} from './text-renderables';
import { randomUUID } from 'crypto';
import { isLayoutRenderable } from './helpers';

const ELEMENT_MAP: Record<string, Type<BaseRenderable>> = {
  text: TextRenderable,
  box: BoxRenderable,
  scrollbox: ScrollBoxRenderable,
  input: InputRenderable,
  textarea: TextareaRenderable,
  select: SelectRenderable,
  'tab-select': TabSelectRenderable,
  code: CodeRenderable,
  'line-number': LineNumberRenderable,
  diff: DiffRenderable,
  markdown: MarkdownRenderable,

  // inline text
  span: SpanRenderable,
  b: BoldSpanRenderable,
  strong: BoldSpanRenderable,
  i: ItalicSpanRenderable,
  em: ItalicSpanRenderable,
  u: UnderlineSpanRenderable,
  br: LineBreakRenderable,
  a: LinkRenderable,
};

export class CommentNode {
  readonly id = `comment-${randomUUID()}`;
  parent: any = null;
  constructor(readonly data: string) {
    Logger.instance.log(CommentNode.name, { id: this.id, parent: this.parent, data });
  }
}

export const CLI_RENDERER = new InjectionToken<CliRenderer>('ClI Renderer');

export type UnprotectedTextRenderable = TextNodeRenderable & {
  rootTextNode: RootTextNodeRenderable;
};

export class OpentuiRenderer2 implements Renderer2 {
  hasRoot = false;
  children = new WeakMap<Renderable, any[]>();

  constructor(
    private cli: CliRenderer,
    private logger: Logger,
  ) {}

  get data() {
    return {};
  }

  destroy() {}

  // -----------------------------
  // ELEMENT CREATION
  // -----------------------------
  createComment(data: string) {
    this.logger.log(this.createComment.name, { data });
    return new CommentNode(data);
  }

  createElement(name: string): Renderable {
    this.logger.log(this.createElement.name, { name });
    const ctor = ELEMENT_MAP[name] ?? BoxRenderable;
    return new ctor(this.cli, {
      id: `${name}-${randomUUID()}`,
    }) as Renderable;
  }

  createText(value: string) {
    this.logger.log(this.createText.name, { value });

    const node = new TextNodeRenderable({});
    if (value != null && value !== '') {
      node.add(String(value));
    }

    return node;
  }

  destroyNode(...args: any[]) {
    this.logger.log(this.destroyNode.name, { args });
  }

  // -----------------------------
  // TREE OPERATIONS
  // -----------------------------
  appendChild(parent: Renderable, child: Renderable) {
    this.logger.log(this.appendChild.name, { parent, child });
    if (!child) return;

    const list = this.getChildren(parent);
    list.push(child);

    // Comments: only logical, no layout
    if (child instanceof CommentNode) {
      child.parent = parent;
      return;
    }

    // Text containers: delegate to their own add()
    if (parent instanceof TextNodeRenderable) {
      parent.add(child);
      child.parent = parent;
      return;
    }

    const wrapped = this.wrapInlineIfNeeded(parent, child);
    // DOM semantics: appendChild moves existing nodes
    if (wrapped.parent && wrapped.parent !== parent) {
      wrapped.parent.remove(wrapped.id);
    }

    parent.add(wrapped);
    wrapped.parent = parent;

    // Attach first layout root to cli.root
    if (!this.hasRoot && parent !== this.cli.root) {
      this.cli.root.add(parent);
      this.hasRoot = true;
    }
  }

  insertBefore(parent: Renderable, child: any, before: any | null) {
    this.logger.log(this.insertBefore.name, { parent, child, before });
    dumpRenderableTree(this.cli.root);

    if (!child) return;

    const list = this.getChildren(parent);
    const index = list.indexOf(before);

    // If anchor not found, just append
    if (index === -1) {
      dumpRenderableTree(this.cli.root);
      return this.appendChild(parent, child);
    }

    // Insert into logical list
    list.splice(index, 0, child);

    // Comments: logical only
    if (child instanceof CommentNode) {
      child.parent = parent;
      return;
    }

    // Text containers: no positional insert, just append
    if (parent instanceof TextNodeRenderable) {
      parent.add(child);
      child.parent = parent;
      dumpRenderableTree(this.cli.root);
      return;
    }

    const wrapped = this.wrapInlineIfNeeded(parent, child);
    if (wrapped.parent && wrapped.parent !== parent) {
      wrapped.parent.remove(wrapped.id);
    }

    // Find the next layout sibling after this logical index
    const layoutSibling = this.findLayoutSibling(parent, index + 1);

    if (layoutSibling && typeof (parent as any).insertBefore === 'function') {
      (parent as any).insertBefore(wrapped, layoutSibling);
    } else {
      parent.add(wrapped);
    }

    wrapped.parent = parent;

    // Same root-attach invariant as appendChild
    if (!this.hasRoot && parent !== this.cli.root) {
      this.cli.root.add(parent);
      this.hasRoot = true;
    }
    dumpRenderableTree(this.cli.root);
  }

  removeChild(parent: Renderable, child: any) {
    this.logger.log(this.removeChild.name, { parent, child });

    const list = this.getChildren(parent);
    const idx = list.indexOf(child);
    if (idx !== -1) {
      list.splice(idx, 1);
    }

    // Comments: nothing to remove from layout
    if (child instanceof CommentNode) {
      return;
    }

    // Layout nodes: remove by id if possible
    if (child && typeof (parent as any).remove === 'function' && (child as any).id) {
      (parent as any).remove((child as any).id);
    }
  }

  selectRootElement(selector: string) {
    this.logger.log(this.selectRootElement.name, { selector });
    return this.cli.root; // keep this
  }

  parentNode(node: Renderable) {
    this.logger.log(this.parentNode.name, { node });
    return node?.parent ?? null;
  }

  nextSibling(node: Renderable) {
    return null;
  }

  // -----------------------------
  // ATTRIBUTES / PROPERTIES
  // -----------------------------
  setAttribute(el: Renderable, name: string, value: string) {
    this.logger.log(this.setAttribute.name, { el, name, value });
    // TODO: map Angular attributes → OpenTUI props
    (el as any)[name] = value;
  }

  removeAttribute(el: Renderable, name: string) {
    this.logger.log(this.setAttribute.name, { el, name });
    delete (el as any)[name];
  }

  addClass(...args: any[]) {
    this.logger.log(this.addClass.name, { args });
  }
  removeClass(...args: any[]) {
    this.logger.log(this.removeClass.name, { args });
  }

  setStyle(el: Renderable, style: string, value: any) {
    this.logger.log(this.setStyle.name, { el, style, value });
    // TODO: map Angular styles → OpenTUI props
  }

  removeStyle(...args: any[]) {
    this.logger.log(this.removeStyle.name, { args });
  }

  setProperty(el: Renderable, name: string, value: any) {
    this.logger.log(this.setProperty.name, { el, name, value });
    (el as any)[name] = value;
  }

  setValue(el: any, value: string | null | undefined) {
    this.logger.log(this.setValue.name, { el, value });

    if (el instanceof TextNodeRenderable) {
      // Clear and replace content
      (el as any).clear?.();
      if (value != null && value !== '') {
        el.add(String(value));
      }
      return;
    }

    // Fallback: if you ever use SpanRenderable as text container directly
    if (el instanceof SpanRenderable) {
      (el as any).clear?.();
      if (value != null && value !== '') {
        el.add(String(value));
      }
      return;
    }
  }

  // -----------------------------
  // EVENTS
  // -----------------------------
  listen(el: any, event: string, callback: (...args: any[]) => void): () => void {
    this.logger.log('listen', { el, event });

    // Map Angular DOM events → OpenTUI events
    const map: Record<string, string> = {
      click: 'activate',
      keydown: 'onKey',
      keyup: 'onKey',
      input: 'onInput',
      change: 'onChange',
      focus: 'onFocus',
      blur: 'onBlur',
    };

    const tuiEvent = map[event] ?? event;

    const wrapped = (...args: any[]) => {
      this.logger.log('EVENT FIRED', { el, event, args });
      return callback(...args);
    };

    if (el && typeof el.on === 'function') {
      const off = el.on(tuiEvent, wrapped);
      return () => off?.();
    }

    return () => {};
  }

  private getChildren(parent: Renderable) {
    if (!this.children.has(parent)) {
      this.children.set(parent, []);
    }
    return this.children.get(parent)!;
  }

  private getLayoutFor(node: any): Renderable | null {
    if (!node) return null;

    // Direct layout node
    if (isLayoutRenderable(node)) {
      return node as Renderable;
    }

    // Inline nodes that were wrapped (TextNodeRenderable, etc.)
    const wrapped = (node as any).__wrappedBy;
    if (wrapped && isLayoutRenderable(wrapped)) {
      return wrapped as Renderable;
    }

    return null;
  }

  private findLayoutSibling(parent: Renderable, startIndex: number): Renderable | null {
    const list = this.getChildren(parent);

    for (let i = startIndex; i < list.length; i++) {
      const layout = this.getLayoutFor(list[i]);
      if (layout) {
        return layout;
      }
    }

    return null;
  }

  private wrapInlineIfNeeded(parent: Renderable, child: Renderable): Renderable {
    const isInline = child instanceof TextNodeRenderable;
    const parentIsBlock =
      parent instanceof TextRenderable ||
      parent instanceof BoxRenderable ||
      parent instanceof ScrollBoxRenderable ||
      parent instanceof SelectRenderable ||
      parent instanceof InputRenderable ||
      parent instanceof TextareaRenderable ||
      parent instanceof MarkdownRenderable ||
      parent instanceof CodeRenderable ||
      parent instanceof DiffRenderable;

    if (isInline && parentIsBlock) {
      const wrapper = new TextRenderable(this.cli, {
        id: `text-${randomUUID()}`,
        content: '',
      });

      // Move the inline node into the wrapper
      (wrapper as any).rootTextNode.add(child);

      // Track the wrapper so future children go into it
      (child as any).__wrappedBy = wrapper;

      return wrapper;
    }

    return child;
  }
}
