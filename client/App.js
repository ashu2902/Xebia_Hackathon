import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, SafeAreaView } from 'react-native';
import 'react-native-gesture-handler';
import LoginStack from './src/Components/Auth/LoginStack/LoginStack';

const App = () => {
  return (
    <NavigationContainer>
    <LoginStack />
    </NavigationContainer>
  );
};

export default App;
