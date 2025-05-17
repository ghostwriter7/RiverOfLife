import { Pipe, PipeTransform } from '@angular/core';
import { Category } from '@app/types/category.type'

@Pipe({ name: 'categoryToIcon' })
export class CategoryToIconPipe implements PipeTransform {

  transform(category: Category): string {
    switch (category) {
      case 'health':
        return 'biotech';
      case 'mental':
        return 'self_improvement';
      case 'money':
        return 'currency_exchange';
      case 'sport':
        return 'sports_gymnastics';
      case 'romantic':
        return 'nights_stay';
    }
  }

}
