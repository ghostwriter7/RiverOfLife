import { Component, input } from '@angular/core';
import { CalendarComponent } from '../../../components/calendar/calendar.component'
import { PageHeaderComponent } from '../../../components/page-header/page-header.component'

@Component({
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
