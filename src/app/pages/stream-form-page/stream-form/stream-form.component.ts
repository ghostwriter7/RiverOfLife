import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { ActivatedRoute, Router } from '@angular/router'
import { PageHeaderComponent } from '@app/components/page-header/page-header.component'
import { Categories } from '@app/consts/categories.const'
import { Question } from '@app/interfaces/question.interface'
import { Stream } from '@app/model/stream.model'
import { TestIds } from '@app/pages/stream-form-page/stream-form/test-ids.const'
import { StreamService } from '@app/services/stream/stream.service'
import { Category } from '@app/types/category.type'

type QuestionFormGroup = FormGroup<{
  displayIndex: FormControl<number>;
  question: FormControl<string>;
  id: FormControl<string | undefined>;
  inactive: FormControl<boolean>
}>
type QuestionsFormArray = FormArray<QuestionFormGroup>;

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
    questionsOnFailure: new FormArray<QuestionFormGroup>([]),
    questionsOnSuccess: new FormArray<QuestionFormGroup>([]),
  });
  protected readonly error = signal<string | null>(null);
  protected readonly isEdit: boolean;
  protected readonly submitButtonLabel: string;
  protected readonly submitted = signal(false);
  protected readonly testIds = TestIds;
  protected readonly title: string;

  private readonly streamId: string | undefined;

  private get questionsOnFailureArray(): QuestionsFormArray {
    return this.formGroup.controls.questionsOnFailure;
  }

  private get questionsOnSuccessArray(): QuestionsFormArray {
    return this.formGroup.controls.questionsOnSuccess;
  }

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

        stream.questionsOnSuccess.forEach(({ displayIndex, id, inactive, question }) =>
          this.questionsOnSuccessArray.push(this.createQuestionFormGroup(displayIndex, question, id, inactive)));
        stream.questionsOnFailure.forEach(({ displayIndex, id, inactive, question }) =>
          this.questionsOnFailureArray.push(this.createQuestionFormGroup(displayIndex, question, id, inactive)));
      }
    }
  }

  protected async onSubmit(): Promise<void> {
    const { title, description, category, questionsOnSuccess, questionsOnFailure } = this.formGroup.value;

    if (!title || !category || description === undefined) {
      return;
    }

    this.error.set(null);
    this.submitted.set(true);

    const stream = Stream
      .builder()
      .withCategory(category)
      .withDescription(description)
      .withTitle(title)
      .withQuestionsOnSuccess(questionsOnSuccess as Question[])
      .withQuestionsOnFailure(questionsOnFailure as Question[])
      .build();

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

  protected addSuccessQuestion(): void {
    const formArray = this.questionsOnSuccessArray;
    const index = formArray.length ? formArray.length - 1 : 0;
    formArray.push(this.createQuestionFormGroup(index));
  }

  protected addFailureQuestion(): void {
    const formArray = this.questionsOnFailureArray;
    const index = formArray.length ? formArray.length - 1 : 0;
    formArray.push(this.createQuestionFormGroup(index));
  }

  protected removeFailureQuestion(index: number): void {
    const questionFormGroup = this.questionsOnFailureArray.at(index);
    if (questionFormGroup.value.id) {
      questionFormGroup.patchValue({ inactive: true });
    } else {
      this.questionsOnFailureArray.removeAt(index);
    }
  }

  protected removeSuccessQuestion(index: number): void {
    const questionFormGroup = this.questionsOnSuccessArray.at(index);
    if (questionFormGroup.value.id) {
      questionFormGroup.patchValue({ inactive: true });
    } else {
      this.questionsOnSuccessArray.removeAt(index);
    }
  }

  private createQuestionFormGroup(displayIndex = 0, question = '', id: string | undefined = undefined, inactive = false): QuestionFormGroup {
    return new FormGroup({
      displayIndex: new FormControl<number>(displayIndex, { nonNullable: true }),
      question: new FormControl<string>(question, { nonNullable: true, validators: Validators.required }),
      id: new FormControl<string | undefined>(id, { nonNullable: true }),
      inactive: new FormControl<boolean>(inactive, { nonNullable: true }),
    });
  }


}
