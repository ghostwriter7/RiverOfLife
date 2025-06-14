import { effect, Injectable, signal, Signal } from '@angular/core'
import { Router } from '@angular/router'
import { createUUID } from '@app/functions/create-uuid.function'
import { StreamHelper } from '@app/helpers/stream-helper'
import { Question } from '@app/interfaces/question.interface'
import { Stream } from '@app/model/stream.model'
import { StreamRepository } from '@app/repositories/stream/stream.repository'

@Injectable({ providedIn: 'root' })
export class StreamService {
  public readonly $streams: Signal<Stream[] | null>;

  public readonly $currentMonth: Signal<number>;
  public readonly $currentYear: Signal<number>;
  public readonly $monthData: Signal<number[]>;

  private readonly currentMonth = signal<number>(0);
  private readonly currentYear = signal<number>(0);
  private readonly monthData = signal<number[]>([]);
  private readonly streamId = signal<string | null>(null);
  private readonly streams = signal<Stream[] | null>(null);

  constructor(
    private readonly router: Router,
    private readonly streamRepository: StreamRepository) {
    this.$monthData = this.monthData.asReadonly();
    this.$currentYear = this.currentYear.asReadonly();
    this.$currentMonth = this.currentMonth.asReadonly();
    this.$streams = this.streams.asReadonly();

    this.getAll()
      .then((streams) => this.streams.set(streams))
      .catch((error) => console.error('Failed to load streams', error));

    this.resetCalendar();

    effect(async () => {
      const month = this.currentMonth();
      const year = this.currentYear();
      const streamId = this.streamId();

      if (!month || !year || !streamId) return;

      this.updateMonthData(streamId, month, year);
    });
  }

  public goToNextStream(): void {
    this.router.navigate(['streams', StreamHelper.getNextStreamId(this.streamId()!, this.streams()!)]);
  }

  public goToPreviousStream(): void {
    this.router.navigate(['streams', StreamHelper.getPreviousStreamId(this.streamId()!, this.streams()!)]);
  }

  public async update(streamId: string, {
    category,
    description,
    title,
    questionsOnFailure,
    questionsOnSuccess
  }: Stream): Promise<Stream> {
    const streamIndex = this.streams()?.findIndex(({ id }) => id === streamId);

    if (streamIndex === -1 || streamIndex === undefined) {
      throw new Error('Stream not found');
    }

    const stream = this.streams()?.[streamIndex]!;
    const withId = (question: Question) => question.id ? question : ({ ...question, id: createUUID() });

    const updatedStream = Stream
      .builder()
      .withId(streamId)
      .withCategory(category)
      .withDescription(description)
      .withTitle(title)
      .withCreatedAt(stream.createdAt)
      .withQuestionsOnSuccess(questionsOnSuccess.map(withId))
      .withQuestionsOnFailure(questionsOnFailure.map(withId))
      .build();

    this.streams.update((streams) => streams!.with(streamIndex, updatedStream));

    this.streamRepository.updateStream(updatedStream);
    this.router.navigate(['streams', streamId]);

    return updatedStream;
  }

  public async editStream(stream: Stream): Promise<void> {
    await this.router.navigate(['edit', stream.id], { state: stream });
  }

  public async deleteStream({ id }: Stream): Promise<void> {
    await Promise.all([
        this.streamRepository.deleteStreamByStreamId(id!),
        this.streamRepository.deleteStreamDataByStreamId(id!)
      ]
    );

    this.streams.update((streams) => streams!.filter((stream) => stream.id !== id));
  }

  public async create(stream: Stream): Promise<Stream> {
    const streams = await this.getAll();

    if (streams.some(({ title }) => title === stream.title)) {
      throw new Error('Stream with this title already exists.');
    }

    stream.id = stream.title.toLowerCase().replace(/\s/g, '_');
    stream.createdAt = new Date();

    const withId = (question: Question) => ({ ...question, id: createUUID(), inactive: false });
    stream.questionsOnSuccess = stream.questionsOnSuccess.map(withId);
    stream.questionsOnFailure = stream.questionsOnFailure.map(withId);

    this.streams.update((streams) => [...(streams || []), stream]);

    return this.streamRepository.create(stream);
  }

  public setStreamId(streamId: string): void {
    this.streamId.set(streamId);
    this.resetCalendar();
  }

  public getAll(): Promise<Stream[]> {
    return this.streamRepository.getAll();
  }

  private async updateMonthData(streamId: string, month: number, year: number): Promise<void> {
    const monthLength = new Date(year, month + 1, 0).getDate();
    this.monthData.set(new Array(monthLength).fill(1));

    const monthData = await this.streamRepository.getStreamDataByMonthAndYear(streamId, month, year);
    if (monthData.length !== 0) {
      this.monthData.set(monthData);
    }
  }

  public async updateDay(date: number, state: number): Promise<void> {
    this.monthData.update((data) => data.with(date - 1, state));
    await this.streamRepository.updateMonthData(this.streamId()!, this.currentMonth(), this.currentYear(), this.monthData());
  }

  public showPreviousMonth(): void {
    const currentMonth = this.currentMonth();

    if (currentMonth === 0) {
      this.currentMonth.set(11);
      this.currentYear.update((year) => year - 1);
    } else {
      this.currentMonth.update((month) => month - 1);
    }
  }

  public showNextMonth(): void {
    const currentMonth = this.currentYear();

    if (currentMonth === 11) {
      this.currentMonth.set(0);
      this.currentYear.update((year) => year + 1);
    } else {
      this.currentMonth.update((month) => month + 1);
    }
  }

  private resetCalendar(): void {
    const now = new Date();
    this.currentMonth.set(now.getMonth());
    this.currentYear.set(now.getFullYear());

  }
}
