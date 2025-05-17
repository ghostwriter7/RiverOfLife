import { Category } from '@app/types/category.type'

export class Stream {
  public createdAt: Date | null = null;

  constructor(
    public readonly title: string,
    public readonly category: Category,
    public readonly description: string | null,
    public id: string | null = null,
  ) {
  }
}
