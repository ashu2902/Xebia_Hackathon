import React, {useState, useEffect, useRef} from 'react'
import { View, Text,StyleSheet, PermissionsAndroid,ToastAndroid } from 'react-native';
import RNMapView, {PROVIDER_GOOGLE} from 'react-native-maps'
import Geolocation from 'react-native-geolocation-service';



const HomeScreen = () => {

  const mapRef = useRef(null);

  requestLocationPermission = async () =>
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        'title': 'Smart Parking',
        'message': 'Smart Parking would like to request your location to optimize your experience'
      }
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log("You can use the location")
    } else {
      console.log("location permission denied")
      alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err)
  }
}

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
});

const [location, setLocation] = useState();
  


useEffect(() => {
requestLocationPermission();
if (!!location && mapRef.current) {
  mapRef.current.animateCamera({
    center: {
      latitude: location?.coords.latitude,
      longitude: location?.coords.longitude,
    },
    pitch: 0,
    heading: 0,
    altitude: 1000,
    zoom: 16,
  });
}
findCoordinates();

}, [location])



  findCoordinates = () => {
    if (hasLocationPermission) {
      Geolocation.getCurrentPosition(
          (position) => {
            console.log('position', position);
            setLocation(position);
          },
          (error) => {
            setLocation(null);
            console.log(error.code, error.message);
          },
          { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    }
	};

    return (
            <View style={{flex:1,height:"100%",width:"100%"}}>
                <Text>HomeScreen</Text>
                {/* <MapView
       provider={PROVIDER_GOOGLE} // remove if not using Google Maps
       style={{...StyleSheet.absoluteFill}}
       region={region}
      //  onRegionChange={onRegionChange}

     >
     </MapView> */}
     <RNMapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        initialCamera={{
          altitude: 15000,
          center: {
            latitude: 23.7603,
            longitude: 90.4125,
          },
          heading: 0,
          pitch: 0,
          zoom: 11,
        }}
        loadingEnabled
        loadingBackgroundColor="white"
        style={StyleSheet.absoluteFill}
        rotateEnabled={false}
      ></RNMapView>
            </View>
    )
}

export default HomeScreen;
