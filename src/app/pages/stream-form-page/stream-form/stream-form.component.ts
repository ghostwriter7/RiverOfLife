import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { PageHeaderComponent } from '@app/components/page-header/page-header.component'
import { Categories } from '@app/consts/categories.const'
import { Stream } from '@app/model/stream.model'
import { TestIds } from '@app/pages/stream-form-page/stream-form/test-ids.const'
import { StreamService } from '@app/services/stream/stream.service'
import { Category } from '@app/types/category.type'

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-stream-form',
  imports: [
    PageHeaderComponent,
    ReactiveFormsModule
  ],
  templateUrl: './stream-form.component.html',
  styleUrl: './stream-form.component.css'
})
export class StreamFormComponent {
  protected readonly categories = Categories;
  protected readonly formGroup = new FormGroup({
    title: new FormControl<string | null>(null, Validators.required),
    description: new FormControl<string | null>(null),
    category: new FormControl<Category | null>(null, Validators.required),
  });
  protected readonly error = signal<string | null>(null);
  protected readonly isEdit: boolean;
  protected readonly submitButtonLabel: string;
  protected readonly submitted = signal(false);
  protected readonly testIds = TestIds;
  protected readonly title: string;

  private readonly streamId: string | undefined;

  constructor(
    route: ActivatedRoute,
    private readonly streamService: StreamService,
    private readonly router: Router) {
    const { data, params } = route.snapshot;
    this.isEdit = (data as {isEdit?: boolean}).isEdit ?? false;
    this.streamId = (params as {streamId?: string}).streamId;

    this.title = this.isEdit ? 'Edit Stream' : 'New Stream';
    this.submitButtonLabel = this.isEdit ? 'Update' : 'Create';

    if (this.isEdit) {
      const stream = this.router.getCurrentNavigation()?.extras.state as Stream;

      if (!stream) {
        this.router.navigate(['streams']);
      } else {
        this.formGroup.patchValue({
          title: stream.title,
          description: stream.description,
          category: stream.category,
        });
      }
    }
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
      const { id } = await (this.isEdit ? this.streamService.update(this.streamId!, stream) : this.streamService.create(stream));
      this.router.navigate(['streams', id]);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'Unknown error');
      this.submitted.set(false);
    }
  }

  protected cancel(): void {
    this.router.navigate(['streams', this.streamId]);
  }
}
