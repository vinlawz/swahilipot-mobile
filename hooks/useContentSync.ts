import { useEffect, useState, useCallback } from 'react';
import { AppState, AppStateStatus } from 'react-native';
import contentSync, { SyncContent } from '@/lib/sync';
import { cache } from '@/lib/cache';

interface UseSyncState {
  data: SyncContent | null;
  loading: boolean;
  error: string | null;
  lastSync: number | null;
  refreshing: boolean;
  refresh: () => Promise<void>;
}

const CACHE_KEY = 'content_sync';

export function useContentSync(): UseSyncState {
  const [data, setData] = useState<SyncContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastSync, setLastSync] = useState<number | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch content from sync service or cache
  const fetchContent = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);

      // Try cache first (if not refreshing)
      if (!isRefresh) {
        const cached = await cache.get<SyncContent>(CACHE_KEY);
        if (cached) {
          setData(cached);
          setLastSync(cached.lastSyncTime);
          setLoading(false);
          return;
        }
      }

      // Fetch fresh content
      const syncedContent = await contentSync.syncAllContent();
      await cache.set(CACHE_KEY, syncedContent);

      setData(syncedContent);
      setLastSync(syncedContent.lastSyncTime);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to sync content';
      setError(message);
      console.error('[useContentSync] Error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  // Initial sync on mount
  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  // Auto-sync when app comes to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener('change', handleAppStateChange);

    return () => {
      subscription.remove();
    };

    function handleAppStateChange(state: AppStateStatus) {
      if (state === 'active') {
        // App came to foreground
        if (contentSync.shouldSync()) {
          console.log('[useContentSync] Auto-syncing content...');
          fetchContent();
        }
      }
    }
  }, [fetchContent]);

  return {
    data,
    loading,
    error,
    lastSync,
    refreshing,
    refresh: () => fetchContent(true),
  };
}
