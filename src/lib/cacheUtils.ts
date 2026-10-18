interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

const memoryStore: Record<string, CacheEntry<unknown>> = {};

export function getMemoryCache<T>(key: string, ttlMs = 30000): T | null {
  const entry = memoryStore[key];
  if (!entry) return null;
  if (Date.now() - entry.timestamp > ttlMs) {
    delete memoryStore[key];
    return null;
  }
  return entry.data as T;
}

export function setMemoryCache<T>(key: string, data: T): void {
  memoryStore[key] = {
    data,
    timestamp: Date.now(),
  };
}

export function invalidateMemoryCache(key: string): void {
  delete memoryStore[key];
}
