import { FormOption } from '@app/model/form-option.model'
import { Category } from '@app/types/category.type'

export const Categories: FormOption<Category>[] = [
  new FormOption('Sport', 'sport'),
  new FormOption('Health', 'health'),
  new FormOption('Money', 'money'),
  new FormOption('Mental', 'mental'),
  new FormOption('Romantic', 'romantic'),
];

