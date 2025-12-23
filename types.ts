
export enum CalculatorType {
  TAX = 'TAX',
  PRICING = 'PRICING',
  LABOR = 'LABOR',
  BREAK_EVEN = 'BREAK_EVEN',
  VACATION = 'VACATION',
  TERMINATION = 'TERMINATION',
  RETIREMENT = 'RETIREMENT'
}

export enum CalculatorTab {
  MEI = 'MEI',
  AUTONOMOUS = 'AUTONOMOUS',
  ME = 'ME',
  CLT = 'CLT',
  PUBLIC_SERVANT = 'PUBLIC_SERVANT'
}

export interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  image: string;
  content: string;
  author?: string;
  readTime?: string;
  isUrgent?: boolean;
  isFeatured?: boolean;
}

export interface Affiliate {
  id: string;
  name: string;
  link: string;
  banner_url: string;
  active: boolean;
  position: 'left' | 'right' | 'center';
}

export interface GroundingSource {
  title?: string;
  uri?: string;
}
