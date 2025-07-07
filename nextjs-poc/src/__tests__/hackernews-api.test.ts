import { fetchTopStories } from '@/lib/hackernews-api';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

const mock = new MockAdapter(axios);

describe('fetchTopStories', () => {
  afterEach(() => mock.reset());

  it('returns stories sorted by score', async () => {
    // mock Hacker News API endpoints
    mock.onGet('https://hacker-news.firebaseio.com/v0/topstories.json').reply(200, [1, 2]);

    mock.onGet('https://hacker-news.firebaseio.com/v0/item/1.json').reply(200, {
      id: 1,
      type: 'story',
      title: 'Story One',
      score: 50,
      by: 'alice',
      time: Date.now() / 1000,
      descendants: 0,
      url: 'https://example.com/one',
    });

    mock.onGet('https://hacker-news.firebaseio.com/v0/item/2.json').reply(200, {
      id: 2,
      type: 'story',
      title: 'Story Two',
      score: 100,
      by: 'bob',
      time: Date.now() / 1000,
      descendants: 0,
      url: 'https://example.com/two',
    });

    const stories = await fetchTopStories(2);
    expect(stories[0].id).toBe(2);
    expect(stories[1].id).toBe(1);
  });
}); 