import { DOCUMENT } from '@angular/common'
import { Inject, Injectable, signal, Signal } from '@angular/core'

@Injectable({ providedIn: 'root' })
export class MenuService {
  public readonly $isActive: Signal<boolean>;

  private readonly isActive = signal(false);

  constructor(@Inject(DOCUMENT) private readonly document: Document ) {
    this.$isActive = this.isActive.asReadonly();
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
