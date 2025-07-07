export interface HackerNewsItem {
  id: number;
  title: string;
  url?: string;
  score: number;
  by: string;
  time: number;
  descendants?: number;
  kids?: number[];
  type: 'story' | 'comment' | 'job' | 'poll' | 'pollopt';
  text?: string;
}

export interface HackerNewsUser {
  id: string;
  created: number;
  karma: number;
  about?: string;
  submitted?: number[];
}

export interface Story extends HackerNewsItem {
  type: 'story';
  url: string;
  title: string;
  score: number;
  by: string;
  time: number;
  descendants: number;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface StoryWithAuthor extends Story {
  author?: HackerNewsUser;
} 