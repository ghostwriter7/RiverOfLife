import { Injectable, signal, Signal, WritableSignal } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router'
import { filter } from 'rxjs'

@Injectable({
  providedIn: 'root'
})
export class CurrentRouteProvider {
  public readonly $currentRoute: Signal<ActivatedRoute>;

  private readonly currentRoute: WritableSignal<ActivatedRoute>;

  constructor(private readonly router: Router) {
    this.currentRoute = signal(this.getDeepestRoute(this.router.routerState.root));
    this.$currentRoute = this.currentRoute.asReadonly();

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe(() => {
        const route = this.getDeepestRoute(this.router.routerState.root);
        this.currentRoute.set(route);
      })
  }

  private getDeepestRoute(activatedRoute: ActivatedRoute): ActivatedRoute {
    if (activatedRoute.firstChild) {
      return this.getDeepestRoute(activatedRoute.firstChild);
    }
    return activatedRoute;
  }
}
