import type { ImageMetadata } from 'astro';

const images = import.meta.glob<{ default: ImageMetadata }>('../assets/projects/*.jpg', { eager: true });
const img = (name: string): ImageMetadata => {
  const hit = images[`../assets/projects/${name}.jpg`];
  if (!hit) throw new Error(`Missing project image ${name}`);
  return hit.default;
};

export type SystemType = 'Hybrid' | 'Grid-tied';
export type Province = 'Rizal' | 'Metro Manila' | 'Bulacan' | 'Tarlac' | 'Pangasinan';

export interface Project {
  slug: string;
  kwp: number;
  type: SystemType;
  batteryAh?: number;
  location?: string;
  province?: Province;
  place?: string; // id in places.json
  date?: string; // ISO date as listed in the profile
  photos: [ImageMetadata, ImageMetadata];
  alts: [string, string];
}

// The installation log from the "Projects" pages of the company profile, newest first.
export const projects: Project[] = [
  {
    slug: 'kingsville-6-96',
    kwp: 6.96,
    type: 'Hybrid',
    batteryAh: 314,
    location: 'Kingsville Subdivision, Antipolo City',
    province: 'Rizal',
    place: 'kingsville',
    date: '2026-02-16',
    photos: [img('kingsville-6-96-a'), img('kingsville-6-96-b')],
    alts: ['Solar panels along the ridge of a green roof', 'The crew standing between two upright solar panels in a yard'],
  },
  {
    slug: 'kingsville-5-8',
    kwp: 5.8,
    type: 'Hybrid',
    batteryAh: 200,
    location: 'Kingsville Subdivision, Antipolo City',
    province: 'Rizal',
    place: 'kingsville',
    date: '2026-02-08',
    photos: [img('kingsville-5-8-a'), img('kingsville-5-8-b')],
    alts: ['Solar panels on a roof with red trim', 'Two men giving a thumbs up beside the inverter and battery'],
  },
  {
    slug: 'urdaneta-9-9',
    kwp: 9.9,
    type: 'Hybrid',
    batteryAh: 314,
    location: 'Urdaneta, Pangasinan',
    province: 'Pangasinan',
    place: 'urdaneta',
    date: '2025-12-06',
    photos: [img('urdaneta-9-9-a'), img('urdaneta-9-9-b')],
    alts: ['A rooftop solar array overlooking rice fields', 'A group holding two solar panels in front of the house'],
  },
  {
    slug: 'pura-4-3',
    kwp: 4.3,
    type: 'Hybrid',
    batteryAh: 280,
    location: 'Pura, Tarlac',
    province: 'Tarlac',
    place: 'pura',
    date: '2025-11-19',
    photos: [img('pura-4-3-a'), img('pura-4-3-b')],
    alts: ['Solar panels catching the low sun', 'Two men beside the wall-mounted inverter and battery'],
  },
  {
    slug: 'san-rafael-9-28',
    kwp: 9.28,
    type: 'Hybrid',
    batteryAh: 400,
    location: 'San Rafael, Tarlac City',
    province: 'Tarlac',
    place: 'san-rafael',
    date: '2025-08-10',
    photos: [img('san-rafael-9-28-a'), img('san-rafael-9-28-b')],
    alts: ['Solar panels on a brown corrugated roof', 'An inverter and battery stack mounted indoors'],
  },
  {
    slug: 'malasiqui-7',
    kwp: 7,
    type: 'Hybrid',
    batteryAh: 300,
    location: 'Malasiqui, Pangasinan',
    province: 'Pangasinan',
    place: 'malasiqui',
    date: '2025-07-08',
    photos: [img('malasiqui-7-a'), img('malasiqui-7-b')],
    alts: ['Three people standing on a finished rooftop array', 'Two men beside the inverter and battery units'],
  },
  {
    slug: 'sta-maria-8-2',
    kwp: 8.2,
    type: 'Hybrid',
    batteryAh: 300,
    location: 'Sta. Maria, Bulacan',
    province: 'Bulacan',
    place: 'sta-maria',
    date: '2025-06-16',
    photos: [img('sta-maria-8-2-a'), img('sta-maria-8-2-b')],
    alts: ['Solar panels on a green roof next to a red-tiled roof', 'A technician at the wall-mounted hybrid inverter and battery'],
  },
  {
    slug: 'boso-boso-16',
    kwp: 16,
    type: 'Grid-tied',
    location: 'Boso‑Boso, Antipolo City',
    province: 'Rizal',
    place: 'boso-boso',
    date: '2025-03-23',
    photos: [img('boso-boso-16-a'), img('boso-boso-16-b')],
    alts: ['Solar panels across a blue corrugated roof', 'A group behind two solar panels in front of a yellow building'],
  },
  {
    slug: 'kingsville-8-6',
    kwp: 8.6,
    type: 'Hybrid',
    batteryAh: 280,
    location: 'Kingsville Subdivision, Antipolo City',
    province: 'Rizal',
    place: 'kingsville',
    date: '2025-03-10',
    photos: [img('kingsville-8-6-a'), img('kingsville-8-6-b')],
    alts: ['Solar panels on a corrugated roof among trees', 'A JTEC electrician working at the meter box'],
  },
  {
    slug: 'up-village-9-8',
    kwp: 9.8,
    type: 'Hybrid',
    batteryAh: 300,
    location: 'UP Village, Quezon City',
    province: 'Metro Manila',
    place: 'up-village',
    photos: [img('up-village-9-8-a'), img('up-village-9-8-b')],
    alts: ['Rows of solar panels on a rooftop', 'A selfie beside the newly installed hybrid inverter'],
  },
  {
    slug: 'kingsville-hills-12',
    kwp: 12,
    type: 'Hybrid',
    batteryAh: 628,
    location: 'Kingsville Hills, Antipolo City',
    province: 'Rizal',
    place: 'kingsville-hills',
    photos: [img('kingsville-hills-12-a'), img('kingsville-hills-12-b')],
    alts: ['The crew with two solar panels in front of a white house', 'The crew beside the installed inverters and battery cabinets'],
  },
  {
    slug: 'cupang-12',
    kwp: 12,
    type: 'Hybrid',
    batteryAh: 600,
    location: 'Cupang, Antipolo City',
    province: 'Rizal',
    place: 'cupang',
    photos: [img('cupang-12-a'), img('cupang-12-b')],
    alts: ['Aerial view of solar panels on red and green roofs', 'The crew gathered around the new inverters and batteries'],
  },
  {
    slug: 'hybrid-10',
    kwp: 10,
    type: 'Hybrid',
    batteryAh: 600,
    photos: [img('hybrid-10-a'), img('hybrid-10-b')],
    alts: ['Aerial view of a solar array on a red corrugated roof', 'Two men beside the inverter and battery units'],
  },
  {
    slug: 'hybrid-6',
    kwp: 6,
    type: 'Hybrid',
    batteryAh: 314,
    photos: [img('hybrid-6-a'), img('hybrid-6-b')],
    alts: ['Aerial view of solar panels on a red roof among trees', 'A man standing beside a wall-mounted inverter and battery'],
  },
];

export const totalKwp = Math.round(projects.reduce((sum, p) => sum + p.kwp, 0) * 100) / 100;
export const hybridCount = projects.filter((p) => p.type === 'Hybrid').length;
export const smallest = projects.reduce((a, b) => (b.kwp < a.kwp ? b : a));
export const largest = projects.reduce((a, b) => (b.kwp > a.kwp ? b : a));

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
export const formatDate = (iso?: string) => {
  if (!iso) return undefined;
  const [y, m, d] = iso.split('-').map(Number);
  return `${d} ${months[m - 1]} ${y}`;
};

export const formatKwp = (kwp: number) => `${kwp.toLocaleString('en-PH', { maximumFractionDigits: 2 })} kWp`;

export const systemLabel = (p: Project) =>
  p.type === 'Hybrid' ? `${formatKwp(p.kwp)} hybrid` : `${formatKwp(p.kwp)} grid-tied`;
