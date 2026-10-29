// Company facts, all taken from the JTEC Electrical Services company profile (2026).

export const site = {
  name: 'JTEC Electrical Services',
  shortName: 'JTEC',
  division: 'JTEC Solar Installation',
  phoneDisplay: '0976 050 3461',
  phoneHref: 'tel:+639760503461',
  email: 'fernandezmarkjay802@gmail.com',
  address: {
    locality: 'Linao, Pura',
    province: 'Tarlac',
    country: 'Philippines',
  },
  mapsUrl: 'https://www.google.com/maps/search/?api=1&query=Linao%2C%20Pura%2C%20Tarlac%2C%20Philippines',
  workforce: '15–20 skilled personnel',
} as const;

export type ChapterName = 'dawn' | 'stone' | 'blue' | 'amber' | 'navy' | 'night';

export const chapterTheme: Record<ChapterName, 'dark' | 'light'> = {
  dawn: 'dark',
  stone: 'light',
  blue: 'dark',
  amber: 'light',
  navy: 'dark',
  night: 'dark',
};

export const chapterColor: Record<ChapterName, string> = {
  dawn: '#032b4f',
  stone: '#f1f0eb',
  blue: '#0461bd',
  amber: '#ffb303',
  navy: '#004b7e',
  night: '#01182c',
};

export const nav = [
  { href: '/services/', label: 'Services' },
  { href: '/projects/', label: 'Projects' },
  { href: '/about/', label: 'About' },
  { href: '/contact/', label: 'Contact' },
] as const;

export const mission =
  'To provide reliable, efficient, and sustainable electrical and solar energy solutions that meet the evolving needs of our clients while ensuring safety, quality, and customer satisfaction.';

export const vision =
  'To become one of the leading providers of solar and electrical services in the Philippines, recognized for innovation, excellence, and commitment to renewable energy development.';

export const values = [
  { name: 'Integrity', text: 'We operate with honesty and transparency in all our work.' },
  { name: 'Quality', text: 'We deliver reliable and high-standard electrical and solar solutions.' },
  { name: 'Safety', text: 'We prioritize safety in every project and operation.' },
  { name: 'Innovation', text: 'We embrace modern technology and renewable energy solutions.' },
  { name: 'Customer focus', text: 'We are committed to client satisfaction and long-term relationships.' },
  { name: 'Teamwork', text: 'We work collaboratively to achieve efficient and successful results.' },
] as const;

// "Unique Selling Positions" in the profile. Wording kept close to the source.
export const commitments = [
  {
    title: 'Solar energy expertise',
    text: 'JTEC specializes in solar installation, delivering efficient and sustainable energy solutions designed to reduce electricity costs and promote long-term savings.',
  },
  {
    title: 'Licensed and professional team',
    text: 'Projects are handled by licensed engineers and skilled personnel, for high-quality workmanship and strict compliance with safety and industry standards.',
  },
  {
    title: 'Complete end-to-end services',
    text: 'From design and supply to installation and maintenance, one JTEC team handles every stage of your electrical or solar project.',
  },
  {
    title: 'Customized solutions',
    text: "Every solar and electrical system is tailored to the client’s needs, location and budget for the best performance and efficiency.",
  },
  {
    title: 'Transparent quotation process',
    text: 'Clients receive clear, detailed and professional quotations by email, with full transparency on pricing, scope and deliverables.',
  },
  {
    title: 'Quality and reliability',
    text: 'JTEC uses durable, trusted components so systems keep performing consistently for the long term.',
  },
  {
    title: 'Cost-efficient energy solutions',
    text: 'Solar systems are designed to maximize return on investment by lowering electricity consumption and long-term utility expenses.',
  },
  {
    title: 'Timely project execution',
    text: 'JTEC is committed to finishing projects within the agreed timeline while keeping high standards of quality and safety.',
  },
  {
    title: 'After-sales support',
    text: 'Ongoing support, maintenance and system checks keep systems performing, and clients satisfied, after the project is complete.',
  },
  {
    title: 'Commitment to sustainability',
    text: 'JTEC promotes environmentally friendly solutions by helping clients move to clean, renewable energy sources.',
  },
] as const;

// The order a project runs in, assembled from the service descriptions in the profile.
export const process = [
  { title: 'Consultation', text: 'System recommendations, cost analysis and return on investment, so you can decide with the numbers in front of you.' },
  { title: 'Site assessment', text: 'Every solar installation starts with an assessment of the site.' },
  { title: 'System design', text: 'Load computation, system layout and compliance with safety standards.' },
  { title: 'Quotation by email', text: 'A detailed quotation listing components, pricing, scope of work and warranties.' },
  { title: 'Supply and installation', text: 'JTEC supplies the components and installs the system.' },
  { title: 'Commissioning', text: 'The system is commissioned and handed over.' },
  { title: 'After-sales support', text: 'Maintenance and system checks after the project is complete.' },
] as const;
