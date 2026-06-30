import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = '@cache_';
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
}

class CacheManager {
  async get<T>(key: string): Promise<T | null> {
    try {
      const entry = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
      if (!entry) return null;

      const parsed = JSON.parse(entry) as CacheEntry<T>;
      const age = Date.now() - parsed.timestamp;

      // Check if cache is still valid (not expired)
      if (age > CACHE_TTL_MS) {
        await this.remove(key);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn(`[Cache] Failed to get ${key}:`, error);
      return null;
    }
  }

  async set<T>(key: string, data: T): Promise<void> {
    try {
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
      };
      await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
    } catch (error) {
      console.warn(`[Cache] Failed to set ${key}:`, error);
    }
  }

  async remove(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } catch (error) {
      console.warn(`[Cache] Failed to remove ${key}:`, error);
    }
  }

  async clear(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
      await AsyncStorage.multiRemove(cacheKeys);
    } catch (error) {
      console.warn('[Cache] Failed to clear cache:', error);
    }
  }

  async getOrFetch<T>(
    key: string,
    fetcher: () => Promise<T>
  ): Promise<T> {
    // Try to get from cache first
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    // Fetch fresh data
    const data = await fetcher();
    await this.set(key, data);
    return data;
  }
}

export const cache = new CacheManager();
export default cache;
