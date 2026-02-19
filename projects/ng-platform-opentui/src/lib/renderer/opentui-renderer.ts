import {
  Renderer2,
  ListenerOptions,
  RendererStyleFlags2,
  runInInjectionContext,
  Injector,
  InjectionToken,
} from '@angular/core';
import { TuiNode } from './tui-node';
import { isMatch, parseAngularEventBinding } from '../events/event-translation';
import { Logger } from '../common';
import { CLI_RENDERER } from './cli-renderer';
import { TuiRoot } from '../components/tui-root';
import { CliRenderer, RootRenderable } from '@opentui/core';
import { inspect } from 'node:util';

let tuiRoot: TuiNode<RootRenderable> | null = null;

export const TUI_ROOT_NODE = new InjectionToken('TUI Root Node', {
  providedIn: 'root',
  factory: () => ({ getRoot: () => tuiRoot }),
});

export class OpentuiRenderer2 implements Renderer2 {
  readonly rootNode: TuiNode<RootRenderable>;
  readonly logger: Logger;
  readonly cliRenderer: CliRenderer;

  constructor(injector: Injector) {
    this.logger = injector.get(Logger);
    this.cliRenderer = injector.get(CLI_RENDERER);
    this.rootNode = new TuiNode<RootRenderable>(this.cliRenderer, this.cliRenderer.root.id);
    tuiRoot = this.rootNode;
    this.rootNode.renderable.set(this.cliRenderer.root);
    const rootNodeInjector = Injector.create({
      providers: [{ provide: TuiNode, useValue: this.rootNode }],
      parent: injector,
    });
    runInInjectionContext(rootNodeInjector, () => {
      const rootComponent = new TuiRoot();
      this.rootNode.component.set(rootComponent as any);
      rootComponent.ngOnInit();
    });
  }

  createElement(name: string) {
    this.logger.log(this.createElement.name, { name });
    return new TuiNode(this.cliRenderer, `element:${name}`);
  }
  createComment(value: string) {
    this.logger.log(this.createComment.name, { value });
    return new TuiNode(this.cliRenderer, `comment:"${value}"`);
  }

  createText(value: string) {
    this.logger.log(this.createText.name, { value });
    const node = new TuiNode(this.cliRenderer, `text value:"${value}"`, value);
    node.value.set(value);
    return node;
  }
  setValue(node: TuiNode, value: string): void {
    // Error: NG0600: Writing to signals is not allowed while Angular renders the template (eg. interpolations)
    // node?.value.set(value);
  }

  appendChild(parent: TuiNode, newChild: TuiNode): void {
    this.logger.log(this.appendChild.name, { parent, newChild });
    if (!newChild) {
      return;
    }

    if (!parent) {
      parent = this.rootNode;
    }
    if (parent === newChild) {
      throw new Error(`Cannot append node ${newChild} to itself`);
    }

    parent.children.update((children) => [...children, newChild]);
    newChild.parent.set(parent);
  }

  insertBefore(parent: TuiNode, newChild: TuiNode, refChild: TuiNode, _isMove?: boolean): void {
    this.logger.log(this.insertBefore.name, { parent, newChild, refChild, _isMove });
    if (!refChild) {
      this.appendChild(parent, newChild);
      return;
    }

    if (!parent) {
      parent = this.rootNode;
    }
    if (parent === newChild) {
      throw new Error(`Cannot insert node ${newChild} into itself`);
    }
    if (newChild === refChild) {
      throw new Error(`Cannot insert node ${newChild} before itself`);
    }

    parent.children.update((children) => {
      const newChildren = children.filter((child) => child !== newChild);
      const refIndex = newChildren.indexOf(refChild);
      if (refIndex === -1) {
        throw new Error(`Reference child ${refChild} not found in parent ${parent}`);
      }
      newChildren.splice(refIndex, 0, newChild);
      return newChildren;
    });
    newChild.parent.set(parent);
  }

  removeChild(
    _parent: TuiNode,
    oldChild: TuiNode,
    _isHostElement?: boolean,
    _requireSynchronousElementRemoval?: boolean,
  ): void {
    const parent = oldChild.parent();
    if (!parent) {
      return;
    }
    parent.children.update((children) => {
      if (!children.includes(oldChild)) {
        return children;
      }
      return children.filter((child) => child !== oldChild);
    });
    try {
      oldChild.parent.set(null);
    } catch {}
  }

  selectRootElement(_selectorOrNode: string | any, _preserveContent?: boolean) {
    return this.rootNode;
  }

  parentNode(node: TuiNode) {
    return node.parent();
  }

  nextSibling(node: TuiNode) {
    this.logger.log(this.nextSibling.name, { node });
    const parent = node.parent();
    if (!parent) {
      return null;
    }
    const siblings = parent.children();
    const index = siblings.indexOf(node);
    if (index === -1) {
      throw new Error(`Node ${node} is not a child of its parent ${parent}`);
    }
    return siblings[index + 1] || null;
  }

  listen(
    target: 'window' | 'document' | 'body' | TuiNode,
    eventName: string,
    callback: (event: any) => boolean | void,
    _options?: ListenerOptions,
  ): () => void {
    if (!target || typeof target === 'string') {
      target = this.rootNode;
    }
    const targetNode = target as TuiNode;
    this.logger.log(this.listen.name, { target, eventName, _options, targetNode });
    const eventPattern = parseAngularEventBinding(eventName);
    if (eventPattern) {
      const handler = (event: any) => {
        if (isMatch(eventPattern, event)) {
          callback(event);
        }
      };

      const registration = { event: eventPattern.eventType, handler };
      targetNode.listeners.update((listeners) => [...listeners, registration]);
      return () => targetNode.listeners.update((listeners) => listeners.filter((l) => l !== registration));
    } else {
      throw new Error(`Unsupported event pattern: ${eventName}`);
    }
  }

  get data(): { [key: string]: any } {
    return {}; // unused, see https://angular.dev/api/core/Renderer2#data
  }
  destroy() {
    this.logger.log(this.destroy.name);
    // this.rootNode.renderable()?.destroyRecursively();
    /* ngOnDestroy will take care of this */
  }
  destroyNode(node: TuiNode) {
    this.logger.log(this.destroyNode.name, { node });
    // node.renderable()?.destroy();
    /* ngOnDestroy will take care of this */
  }
  setProperty(_el: TuiNode, _name: string, _value: any): void {
    /* this is handled via the component's input synchronization */
  }
  setAttribute(_el: TuiNode, _name: string, _value: string, _namespace?: string | null): void {
    /* this is handled via the component's input synchronization */
  }
  removeAttribute(_el: TuiNode, _name: string, _namespace?: string | null): void {
    /* this is handled via the component's input synchronization */
  }
  setStyle(_el: TuiNode, _style: string, _value: any, _flags?: RendererStyleFlags2): void {
    /* this is handled via the component's input synchronization */
  }
  removeStyle(_el: TuiNode, _style: string, _flags?: RendererStyleFlags2): void {
    /* this is handled via the component's input synchronization */
  }
  addClass(_el: TuiNode, _name: string): void {
    /* this is handled via the component's input synchronization */
  }
  removeClass(_el: TuiNode, _name: string): void {
    /* this is handled via the component's input synchronization */
  }
}
