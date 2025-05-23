import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

@Component({
  selector: 'app-view-toggle',
  templateUrl: './view-toggle.component.html',
  styleUrl: './view-toggle.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewToggleComponent {
  protected readonly isQuizViewActive = computed(() => this.activeView() === 'quiz');
  protected readonly isCalendarViewActive = computed(() => this.activeView() === 'calendar');

  protected readonly activeView = signal<'calendar' | 'quiz'>('calendar')

  protected activateView(view: 'calendar' | 'quiz'): void {
    this.activeView.set(view);
  }
}
