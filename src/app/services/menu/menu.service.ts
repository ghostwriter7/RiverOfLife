import { DOCUMENT } from '@angular/common'
import { Inject, Injectable, signal, Signal } from '@angular/core'
import { Router } from '@angular/router'
import { filter, tap } from 'rxjs'

@Injectable({ providedIn: 'root' })
export class MenuService {
  public readonly $isActive: Signal<boolean>;

  private readonly isActive = signal(false);

  constructor(
    private readonly router: Router,
    @Inject(DOCUMENT) private readonly document: Document) {
    this.$isActive = this.isActive.asReadonly();


    this.router.events
      .pipe(
        filter(() => this.isActive()),
        tap(() => this.hideMenu())
      )
      .subscribe();
  }

  public showMenu(): void {
    this.document.body.classList.add('no-scroll');
    this.isActive.set(true);
  }

  public hideMenu(): void {
    this.document.body.classList.remove('no-scroll');
    this.isActive.set(false);
  }
}
