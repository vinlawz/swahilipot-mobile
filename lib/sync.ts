// Unified content sync service
// Fetches and syncs content from website, social media, and backend
// Runs daily or on-demand

import { websiteFetcher, Show } from './websiteFetch';

export interface SyncContent {
  programs: Program[];
  events: Event[];
  posts: SocialPost[];
  lastSyncTime: number;
}

export interface Program {
  id: string;
  title: string;
  description: string;
  category: 'mentorship' | 'training' | 'entrepreneurship' | 'arts';
  image?: string;
  mentor?: string;
  startDate?: string;
  capacity?: number;
  enrolled?: number;
  source: 'website' | 'api'; // Where data came from
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  image?: string;
  capacity?: number;
  attendees: number;
  source: 'website' | 'facebook' | 'twitter' | 'instagram' | 'api';
}

export interface SocialPost {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  likes: number;
  comments?: number;
  shares?: number;
  image?: string;
  video?: string;
  source: 'facebook' | 'twitter' | 'instagram' | 'tiktok' | 'internal';
  url?: string; // Link back to original post
}

class ContentSyncService {
  private lastSyncTime = 0;
  private syncIntervalMs = 24 * 60 * 60 * 1000; // 24 hours

  // Main sync orchestrator
  async syncAllContent(): Promise<SyncContent> {
    try {
      console.log('[Sync] Starting content sync...');

      const [programs, events, posts] = await Promise.all([
        this.syncPrograms(),
        this.syncEvents(),
        this.syncPosts(),
      ]);

      const syncedContent: SyncContent = {
        programs,
        events,
        posts,
        lastSyncTime: Date.now(),
      };

      this.lastSyncTime = Date.now();
      console.log('[Sync] Content sync completed', {
        programs: programs.length,
        events: events.length,
        posts: posts.length,
      });

      return syncedContent;
    } catch (error) {
      console.error('[Sync] Failed to sync content:', error);
      throw error;
    }
  }

  // Sync programs from website + API
  private async syncPrograms(): Promise<Program[]> {
    try {
      const programs: Program[] = [];

      // Fetch from Supabase API
      const apiPrograms = await this.fetchFromAPI('/programs');
      programs.push(...apiPrograms.map((p: any) => ({ ...p, source: 'api' })));

      // Fetch from Swahilipot FM website
      try {
        const shows = await websiteFetcher.getShows();
        const websitePrograms = shows.map((show: Show) => ({
          id: show.id,
          title: show.name,
          description: show.description,
          category: 'training' as const,
          image: show.image,
          mentor: show.host,
          source: 'website' as const,
        }));
        programs.push(...websitePrograms);
        console.log('[Sync] Added', websitePrograms.length, 'shows from website');
      } catch (err) {
        console.warn('[Sync] Failed to fetch shows from website:', err);
      }

      return this.deduplicateContent(programs, 'title');
    } catch (error) {
      console.error('[Sync] Failed to sync programs:', error);
      return [];
    }
  }

  // Sync events from multiple sources
  private async syncEvents(): Promise<Event[]> {
    try {
      const events: Event[] = [];

      // 1. Fetch from Supabase API
      const apiEvents = await this.fetchFromAPI('/events');
      events.push(...apiEvents.map((e: any) => ({ ...e, source: 'api' })));

      // 2. Fetch from Swahilipot FM website
      try {
        const websiteEvents = await websiteFetcher.getEvents();
        events.push(...websiteEvents);
        console.log('[Sync] Added', websiteEvents.length, 'events from website');
      } catch (err) {
        console.warn('[Sync] Failed to fetch events from website:', err);
      }

      // 3. Fetch from Facebook (if API configured)
      const facebookEvents = await this.fetchFromFacebook();
      events.push(...facebookEvents.filter((item): item is Event => 'date' in item));

      // 4. Fetch from Instagram (if API configured)
      const instagramEvents = await this.fetchFromInstagram();
      events.push(...instagramEvents.filter((item): item is Event => 'date' in item));

      // 5. Fetch from Twitter (if API configured)
      const twitterEvents = await this.fetchFromTwitter();
      events.push(...twitterEvents.filter((item): item is Event => 'date' in item));

      return this.deduplicateContent(events, 'title');
    } catch (error) {
      console.error('[Sync] Failed to sync events:', error);
      return [];
    }
  }

  // Sync social posts from all platforms
  private async syncPosts(): Promise<SocialPost[]> {
    try {
      const posts: SocialPost[] = [];

      // 1. Fetch from internal (Supabase)
      const internalPosts = await this.fetchFromAPI('/posts');
      posts.push(...internalPosts.map((p: any) => ({ ...p, source: 'internal' })));

      // 2. Fetch from Facebook
      const facebookPosts = await this.fetchFromFacebook();
      posts.push(...facebookPosts.filter((item): item is SocialPost => !('date' in item)));

      // 3. Fetch from Instagram
      const instagramPosts = await this.fetchFromInstagram();
      posts.push(...instagramPosts.filter((item): item is SocialPost => !('date' in item)));

      // 4. Fetch from Twitter
      const twitterPosts = await this.fetchFromTwitter();
      posts.push(...twitterPosts.filter((item): item is SocialPost => !('date' in item)));

      // 5. Fetch from TikTok
      const tiktokPosts = await this.fetchFromTikTok();
      posts.push(...tiktokPosts);

      // Sort by timestamp (newest first)
      return posts.sort(
        (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
    } catch (error) {
      console.error('[Sync] Failed to sync posts:', error);
      return [];
    }
  }

  // Fetch from Supabase API
  private async fetchFromAPI(endpoint: string): Promise<any[]> {
    try {
      // TODO: Replace with actual Supabase fetch
      // For now, return empty (will be filled when Supabase is set up)
      return [];
    } catch (error) {
      console.warn(`[Sync] Failed to fetch from API ${endpoint}:`, error);
      return [];
    }
  }

  // Fetch from Facebook (requires Facebook API credentials)
  private async fetchFromFacebook(): Promise<(Event | SocialPost)[]> {
    try {
      // TODO: Implement Facebook Graph API
      // Requires: facebook app id, access token, page id
      // Fetch: posts, events, reactions
      return [];
    } catch (error) {
      console.warn('[Sync] Failed to fetch from Facebook:', error);
      return [];
    }
  }

  // Fetch from Instagram (requires Instagram API credentials)
  private async fetchFromInstagram(): Promise<(Event | SocialPost)[]> {
    try {
      // TODO: Implement Instagram Graph API
      // Requires: instagram business account, access token
      // Fetch: posts, stories, reels
      return [];
    } catch (error) {
      console.warn('[Sync] Failed to fetch from Instagram:', error);
      return [];
    }
  }

  // Fetch from Twitter (requires Twitter API credentials)
  private async fetchFromTwitter(): Promise<(Event | SocialPost)[]> {
    try {
      // TODO: Implement Twitter API v2
      // Requires: api key, secret, bearer token
      // Fetch: tweets, retweets, replies
      return [];
    } catch (error) {
      console.warn('[Sync] Failed to fetch from Twitter:', error);
      return [];
    }
  }

  // Fetch from TikTok (requires TikTok API credentials)
  private async fetchFromTikTok(): Promise<SocialPost[]> {
    try {
      // TODO: Implement TikTok API
      // Requires: api key, secret
      // Fetch: videos, comments, engagement
      return [];
    } catch (error) {
      console.warn('[Sync] Failed to fetch from TikTok:', error);
      return [];
    }
  }

  // Remove duplicate content by title
  private deduplicateContent<T extends { title: string }>(
    items: T[],
    key: keyof T
  ): T[] {
    const seen = new Set();
    return items.filter((item) => {
      const value = item[key];
      if (seen.has(value)) return false;
      seen.add(value);
      return true;
    });
  }

  // Check if sync is needed
  shouldSync(): boolean {
    return Date.now() - this.lastSyncTime > this.syncIntervalMs;
  }

  // Force sync regardless of timing
  async forceSyncNow(): Promise<SyncContent> {
    return this.syncAllContent();
  }
}

export const contentSync = new ContentSyncService();
export default contentSync;
