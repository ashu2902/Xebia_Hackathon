import React, {useEffect} from 'react'
import { SafeAreaView, Text, Image } from 'react-native';
import { database, Colors} from '../../../Config';
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
            <SafeAreaView style = {{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor:Colors.primaryShade2}}>
            <Image source={require('../../Assets/Images/Logo/logo-1.png')} style={{ width: 180*1.25, height: 58*1.25}}/>
        </SafeAreaView>
    )
}

export default SplashScreen;
