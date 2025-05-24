import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

import HardModeScreen from '../screens/HardModeScreen';
import HomeScreen from '../screens/HomeScreen';
import NewGameScreen from '../screens/NewGameScreen';
import NormalModeScreen from '../screens/NormalModeScreen';
import SettingsScreen from '../screens/SettingScreen';
import VsBotScreen from '../screens/VsBotScreen';
import VsFriendScreen from '../screens/VsFriendScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="NewGame" component={NewGameScreen} />
      <Stack.Screen name="VsBot" component={VsBotScreen} />
      <Stack.Screen name="VsFriend" component={VsFriendScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
      <Stack.Screen name="NormalMode" component={NormalModeScreen} />
      <Stack.Screen name="HardMode" component={HardModeScreen} />
    </Stack.Navigator>
  );
}