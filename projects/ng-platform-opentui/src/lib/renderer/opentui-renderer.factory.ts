import { inject, Injectable, Injector, Renderer2, RendererFactory2, RendererType2 } from '@angular/core';
import { Logger } from '../common/logger';
import { OpentuiRenderer2 } from './opentui-renderer';

@Injectable({providedIn: 'root'})
export class OpentuiRendererFactory2 implements RendererFactory2 {
  private readonly injector = inject(Injector);
  private renderer?: OpentuiRenderer2;

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    const logger = this.injector.get(Logger);
    logger.log(this.createRenderer.name, { hostElement, type });
    return this.renderer ?? (this.renderer = new OpentuiRenderer2(this.injector));
  }

  begin() {}
  end() {}
  whenRenderingDone() {
    return Promise.resolve();
  }
}
