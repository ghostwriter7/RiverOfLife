import { StreamHelper } from '@app/helpers/stream-helper'
import { Stream } from '@app/model/stream.model'

describe('StreamHelper', () => {
  const streams = ['stream-a', 'stream-b', 'stream-c'].map((streamId) => Stream
    .builder()
    .withId(streamId)
    .withTitle('Any title')
    .withCategory('mental')
    .build());

  test.each([
    {
      currentStreamId: 'stream-a',
      expectedNextStreamId: 'stream-b',
    },
    {
      currentStreamId: 'stream-b',
      expectedNextStreamId: 'stream-c',
    },
    {
      currentStreamId: 'stream-c',
      expectedNextStreamId: 'stream-a',
    }
  ])('should return the ID of the next stream', ({ currentStreamId, expectedNextStreamId }) =>
    expect(StreamHelper.getNextStreamId(currentStreamId, streams)).toBe(expectedNextStreamId)
  );

  test.each([
    {
      currentStreamId: 'stream-a',
      expectedPreviousStreamId: 'stream-c',
    },
    {
      currentStreamId: 'stream-b',
      expectedPreviousStreamId: 'stream-a',
    },
    {
      currentStreamId: 'stream-c',
      expectedPreviousStreamId: 'stream-b',
    }
  ])('should return the ID of the previous stream', ({ currentStreamId, expectedPreviousStreamId }) =>
    expect(StreamHelper.getPreviousStreamId(currentStreamId, streams)).toBe(expectedPreviousStreamId)
  );
});
