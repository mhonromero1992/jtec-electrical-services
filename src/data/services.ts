import type { ImageMetadata } from 'astro';
import solarInstallation from '../assets/services/solar-installation.jpg';
import electricalDesign from '../assets/services/electrical-design.jpg';
import electricalInstallation from '../assets/services/electrical-installation.jpg';
import solarConsultation from '../assets/services/solar-consultation.jpg';
import quotationProposal from '../assets/services/quotation-proposal.jpg';

export interface Service {
  slug: string;
  name: string;
  summary: string;
  text: string;
  includes: string[];
  image: ImageMetadata;
  alt: string;
}

// Descriptions from the "Our Services" page of the company profile.
export const services: Service[] = [
  {
    slug: 'solar-installation',
    name: 'Solar installation',
    summary: 'Complete solar power systems, from site assessment to commissioning.',
    text: 'JTEC provides complete solar power system installation, from site assessment and system design to installation and commissioning. Each system is customized to maximize energy efficiency, reduce electricity costs and ensure long-term performance for residential and commercial clients.',
    includes: ['Site assessment', 'System design', 'Installation', 'Commissioning'],
    image: solarInstallation,
    alt: 'Two JTEC installers fitting solar panels on a blue corrugated roof',
  },
  {
    slug: 'electrical-design',
    name: 'Electrical design and planning',
    summary: 'Designs built on proper load computation and safety standards.',
    text: 'Professional electrical system designs tailored to each project. JTEC makes sure of proper load computation, system layout and compliance with safety standards, for electrical setups that are efficient and reliable.',
    includes: ['Load computation', 'System layout', 'Safety-standard compliance'],
    image: electricalDesign,
    alt: 'Two inverters and breaker boxes mounted on a concrete wall while a technician works below',
  },
  {
    slug: 'electrical-installation',
    name: 'Electrical installation and maintenance',
    summary: 'Wiring, panel boards, upgrades, and the maintenance after.',
    text: 'Full electrical installation services, including wiring, panel board setup and system upgrades. JTEC also provides routine maintenance and troubleshooting to keep electrical systems safe and running without interruption.',
    includes: ['Wiring', 'Panel board setup', 'System upgrades', 'Maintenance and troubleshooting'],
    image: electricalInstallation,
    alt: 'A JTEC electrician in a branded shirt working at an outdoor meter box',
  },
  {
    slug: 'solar-consultation',
    name: 'Solar system consultation',
    summary: 'Recommendations, cost analysis and return on investment.',
    text: 'Expert consultation to help clients understand solar energy, including system recommendations, cost analysis and return on investment. The goal is an informed, practical energy decision.',
    includes: ['System recommendations', 'Cost analysis', 'Return on investment'],
    image: solarConsultation,
    alt: 'A technician connecting cables under a wall-mounted hybrid inverter',
  },
  {
    slug: 'quotation-proposal',
    name: 'Project quotation and proposal',
    summary: 'A transparent quotation by email before any work starts.',
    text: 'JTEC prepares detailed, transparent quotations sent by email, outlining system components, pricing, scope of work and warranties, for clarity and confidence before the project begins.',
    includes: ['System components', 'Pricing', 'Scope of work', 'Warranties'],
    image: quotationProposal,
    alt: 'A group standing behind two solar panels in front of a yellow building',
  },
];
