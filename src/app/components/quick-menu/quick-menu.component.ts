import { ChangeDetectionStrategy, Component, computed, effect, signal } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router'
import { TestIds } from '@app/components/quick-menu/test-ids.const'
import { CurrentRouteProvider } from '@app/services/current-route-provider/current-route-provider.service'
import { StreamService } from '@app/services/stream/stream.service'

@Component({
  selector: 'app-quick-menu',
  imports: [RouterLink],
  templateUrl: './quick-menu.component.html',
  styleUrl: './quick-menu.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuickMenuComponent {
  protected readonly showNavigationBetweenStreams = computed(() => this.isBackAndForthAllowed() && (this.streamService.$streams()?.length ?? 0) > 1);
  protected readonly showAdd = signal(false);
  protected readonly showGoToList = signal(false);
  protected readonly testIds = TestIds;

  private readonly isBackAndForthAllowed = signal(false);

  constructor(
    private readonly currentRouteProvider: CurrentRouteProvider,
    protected readonly streamService: StreamService) {

    effect(() => this.updateAvailableOptions(this.currentRouteProvider.$currentRoute()));
  }

  private updateAvailableOptions(route: ActivatedRoute): void {
    const { url, params } = route.snapshot;

    const showAdd = !['new', 'edit'].includes(url[0]?.path);
    const showGoToList = (url[0]?.path !== 'streams' || Object.hasOwn(params, 'streamId'));
    const isBackAndForthAllowed = showAdd && showGoToList;

    this.showAdd.set(showAdd);
    this.showGoToList.set(showGoToList);
    this.isBackAndForthAllowed.set(isBackAndForthAllowed);
  }
}
