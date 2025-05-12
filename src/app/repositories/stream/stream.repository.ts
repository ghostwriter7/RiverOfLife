import { Injectable } from '@angular/core';
import { Stream } from '../../model/stream.model'

@Injectable({ providedIn: 'root' })
export class StreamRepository {

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
    const request = streamStore.getAll();

    return new Promise((resolve, reject) => {
      request.onsuccess = () => resolve(request.result
        .map(({ title, category, description }) => new Stream(title, category, description)));

      request.onerror = () => reject(request.error);
    });
  }

  private getDatabase(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open('river-of-life', 1);

      request.onsuccess = () => resolve(request.result);

      request.onerror = () => reject(request.error);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBRequest).result as IDBDatabase;

        if (!db.objectStoreNames.contains('streams')) {
          db.createObjectStore('streams', { keyPath: 'title' });
        }

        resolve(db);
      }
    });
  }
}
