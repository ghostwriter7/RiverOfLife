import { Component, Signal } from '@angular/core';
import { RouterLink } from '@angular/router'
import { PageHeaderComponent } from '../../../components/page-header/page-header.component'
import { Stream } from '../../../model/stream.model'
import { StreamService } from '../../../services/stream/stream.service'

@Component({
  selector: 'app-streams',
  imports: [
    PageHeaderComponent,
    RouterLink,
  ],
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.css'
})
export class StreamsComponent {
  protected readonly streams: Signal<Stream[]>;

  constructor(private readonly streamService: StreamService) {
    this.streams = this.streamService.$streams;
  }

  protected delete(event: Event, stream: Stream): void {
    event.stopPropagation();
    this.streamService.deleteStream(stream);
  }
}
