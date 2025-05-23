import { ChangeDetectionStrategy, Component, computed, model } from '@angular/core';
import { StreamView } from '@app/types/stream.view'

@Component({
  selector: 'app-view-toggle',
  templateUrl: './view-toggle.component.html',
  styleUrl: './view-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewToggleComponent {
  public view = model<StreamView>('calendar');

  protected readonly isQuizViewActive = computed(() => this.view() === 'questions');
  protected readonly isCalendarViewActive = computed(() => this.view() === 'calendar');


  protected activateView(view: StreamView): void {
    this.view.set(view);
  }
}
