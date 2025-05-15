import { NewStreamComponent } from '@app/pages/new-stream-page/new-stream/new-stream.component'
import { StreamService } from '@app/services/stream/stream.service'
import { createComponentFactory, Spectator } from '@ngneat/spectator/jest'

describe('NewStreamComponent', () => {
  const streamServiceMock = { create: () => jest.fn() };

  let spectator: Spectator<NewStreamComponent>;
  const createComponent = createComponentFactory({
    component: NewStreamComponent,
    providers: [
      { provide: StreamService, useValue: streamServiceMock}
    ]
  });

  beforeEach(() => spectator = createComponent())

  it('should create', () => expect(spectator.component).toBeDefined());
})
