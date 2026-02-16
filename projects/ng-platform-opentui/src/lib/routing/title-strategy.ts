import { Injectable } from '@angular/core';
import { TitleStrategy, RouterStateSnapshot } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class TuiTitleStrategy extends TitleStrategy {
  override updateTitle(snapshot: RouterStateSnapshot): void {
    const title = this.buildTitle(snapshot) ?? '';

    // OSC 0 — set terminal/tab/window title
    const osc = `\x1b]0;${title}\x07`;

    try {
      process.stdout.write(osc);
    } catch {
      // If stdout isn't a TTY or something weird happens, fail silently
    }
  }
}
