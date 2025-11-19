export type Language = 'en' | 'ru';

export interface Post {
  id: string;
  content: string;
  scheduledTime: Date;
  status: 'published' | 'scheduled' | 'draft';
  generatedByAi?: boolean;
  topic?: string;
}

export interface ChannelStats {
  date: string;
  subscribers: number;
  views: number;
  engagementRate: number;
}

export interface AdSlot {
  id: string;
  date: Date;
  price: number;
  status: 'open' | 'booked' | 'completed';
  advertiserName?: string;
  adContent?: string;
  matchScore?: number; // 0-100 AI match score
}

export type AppView = 'connect' | 'dashboard' | 'scheduler' | 'analytics' | 'monetization';

export interface AIInsight {
  type: 'growth' | 'content' | 'monetization';
  text: string;
}
