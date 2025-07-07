import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Meta, StoryObj } from '@storybook/react';
import { Button } from '../Button/Button'; // Assuming Button is in a sibling directory

const ChallengeCard = () => (
  <View style={styles.card}>
    <Image 
        source={{ uri: 'https://i.imgur.com/your-image.png' }} // Placeholder - replace with actual asset
        style={styles.illustration} 
        resizeMode="contain"
    />
    <Text style={styles.title}>
      Tag et billede af din yndlingsfilm, og del et billede af den her på Flimmer!
    </Text>
    <Button 
        title="DEL BILLEDE"
        variant="secondary"
        onPress={() => {}}
        style={styles.button}
    />
  </View>
);

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#1EE3CF', // Teal color from screenshot
        borderRadius: 20,
        padding: 20,
        alignItems: 'center',
        margin: 16,
    },
    illustration: {
        width: 100,
        height: 100,
        marginBottom: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#004D40',
        marginBottom: 20,
    },
    button: {
        backgroundColor: 'white',
        width: '80%',
    }
});

const meta: Meta<typeof ChallengeCard> = {
  title: 'Components/ChallengeCard',
  component: ChallengeCard,
   decorators: [
    (Story) => (
      <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
        <Story />
      </View>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof ChallengeCard>;

export const Default: Story = {}; 