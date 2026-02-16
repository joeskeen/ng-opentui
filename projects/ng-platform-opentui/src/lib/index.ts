import { IMAGE_CONFIG, ImageConfig, LocationStrategy, PlatformLocation } from '@angular/common';
import {
  ApplicationConfig,
  ApplicationRef,
  PlatformRef,
  Type,
  ɵinternalCreateApplication,
  createPlatformFactory,
  platformCore,
  StaticProvider,
  RendererFactory2,
  ErrorHandler,
  ɵINJECTOR_SCOPE,
} from '@angular/core';
import { CLI_RENDERER } from './renderer/opentui-renderer';
import { createCliRenderer } from '@opentui/core';
import { Logger } from './common/logger';
import { LoggingErrorHandler } from './common/error-handler';
import { TuiLocationStrategy, TuiPlatformLocation } from './routing/location';
import { TitleStrategy } from '@angular/router';
import { TuiTitleStrategy } from './routing/title-strategy';
import { OpentuiRendererFactory2 } from './renderer/opentui-renderer.factory';
import { MouseEventsService } from './events/mouse-events.service';

/**
 * Angular's compiler automatically assigns a default CSS selector
 * (e.g., ['ng-component']) to any component that does not explicitly
 * declare one. In a DOM‑based platform this is required so Angular can
 * locate an existing host element during bootstrap.
 *
 * A opentui platform has no DOM and therefore must never attempt to
 * query for a host element. By replacing the compiled Ivy selector
 * list with `[[]]`, we signal to Angular that the component has no
 * selector. This forces Angular's bootstrap logic to *create* a host
 * element instead of trying to *locate* one, which avoids DOM access
 * and aligns with the invariants of a selector‑less, non‑browser
 * environment.
 *
 * This mutation must occur before Angular reads the component's Ivy
 * definition during bootstrap.
 *
 * This function will only ever need to be called on the root, since
 * any child components would be created, not expected to already exist.
 *
 * @param cmp The component type whose Ivy metadata should be patched.
 */
function stripSelectors(cmp: any) {
  if (cmp.ɵcmp && cmp.ɵcmp.selectors) {
    cmp.ɵcmp.selectors = [[]];
  }
}

/**
 * Identifier for the opentui platform. A opentui platform provides Angular's
 * dependency injection and change detection infrastructure without any
 * browser or DOM APIs. It is intended for environments such as Node,
 * CLIs, testing harnesses, or custom renderers where no DOM is present.
 */
const PLATFORM_OPENTUI_ID = 'opentui';

/**
 * Minimal provider set required for Angular to bootstrap in a non‑DOM
 * environment.
 *
 * Through iterative elimination, these were identified as the smallest
 * set of providers that Angular's bootstrap pipeline depends on:
 *
 *   • ɵINJECTOR_SCOPE — required so Angular can assign the root injector
 *     scope and generate a valid application ID.
 *
 *   • ErrorHandler — Angular always injects an ErrorHandler during
 *     application bootstrap. Without this, DI throws NG0402.
 *
 *   • RendererFactory2 — Angular requires a renderer even if no DOM is
 *     present. The opentuiRendererFactory2 satisfies this contract without
 *     performing any rendering.
 *
 *   • IMAGE_CONFIG — Angular's image directive expects this token to be
 *     present. Providing a minimal config avoids NG0210 errors in apps
 *     that include the directive, even if images are never rendered.
 *
 * All other browser‑specific providers (Document, PlatformLocation,
 * Sanitizer, XHR, ViewportScroller, etc.) are optional in a opentui
 * environment and can be safely omitted.
 *
 * This list represents the true minimal surface area required for
 * Angular to run without a DOM.
 */

const OPENTUI_PLATFORM_APPLICATION_STATIC_PROVIDERS: StaticProvider[] = [
  /** without this you get "ɵNotFound: NG0201: No provider found for `InjectionToken AppId`." */
  { provide: ɵINJECTOR_SCOPE, useValue: 'root' },
  { provide: Logger, useValue: Logger.instance },
  /** without this you get "RuntimeError: NG0402: A required Injectable was not found in the dependency injection tree." */
  { provide: ErrorHandler, useClass: LoggingErrorHandler, deps: [] },
  /** without this you get "RuntimeError: NG0407: Angular was not able to inject a renderer (RendererFactory2)." */
  { provide: RendererFactory2, useClass: OpentuiRendererFactory2, deps: [] },
  /** without this you get "ERROR RuntimeError: NG0210: The document object is not available in this context. Make sure the DOCUMENT injection token is provided." */
  {
    provide: IMAGE_CONFIG,
    useValue: { disableImageSizeWarning: true, disableImageLazyLoadWarning: true } as ImageConfig,
  },
];

/**
 * Platform‑level providers for the opentui platform.
 *
 * In a browser platform, this array would supply low‑level services such
 * as PlatformLocation, LocationStrategy, Sanitizer, and others that the
 * Angular platform runtime depends on. Through iterative elimination, it
 * was determined that none of these are required for a minimal, DOM‑less
 * Angular bootstrap.
 *
 * As a result, the opentui platform does not install any platform‑level
 * providers. Angular's core platform logic (platformCore) is sufficient
 * when combined with the minimal application‑level providers above.
 */
const INTERNAL_OPENTUI_PLATFORM_PROVIDERS: StaticProvider[] = [
  { provide: Logger, useValue: Logger.instance },
];

/**
 * Creates a opentui Angular platform instance.
 *
 * This mirrors Angular's `platformBrowser` and `platformServer` entry
 * points, but without installing any browser‑specific platform services.
 * The opentui platform relies entirely on Angular's core platform runtime
 * (`platformCore`) and the minimal application‑level providers defined
 * above.
 *
 * The result is a fully functional Angular platform that can bootstrap
 * applications without DOM, browser, or zone dependencies.
 */
export function platformOpentui(): PlatformRef {
  return createPlatformFactory(platformCore, PLATFORM_OPENTUI_ID, [
    ...INTERNAL_OPENTUI_PLATFORM_PROVIDERS,
  ])();
}

/**
 * Bootstraps an Angular application using the opentui platform.
 *
 * This function mirrors Angular's `bootstrapApplication`, but applies
 * opentui‑specific behavior:
 *
 *   • Strips selectors from the root component so Angular creates a
 *     host element instead of querying the DOM.
 *   • Installs opentui platform and application providers.
 *   • Uses Angular's internal `ɵinternalCreateApplication` to avoid
 *     browser‑specific bootstrap logic.
 *
 * The result is a fully bootstrapped Angular application running in a
 * non‑DOM environment.
 */
export async function bootstrapApplication(
  component: Type<unknown>,
  applicationConfig: ApplicationConfig,
): Promise<ApplicationRef> {
  const cliRenderer = await createCliRenderer({
    exitOnCtrlC: true,
    onDestroy: () => process.exit(0),
    autoFocus: true,
    useMouse: true,
  });
  cliRenderer.start();
  stripSelectors(component);
  return ɵinternalCreateApplication({
    rootComponent: component,
    appProviders: [
      ...OPENTUI_PLATFORM_APPLICATION_STATIC_PROVIDERS,
      { provide: CLI_RENDERER, useValue: cliRenderer },
      { provide: LocationStrategy, useClass: TuiLocationStrategy },
      { provide: PlatformLocation, useClass: TuiPlatformLocation },
      { provide: TitleStrategy, useClass: TuiTitleStrategy },
      MouseEventsService,
      ...applicationConfig.providers,
    ],
    platformProviders: [
      ...INTERNAL_OPENTUI_PLATFORM_PROVIDERS,
    ],
    platformRef: platformOpentui(),
  });
}
