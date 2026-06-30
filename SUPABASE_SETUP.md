# Supabase Setup Guide for Swahilipot Mobile

Complete step-by-step guide to connect your app to real backend data.

## ⏱️ Time Required: 15-20 minutes

---

## Step 1: Create Supabase Project (5 min)

### 1.1 Go to Supabase
- Visit: https://supabase.com
- Click **"Sign Up"** (or login if you have account)
- Use Google, GitHub, or email

### 1.2 Create New Project
1. Click **"New Project"**
2. Enter:
   - **Project name:** `swahilipot-mobile`
   - **Database password:** Create a strong password (save it!)
   - **Region:** Choose closest to Kenya (e.g., `eu-west-1` Europe)
3. Click **"Create new project"**
4. Wait 2-3 minutes for project to initialize

### 1.3 Get Your Credentials
1. Go to **Settings** (gear icon)
2. Click **"API"**
3. Copy these and save them:
   ```
   Project URL: https://xxxxx.supabase.co
   Anon Key: eyJxxxx...
   ```

---

## Step 2: Create Database Tables (5 min)

### 2.1 Open SQL Editor
1. In Supabase dashboard, click **"SQL Editor"** (left sidebar)
2. Click **"New Query"**

### 2.2 Create Users Table
Copy and paste this SQL, then click **"Run"**:

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  avatar TEXT,
  membership TEXT DEFAULT 'Community Member',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read all users, but only update their own
CREATE POLICY "Users can view all profiles" ON users
  FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON users
  FOR UPDATE USING (auth.uid() = id);
```

### 2.3 Create Programs Table
Create new query, paste this, run:

```sql
CREATE TABLE programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL, -- 'mentorship', 'training', 'entrepreneurship', 'arts'
  image TEXT,
  mentor TEXT,
  start_date DATE,
  capacity INT,
  enrolled INT DEFAULT 0,
  source TEXT DEFAULT 'api', -- 'api', 'website', 'social'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Programs are viewable by everyone" ON programs
  FOR SELECT USING (true);

CREATE POLICY "Only admins can insert programs" ON programs
  FOR INSERT WITH CHECK (false); -- Change this later for admin users
```

### 2.4 Create Events Table
Create new query, paste this, run:

```sql
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  date DATE NOT NULL,
  time TIME,
  location TEXT NOT NULL,
  image TEXT,
  capacity INT,
  attendees INT DEFAULT 0,
  source TEXT DEFAULT 'api', -- 'api', 'facebook', 'twitter', 'instagram'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Events are viewable by everyone" ON events
  FOR SELECT USING (true);

CREATE POLICY "Users can create events" ON events
  FOR INSERT WITH CHECK (true);
```

### 2.5 Create Posts Table
Create new query, paste this, run:

```sql
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  author_id UUID REFERENCES users(id),
  content TEXT NOT NULL,
  image TEXT,
  video TEXT,
  source TEXT DEFAULT 'internal', -- 'internal', 'facebook', 'instagram', 'twitter', 'tiktok'
  likes INT DEFAULT 0,
  comments INT DEFAULT 0,
  shares INT DEFAULT 0,
  url TEXT, -- Original post URL if from social
  timestamp TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Posts are viewable by everyone" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Users can create posts" ON posts
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own posts" ON posts
  FOR UPDATE USING (auth.uid() = author_id);
```

### 2.6 Create RSVPs Table
Create new query, paste this, run:

```sql
CREATE TABLE rsvps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) NOT NULL,
  event_id UUID REFERENCES events(id) NOT NULL,
  status TEXT DEFAULT 'going', -- 'going', 'interested', 'not_going'
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, event_id)
);

ALTER TABLE rsvps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view all RSVPs" ON rsvps
  FOR SELECT USING (true);

CREATE POLICY "Users can create own RSVP" ON rsvps
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## Step 3: Add Sample Data (3 min)

### 3.1 Insert Sample Programs
Create new query, paste this, run:

```sql
INSERT INTO programs (title, description, category, mentor, capacity, enrolled) VALUES
('Creative Mentorship Program', 'One-on-one guidance from industry professionals', 'mentorship', 'Jane Doe', 15, 8),
('Digital Skills Training', 'Learn web development, design, digital marketing', 'training', 'John Smith', 30, 22),
('Startup Incubation', 'Support for young entrepreneurs building creative businesses', 'entrepreneurship', 'Sarah Ahmed', 10, 5),
('Arts & Culture Initiative', 'Promoting local arts, music, and cultural heritage', 'arts', 'Amina Hassan', 20, 18);
```

### 3.2 Insert Sample Events
Create new query, paste this, run:

```sql
INSERT INTO events (title, description, date, time, location, capacity, attendees) VALUES
('Creative Coding Workshop', 'Learn web development fundamentals', '2025-07-15', '14:00', 'Swahilipot Studios, Mombasa', 50, 32),
('Community Meetup & Open Mic', 'Connect with community members', '2025-07-22', '18:00', 'Old Town Plaza', 100, 48),
('Entrepreneurship Panel', 'Discuss startup journey with founders', '2025-07-29', '15:00', 'Swahilipot Studios', 40, 35);
```

### 3.3 Insert Sample Posts
Create new query, paste this, run:

```sql
INSERT INTO posts (author, content, source, likes) VALUES
('Juma Hassan', 'Just finished the digital skills bootcamp. Amazing experience! 🚀', 'internal', 42),
('Amina Said', 'Excited to announce our next community meetup this Saturday!', 'internal', 28),
('Swahilipot Team', 'New podcast episode is live! Discussing creative entrepreneurship in East Africa.', 'internal', 156);
```

---

## Step 4: Set Up Authentication (3 min)

### 4.1 Enable Email Auth
1. Go to **Authentication** (left sidebar)
2. Click **"Providers"**
3. Make sure **Email** is enabled (toggle on)
4. Click **"Save"**

### 4.2 Get Service Role Key (for backend)
1. Go to **Settings** → **API**
2. Scroll down to find **"Service role key"**
3. Copy it (you'll need this for backend jobs)
4. Keep this **SECRET** - never share or commit it!

---

## Step 5: Update Mobile App (.env file) (2 min)

### 5.1 Create `.env.local` file
In your project root (`swahilipot-mobile/`), create file `.env.local`:

```
EXPO_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJxxxx...
```

Replace with your actual credentials from Step 1.3

### 5.2 Add to `.gitignore`
Make sure `.env.local` is in `.gitignore` (should already be there):

```
.env.local
.env.*.local
```

---

## Step 6: Update API Client (5 min)

### 6.1 Install Supabase Package
In terminal, run:

```bash
npm install @supabase/supabase-js
```

### 6.2 Create Supabase Client
Create file `lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

### 6.3 Update API Client (`lib/api.ts`)
Replace the mock functions with real Supabase calls.

Replace this section:

```typescript
// OLD - Mock data
private async fetchFromAPI(endpoint: string): Promise<any[]> {
  return [];
}
```

With this:

```typescript
// NEW - Real Supabase
private async fetchFromAPI(endpoint: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from(endpoint.replace('/', ''))
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  } catch (err) {
    console.error(`[API] Failed to fetch ${endpoint}:`, err);
    return [];
  }
}

async getPrograms() {
  return this.fetchFromAPI('programs');
}

async getEvents() {
  return this.fetchFromAPI('events');
}

async getPosts() {
  return this.fetchFromAPI('posts');
}
```

---

## Step 7: Update Auth Context (3 min)

### 7.1 Replace Mock Auth
Update `contexts/AuthContext.tsx`:

Replace:

```typescript
const signUp = async (email: string, _password: string, name: string) => {
  // ... mock user creation
  const mockUser = { ... };
  sessionUser = mockUser;
}
```

With:

```typescript
const signUp = async (email: string, password: string, name: string) => {
  try {
    setError(null);
    setIsLoading(true);

    // Sign up with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user) throw new Error('Sign up failed');

    // Create user profile
    const { error: profileError } = await supabase
      .from('users')
      .insert([{
        id: authData.user.id,
        email,
        name,
      }]);

    if (profileError) throw profileError;

    const user: User = {
      id: authData.user.id,
      email,
      name,
      membership: 'Community Member',
    };

    sessionUser = user;
    sessionToken = authData.session?.access_token || '';
    setUser(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sign up failed';
    setError(message);
    throw err;
  } finally {
    setIsLoading(false);
  }
};
```

Do the same for `signIn`:

```typescript
const signIn = async (email: string, password: string) => {
  try {
    setError(null);
    setIsLoading(true);

    // Sign in with Supabase Auth
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    if (!data.user) throw new Error('Sign in failed');

    // Get user profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (userError) throw userError;

    const user: User = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      membership: userData.membership,
    };

    sessionUser = user;
    sessionToken = data.session?.access_token || '';
    setUser(user);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Sign in failed';
    setError(message);
    throw err;
  } finally {
    setIsLoading(false);
  }
};
```

---

## Step 8: Test It! (2 min)

### 8.1 Reload App
On your phone:
- Shake → "Reload"
- Or press `r` in terminal

### 8.2 Sign Up with Real Backend
1. Click "Sign Up"
2. Enter email, password, name
3. Click "Create Account"
4. **Real account created in Supabase!**

### 8.3 Check Programs
1. Go to **Foundation** tab
2. Pull down to refresh
3. Should see programs from Supabase database
4. Check last sync time

### 8.4 Verify in Supabase
1. Go back to Supabase dashboard
2. Click **"SQL Editor"**
3. Create new query:
   ```sql
   SELECT * FROM users;
   SELECT * FROM programs;
   SELECT * FROM posts;
   ```
4. See your real data!

---

## Step 9: Add More Features (Optional)

### 9.1 Social Media Integration
Add these environment variables to `.env.local`:

```
FACEBOOK_APP_ID=xxx
FACEBOOK_ACCESS_TOKEN=xxx
INSTAGRAM_ACCESS_TOKEN=xxx
TWITTER_BEARER_TOKEN=xxx
TIKTOK_API_KEY=xxx
```

Then implement the social sync methods in `lib/sync.ts`

### 9.2 Set Up Scheduled Sync
Create a **Supabase Edge Function** that syncs from social media daily:

1. Go to **Functions** (left sidebar)
2. Click **"Create a new function"**
3. Name it: `sync-social-content`
4. Implement fetching logic for each platform

### 9.3 Enable Real-time Updates
Add this to `lib/sync.ts`:

```typescript
// Real-time subscription
supabase
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'posts' },
    (payload) => {
      console.log('New post:', payload.new);
      // Refresh posts automatically
    }
  )
  .subscribe();
```

---

## Troubleshooting

### ❌ "Unable to resolve @supabase/supabase-js"
**Solution:** Run `npm install @supabase/supabase-js` again

### ❌ "Invalid API key"
**Solution:** Check your `.env.local` - make sure URL and key are correct

### ❌ "Auth failed"
**Solution:** Make sure email auth is enabled in Supabase Settings → Authentication

### ❌ "Database connection refused"
**Solution:** Check your project is running (should auto-start in Supabase)

### ❌ RLS (Row Level Security) errors
**Solution:** Go to each table in Supabase, click "Auth policies" and review the rules

---

## Next Steps

1. ✅ **Test real authentication** (sign up/login)
2. ✅ **Verify programs load** from database
3. ✅ **Add social credentials** for platforms
4. ✅ **Set up daily sync job** (Supabase function)
5. ✅ **Test pull-to-refresh** with real data

---

## Quick Reference

```typescript
// In your code, use:
import { supabase } from '@/lib/supabase';

// Query data
const { data } = await supabase
  .from('programs')
  .select('*');

// Insert data
await supabase
  .from('posts')
  .insert([{ author: 'Name', content: 'Text' }]);

// Update data
await supabase
  .from('events')
  .update({ attendees: 35 })
  .eq('id', event_id);

// Subscribe to changes
supabase
  .on('postgres_changes', { ... })
  .subscribe();
```

---

**You're all set!** Your Swahilipot Mobile app is now connected to a real production database. 🚀
