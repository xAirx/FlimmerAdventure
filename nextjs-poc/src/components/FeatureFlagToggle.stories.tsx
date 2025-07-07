import type { Meta, StoryObj } from '@storybook/react';
import { FeatureFlagToggle } from './FeatureFlagToggle';

const meta: Meta<typeof FeatureFlagToggle> = {
  title: 'Components/FeatureFlagToggle',
  component: FeatureFlagToggle,
};
export default meta;

type Story = StoryObj<typeof FeatureFlagToggle>;

export const Off: Story = {
  args: {
    flagKey: 'demo',
    label: 'Demo Flag',
    description: 'Toggle demo feature',
    defaultEnabled: false,
  },
};

export const On: Story = {
  args: {
    flagKey: 'demo',
    label: 'Demo Flag',
    description: 'Toggle demo feature',
    defaultEnabled: true,
  },
}; 