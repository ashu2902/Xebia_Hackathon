import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  Platform,
} from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import mapStyles from '../../styles/mapStyles';

const HomeScreen = () => {
  const mapRef = useRef(null);

  const [LocationPermissionGranted, setLocationPermissionGranted] = useState(false)
  const [latitude, setLat] = useState(0);
  const [longitude, setLong] = useState(0);

  const [region, setRegion] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });



  const goToInitialLocation = () => {
    let initialRegion = Object.assign({}, region);
    initialRegion['latitudeDelta'] = 0.005;
    initialRegion['longitudeDelta'] = 0.005;
    mapRef.current.animateToRegion(initialRegion, 2000);
  };


  getCurrentLocation = async () => {
    console.log('inside current location')
    Geolocation.getCurrentPosition(
      (position) => {
        console.log('position', position);
        setLat(position.coords.latitude);
        setLong(position.coords.longitude);
        setRegion({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          longitudeDelta: 0.004,
          latitudeDelta: 0.009,
        });
        let temp = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          longitudeDelta: 0.004,
          latitudeDelta: 0.009,
        }
        mapRef.current.animateToRegion(temp);
      },
      (error) => {
        Alert.alert(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 10000,
      }
      );
    }


  useEffect(() => {
    requestLocationPermission = async () => {
        try {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
              title: 'Smart Parking',
              message:
                'Smart Parking access to your location to optimize your experience',
            }
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            console.log('You can use the location');
    setLocationPermissionGranted(true);

          } else {
            console.log('location permission denied');
    setLocationPermissionGranted(false);

          }
        } catch (err) {
          console.warn(err);
        }
    };
    if (Platform.OS == 'android') {
    requestLocationPermission();
    }

    

    if(LocationPermissionGranted == true)
    {
    getCurrentLocation();
    }
  }, []);

  handleMapReady = () => {
getCurrentLocation()
}
  return (
    <View style={{ flex: 1, height: '100%', width: '100%' }}>
      <Text>HomeScreen</Text>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        zoomEnabled={true}
        region={region}
        followsUserLocation={true}
        onMapReady={handleMapReady}
        style={StyleSheet.absoluteFill}
        rotateEnabled={false}
        showsUserLocation={true}
        initialRegion={region}
      >
        <Marker
          coordinate={{
            latitude: latitude,
            longitude: longitude,
          }}
        ></Marker>
      </MapView>
    </View>
  );
};

export default HomeScreen;
