import { Injectable } from '@angular/core'
import { Stream } from '../../model/stream.model'
import { StreamRepository } from '../../repositories/stream/stream.repository'

@Injectable({ providedIn: 'root' })
export class StreamService {

  constructor(private readonly streamRepository: StreamRepository) {
  }

  public async create(stream: Stream): Promise<Stream> {
    const streams = await this.getAll();

    if (streams.some(({ title }) => title === stream.title)) {
      throw new Error('Stream with this title already exists.');
    }

    return await this.streamRepository.create(stream);
  }

  public async getAll(): Promise<Stream[]> {
    return await this.streamRepository.getAll();
  }
}
