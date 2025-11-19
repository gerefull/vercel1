import { ChannelStats, Post, AdSlot } from './types';

export const MOCK_STATS: ChannelStats[] = [
  { date: 'Mon', subscribers: 10240, views: 4500, engagementRate: 4.2 },
  { date: 'Tue', subscribers: 10255, views: 4800, engagementRate: 4.5 },
  { date: 'Wed', subscribers: 10300, views: 5200, engagementRate: 4.8 },
  { date: 'Thu', subscribers: 10290, views: 4900, engagementRate: 4.3 },
  { date: 'Fri', subscribers: 10350, views: 6000, engagementRate: 5.1 },
  { date: 'Sat', subscribers: 10410, views: 7500, engagementRate: 5.5 },
  { date: 'Sun', subscribers: 10450, views: 7200, engagementRate: 5.4 },
];

export const INITIAL_POSTS: Post[] = [
  {
    id: '1',
    content: '🚀 Top 5 Marketing Trends for 2025! #Marketing #Trends',
    scheduledTime: new Date(Date.now() + 86400000), // Tomorrow
    status: 'scheduled',
    generatedByAi: true,
    topic: 'Marketing Trends'
  },
  {
    id: '2',
    content: 'How to scale your business without a budget? Here is a thread 🧵',
    scheduledTime: new Date(Date.now() + 172800000), // Day after tomorrow
    status: 'scheduled',
    generatedByAi: false
  }
];

export const INITIAL_AD_SLOTS: AdSlot[] = [
  {
    id: 'slot-1',
    date: new Date(Date.now() + 259200000),
    price: 500, // In Telegram Stars approximation or currency
    status: 'open'
  },
  {
    id: 'slot-2',
    date: new Date(Date.now() + 345600000),
    price: 750,
    status: 'booked',
    advertiserName: 'TechGrowth App',
    adContent: 'Check out the new TechGrowth App for managing your startups!',
    matchScore: 85
  }
];