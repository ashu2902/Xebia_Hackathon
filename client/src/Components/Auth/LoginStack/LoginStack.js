import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from '../../../Screens/SplashScreen/SplashScreen';
import HomeScreen from '../../../Screens/HomeScreen/HomeScreen';
import LoginScreen from '../../../Screens/LoginScreen/LoginScreen';

const LoginStack = () => {
    
    const Stack = createStackNavigator();

    return (
        <Stack.Navigator screenOptions={{
          headerShown: false
        }}>
      <Stack.Screen name="SplashScreen" component={SplashScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
    </Stack.Navigator>
    )
}

export default LoginStack
