import React from 'react';
import PreferencesScreen from './PreferencesScreen';

export default function InputScreen(props) {
  return (
    <PreferencesScreen
      selectedMood={props.selectedMood || 'cosy'}
      initialMode={props.mode || 'order'}
      initialDiet={props.dietType || 'veg'}
      onBack={props.onBack}
      onMatchMeal={props.onMatchMeal || props.onFeedMe}
      {...props}
    />
  );
}
