import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

// In-memory storage that gracefully handles all operations
const memoryStorage = {
  data: {} as Record<string, string>,
  getItem: async (key: string) => {
    try {
      return memoryStorage.data[key] || null;
    } catch (err) {
      console.log('[Storage] getItem error, returning null');
      return null;
    }
  },
  setItem: async (key: string, value: string) => {
    try {
      memoryStorage.data[key] = value;
    } catch (err) {
      console.log('[Storage] setItem error, continuing');
    }
  },
  removeItem: async (key: string) => {
    try {
      delete memoryStorage.data[key];
    } catch (err) {
      console.log('[Storage] removeItem error, continuing');
    }
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: memoryStorage,
    autoRefreshToken: true,
    persistSession: false, // Disable persistence for Expo Go
  },
});
