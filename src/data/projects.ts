export interface Project {
  id: number;
  number: string;
  tag: string;
  year: string;
  title: string;
  description: string;
  tech: string[];
  image?: string;
  imgBg: string;
  accent: string;
  accentDim: string;
  accentBg: string;
  glow: string;
  url?: string;
  github?: string;
}

export const projects: Project[] = [
  {
    id: 1,
    number: '01',
    tag: 'Mobile • Backend',
    year: '2026',
    title: 'Investor–Startup Matchmaking App',
    description:
      "Mobile app that connects investors with startup ideas based on personalized preferences like industry, funding stage, and risk level. Filters and recommends relevant opportunities, with real-time chat between investors and founders to streamline collaboration and decision-making.",
    tech: ['NestJS', 'Supabase', 'Socket.io', 'PostgreSQL', 'React Native'],
    image: '/projects/investor-matcher.jpg',
    imgBg: 'linear-gradient(135deg, rgba(167,139,250,0.16) 0%, #0a0a0a 65%)',
    accent: '#a78bfa',
    accentDim: 'rgba(167,139,250,0.45)',
    accentBg: 'rgba(167,139,250,0.12)',
    glow: 'rgba(167,139,250,0.18)',
    github: 'https://github.com/johnwalle/idea-investor-matcher-api',
  },
  {
    id: 2,
    number: '02',
    tag: 'E-Commerce',
    year: '2025',
    title: 'Ethiopian Artisan Marketplace',
    description:
      'Full-stack e-commerce platform connecting local artisans with global buyers. Showcases handmade textiles, pottery, and jewelry while sharing the cultural heritage behind each craft, with secure payments and a seamless user experience built to scale traditional Ethiopian craftsmanship internationally.',
    tech: ['Next.js', 'Motion Design', 'Material UI', 'Node.js', 'Mongoose'],
    image: '/projects/artisan-marketplace.png',
    imgBg: 'linear-gradient(135deg, rgba(240,153,95,0.16) 0%, #0a0a0a 65%)',
    accent: '#f0995f',
    accentDim: 'rgba(240,153,95,0.45)',
    accentBg: 'rgba(240,153,95,0.12)',
    glow: 'rgba(240,153,95,0.18)',
    url: 'https://ethiopian-crafts-e-commerce.vercel.app',
    github: 'https://github.com/johnwalle/Ethiopian-Crafts-eCommerce'

  },
  {
    id: 3,
    number: '03',
    tag: 'Logistics • Full-Stack',
    year: '2025',
    title: 'FastX Delivery',
    description:
      'High-performance delivery management system for optimizing logistics operations. Businesses manage orders, track deliveries in real time, and dispatch drivers through an intuitive dashboard featuring route optimization, role-based authentication, real-time notifications, and performance analytics.',
    tech: ['React', 'Tailwind CSS', 'Material UI', 'Cloudinary', 'ExpressJS'],
    image: '/projects/fastx-delivery.png',
    imgBg: 'linear-gradient(135deg, rgba(52,211,153,0.16) 0%, #0a0a0a 65%)',
    accent: '#34d399',
    accentDim: 'rgba(52,211,153,0.45)',
    accentBg: 'rgba(52,211,153,0.12)',
    glow: 'rgba(52,211,153,0.18)',
    url: 'https://fastx-delivery-app.vercel.app',
    github: 'https://github.com/johnwalle/fastx-delivery-app',
  },
  {
    id: 4,
    number: '04',
    tag: 'HealthTech • Mobile',
    year: '2025',
    title: 'Skin Health Companion',
    description:
      'React Native healthcare app that helps patients understand and manage their skin health. Provides dermatologist-approved educational resources, personalized profiles, and secure connections with verified skin health experts, with role-based access control and safe medical document uploads.',
    tech: ['React Native', 'Supabase', 'TypeScript', 'Firebase', 'Chat & Messaging'],
    image: '/projects/skin_health.png',
    imgBg: 'linear-gradient(135deg, rgba(244,114,182,0.16) 0%, #0a0a0a 65%)',
    accent: '#f472b6',
    accentDim: 'rgba(244,114,182,0.45)',
    accentBg: 'rgba(244,114,182,0.12)',
    glow: 'rgba(244,114,182,0.18)',
  },
  {
    id: 5,
    number: '05',
    tag: 'Pharmacy • Full-Stack',
    year: '2025',
    title: 'Yenewub PharmaStock',
    description:
      'Complete pharmacy management system for medicine inventory, dispensing, and sales workflows. Pharmacists manage stock from store to dispenser and sell through a dedicated sell station, backed by an analytics dashboard, reporting, user management, and real-time low-stock alerts.',
    tech: ['Next.js', 'TypeScript', 'Redux', 'Node.js', 'MongoDB'],
    image: '/projects/pharmastock.png',
    imgBg: 'linear-gradient(135deg, rgba(96,165,250,0.16) 0%, #0a0a0a 65%)',
    accent: '#60a5fa',
    accentDim: 'rgba(96,165,250,0.45)',
    accentBg: 'rgba(96,165,250,0.12)',
    glow: 'rgba(96,165,250,0.18)',
    url: 'https://pharmastock-pro.vercel.app',
    github: 'https://github.com/johnwalle/pharmastock-pro'
  },
  {
    id: 6,
    number: '06',
    tag: 'Utilities • Admin Dashboard',
    year: '2026',
    title: 'AquaConnect Admin',
    description:
      'Admin dashboard for the AquaConnect water utility management system, giving operators a central place to oversee customers, usage, and service operations with a clean, responsive interface.',
    tech: ['Next.js', 'Tailwind CSS', 'JavaScript'],
    image: '/projects/aquaconnect.jpg',
    imgBg: 'linear-gradient(135deg, rgba(34,211,238,0.16) 0%, #0a0a0a 65%)',
    accent: '#22d3ee',
    accentDim: 'rgba(34,211,238,0.45)',
    accentBg: 'rgba(34,211,238,0.12)',
    glow: 'rgba(34,211,238,0.18)',
    github: 'https://github.com/johnwalle/aquaconnect-admin',
  },
];