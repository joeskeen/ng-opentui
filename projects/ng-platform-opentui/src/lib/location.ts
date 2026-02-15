import { Injectable } from '@angular/core';
import { LocationChangeListener, LocationStrategy, PlatformLocation } from '@angular/common';

@Injectable({providedIn: 'root'})
export class TuiPlatformLocation extends PlatformLocation {
  private _path = '/';
  private _search = '';
  private _hash = '';
  private popStateListeners: LocationChangeListener[] = [];

  override getBaseHrefFromDOM(): string {
    return '/';
  }

  override get pathname(): string {
    return this._path;
  }

  override get search(): string {
    return this._search;
  }

  override get hash(): string {
    return this._hash;
  }

  override get href(): string {
    return this._path + this._search + this._hash;
  }

  override pushState(state: any, title: string, url: string): void {
    this._update(url);
  }

  override replaceState(state: any, title: string, url: string): void {
    this._update(url);
  }

  private _update(url: string) {
    const [path, query = '', hash = ''] = url.split(/[\?#]/);
    this._path = path || '/';
    this._search = query ? '?' + query : '';
    this._hash = hash ? '#' + hash : '';

    // Notify listeners
    for (const fn of this.popStateListeners) fn({ type: 'locationChange', state: null });
  }

  override onPopState(fn: LocationChangeListener): VoidFunction {
    this.popStateListeners.push(fn);
    return () => {
      this.popStateListeners = this.popStateListeners.filter((x) => x !== fn);
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
