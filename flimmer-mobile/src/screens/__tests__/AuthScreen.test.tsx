import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import AuthScreen from '../AuthScreen';
import { useAuth } from '../../App';

// Mock the useAuth hook
jest.mock('../../App', () => ({
  useAuth: jest.fn(),
}));

const mockLogin = jest.fn();
const mockUseAuth = useAuth as jest.MockedFunction<typeof useAuth>;

describe('AuthScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseAuth.mockReturnValue({
      user: null,
      login: mockLogin,
      logout: jest.fn(),
      isLoading: false,
    });
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('renders correctly', () => {
    const { getByText } = render(<AuthScreen />);
    
    expect(getByText('🎬 Flimmer')).toBeTruthy();
    expect(getByText('Safe Video Sharing for Families')).toBeTruthy();
    expect(getByText('I am a:')).toBeTruthy();
    expect(getByText('Parent')).toBeTruthy();
    expect(getByText('Child')).toBeTruthy();
  });

  it('allows role selection', () => {
    const { getByText } = render(<AuthScreen />);
    
    const parentButton = getByText('Parent');
    const childButton = getByText('Child');
    
    fireEvent.press(parentButton);
    // Parent button should be selected (we can test this through style changes)
    
    fireEvent.press(childButton);
    // Child button should be selected
  });

  it('validates form before submission', () => {
    const { getByText } = render(<AuthScreen />);
    
    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);
    
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please select your role');
  });

  it('validates name input', () => {
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);
    
    // Select parent role
    fireEvent.press(getByText('Parent'));
    
    // Try to continue without name
    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);
    
    expect(Alert.alert).toHaveBeenCalledWith('Error', 'Please enter your name');
  });

  it('successfully logs in with valid data', async () => {
    const { getByText, getByPlaceholderText } = render(<AuthScreen />);
    
    // Select parent role
    fireEvent.press(getByText('Parent'));
    
    // Enter name
    const nameInput = getByPlaceholderText('Enter your name');
    fireEvent.changeText(nameInput, 'Test Parent');
    
    // Submit form
    const continueButton = getByText('Continue');
    fireEvent.press(continueButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        id: 'parent-001',
        name: 'Test Parent',
        role: 'parent',
        childIds: ['child-001', 'child-002'],
      });
    });
  });

  it('handles quick demo for parent', async () => {
    const { getByText } = render(<AuthScreen />);
    
    const parentDemoButton = getByText('Parent Demo');
    fireEvent.press(parentDemoButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        id: 'parent-001',
        name: 'Sarah Johnson',
        role: 'parent',
        childIds: ['child-001', 'child-002'],
      });
    });
  });

  it('handles quick demo for child', async () => {
    const { getByText } = render(<AuthScreen />);
    
    const childDemoButton = getByText('Child Demo');
    fireEvent.press(childDemoButton);
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        id: 'child-001',
        name: 'Emma Johnson',
        role: 'child',
        parentId: 'parent-001',
      });
    });
  });

  it('displays role descriptions correctly', () => {
    const { getByText } = render(<AuthScreen />);
    
    expect(getByText('Monitor and manage your child\'s content')).toBeTruthy();
    expect(getByText('Create and share videos safely')).toBeTruthy();
  });

  it('handles text input changes', () => {
    const { getByPlaceholderText } = render(<AuthScreen />);
    
    const nameInput = getByPlaceholderText('Enter your name');
    fireEvent.changeText(nameInput, 'New Name');
    
    expect(nameInput.props.value).toBe('New Name');
  });
}); 