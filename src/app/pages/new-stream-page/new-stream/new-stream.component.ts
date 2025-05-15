import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router'
import { PageHeaderComponent } from '@app/components/page-header/page-header.component'
import { Stream } from '@app/model/stream.model'
import { StreamService } from '@app/services/stream/stream.service'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-new-stream',
  imports: [
    PageHeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './new-stream.component.html',
  styleUrl: './new-stream.component.css'
})
export class NewStreamComponent {
  protected readonly formGroup = new FormGroup({
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
    category: new FormControl<string | null>(null, Validators.required),
  });
  protected readonly error = signal<string | null>(null);
  protected readonly submitted = signal(false);

  constructor(private readonly streamService: StreamService,
              private readonly router: Router) {
  }

  protected async onSubmit(): Promise<void> {
    const { title, description, category } = this.formGroup.value;

    if (!title || !category || description === undefined) {
      return;
    }

    this.error.set(null);
    this.submitted.set(true);

    const stream = new Stream(title, category, description);
    try {
      await this.streamService.create(stream);
      this.router.navigate(['streams', stream.title]);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Unknown error');
      this.submitted.set(false);
    }
  }
}
