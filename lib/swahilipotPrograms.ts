// Swahilipot Foundation Programs
// Real programs from Swahilipot Hub

export interface Program {
  id: string;
  title: string;
  description: string;
  category: 'mentorship' | 'training' | 'entrepreneurship' | 'arts' | 'youth' | 'culture';
  image?: string;
  mentor?: string;
  capacity?: number;
  enrolled?: number;
  url?: string; // Link to program page
  source: 'website' | 'api';
}

export const SWAHILIPOT_PROGRAMS: Program[] = [
  {
    id: 'program_case_management',
    title: 'Case Management',
    description: 'Personalized youth support & guidance',
    category: 'youth',
    mentor: 'Swahilipot Team',
    capacity: 50,
    enrolled: 24,
    url: 'https://www.swahilipothub.co.ke/programs/case-management',
    source: 'website',
  },
  {
    id: 'program_v2t',
    title: 'V2T - Vijana To Thrive',
    description: 'Youth Hub Network - Connecting youth across the region',
    category: 'youth',
    mentor: 'Regional Coordinators',
    capacity: 100,
    enrolled: 67,
    url: 'https://www.swahilipothub.co.ke/programs/v2t',
    source: 'website',
  },
  {
    id: 'program_creatives',
    title: 'Creatives',
    description: 'Music, film, dance & visual arts',
    category: 'arts',
    mentor: 'Creative Industry Professionals',
    capacity: 80,
    enrolled: 58,
    url: 'https://www.swahilipothub.co.ke/department/creatives',
    source: 'website',
  },
  {
    id: 'program_digital_literacy',
    title: 'Digital Literacy',
    description: 'Building digital skills for the future',
    category: 'training',
    mentor: 'Tech Educators',
    capacity: 60,
    enrolled: 45,
    url: 'https://www.swahilipothub.co.ke/programs/digital-literacy',
    source: 'website',
  },
  {
    id: 'program_scale_up',
    title: 'Scale Up',
    description: 'Accelerating youth entrepreneurship',
    category: 'entrepreneurship',
    mentor: 'Business Mentors',
    capacity: 30,
    enrolled: 18,
    url: 'https://www.swahilipothub.co.ke/programs/scale-up',
    source: 'website',
  },
  {
    id: 'program_heritage',
    title: 'Heritage',
    description: 'Bridging culture and digital practices',
    category: 'culture',
    mentor: 'Cultural Ambassadors',
    capacity: 40,
    enrolled: 32,
    url: 'https://www.swahilipothub.co.ke/programs/heritage',
    source: 'website',
  },
];

export function getAllPrograms(): Program[] {
  return SWAHILIPOT_PROGRAMS;
}

export function getProgramsByCategory(category: string): Program[] {
  return SWAHILIPOT_PROGRAMS.filter((p) => p.category === category);
}

export function getProgramById(id: string): Program | undefined {
  return SWAHILIPOT_PROGRAMS.find((p) => p.id === id);
}

export function getCategories(): string[] {
  const categories = new Set(SWAHILIPOT_PROGRAMS.map((p) => p.category));
  return Array.from(categories).sort();
}

export function getProgramStats() {
  return {
    total: SWAHILIPOT_PROGRAMS.length,
    totalCapacity: SWAHILIPOT_PROGRAMS.reduce((sum, p) => sum + (p.capacity || 0), 0),
    totalEnrolled: SWAHILIPOT_PROGRAMS.reduce((sum, p) => sum + (p.enrolled || 0), 0),
    categories: getCategories().length,
  };
}
