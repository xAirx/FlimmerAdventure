import axios from 'axios';
import { HackerNewsItem, HackerNewsUser, Story } from '@/types/hackernews';

const BASE_URL = 'https://hacker-news.firebaseio.com/v0';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

/**
 * Fetch top story IDs from Hacker News
 */
export const fetchTopStoryIds = async (): Promise<number[]> => {
  try {
    const response = await api.get<number[]>('/topstories.json');
    return response.data;
  } catch (error) {
    console.error('Error fetching top story IDs:', error);
    throw new Error('Failed to fetch top stories');
  }
};

/**
 * Fetch a single item by ID from Hacker News
 */
export const fetchItem = async (id: number): Promise<HackerNewsItem> => {
  try {
    const response = await api.get<HackerNewsItem>(`/item/${id}.json`);
    if (!response.data) {
      throw new Error(`Item ${id} not found`);
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error);
    throw new Error(`Failed to fetch item ${id}`);
  }
};

/**
 * Fetch user information by username
 */
export const fetchUser = async (username: string): Promise<HackerNewsUser> => {
  try {
    const response = await api.get<HackerNewsUser>(`/user/${username}.json`);
    if (!response.data) {
      throw new Error(`User ${username} not found`);
    }
    return response.data;
  } catch (error) {
    console.error(`Error fetching user ${username}:`, error);
    throw new Error(`Failed to fetch user ${username}`);
  }
};

/**
 * Fetch multiple items by IDs
 */
export const fetchItems = async (ids: number[]): Promise<HackerNewsItem[]> => {
  try {
    const promises = ids.map(id => fetchItem(id));
    const items = await Promise.allSettled(promises);
    
    return items
      .filter((result): result is PromiseFulfilledResult<HackerNewsItem> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  } catch (error) {
    console.error('Error fetching multiple items:', error);
    throw new Error('Failed to fetch items');
  }
};

/**
 * Fetch top stories (limited to specified count)
 */
export const fetchTopStories = async (limit: number = 20): Promise<Story[]> => {
  try {
    const topStoryIds = await fetchTopStoryIds();
    const limitedIds = topStoryIds.slice(0, limit);
    
    const items = await fetchItems(limitedIds);
    
    // Filter only stories and ensure they have required fields
    const stories = items
      .filter((item): item is Story => 
        item.type === 'story' && 
        typeof item.title === 'string' && 
        typeof item.score === 'number' &&
        typeof item.by === 'string' &&
        typeof item.time === 'number'
      )
      .sort((a, b) => b.score - a.score); // Sort by score descending
    
    return stories;
  } catch (error) {
    console.error('Error fetching top stories:', error);
    throw new Error('Failed to fetch top stories');
  }
};

/**
 * Get domain from URL
 */
export const getDomainFromUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname.replace('www.', '');
  } catch {
    return 'Unknown';
  }
};

/**
 * Format time as relative string (e.g., "2 hours ago")
 */
export const formatTimeAgo = (unixTime: number): string => {
  const now = Date.now();
  const diffMs = now - (unixTime * 1000);
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
}; 