import { FormControl, FormGroup } from '@angular/forms'

export type CellDetailsFormGroup = FormGroup<{
  climbing: FormControl<boolean>;
  sugarFree: FormControl<boolean>;
  mentalHealth: FormControl<boolean>;
}>;
