import { Question } from '@app/interfaces/question.interface'
import { Category } from '@app/types/category.type'

export class Stream {
  public createdAt: Date | null = null;
  public questionsOnSuccess: Question[] = [];
  public questionsOnFailure: Question[] = [];
  public title!: string;
  public category!: Category;
  public description!: string | null;
  public id: string | null = null;

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
  private questionsOnSuccess: Question[] = [];
  private questionsOnFailure: Question[] = [];

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

  public withQuestionsOnSuccess(questions: Question[]): StreamBuilder {
    this.questionsOnSuccess = questions;
    return this;
  }

  public withQuestionsOnFailure(questions: Question[]): StreamBuilder {
    this.questionsOnFailure = questions;
    return this;
  }

  public build(): Stream {
    if (!this.title) {
      throw new Error('Title is required');
    }

    if (!this.category) {
      throw new Error('Category is required');
    }

    const stream = new Stream();
    stream.title = this.title;
    stream.category = this.category;
    stream.description = this.description;
    stream.id = this.id;
    stream.createdAt = this.createdAt;
    stream.questionsOnSuccess = this.questionsOnSuccess;
    stream.questionsOnFailure = this.questionsOnFailure;

    return stream;
  }
}
