import { signal } from '@angular/core'
import { Params, provideRouter, UrlSegment } from '@angular/router'
import { QuickMenuComponent } from '@app/components/quick-menu/quick-menu.component'
import { TestIds } from '@app/components/quick-menu/test-ids.const'
import { Stream } from '@app/model/stream.model'
import { CurrentRouteProvider } from '@app/services/current-route-provider/current-route-provider.service'
import { StreamService } from '@app/services/stream/stream.service'
import { byTestId, createComponentFactory, Spectator } from '@ngneat/spectator/jest'

const currentRouteProviderMockFactory = () =>
  ({ $currentRoute: signal({ snapshot: { url: [] as UrlSegment[], params: {} as Params } }) });
type CurrentRouteProviderMock = ReturnType<typeof currentRouteProviderMockFactory>;

const streamServiceMockFactory = () =>
  ({
    goToNextStream: jest.fn(),
    goToPreviousStream: jest.fn(),
    $streams: signal<Stream[] | null>(null),
  });
type StreamServiceMock = ReturnType<typeof streamServiceMockFactory>;

describe('QuickMenuComponent', () => {
  let spectator: Spectator<QuickMenuComponent>;
  const createComponent = createComponentFactory({
    component: QuickMenuComponent,
    shallow: true,
    providers: [
      provideRouter([]),
      { provide: StreamService, useFactory: streamServiceMockFactory },
      { provide: CurrentRouteProvider, useFactory: currentRouteProviderMockFactory }
    ]
  });

  let currentRouteProviderMock: CurrentRouteProviderMock;
  let streamServiceMock: StreamServiceMock;

  beforeEach(() => {
    spectator = createComponent();
    currentRouteProviderMock = spectator.inject(CurrentRouteProvider) as unknown as CurrentRouteProviderMock;
    streamServiceMock = spectator.inject(StreamService) as unknown as StreamServiceMock;
  });

  const assertButtonVisible = (isVisible: boolean, buttonTestId: string) => {
    const button = spectator.query(byTestId(buttonTestId));
    if (isVisible) {
      expect(button).toBeDefined();
    } else {
      expect(button).toBeNull();
    }
  }

  const assertAddButtonVisible = (isVisible: boolean) => assertButtonVisible(isVisible, TestIds.AddButton);

  const assertGoToListButtonVisible = (isVisible: boolean) =>
    assertButtonVisible(isVisible, TestIds.StreamListButton);

  const assertBackAndForthButtonsVisible = (isVisible: boolean) => {
    assertButtonVisible(isVisible, TestIds.NextStreamButton);
    assertButtonVisible(isVisible, TestIds.PreviousStreamButton);
  }

  it('should only display the Add Stream button when visiting the Streams page', () => {
    mockCurrentRoute([new UrlSegment('streams', {})]);
    currentRouteProviderMock.$currentRoute.set({ snapshot: { url: [new UrlSegment('streams', {})], params: {} } });

    spectator.detectChanges();

    assertAddButtonVisible(true);
    assertGoToListButtonVisible(false);
    assertBackAndForthButtonsVisible(false);
  });

  const mockCurrentRoute = (url: UrlSegment[], params: Params = {}) =>
    currentRouteProviderMock.$currentRoute.set({ snapshot: { url, params } });

  test.each([
    { url: [new UrlSegment('new', {})] },
    { url: [new UrlSegment('edit', { streamId: 'test-id' })] }
  ])('should only display the Streams List button when visiting the Add/Edit Stream page', ({ url }) => {
    mockCurrentRoute(url);

    spectator.detectChanges();

    assertAddButtonVisible(false);
    assertGoToListButtonVisible(true);
    assertBackAndForthButtonsVisible(false);
  })

  it('should display all the buttons when visiting the specific Stream page and there are at least 2 streams', () => {
    mockCurrentRoute([new UrlSegment('stream', { streamId: 'test-id' })]);
    streamServiceMock.$streams.set([new Stream('test', 'mental', 'test'), new Stream('test2', 'health', 'test2')])

    spectator.detectChanges();

    assertAddButtonVisible(true);
    assertGoToListButtonVisible(true);
    assertBackAndForthButtonsVisible(true);
  });

  it('should display back to all streams and add stream buttons when visiting the specific Stream page and there are less than 2 streams', () => {
    mockCurrentRoute([new UrlSegment('stream', { streamId: 'test-id' })]);
    streamServiceMock.$streams.set([new Stream('test', 'mental', 'test')])

    spectator.detectChanges();

    assertAddButtonVisible(true);
    assertGoToListButtonVisible(true);
    assertBackAndForthButtonsVisible(false);
  })
})
