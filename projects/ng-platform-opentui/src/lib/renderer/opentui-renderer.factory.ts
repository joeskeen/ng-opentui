import { inject, Injectable, Renderer2, RendererFactory2, RendererType2 } from "@angular/core";
import { Logger } from "../common/logger";
import { CLI_RENDERER, OpentuiRenderer2 } from "./opentui-renderer";

@Injectable({ providedIn: 'root' })
export class OpentuiRendererFactory2 implements RendererFactory2 {
  private readonly cli = inject(CLI_RENDERER);
  private readonly logger = inject(Logger);

  private readonly renderer = new OpentuiRenderer2(this.cli, this.logger);

  createRenderer(hostElement: any, type: RendererType2 | null): Renderer2 {
    this.logger.log(this.createRenderer.name, {hostElement, type});
    return this.renderer;
  }

  begin() {}
  end() {}
  whenRenderingDone() { return Promise.resolve(); }
}
