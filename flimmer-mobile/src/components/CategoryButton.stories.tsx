import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Meta, StoryObj } from '@storybook/react';

interface CategoryButtonProps {
  emoji: string;
  onPress: () => void;
}

const CategoryButton: React.FC<CategoryButtonProps> = ({ emoji, onPress }) => (
  <TouchableOpacity onPress={onPress} style={styles.container}>
    <Text style={styles.emoji}>{emoji}</Text>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    width: 80,
    height: 80,
    borderRadius: 20,
    backgroundColor: '#9c27b0', // Example color, can be customized
    justifyContent: 'center',
    alignItems: 'center',
    margin: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  emoji: {
    fontSize: 40,
  },
});

const meta: Meta<typeof CategoryButton> = {
  title: 'Components/CategoryButton',
  component: CategoryButton,
  decorators: [
    (Story) => (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
  argTypes: {
    emoji: { control: 'text' },
  },
};

export default meta;

type Story = StoryObj<typeof CategoryButton>;

export const Basketball: Story = {
  args: {
    emoji: '🏀',
    onPress: () => console.log('Basketball category pressed'),
  },
};

export const Scissors: Story = {
  args: {
    emoji: '✂️',
    onPress: () => console.log('Scissors category pressed'),
  },
};

export const Avocado: Story = {
  args: {
    emoji: '🥑',
    onPress: () => console.log('Avocado category pressed'),
  },
}; 