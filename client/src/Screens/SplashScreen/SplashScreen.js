import React, {useEffect} from 'react'
import { SafeAreaView, Text } from 'react-native';
import { database } from '../../../Config';
import auth from '@react-native-firebase/auth';

const SplashScreen = ({navigation}) => {

    checkUser =  async () => {
        try{
            if(auth().currentUser.uid) {
                await database.ref('Users/' + auth().currentUser.uid + '/').once('value').then(snapshot => {
                    if(snapshot.exists())
                    {
                console.log('reached here 2')

                        navigation.replace('HomeScreen');
                    }
                    else
                    {
                        console.log('reached login');
                        navigation.replace('LoginScreen');
                    }
                })
            }
            else {
             console.log('reached login');

                navigation.replace('LoginScreen');
            }
            
        }
        catch(err) {
         navigation.replace('LoginScreen')
     }
    }

    useEffect(() => {
      checkUser();
    }, [])

    return (
            <SafeAreaView style = {{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text style = {{fontSize: 30}}>Splash Screen</Text>
        </SafeAreaView>
    )
}

export default SplashScreen;
