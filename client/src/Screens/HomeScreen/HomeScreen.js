import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { database, Colors } from '../../../Config';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import mapStyles from '../../styles/mapStyles';
import { FlatList } from 'react-native-gesture-handler';
import ParkingLots from '../../Components/ParkingLots/ParkingLots';
import RBSheet from 'react-native-raw-bottom-sheet';

const HomeScreen = () => {
  const mapRef = useRef(null);
  const bottomSheetRef = useRef();

  const [parkingLots, setParkingLots] = useState(null);
  const [LocationPermissionGranted, setLocationPermissionGranted] =
    useState(false);
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
    console.log('inside current location');
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
        };
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
  };

  fetchParkingLots = async () => {
    let obj = [];
    await database
      .ref('ParkingLots/')
      .once('value')
      .then((snapshot) => {
        if (snapshot.exists()) {
          snapshot.forEach((snap) => {
            console.log('snap', snap.val());
            var data = snap.val();
            obj.push(data);
          });
          setParkingLots(obj);
          console.log('snapshot', snapshot.val());
        }
      });
  };

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

    if (LocationPermissionGranted == true) {
      getCurrentLocation();
    }

    fetchParkingLots();
  }, []);

  handleMapReady = () => {
    getCurrentLocation();
  };

  const renderParkingLots = ({ item }) => {
    console.log('item', item);
    return (
      <ParkingLots
        name={item.name}
        longitude={item.longitude}
        latitude={item.latitude}
        url={item.img_url}
        location={item.location}
      />
    );
  };
  return (
    <View style={{ flex: 1, height: '100%', width: '100%' }}>
      <View style={{flex:1, position:'absolute', bottom:0, left:0, right:0, justifyContent:'center', alignItems:'center', zIndex:2, backgroundColor:Colors.primaryLight1}}>
      <View style={{width:'100%', padding:5}}>
          <Text style={{fontSize:20, fontFamily:'WorkSans-Bold', marginLeft:5, color:Colors.primary}}>
            Nearby Spots
          </Text>
          </View>
      <FlatList
        data={parkingLots}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        style={{paddingBottom:10, marginLeft:10,paddingTop:5}}
        renderItem={renderParkingLots}
        keyExtractor={(item) => item.id}
        />
        
        </View>


     {/* <View style={{flex:1, position:'absolute', bottom:100, left:0, right:0, justifyContent:'center', alignItems:'center', zIndex:2}}>
       <TouchableOpacity style={{borderRadius:15, backgroundColor:Colors.primary, justifyContent:'center', alignItems:'center'}} onPress={() => bottomSheetRef.current.open()}>
        <Text style={{color:'#fff', fontFamily:'WorkSans-SemiBold', paddingVertical:10, paddingHorizontal:15}}>Find Parking Spots</Text>
       </TouchableOpacity>
      </View> */}
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        zoomEnabled={true}
        region={region}
        followsUserLocation={true}
        onMapReady={handleMapReady}
        style={{height:'100%', width:'100%'}}
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
    
      {/* <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        customStyles={{
          container: {
            zIndex: 10,
            height: '40%',
            borderTopEndRadius: 10,
            borderTopStartRadius: 10,
          },
          wrapper: { backgroundColor: 'rgba(255,255,255,0.5)', zIndex: 10 },
        }}
        animationType="slide"
        openDuration={700}
        closeDuration={700}
      >
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 2,
            backgroundColor: Colors.primaryLight1,
          }}
        >
          <View style={{ width: '100%', padding: 5 }}>
            <Text
              style={{
                fontSize: 20,
                fontFamily: 'WorkSans-Bold',
                marginLeft: 5,
                color: Colors.primary,
              }}
            >
              Nearby Spots
            </Text>
          </View>
          <FlatList
            data={parkingLots}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{ paddingBottom: 10, marginLeft: 10, paddingTop: 5 }}
            renderItem={renderParkingLots}
            keyExtractor={(item) => item.id}
          />
        </View>
      </RBSheet> */}
    </View>
  );
};

export default HomeScreen;
