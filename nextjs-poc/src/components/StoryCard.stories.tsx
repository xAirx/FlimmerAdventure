import type { Meta, StoryObj } from '@storybook/react';
import { StoryCard } from './StoryCard';

const meta: Meta<typeof StoryCard> = {
  title: 'Components/StoryCard',
  component: StoryCard,
  tags: ['autodocs'],
};

export default meta;

export const Basic: StoryObj<typeof StoryCard> = {
  args: {
    story: {
      id: 1,
      title: 'Hello Storybook',
      url: 'https://storybook.js.org',
      score: 123,
      by: 'jane',
      time: Math.floor(Date.now() / 1000) - 3600,
      descendants: 42,
      type: 'story',
    },
    index: 0,
  },
}; 