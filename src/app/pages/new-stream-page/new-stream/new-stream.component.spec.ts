import { provideExperimentalZonelessChangeDetection } from '@angular/core'
import { Router } from '@angular/router'
import { Stream } from '@app/model/stream.model'
import { NewStreamComponent } from '@app/pages/new-stream-page/new-stream/new-stream.component'
import { TestIds } from '@app/pages/new-stream-page/new-stream/test-ids.const'
import { StreamService } from '@app/services/stream/stream.service'
import { byTestId, createComponentFactory, Spectator } from '@ngneat/spectator/jest'

describe('NewStreamComponent', () => {
  const streamServiceMock = { create: jest.fn() };

  let spectator: Spectator<NewStreamComponent>;
  const createComponent = createComponentFactory({
    component: NewStreamComponent,
    providers: [{ provide: StreamService, useValue: streamServiceMock }, provideExperimentalZonelessChangeDetection()]
  });


  beforeEach(() => spectator = createComponent());

  const getSubmitButton = () => spectator.query<HTMLButtonElement>(byTestId(TestIds.SubmitButton))!;
  const getTitleInput = () => spectator.query<HTMLInputElement>(byTestId(TestIds.TitleInput))!;
  const getCategorySelect = () => spectator.query<HTMLSelectElement>(byTestId(TestIds.CategorySelect))!;
  const getErrorMessage = () => spectator.query<HTMLParagraphElement>(byTestId(TestIds.ErrorMessage))!;

  const TEST_TITLE = 'Test Stream';
  const TEST_CATEGORY = 'Mental';

  it('should create', () => expect(spectator.component).toBeDefined());

  it('should keep the button disabled if the form is invalid', () =>
    expect(getSubmitButton()?.disabled).toBe(true)
  );

  it('should enable the button if the required fields are filled up', () => {
    spectator.typeInElement(TEST_TITLE, getTitleInput());
    spectator.selectOption(getCategorySelect(), TEST_CATEGORY);

    expect(getSubmitButton().disabled).toBe(false);
  });

  describe('Submission', () => {
    let router: Router;

    beforeEach(() => {
      router = spectator.inject(Router);
      jest.useFakeTimers();
    });

    afterEach(() => jest.useRealTimers());

    it('should call the service when the form is submitted and redirect on success', async () => {
      streamServiceMock.create.mockResolvedValue(null);
      const navigateFn = jest.spyOn(router, 'navigate')
        .mockResolvedValue(true);

      spectator.typeInElement(TEST_TITLE, getTitleInput());
      spectator.selectOption(getCategorySelect(), TEST_CATEGORY);

      spectator.dispatchMouseEvent(getSubmitButton(), 'click');

      await jest.runAllTimersAsync();

      expect(streamServiceMock.create).toHaveBeenCalledWith(new Stream(TEST_TITLE, TEST_CATEGORY, null));
      expect(navigateFn).toHaveBeenCalledWith(['streams', TEST_TITLE]);
      expect(getErrorMessage()).toBeNull();
    });

    it('should handle a service error on submission', async () => {
      const errorMessage = 'Service error';
      streamServiceMock.create.mockRejectedValue(new Error(errorMessage));
      const navigateFn = jest.spyOn(router, 'navigate');

      spectator.typeInElement(TEST_TITLE, getTitleInput());
      spectator.selectOption(getCategorySelect(), TEST_CATEGORY);

      spectator.dispatchMouseEvent(getSubmitButton(), 'click');

      await jest.runAllTimersAsync();

      expect(streamServiceMock.create).toHaveBeenCalledWith(new Stream(TEST_TITLE, TEST_CATEGORY, null));
      expect(navigateFn).not.toHaveBeenCalled();
      expect(getErrorMessage()?.textContent).toBe(errorMessage);
    });
  });
});
