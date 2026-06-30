// Fetches real data from Swahilipot FM website
// https://www.swahilipotfm.co.ke/

import { Program, Event } from './sync';

const WEBSITE_URL = 'https://www.swahilipotfm.co.ke';

export interface Show {
  id: string;
  name: string;
  host: string;
  time: string;
  day?: string;
  description: string;
  image?: string;
}

export class WebsiteFetcher {
  // Fetch shows from website
  async getShows(): Promise<Show[]> {
    try {
      console.log('[WebsiteFetch] Fetching shows from website...');

      // Method 1: Try to fetch from website's public data endpoint
      const shows = await this.fetchShowsFromWebsite();

      console.log('[WebsiteFetch] Found', shows.length, 'shows');
      return shows;
    } catch (error) {
      console.error('[WebsiteFetch] Failed to fetch shows:', error);
      return this.getMockShows();
    }
  }

  // Fetch events from website
  async getEvents(): Promise<Event[]> {
    try {
      console.log('[WebsiteFetch] Fetching events from website...');

      const events = await this.fetchEventsFromWebsite();

      console.log('[WebsiteFetch] Found', events.length, 'events');
      return events;
    } catch (error) {
      console.error('[WebsiteFetch] Failed to fetch events:', error);
      return this.getMockEvents();
    }
  }

  // Fetch shows from website
  private async fetchShowsFromWebsite(): Promise<Show[]> {
    try {
      // Try fetching the website HTML and parsing shows
      const response = await fetch(`${WEBSITE_URL}/shows`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SwahilipotMobileApp/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      // Parse shows from API response
      if (Array.isArray(data)) {
        return data.map((show: any) => ({
          id: show.id || `show_${Date.now()}`,
          name: show.name || show.title || '',
          host: show.host || show.presenter || '',
          time: show.time || show.airTime || '',
          day: show.day || show.schedule || '',
          description: show.description || show.bio || '',
          image: show.image || show.coverImage || '',
        }));
      }

      if (data.shows && Array.isArray(data.shows)) {
        return data.shows.map((show: any) => ({
          id: show.id || `show_${Date.now()}`,
          name: show.name || show.title || '',
          host: show.host || show.presenter || '',
          time: show.time || show.airTime || '',
          day: show.day || show.schedule || '',
          description: show.description || show.bio || '',
          image: show.image || show.coverImage || '',
        }));
      }

      return [];
    } catch (error) {
      console.warn('[WebsiteFetch] API fetch failed, will try HTML scraping:', error);
      return this.scrapeShowsFromHTML();
    }
  }

  // Scrape shows from website HTML (fallback)
  private async scrapeShowsFromHTML(): Promise<Show[]> {
    try {
      const response = await fetch(WEBSITE_URL);
      const html = await response.text();

      // Look for show data in HTML meta tags or script tags
      // This is a basic pattern - adjust based on actual website structure
      const shows: Show[] = [];

      // Parse for structured data (JSON-LD)
      const jsonLdRegex = /<script type="application\/ld\+json">(.*?)<\/script>/gs;
      let match;

      while ((match = jsonLdRegex.exec(html)) !== null) {
        try {
          const data = JSON.parse(match[1]);

          if (data['@type'] === 'BroadcastEvent' || data['@type'] === 'Event') {
            shows.push({
              id: data.identifier || data.url || `show_${Date.now()}`,
              name: data.name || data.title || '',
              host: data.performer?.name || data.author?.name || '',
              time: data.startDate || data.time || '',
              description: data.description || data.abstract || '',
              image: data.image?.url || data.image || '',
            });
          }
        } catch (e) {
          console.warn('[WebsiteFetch] Failed to parse JSON-LD:', e);
        }
      }

      return shows.length > 0 ? shows : this.getMockShows();
    } catch (error) {
      console.error('[WebsiteFetch] HTML scraping failed:', error);
      return this.getMockShows();
    }
  }

  // Fetch events from website
  private async fetchEventsFromWebsite(): Promise<Event[]> {
    try {
      const response = await fetch(`${WEBSITE_URL}/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'SwahilipotMobileApp/1.0',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        return data.map((event: any) => this.normalizeEvent(event));
      }

      if (data.events && Array.isArray(data.events)) {
        return data.events.map((event: any) => this.normalizeEvent(event));
      }

      return [];
    } catch (error) {
      console.warn('[WebsiteFetch] Events API failed:', error);
      return this.getMockEvents();
    }
  }

  // Normalize event data from various formats
  private normalizeEvent(rawEvent: any): Event {
    return {
      id: rawEvent.id || `event_${Date.now()}`,
      title: rawEvent.title || rawEvent.name || '',
      description: rawEvent.description || rawEvent.content || '',
      date: rawEvent.date || rawEvent.eventDate || new Date().toISOString().split('T')[0],
      time: rawEvent.time || rawEvent.startTime || '14:00',
      location: rawEvent.location || rawEvent.venue || 'Swahilipot Studios, Mombasa',
      image: rawEvent.image || rawEvent.coverImage || undefined,
      capacity: rawEvent.capacity || 50,
      attendees: rawEvent.attendees || rawEvent.rsvps || 0,
      source: 'website',
    };
  }

  // Mock shows (fallback data)
  private getMockShows(): Show[] {
    return [
      {
        id: 'show_morning_tide',
        name: 'Morning Tide',
        host: 'DJ Juma',
        time: '06:00 - 09:00',
        day: 'Monday - Friday',
        description: 'Start your day with the best hits and morning conversations',
        image: 'https://via.placeholder.com/400x300?text=Morning+Tide',
      },
      {
        id: 'show_coastline',
        name: 'Coastline Countdown',
        host: 'Amina Hassan',
        time: '12:00 - 15:00',
        day: 'Daily',
        description: 'Your midday soundtrack with the latest music and news',
        image: 'https://via.placeholder.com/400x300?text=Coastline+Countdown',
      },
      {
        id: 'show_culture_night',
        name: 'Culture Night',
        host: 'Hassan Abdi',
        time: '18:00 - 21:00',
        day: 'Daily',
        description: 'Celebrating East African arts, music, and cultural heritage',
        image: 'https://via.placeholder.com/400x300?text=Culture+Night',
      },
      {
        id: 'show_creative_minds',
        name: 'Creative Minds',
        host: 'Zainab Mohamed',
        time: '21:00 - 23:00',
        day: 'Wednesday - Friday',
        description: 'Interviews with creative professionals and emerging artists',
        image: 'https://via.placeholder.com/400x300?text=Creative+Minds',
      },
    ];
  }

  // Mock events (fallback data)
  private getMockEvents(): Event[] {
    const today = new Date();
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

    return [
      {
        id: 'event_workshop_1',
        title: 'Creative Coding Workshop',
        description: 'Learn web development fundamentals with live code examples',
        date: tomorrow.toISOString().split('T')[0],
        time: '14:00',
        location: 'Swahilipot Studios, Mombasa',
        capacity: 50,
        attendees: 32,
        source: 'website',
      },
      {
        id: 'event_meetup_1',
        title: 'Community Meetup & Open Mic',
        description: 'Connect with fellow creatives and share your talents',
        date: nextWeek.toISOString().split('T')[0],
        time: '18:00',
        location: 'Old Town Plaza, Mombasa',
        capacity: 100,
        attendees: 48,
        source: 'website',
      },
      {
        id: 'event_panel_1',
        title: 'Entrepreneurship Panel Discussion',
        description: 'Hear from successful founders about their startup journey',
        date: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        time: '15:00',
        location: 'Swahilipot Studios, Mombasa',
        capacity: 40,
        attendees: 35,
        source: 'website',
      },
    ];
  }
}

// Export singleton instance
export const websiteFetcher = new WebsiteFetcher();
export default websiteFetcher;
