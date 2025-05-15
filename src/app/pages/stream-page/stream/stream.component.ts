import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CalendarComponent, } from '@app/components/calendar/calendar.component'
import { PageHeaderComponent } from '@app/components/page-header/page-header.component'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stream',
  imports: [
    PageHeaderComponent,
    CalendarComponent
  ],
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.css'
})
export class StreamComponent {
  public readonly streamId = input.required<string>();
}
