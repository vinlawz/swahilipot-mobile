// API client for Swahilipot backend
// Currently using mock data, ready for Supabase integration

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  status: number;
}

class ApiClient {
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || 'https://api.swahilipot.org';
  private timeout = 10000;

  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    try {
      const url = `${this.baseUrl}${endpoint}`;
      const response = await fetch(url, {
        ...options,
        timeout: this.timeout,
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`[API] Request failed: ${endpoint}`, error);
      throw error;
    }
  }

  // Auth endpoints (TODO: integrate with Supabase)
  auth = {
    signUp: async (email: string, password: string) => {
      // TODO: Replace with Supabase
      return { id: 'user_1', email, name: email.split('@')[0] };
    },

    signIn: async (email: string, password: string) => {
      // TODO: Replace with Supabase
      return { id: 'user_1', email, name: email.split('@')[0] };
    },

    getProfile: async () => {
      // TODO: Replace with Supabase
      return {
        id: 'user_1',
        email: 'user@example.com',
        name: 'User',
      };
    },
  };

  // Programs/Foundation endpoints
  foundation = {
    getPrograms: async () => {
      // TODO: Replace with Supabase query
      return [
        {
          id: '1',
          title: 'Creative Mentorship Program',
          description: 'One-on-one guidance from industry professionals',
          category: 'mentorship',
        },
        {
          id: '2',
          title: 'Digital Skills Training',
          description: 'Learn web development, design, digital marketing',
          category: 'training',
        },
        {
          id: '3',
          title: 'Startup Incubation',
          description: 'Support for young entrepreneurs',
          category: 'entrepreneurship',
        },
      ];
    },

    getProgram: async (id: string) => {
      // TODO: Replace with Supabase query
      return {
        id,
        title: 'Creative Mentorship Program',
        description: 'Detailed program description',
        category: 'mentorship',
        mentor: 'Jane Doe',
        startDate: '2025-07-15',
        capacity: 15,
        enrolled: 8,
      };
    },
  };

  // Events endpoints
  events = {
    getEvents: async (status: 'upcoming' | 'past' = 'upcoming') => {
      // TODO: Replace with Supabase query
      return [
        {
          id: '1',
          title: 'Creative Coding Workshop',
          date: '2025-07-15',
          time: '2:00 PM',
          location: 'Swahilipot Studios',
          attendees: 32,
          status: 'upcoming',
        },
      ];
    },

    getEvent: async (id: string) => {
      // TODO: Replace with Supabase query
      return {
        id,
        title: 'Creative Coding Workshop',
        description: 'Learn web development fundamentals',
        date: '2025-07-15',
        time: '2:00 PM',
        location: 'Swahilipot Studios, Mombasa',
        capacity: 50,
        attendees: 32,
      };
    },

    rsvpEvent: async (eventId: string) => {
      // TODO: Replace with Supabase mutation
      return { success: true, eventId };
    },
  };

  // Social/Community endpoints
  community = {
    getPosts: async (limit = 20) => {
      // TODO: Replace with Supabase query
      return [
        {
          id: '1',
          author: 'Juma Hassan',
          content: 'Just finished the digital skills bootcamp!',
          timestamp: '2 hours ago',
          likes: 42,
        },
      ];
    },

    likePost: async (postId: string) => {
      // TODO: Replace with Supabase mutation
      return { success: true, postId };
    },

    createPost: async (content: string) => {
      // TODO: Replace with Supabase mutation
      return { id: 'post_' + Date.now(), content, timestamp: 'now' };
    },
  };

  // FM/Streaming endpoints
  streaming = {
    getLiveStatus: async () => {
      // TODO: Replace with real API
      return {
        isLive: true,
        currentShow: 'Morning Tide',
        host: 'DJ Mwangi',
        listeners: 156,
      };
    },

    getShowSchedule: async () => {
      // TODO: Replace with Supabase query
      return [
        { time: '6:00 AM', show: 'Morning Tide', host: 'DJ Mwangi' },
        { time: '12:00 PM', show: 'Coastline Countdown', host: 'Sarah K' },
      ];
    },
  };
}

// Create singleton instance
export const api = new ApiClient();

// Export for direct use
export default api;
