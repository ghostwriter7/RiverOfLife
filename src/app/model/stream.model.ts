import { Category } from '@app/types/category.type'

export class Stream {
  public readonly icon: string;

  constructor(
    public readonly title: string,
    public readonly category: Category,
    public readonly description: string | null
  ) {
    this.icon = this.getIconFromCategory(category);
  }

  private getIconFromCategory(category: Category): string {
    switch (category) {
      case 'health': return 'biotech';
      case 'mental': return 'self_improvement';
      case 'money': return 'currency_exchange';
      case 'sport': return 'sports_gymnastics';
      case 'romantic': return 'nights_stay';
    }
  }
}
