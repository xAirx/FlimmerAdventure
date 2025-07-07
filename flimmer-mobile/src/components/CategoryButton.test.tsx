import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { CategoryButton } from './CategoryButton'; // Assuming the component is in the same folder

describe('CategoryButton', () => {
  it('renders the emoji correctly', () => {
    const { getByText } = render(<CategoryButton emoji="🏀" onPress={() => {}} />);
    expect(getByText('🏀')).toBeTruthy();
  });

  it('calls the onPress handler when pressed', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(<CategoryButton emoji="🏀" onPress={onPressMock} />);
    
    fireEvent.press(getByText('🏀'));
    
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });
}); 