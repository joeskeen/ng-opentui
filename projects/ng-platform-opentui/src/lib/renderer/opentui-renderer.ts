// import "@opentui/core-linux-x64";
import {
  RendererFactory2,
  Renderer2,
  RendererType2,
  Injectable,
  inject,
  InjectionToken,
} from '@angular/core';

import {
  createCliRenderer,
  type CliRenderer,
  type Renderable,
  TextRenderable,
  BoxRenderable,
} from '@opentui/core';
import { Logger } from '../util/logger';

// Temporary mapping — we’ll expand this later
const ELEMENT_MAP: Record<string, any> = {
  div: BoxRenderable,
  span: BoxRenderable,
  text: TextRenderable, // only if you ever use a <text> tag explicitly
  box: BoxRenderable,
};

export const CLI_RENDERER = new InjectionToken<CliRenderer>('ClI Renderer');

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
  createElement(name: string): Renderable {
    this.logger.log(this.createElement.name, { name });

    const ctor = ELEMENT_MAP[name] ?? BoxRenderable; // default to container

    return new ctor(this.cli, {
      id: `${name}-${Math.random().toString(36).slice(2)}`,
      content: '',
    });
  }

  createComment(...args: any[]) {
    this.logger.log(this.createComment.name, { args });
    return null;
  }

  createText(value: string): Renderable {
    this.logger.log(this.createText.name, { value });
    return new TextRenderable(this.cli, {
      id: `text-${Math.random().toString(36).slice(2)}`,
      content: (value ?? '').toString(),
    });
  }

  destroyNode(...args: any[]) {
    this.logger.log(this.destroyNode.name, { args });
  }

  // -----------------------------
  // TREE OPERATIONS
  // -----------------------------
  appendChild(parent: Renderable | null, child: Renderable) {
    this.logger.log(this.appendChild.name, { parent, child });
    if (!this.hasRoot) {
      this.hasRoot = true;
      this.cli.root.add(child);
      return;
    }
    parent?.add(child);
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
      el.content = (value ?? '').toString();
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
