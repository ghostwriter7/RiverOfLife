import { Stream } from '@app/model/stream.model'

export class StreamHelper {
  public static getNextStreamId(currentStreamId: string, streams: Stream[]): string {
    const streamIndex = this.getIndexOfCurrentStream(currentStreamId, streams);

    const nextStreamIndex = streamIndex === streams.length - 1 ? 0 : streamIndex + 1;
    return streams[nextStreamIndex].id!;
  }

  public static getPreviousStreamId(currentStreamId: string, streams: Stream[]): string {
    const streamIndex = this.getIndexOfCurrentStream(currentStreamId, streams);

    const previousStreamIndex = streamIndex === 0 ? streams.length - 1 : streamIndex - 1;
    return streams[previousStreamIndex].id!;
  }

  private static getIndexOfCurrentStream(streamId: string, streams: Stream[]): number {
    return streams.findIndex(({ id }) => id === streamId);
  }
}
