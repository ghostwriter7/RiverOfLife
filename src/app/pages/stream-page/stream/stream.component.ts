import { Component, input } from '@angular/core';
import { PageHeaderComponent } from '../../../components/page-header/page-header.component'

@Component({
  selector: 'app-stream',
  standalone: true,
  imports: [
    PageHeaderComponent
  ],
  templateUrl: './stream.component.html',
  styleUrl: './stream.component.css'
})
export class StreamComponent {
  public readonly streamId = input.required<string>();
}
