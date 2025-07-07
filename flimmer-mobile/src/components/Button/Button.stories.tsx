import React from 'react';
import { View } from 'react-native';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  decorators: [
    (Story) => (
      <View style={{ width: '80%', alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    title: { control: 'text' },
    variant: {
      options: ['primary', 'secondary'],
      control: { type: 'radio' },
    },
  },
};

export default meta;

type Story = StoryObj<typeof Button>;

export const Primary: Story = {
  args: {
    title: 'Opret konto',
    variant: 'primary',
    onPress: () => console.log('Primary button pressed'),
  },
};

export const Secondary: Story = {
  args: {
    title: 'Log ind',
    variant: 'secondary',
    onPress: () => console.log('Secondary button pressed'),
  },
}; 