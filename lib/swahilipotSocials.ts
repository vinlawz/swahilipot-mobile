// Swahilipot Social Media Presence
// Direct links to all platforms

export interface SocialPlatform {
  id: string;
  name: string;
  icon: string;
  color: string;
  url: string;
  handle?: string;
  description: string;
}

export const SWAHILIPOT_SOCIALS: SocialPlatform[] = [
  {
    id: 'youtube',
    name: 'YouTube',
    icon: 'play-circle',
    color: '#FF0000',
    url: 'https://www.youtube.com/@swahilipotfm',
    handle: '@swahilipotfm',
    description: 'Videos & live streams',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    icon: 'camera',
    color: '#E4405F',
    url: 'https://www.instagram.com/swahilipotfm/',
    handle: '@swahilipotfm',
    description: 'Photos & Stories',
  },
  {
    id: 'twitter',
    name: 'Twitter/X',
    icon: 'twitter',
    color: '#000000',
    url: 'https://x.com/swahilipotfm',
    handle: '@swahilipotfm',
    description: 'News & updates',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    icon: 'facebook',
    color: '#1877F2',
    url: 'https://www.facebook.com/people/Swahilipot-Fm/100093582650835/',
    handle: 'Swahilipot FM',
    description: 'Community & events',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Channel',
    icon: 'message',
    color: '#25D366',
    url: 'https://www.whatsapp.com/channel/0029Vap3gSq7z4kc8n1ECO0P',
    handle: 'Swahilipot FM',
    description: 'Direct updates',
  },
];

export function getSocialById(id: string): SocialPlatform | undefined {
  return SWAHILIPOT_SOCIALS.find((s) => s.id === id);
}

export function getAllSocials(): SocialPlatform[] {
  return SWAHILIPOT_SOCIALS;
}
