import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HardModeScreen from './HardModeScreen';
import HomeScreen from './HomeScreen';
import NewGameScreen from './NewGameScreen';
import NormalModeScreen from './NormalModeScreen';
import SettingsScreen from './SettingScreen';
import VsBotScreen from './VsBotScreen';
import VsFriendScreen from './VsFriendScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="NewGame" component={NewGameScreen} />
        <Stack.Screen name="VsBot" component={VsBotScreen} />
        <Stack.Screen name="VsFriend" component={VsFriendScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen name="NormalMode" component={NormalModeScreen} />
        <Stack.Screen name="HardMode" component={HardModeScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}