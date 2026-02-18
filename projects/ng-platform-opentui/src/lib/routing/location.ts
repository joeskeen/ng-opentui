import { computed, Injectable, signal } from '@angular/core';
import { LocationChangeListener, LocationStrategy, PlatformLocation } from '@angular/common';

@Injectable({providedIn: 'root'})
export class TuiPlatformLocation extends PlatformLocation {
  private _title = signal('');
  private _state = signal<any>(null);
  private _path = signal('/');
  private _search = signal('');
  private _hash = signal('');
  private popStateListeners = signal<LocationChangeListener[]>([]);
  private _href = computed(() => this._path() + this._search() + this._hash());

  override getBaseHrefFromDOM(): string {
    return '/';
  }

  override get pathname(): string {
    return this._path();
  }

  override get search(): string {
    return this._search();
  }

  override get hash(): string {
    return this._hash();
  }

  override get href(): string {
    return this._href();
  }

  override pushState(state: any, title: string, url: string): void {
    this._state.set(state);
    this._title.set(title);
    this._update(url);
  }

  override replaceState(state: any, title: string, url: string): void {
    this._state.set(state);
    this._title.set(title);
    this._update(url);
  }

  private _update(url: string) {
    const [path, query = '', hash = ''] = url.split(/[\?#]/);
    this._path.set(path || '/');
    this._search.set(query ? '?' + query : '');
    this._hash.set(hash ? '#' + hash : '');

    // Notify listeners
    for (const fn of this.popStateListeners()) fn({ type: 'locationChange', state: null });
  }

  override onPopState(fn: LocationChangeListener): VoidFunction {
    this.popStateListeners.update((listeners) => [...listeners, fn]);
    return () => {
      this.popStateListeners.update((listeners) => listeners.filter((x) => x !== fn));
    };
  }

  override onHashChange(fn: LocationChangeListener): VoidFunction {
    // Hash never changes in this environment
    return () => {};
  }

  override getState(): unknown {
    return null;
  }

  override forward(): void {}
  override back(): void {}
  override get protocol(): string {
    return 'tui:';
  }
  override get hostname(): string {
    return '';
  }
  override get port(): string {
    return '';
  }
}

@Injectable({providedIn: 'root'})
export class TuiLocationStrategy extends LocationStrategy {
  constructor(private platform: TuiPlatformLocation) {
    super();
  }

  override path(includeHash: boolean = false): string {
    return this.platform.pathname + this.platform.search + (includeHash ? this.platform.hash : '');
  }

  override prepareExternalUrl(internal: string): string {
    return internal;
  }

  override pushState(state: any, title: string, url: string, queryParams: string): void {
    this.platform.pushState(state, title, url + queryParams);
  }

  override replaceState(state: any, title: string, url: string, queryParams: string): void {
    this.platform.replaceState(state, title, url + queryParams);
  }

  override onPopState(fn: LocationChangeListener): void {
    this.platform.onPopState(fn);
  }

  override getBaseHref(): string {
    return '/';
  }

  override getState(): unknown {
    return null;
  }

  override forward(): void {}
  override back(): void {}
}
