import { Directive, Input, inject, effect, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { TuiNode } from '../renderer';

@Directive({
  selector: 'text[routerLink]',
  standalone: true,
})
export class TuiRouterLink {
  private readonly router = inject(Router);

  @Input() routerLink: string | any[] | unknown | undefined;

  constructor(private readonly elementRef: ElementRef) {
    const node = this.elementRef.nativeElement as TuiNode;
    node.listeners.update((listeners: any[]) => [
      ...listeners,
      {
        event: 'click',
        handler: () => this.navigate(),
      },
    ]);
  }

  private navigate() {
    if (this.routerLink) {
      this.router.navigateByUrl(this.routerLink as any).catch((err: any) => {
        console.error('Navigation error:', err);
      });
    }
  }
}