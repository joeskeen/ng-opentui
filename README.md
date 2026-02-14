# **Angular Noop Platform**

*A minimal, DOM‑less Angular platform for custom runtimes, CLIs, servers, and experimental renderers.*

## **What is this?**

`@angular/platform-noop` is a custom Angular platform implementation that provides:

- Angular’s **dependency injection**
- Angular’s **change detection**
- Angular’s **component instantiation**
- Angular’s **environment injector**
- Angular’s **application bootstrap pipeline**

…but **without any browser or DOM APIs**.

It is essentially Angular’s brain — without its body.

This platform is ideal for environments where:

- there is **no DOM**
- there is **no browser**
- you want to **render Angular components into something else**  
  (terminal, canvas, PDF, custom UI toolkit, etc.)
- you want to **experiment with Angular’s internals**
- you want to **build a custom renderer**
- you want to **run Angular in Node** without JSDOM
- you want a **minimal test harness** for Angular logic

If you’ve ever wished Angular had a “headless mode,” this is it.

> **Note:** This package is not intended to be used directly as a
> production-ready runtime. Instead, it serves as a *reference
> implementation* and a *starting point* for building your own custom
> Angular platform—one that is fully detached from the DOM and tailored
> to your target environment. The noop platform demonstrates the minimal
> set of invariants Angular requires in order to run outside the browser.

---

## **Why does this exist?**

Angular’s official platforms — Browser, Server, WebWorker — all assume some form of DOM or DOM‑like environment. Even Angular Universal (server‑side rendering) still relies on a DOM abstraction.

But there are valid use cases where:

- you don’t want a DOM  
- you don’t want to simulate a DOM  
- you don’t want Angular to *think* a DOM exists  
- you want Angular to run purely as a component model + DI container  

Unfortunately, Angular’s bootstrap pipeline assumes:

- components have selectors  
- selectors correspond to DOM elements  
- the platform provides browser services  
- the renderer manipulates DOM nodes  
- the environment injector is tied to the browser platform  

This project exists to break those assumptions cleanly and intentionally.

---

## **What makes a noop platform different?**

A noop platform has a few key invariants:

### **1. No DOM access of any kind**

This platform does **not** provide:

- `Document`
- `PlatformLocation`
- `LocationStrategy`
- `ViewportScroller`
- `Sanitizer`
- `XhrFactory`

Through iterative elimination, it turns out Angular does **not** require any of these to bootstrap in a DOM‑less environment.

### **2. The root component must not have a selector**

Angular’s compiler automatically generates a default selector (`ng-component`) if you don’t provide one.

In a DOM‑less environment, this is fatal.

Angular will try to *locate* a host element instead of *creating* one, which leads to assertion failures.

This platform patches the Ivy metadata of the root component:

```ts
cmp.ɵcmp.selectors = [[]];
```

This tells Angular:

> “This component has no selector. Do not query the DOM. Create a host element instead.”

Child components do **not** need patching — Angular instantiates them internally.

### **3. A minimal provider set**

Through systematic elimination, the smallest provider set Angular requires is:

- `ɵINJECTOR_SCOPE` — needed for application ID generation  
- `ErrorHandler` — Angular always injects one  
- `RendererFactory2` — Angular requires a renderer, even if it does nothing  
- `IMAGE_CONFIG` — required by Angular’s image directive  

Everything else is optional.

### **4. The platform bootstrap pipeline must run without browser services**

This platform uses Angular’s internal `ɵinternalCreateApplication` to bootstrap the app without invoking browser‑specific logic.

---

## **How it works**

### **Creating the platform**

```ts
export function platformNoop(): PlatformRef {
  return createPlatformFactory(platformCore, PLATFORM_NOOP_ID, [])();
}
```

This mirrors `platformBrowser()` and `platformServer()`, but installs **no** platform‑level providers.

### **Bootstrapping an application**

```ts
export async function bootstrapApplication(component, config) {
  stripSelectors(component);
  return ɵinternalCreateApplication({
    rootComponent: component,
    appProviders: [...],
    platformProviders: [],
    platformRef: platformNoop(),
  });
}
```

This is equivalent to Angular’s `bootstrapApplication()`, but adapted for a DOM‑less environment.

---

## **Who is this for?**

This project is useful for:

### **Platform architects**

Building a custom Angular runtime or experimenting with Angular’s internals.

### **Renderer authors**

Rendering Angular components into:

- terminal UIs  
- canvas  
- WebGL  
- native UI toolkits  
- PDFs  
- game engines  
- anything that isn’t the DOM  

### **Framework researchers**

Studying Angular’s DI, change detection, and bootstrap pipeline without browser noise.

### **Tooling authors**

Building:

- Angular‑powered CLIs  
- static analyzers  
- code generators  
- test harnesses  
- SSR‑like pipelines without DOM emulation  

### **Engineers who want to understand Angular deeply**

This platform exposes Angular’s core architecture in its purest form.

---

## **Why not just use JSDOM or Domino?**

Because:

- they simulate a DOM you don’t need  
- they hide the real architectural boundaries  
- they introduce performance overhead  
- they mask bugs  
- they force Angular to take browser‑specific code paths  
- they don’t help you build a custom renderer  

A noop platform is cleaner, faster, and more honest.

---

## **What this project is _not_**

- It is **not** a replacement for Angular Universal  
- It is **not** a browser platform  
- It is **not** a DOM emulator  
- It is **not** a full rendering engine  
- It is **not** intended for production web apps  

This is a foundation for **custom platforms**, not a general‑purpose runtime.

---

## **Future directions**

This platform is intentionally minimal, but it opens the door to:

- a terminal renderer  
- a canvas renderer  
- a native desktop renderer  
- a WebGPU/WebGL renderer  
- a static HTML generator  
- a test‑only Angular runtime  
- a teaching tool for Angular internals  

If you build something on top of this, please share it — the Angular ecosystem needs more experimentation at the platform level.

---

## **Why this matters**

Angular’s architecture is powerful, but most developers only ever see it through the lens of the browser. This project demonstrates that Angular is not inherently tied to the DOM — it’s a component model, a DI system, and a change detection engine that can run anywhere.

By providing a clean, minimal, DOM‑less platform, this project gives engineers the freedom to explore what Angular can be outside the browser.
