import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Text, SafeAreaView, StatusBar } from 'react-native';
import 'react-native-gesture-handler';
import LoginStack from './src/Components/Auth/LoginStack/LoginStack';
import { Colors } from './Config';
const App = () => {
  return (
    <NavigationContainer>
      <StatusBar backgroundColor={Colors.primaryShade1}/>
    <LoginStack />
    </NavigationContainer>
  );
};

export default App;
