import { provideExperimentalZonelessChangeDetection } from '@angular/core'
import { ActivatedRoute, Router } from '@angular/router'
import { Stream } from '@app/model/stream.model'
import { StreamFormComponent } from '@app/pages/stream-form-page/stream-form/stream-form.component'
import { TestIds } from '@app/pages/stream-form-page/stream-form/test-ids.const'
import { StreamService } from '@app/services/stream/stream.service'
import { byTestId, createComponentFactory, Spectator } from '@ngneat/spectator/jest'

describe('StreamFormComponent', () => {
  const streamServiceMock = { create: jest.fn(), update: jest.fn() };

  let spectator: Spectator<StreamFormComponent>;
  const createComponent = createComponentFactory({
    component: StreamFormComponent,
    providers: [{ provide: StreamService, useValue: streamServiceMock }, provideExperimentalZonelessChangeDetection()]
  });

  const getSubmitButton = () => spectator.query<HTMLButtonElement>(byTestId(TestIds.SubmitButton))!;
  const getTitleInput = () => spectator.query<HTMLInputElement>(byTestId(TestIds.TitleInput))!;
  const getCategorySelect = () => spectator.query<HTMLSelectElement>(byTestId(TestIds.CategorySelect))!;
  const getErrorMessage = () => spectator.query<HTMLParagraphElement>(byTestId(TestIds.ErrorMessage))!;

  const TEST_TITLE = 'Test Stream';
  const TEST_CATEGORY = 'mental';

  describe('New Stream Case', () => {
    const TEST_ID = 'test_stream';

    beforeEach(() => spectator = createComponent({
      providers: [{ provide: ActivatedRoute, useValue: { snapshot: { data: {}, params: {} } } }]
    }))

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
        streamServiceMock.create.mockResolvedValue({ id: TEST_ID });
        const navigateFn = jest.spyOn(router, 'navigate')
          .mockResolvedValue(true);

        spectator.typeInElement(TEST_TITLE, getTitleInput());
        spectator.selectOption(getCategorySelect(), TEST_CATEGORY);

        spectator.dispatchMouseEvent(getSubmitButton(), 'click');

        await jest.runAllTimersAsync();

        expect(streamServiceMock.create).toHaveBeenCalledWith(new Stream(TEST_TITLE, TEST_CATEGORY, null));
        expect(streamServiceMock.update).not.toHaveBeenCalled();
        expect(navigateFn).toHaveBeenCalledWith(['streams', TEST_ID]);
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
        expect(streamServiceMock.update).not.toHaveBeenCalled();
        expect(navigateFn).not.toHaveBeenCalled();
        expect(getErrorMessage()?.textContent).toBe(errorMessage);
      });
    });
  });


  describe('Edit Stream Case', () => {
    const STREAM_ID = 'test-stream';
    const TEST_DESCRIPTION = 'Test description';
    const editedStream = new Stream('Existing Title', 'mental', TEST_DESCRIPTION);
    const routerMock = {
      getCurrentNavigation: jest.fn().mockReturnValue({ extras: { state: editedStream } }),
      navigate: jest.fn().mockResolvedValue(true)
    };

    beforeEach(() => {
      spectator = createComponent({
        providers: [
          {
            provide: ActivatedRoute,
            useValue: { snapshot: { data: { isEdit: true }, params: { streamId: STREAM_ID } } },
          },
          { provide: Router, useValue: routerMock }
        ]
      });

      jest.useFakeTimers();
    });

    afterEach(() => jest.useRealTimers());

    it('should call the service when the form is submitted and redirect on success', async () => {
      streamServiceMock.update.mockResolvedValue({ id: STREAM_ID });

      spectator.typeInElement(TEST_TITLE, getTitleInput());
      spectator.selectOption(getCategorySelect(), TEST_CATEGORY);

      spectator.dispatchMouseEvent(getSubmitButton(), 'click');

      await jest.runAllTimersAsync();

      expect(streamServiceMock.update).toHaveBeenCalledWith(STREAM_ID, new Stream(TEST_TITLE, TEST_CATEGORY, TEST_DESCRIPTION));
      expect(streamServiceMock.create).not.toHaveBeenCalled();
      expect(routerMock.navigate).toHaveBeenCalledWith(['streams', STREAM_ID]);
      expect(getErrorMessage()).toBeNull();
    });

    it('should handle a service error on submission', async () => {
      const errorMessage = 'Service error';
      streamServiceMock.update.mockRejectedValue(new Error(errorMessage));

      spectator.typeInElement(TEST_TITLE, getTitleInput());
      spectator.selectOption(getCategorySelect(), TEST_CATEGORY);

      spectator.dispatchMouseEvent(getSubmitButton(), 'click');

      await jest.runAllTimersAsync();

      expect(streamServiceMock.update).toHaveBeenCalledWith(STREAM_ID, new Stream(TEST_TITLE, TEST_CATEGORY, TEST_DESCRIPTION));
      expect(streamServiceMock.create).not.toHaveBeenCalled();
      expect(routerMock.navigate).not.toHaveBeenCalled();
      expect(getErrorMessage()?.textContent).toBe(errorMessage);
    });
  });
});
