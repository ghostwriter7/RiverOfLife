import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms'
import { PageHeaderComponent } from '../../../components/page-header/page-header.component'

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

  protected onSubmit(): void {

  }
}
