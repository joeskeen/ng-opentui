# **ng-platform-opentui**

An experimental Angular platform for building **Terminal User Interface (TUI)** applications using **Angular’s component model, DI system, and change‑detection engine**.

This project explores what it takes to run Angular in a **non‑browser environment**, using **OpenTUI** as the rendering backend. OpenTUI was chosen because it offers a stable, well‑designed API compared to many other Node‑based TUI libraries that are still in alpha or pre‑alpha stages.

The goal is simple:

**Make it possible to build real TUI apps with Angular.**  
No DOM. No browser. Just Angular + a terminal renderer.

This repository is experimental and serves as a foundation for:

- understanding Angular’s platform and bootstrap internals  
- implementing a custom renderer  
- mapping Angular templates to terminal widgets  
- exploring zoneless change detection in a non‑browser runtime  

If you’re curious about Angular beyond the browser, or you want to build rich terminal apps with a familiar framework, this project is for you.
