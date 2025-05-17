import { Category } from '@app/types/category.type'

export class Stream {
  public createdAt: Date | null = null;

  constructor(
    public title: string,
    public category: Category,
    public description: string | null,
    public id: string | null = null,
  ) {
  }

  public copy(): Stream {
    return Stream
      .builder()
      .withCategory(this.category)
      .withCreatedAt(this.createdAt)
      .withDescription(this.description)
      .withId(this.id)
      .withTitle(this.title)
      .build();
  }

  public static builder(): StreamBuilder {
    return new StreamBuilder();
  }
}

class StreamBuilder {
  private id: string | null = null;
  private title: string | null = null;
  private description: string | null = null;
  private category: Category | null = null;
  private createdAt: Date | null = null;

  public withCreatedAt(createdAt: Date | null): StreamBuilder {
    this.createdAt = createdAt;
    return this;
  }

  public withCategory(category: Category): StreamBuilder {
    this.category = category;
    return this;
  }

  public withDescription(description: string | null): StreamBuilder {
    this.description = description;
    return this;
  }

  public withTitle(title: string): StreamBuilder {
    this.title = title;
    return this;
  }

  public withId(id: string | null): StreamBuilder {
    this.id = id;
    return this;
  }

  public build(): Stream {
    if (!this.title) {
      throw new Error('Title is required');
    }

    if (!this.category) {
      throw new Error('Category is required');
    }

    const stream = new Stream(this.title, this.category, this.description, this.id);
    stream.createdAt = this.createdAt;

    return stream;
  }
}
