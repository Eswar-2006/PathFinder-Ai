
export enum Sender {
  USER = 'user',
  AI = 'ai'
}

export enum HistoryCategory {
  CHATS = 'Your Chats',
  RESEARCH = 'Career Research',
  SEARCH = 'Search Results'
}

export interface Message {
  id: string;
  sender: Sender;
  text: string;
  timestamp: Date;
  isImage?: boolean;
}

export interface HistoryItem {
  id: string;
  title: string;
  category: HistoryCategory;
  timestamp: Date;
  messages: Message[];
}

export interface Scholarship {
  id: string;
  name: string;
  provider: string;
  amount: string;
  // link: string; // Removed link as it wasn't used in mocks
  status: 'Open' | 'Closed' | 'Closing Soon';
  deadline: string;
  uptime?: string;
  category?: string;
}

export interface University {
  id: string;
  name: string;
  location: string;
  avgPackage: string;
  // highlights: string[]; // Removed as not used in mocks
  admissionStatus: 'Open' | 'Closed';
  nextIntake: string;
  uptime: string;
}
