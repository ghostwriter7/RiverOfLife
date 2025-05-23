import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CalendarComponent, } from '@app/components/calendar/calendar.component'
import { PageHeaderComponent } from '@app/components/page-header/page-header.component'
import { QuestionsComponent } from '@app/pages/stream-page/questions/questions.component'
import { ViewToggleComponent } from '@app/pages/stream-page/view-toggle/view-toggle.component'
import { StreamService } from '@app/services/stream/stream.service'
import { StreamView } from '@app/types/stream.view'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stream',
  imports: [
    PageHeaderComponent,
    CalendarComponent,
    ViewToggleComponent,
    QuestionsComponent
  ],
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.css'
})
export class StreamComponent {
  public readonly streamId = input.required<string>();
  public readonly title = computed(() =>
    this.streamService.$streams()?.find((stream) => stream.id === this.streamId())?.title || '');

  protected view: StreamView = 'calendar';

  constructor(private readonly streamService: StreamService) {
  }
}
