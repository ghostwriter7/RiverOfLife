import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { PageHeaderComponent } from '../../../components/page-header/page-header.component'
import { Stream } from '../../../model/stream.model'
import { StreamService } from '../../../services/stream/stream.service'

@Component({
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

  constructor(private readonly streamService: StreamService) {
  }

  protected async onSubmit(): Promise<void> {
    const { title, description, category } = this.formGroup.value;

    if (!title || !category || description === undefined) {
      return;
    }

    // TODO switch on the spinner

    const stream = new Stream(title, category, description);
    try {
      await this.streamService.create(stream);
    } catch (error) {
      // TODO display error
    } finally {
      // TODO switch off the spinner
    }
  }
}
