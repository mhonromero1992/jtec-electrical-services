import type { ImageMetadata } from 'astro';
import markJay from '../assets/team/mark-jay-fernandez.png';
import robert from '../assets/team/robert-mallillin.png';
import cojack from '../assets/team/cojack-aman.png';
import zaynel from '../assets/team/zaynel-perida.png';
import michelle from '../assets/team/michelle-ann-fernandez.png';
import krisha from '../assets/team/krisha-fernandez.png';

export interface Person {
  name: string;
  role: string;
  photo: ImageMetadata;
  lead?: boolean;
}

// From the "Our Team" page of the profile; Robert S. Mallillin added as Assistant Manager.
export const team: Person[] = [
  { name: 'Engr. Mark Jay P. Fernandez', role: 'General Manager / Owner', photo: markJay, lead: true },
  { name: 'Robert S. Mallillin', role: 'Assistant Manager', photo: robert, lead: true },
  { name: 'Engr. Cojack U. Aman', role: 'Senior Engineer', photo: cojack },
  { name: 'Engr. Zaynel G. Perida', role: 'Design Engineer', photo: zaynel },
  { name: 'Michelle Ann P. Fernandez', role: 'Accounting and Finance', photo: michelle },
  { name: 'Krisha S. Fernandez', role: 'Purchasing Officer', photo: krisha },
];

// "Work Experience" from the profile, in order.
export const experience = [
  { years: '2016', name: 'BPO2 Circuit Makati', place: 'makati' },
  { years: '2017', name: 'Red Planet Hotel Aurora', place: 'aurora-blvd' },
  { years: '2018', name: 'ROHM Electronics, Carmona, Cavite', place: 'carmona' },
  { years: '2019', name: 'Glory Project, Tanza, Cavite', place: 'tanza' },
  { years: '2020', name: 'Calamba Coliseum', place: 'calamba' },
  { years: '2021 to 2023', name: 'Ridgewood Tower Premier, Taguig', place: 'taguig' },
  { years: '2024 to 2026', name: 'North to South Railway Project, Mabalacat', place: 'mabalacat' },
] as const;
