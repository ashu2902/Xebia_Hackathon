import React from 'react'
import { View, Text,StyleSheet } from 'react-native';
import MapView,{PROVIDER_GOOGLE} from 'react-native-maps'
const HomeScreen = () => {
    return (
            <View style={{flex:1,height:"100%",width:"100%"}}>
                <Text>HomeScreen</Text>
                <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={{...StyleSheet.absoluteFill}}
       region={{
         latitude: 37.78825,
         longitude: -122.4324,
         latitudeDelta: 0.015,
         longitudeDelta: 0.0121,
       }}
     >
     </MapView>
            </View>
    )
}

export default HomeScreen;
