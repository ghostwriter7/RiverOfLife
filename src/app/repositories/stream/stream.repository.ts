import { Injectable } from '@angular/core';
import { Stream } from '@app/model/stream.model'

@Injectable({ providedIn: 'root' })
export class StreamRepository {
  private db: IDBDatabase | null = null;

  public async updateStream(stream: Stream): Promise<void> {
    const db = await this.getDatabase();
    const transaction = db.transaction('streams', 'readwrite');
    const store = transaction.objectStore('streams');
    const request = store.put(stream);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async deleteStreamByStreamId(streamId: string): Promise<void> {
    const db = await this.getDatabase();
    const transaction = db.transaction('streams', 'readwrite');
    const streamStore = transaction.objectStore('streams');
    const request = streamStore.delete(streamId);
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async deleteStreamDataByStreamId(streamId: string): Promise<void> {
    const db = await this.getDatabase();
    const transaction = db.transaction('stream-data', 'readwrite');
    const streamDataStore = transaction.objectStore('stream-data');
    const request = streamDataStore.delete(IDBKeyRange.bound([streamId, 0, 0], [streamId, 11, 9999]));
    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  public async getStreamDataByMonthAndYear(streamId: string, month: number, year: number): Promise<number[]> {
    const db = await this.getDatabase();
    const transaction = db.transaction('stream-data', 'readonly');

    const streamDataStore = transaction.objectStore('stream-data');
    const request = streamDataStore.get([streamId, month, year]);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve((request.result as { data: number[] })?.data || []);

      request.onerror = () => reject(request.error);
    })
  }

  public async create(stream: Stream): Promise<Stream> {
    const db = await this.getDatabase();
    const transaction = db.transaction('streams', 'readwrite');

    const streamStore = transaction.objectStore('streams');
    const request = streamStore.add(stream);

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(stream);

      request.onerror = () => reject(request.error);
    });
  }

  public async getAll(): Promise<Stream[]> {
    const db = await this.getDatabase();
    const transaction = db.transaction('streams', 'readonly');

    const streamStore = transaction.objectStore('streams');
    const index = streamStore.index('createdAtIndex');
    const direction = 'next';
    const request = index.openCursor(null, direction);

    return new Promise((resolve, reject) => {
      const streams: Stream[] = [];
      request.onsuccess = (event: Event) => {
        const cursor = (event.target as IDBRequest).result as IDBCursorWithValue;
        if (cursor) {
          const { category, createdAt, description, id, title } = cursor.value;
          const stream = Stream
            .builder()
            .withTitle(title)
            .withCategory(category)
            .withDescription(description)
            .withId(id)
            .withCreatedAt(createdAt)
            .build();
          streams.push(stream);
          cursor.continue();
        } else {
          resolve(streams);
        }
      }

      request.onerror = () => reject(request.error);
    });
  }


  public async updateMonthData(streamId: string, month: number, year: number, data: number[]): Promise<void> {
    const db = await this.getDatabase();
    const transaction = db.transaction('stream-data', 'readwrite');

    const streamDataStore = transaction.objectStore('stream-data');
    const request = streamDataStore.put({ streamId, month, year, data });

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve();

      request.onerror = () => reject(request.error);
    });
  }

  private getDatabase(): Promise<IDBDatabase> {
    if (this.db) {
      return Promise.resolve(this.db);
    }

    return new Promise((resolve, reject) => {
      const request = indexedDB.open('river-of-life', 1);

      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };

      request.onerror = () => reject(request.error);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBRequest).result as IDBDatabase;

        if (!db.objectStoreNames.contains('streams')) {
          const store = db.createObjectStore('streams', { keyPath: 'id' });
          store.createIndex('createdAtIndex', 'createdAt');
        }

        if (!db.objectStoreNames.contains('stream-data')) {
          db.createObjectStore('stream-data', { keyPath: ['streamId', 'month', 'year'] });
        }
      }
    });
  }
}
