export interface SiteLink {
  label: string;
  href: string;
}

export interface SiteContactLink extends SiteLink {
  icon: string;
}

export interface SiteSocialLink {
  label: string;
  icon: string;
  url: string | null;
}

export interface SiteMetric {
  value: number;
  suffix?: string;
  label: string;
}

export interface SiteMetrics {
  experienceYears: SiteMetric;
  experts: SiteMetric;
  projects: SiteMetric;
  references: SiteMetric;
}

export interface SiteFounder {
  expertId: string;
  name: string;
  image: ImageMetadata;
  imageAlt: string;
  introduction: string;
  commitment: string;
  quote: string;
  highlights: readonly string[];
}

export interface SiteExpertNetwork {
  homeLimit: number;
  archiveHref: string;
}

export interface SiteSolutionsSection {
  limit: number;
  archiveHref: string;
}

export interface SiteEvidenceSection {
  limit: number;
  archiveHref: string;
}

export interface SiteClientsSection {
  limit: number;
  previewCount: number;
  archiveHref: string;
}

export interface SiteProjectsSection {
  limit: number;
  archiveHref: string;
}

export interface SiteBlogSection {
  limit: number;
  archiveHref: string;
}

export interface SitePostalAddress {
  street: string;
  locality: string;
  country: string;
}

export interface SiteAnalytics {
  /** Контейнер на Google Tag Manager. Оттам се управляват GA4 и рекламните тагове. */
  gtmId: string;
}

export interface SiteConfig {
  name: string;
  legalName: string;
  tagline: string;
  description: string;
  contact: {
    phone: SiteContactLink;
    viber: SiteContactLink;
    messenger: SiteContactLink;
    email: SiteContactLink;
    address: SiteContactLink;
  };
  socials: readonly SiteSocialLink[];
  metrics: SiteMetrics;
  founder: SiteFounder;
  expertNetwork: SiteExpertNetwork;
  solutionsSection: SiteSolutionsSection;
  evidenceSection: SiteEvidenceSection;
  clientsSection: SiteClientsSection;
  projectsSection: SiteProjectsSection;
  blogSection: SiteBlogSection;
  analytics: SiteAnalytics;
  /** Разбит по полета за структурираните данни; за показване служи `contact.address`. */
  postalAddress: SitePostalAddress;
}

export const site: SiteConfig = {
  name: 'VAMO',
  analytics: {
    gtmId: 'GTM-NWS7CNRK',
  },
  postalAddress: {
    street: 'ул. „Доктор Христо Татарчев“ 24 (партер)',
    locality: 'Благоевград',
    country: 'BG',
  },
  legalName: 'ВАМО ЕООД',
  tagline: 'VAMO е система за растеж',
  description:
    'която обединява стратегия, експертност, медии и реализация. Работим с бизнеси и организации, които искат да превърнат потенциала си в реален, измерим резултат.',
  contact: {
    phone: {
      label: '089 918 0790',
      href: 'tel:+359899180790',
      icon: 'phone',
    },
    viber: {
      label: 'Контакти по Viber',
      href: 'viber://chat?number=359899180790',
      icon: 'phone-call',
    },
    messenger: {
      label: 'Контакти по Messenger',
      href: 'https://m.me/vamo.eu/',
      icon: 'messenger-logo',
    },
    email: {
      label: 'office@vamo.bg',
      href: 'mailto:office@vamo.bg',
      icon: 'envelope-simple',
    },
    address: {
      label: 'гр. Благоевград, ул. „Доктор Христо Татарчев“ 24 (партер)',
      href: 'https://maps.app.goo.gl/K8PvnJc5P5FXtS8h7',
      icon: 'map-pin',
    },
  },
  socials: [
    { label: 'LinkedIn', icon: 'linkedin-logo', url: 'https://www.linkedin.com/company/vamo-bg/' },
    { label: 'YouTube', icon: 'youtube-logo', url: 'https://www.youtube.com/@VamoBG' },
    { label: 'Facebook', icon: 'facebook-logo', url: 'https://www.facebook.com/vamo.eu/' },
    { label: 'Instagram', icon: 'instagram-logo', url: 'https://www.instagram.com/vamo.eu/' },
  ],
  metrics: {
    experienceYears: {
      value: 25,
      suffix: '+',
      label: 'години опит в реални проекти',
    },
    experts: {
      value: 35,
      suffix: '+',
      label: 'експерти според нуждите ви',
    },
    projects: {
      value: 130,
      suffix: '+',
      label: 'реализирани проекта',
    },
    references: {
      value: 140,
      suffix: '+',
      label: 'официални референции',
    },
  },
  founder: {
    expertId: 'gergana-ivanova',
    name: 'Гергана Иванова',
    image: founderImage,
    imageAlt: 'Гергана Иванова',
    introduction:
      'Помагам на бизнеси, институции и проекти да превърнат своята стойност във видимост, доверие и устойчив резултат.',
    commitment:
      'Работата с мен означава, че не сте сами в процеса — имате човек, който държи посоката, координира стъпките и следи изпълнението.',
    quote:
      'Държа посоката, координирам стъпките и следя изпълнението от началото до резултата.',
    highlights: [
      '25+ години опит',
      'Лична отговорност към всеки проект',
      'Експертна мрежа според нуждите',
      'Реални проекти, референции и доказателства',
    ],
  },
  expertNetwork: {
    homeLimit: 6,
    archiveHref: '/ekspertna-mrezha/',
  },
  solutionsSection: {
    limit: 6,
    archiveHref: '/resheniya/',
  },
  evidenceSection: {
    limit: 3,
    archiveHref: '/referentsii/',
  },
  clientsSection: {
    limit: 13,
    previewCount: 8,
    archiveHref: '/klienti/',
  },
  projectsSection: {
    limit: 3,
    archiveHref: '/portfolio/',
  },
  blogSection: {
    limit: 3,
    archiveHref: '/blog/',
  },
};
import founderImage from '../assets/experts/gergana-ivanova.jpg';
