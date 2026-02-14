import {
  RendererFactory2,
  Renderer2,
} from "@angular/core";

function noop() {}

export class NoopRendererFactory2 implements RendererFactory2 {
  createRenderer = () => new NoopRenderer2();
  begin = noop as any;
  end = noop as any;
  whenRenderingDone = noop as any;
}

class NoopRenderer2 implements Renderer2 {
  get data(): { [key: string]: any } {
    return {};
  }
  destroy = noop;
  createElement = (name: string) => ({ nodeName: name.toUpperCase() });
  createComment = noop;
  createText = noop;
  destroyNode = noop;
  appendChild = noop;
  insertBefore = noop;
  removeChild = noop;
  selectRootElement = noop;
  parentNode = noop;
  nextSibling = noop;
  setAttribute = noop;
  removeAttribute = noop;
  addClass = noop;
  removeClass = noop;
  setStyle = noop;
  removeStyle = noop;
  setProperty = noop;
  setValue = noop;
  listen = () => noop;
}
