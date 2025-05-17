import { ChangeDetectionStrategy, Component, Signal } from '@angular/core';
import { RouterLink } from '@angular/router'
import { PageHeaderComponent } from '@app/components/page-header/page-header.component'
import { SpinnerComponent } from '@app/components/spinner/spinner.component'
import { Stream } from '@app/model/stream.model'
import { CategoryToIconPipe } from '@app/pipes/category-to-icon.pipe'
import { StreamService } from '@app/services/stream/stream.service'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-streams',
  imports: [
    CategoryToIconPipe,
    PageHeaderComponent,
    RouterLink,
    SpinnerComponent,
  ],
  templateUrl: './streams.component.html',
  styleUrl: './streams.component.css'
})
export class StreamsComponent {
  protected readonly streams: Signal<Stream[] | null>;

  constructor(private readonly streamService: StreamService) {
    this.streams = this.streamService.$streams;
  }

  protected delete(event: Event, stream: Stream): void {
    event.stopPropagation();
    this.streamService.deleteStream(stream);
  }

  protected edit(event: Event, stream: Stream): void {
    event.stopPropagation();
    this.streamService.editStream(stream);
  }
}
