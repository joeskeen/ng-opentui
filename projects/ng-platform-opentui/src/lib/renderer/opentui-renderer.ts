// import "@opentui/core-linux-x64";
import {
  RendererFactory2,
  Renderer2,
  RendererType2,
  Injectable,
  inject,
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
import { Logger } from '../util/logger';
import {
  BoldSpanRenderable,
  ItalicSpanRenderable,
  LineBreakRenderable,
  LinkRenderable,
  SpanRenderable,
  UnderlineSpanRenderable,
} from './text-renderables';
import { randomUUID } from 'crypto';
import { inspect } from 'util';

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

export const CLI_RENDERER = new InjectionToken<CliRenderer>('ClI Renderer');

export type UnprotectedTextRenderable = TextNodeRenderable & {
  rootTextNode: RootTextNodeRenderable;
};

@Injectable({ providedIn: 'root' })
export class OpentuiRendererFactory2 implements RendererFactory2 {
  private readonly renderer = inject(CLI_RENDERER);
  private readonly logger = inject(Logger);

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    return new OpentuiRenderer2(this.renderer, this.logger);
  }

  begin() {}
  end() {}
  whenRenderingDone() {
    return Promise.resolve();
  }
}

class OpentuiRenderer2 implements Renderer2 {
  hasRoot = false;

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
  createComment(...args: any[]) {
    this.logger.log(this.createComment.name, { args });
    return null;
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
    const node = new SpanRenderable();
    node.add(value ?? '');
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

    // First child becomes root

    // First time we see a parent, make *that* the root container
    if (!this.hasRoot) {
      this.hasRoot = true;
      this.cli.root.add(parent); // attach the <div> once
    }

    // From here on, always treat appendChild normally
    // Inline text inside <text>
    if (parent instanceof TextRenderable && child instanceof TextNodeRenderable) {
      (parent as unknown as UnprotectedTextRenderable).rootTextNode.add(child);
      return;
    }

    // Inline text inside inline text
    if (parent instanceof TextNodeRenderable && child instanceof TextNodeRenderable) {
      parent.add(child);
      return;
    }

    // Inline text inside a block element → wrap it
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

    if (child instanceof TextNodeRenderable && parentIsBlock) {
      const wrapper = new TextRenderable(this.cli, {
        id: `text-${randomUUID()}`,
        content: '',
      });
      (wrapper as unknown as UnprotectedTextRenderable).rootTextNode.add(child);
      parent.add(wrapper as any);
      return;
    }

    // otherwise, normal append
    parent.add(child);
  }

  insertBefore(parent: Renderable, child: Renderable, before: Renderable) {
    this.logger.log(this.insertBefore.name, { parent, child, before });
    // OpenTUI doesn't support insertBefore directly — we’ll emulate later
    parent.add(child);
  }

  removeChild(parent: Renderable, child: Renderable) {
    this.logger.log(this.removeChild.name, { parent, child });
    parent.remove(child.id);
  }

  selectRootElement(selector: string) {
    this.logger.log(this.selectRootElement.name, { selector });
    return this.cli.root; // keep this
  }

  parentNode(node: Renderable) {
    this.logger.log(this.parentNode.name, { node });
    return node.parent ?? null;
  }

  nextSibling(node: Renderable) {
    this.logger.log(this.nextSibling.name, { node });
    return null; // OpenTUI doesn't expose sibling traversal yet
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

  setValue(el: Renderable, value: string) {
    this.logger.log(this.setValue.name, { el, value });
    if (el instanceof TextRenderable) {
      el.content = value;
      return;
    }

    if (el instanceof TextNodeRenderable) {
      if (el.children.length === 0) {
        el.add(value ?? '');
      } else {
        el.replace(value ?? '', 0);
      }

      return;
    }
  }

  // -----------------------------
  // EVENTS
  // -----------------------------
  listen(el: Renderable, event: string, callback: (...args: any[]) => void) {
    this.logger.log(this.listen.name, { el, event, callback });
    // TODO: map Angular events → OpenTUI events
    return () => {};
  }
}
