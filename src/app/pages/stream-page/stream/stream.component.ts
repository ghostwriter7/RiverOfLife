import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CalendarComponent, } from '@app/components/calendar/calendar.component'
import { PageHeaderComponent } from '@app/components/page-header/page-header.component'
import { ViewToggleComponent } from '@app/pages/stream-page/view-toggle/view-toggle.component'
import { StreamService } from '@app/services/stream/stream.service'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stream',
  imports: [
    PageHeaderComponent,
    CalendarComponent,
    ViewToggleComponent
  ],
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.css'
})
export class StreamComponent {
  public readonly streamId = input.required<string>();

  public readonly title = computed(() =>
    this.streamService.$streams()?.find((stream) => stream.id === this.streamId())?.title || '');

  constructor(private readonly streamService: StreamService) {
  }
}
