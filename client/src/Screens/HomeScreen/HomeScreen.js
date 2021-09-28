import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PermissionsAndroid,
  Alert,
  TouchableOpacity,
  Platform,
  Linking,
  Dimensions,
  Image
} from 'react-native';
import { database, Colors } from '../../../Config';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import mapStyles from '../../styles/mapStyles';
import { FlatList } from 'react-native-gesture-handler';
import ParkingLots from '../../Components/ParkingLots/ParkingLots';
import RBSheet from 'react-native-raw-bottom-sheet';
import auth from '@react-native-firebase/auth';
import { getDistance } from 'geolib';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';

const HomeScreen = ({navigation}) => {

  const api = 'http://192.168.1.11:8080';
  const windowWidth = Dimensions.get('window').width;

  const mapRef = useRef(null);
  const bottomSheetRef = useRef();
  const [realTime, setRealTime] = useState([]);
  const [parkingLots, setParkingLots] = useState([]);
  const [markerData, setMarkerData] = useState([]);
  const [markerDist, setMarkerDist] = useState(0);
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
        let temp = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          longitudeDelta: 0.004,
          latitudeDelta: 0.009,
        };
        setRegion(temp);
       
        mapRef.current.animateToRegion(region);
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
      .on('value', (snapshot) => {
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

    const interval = setInterval(async () => {
     await axios.get(`http://192.168.1.11:8080/api/test`).then(
        function (response) {
          // console.log('response', response.data)
          setRealTime({vacant: response.data.vacant, id: response.data.Lot_Id});
          }
          ).catch(function (error) {
            console.log('err', error);
          }).finally(function ()
          {
            // console.log('called');
          })
        }, 5000)
          
          if (LocationPermissionGranted == true) {
      getCurrentLocation();
    }

    fetchParkingLots();

    return () => clearInterval(interval); 

  }, []);

  handleMapReady = () => {
    getCurrentLocation();
  };

  handleLotPress = (item) => {
    console.log('lot item', item)
    let region = {
      latitude: item.latitude,
          longitude: item.longitude,
          longitudeDelta: 0.004,
          latitudeDelta: 0.009,
    }
    mapRef.current.animateToRegion(region);
  }

  const renderParkingLots = ({ item }) => {
    console.log('item', item);
    let current = {
      longitude,
      latitude
    }

    return (
      <TouchableOpacity 
      onPress={() => handleLotPress(item)}>
      <ParkingLots
        name={item.name}
        longitude={item.longitude}
        latitude={item.latitude}
        url={item.img_url}
        location={item.location}
        currentPos={current}
        />
        </TouchableOpacity>
    );
  };

  const signOut = () => {
    auth()
    .signOut()
    .then(() => navigation.replace('LoginScreen'));
    }

  const openGMaps = (lat, lng) => {
    // var scheme = Platform.OS === 'ios' ? 'maps:' : 'geo:';
    // var url = scheme + `${lat},${lng}`;
    var url = Platform.OS === 'android' ? `google.navigation:q=${lat}+${lng}` : `maps://app?daddr=${lat}+${lng}`
    Linking.openURL(url);
  }
  
  handleMarkerPress = (parking) => {
    let away = 0;
    let currentPos = {
      longitude,
      latitude
    }

    let secondLongitude = parking.longitude;
    let secondLatitude = parking.latitude;

    console.log(`second ${secondLatitude} long ${secondLongitude}`)
   const distance = getDistance(currentPos, {
       longitude: secondLongitude, latitude: secondLatitude
    })

    console.log('distance', distance)

    if (distance<1000 && distance>=0)
    {
        away = distance + 'm'
    }
    else
    {
        away = (distance/1000).toFixed(2) + 'km'
    }

    setMarkerDist(away);
    setMarkerData(parking);
    bottomSheetRef.current.open();
  }

  // console.log('realtime DATA', realTime && realTime.Lot_Id, realTime && realTime.vacant);
  return (
    <View style={{ flex: 1, height: '100%', width: '100%' }}>
      <TouchableOpacity onPress={() => signOut()} style={{position:'absolute', zIndex:2, backgroundColor:'white', height:40, width:40, borderRadius:35, margin:15, justifyContent:'center', alignItems:'center'}}>
        <Icon name={'logout'} color={'#000000'} size={30} />
      </TouchableOpacity>
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
        customMapStyle={mapStyles}
        followsUserLocation={true}
        onMapReady={handleMapReady}
        style={{height:'100%', width:'100%'}}
        rotateEnabled={false}
        showsUserLocation={true}
        initialRegion={region}
      >
        {parkingLots.map( (lot, index) => {
          return(<Marker
            key={index}
            coordinate={{
              latitude: Number(lot.latitude),
              longitude: Number(lot.longitude),
            }}
            title={lot.name}
            pinColor={Colors.primaryLight2}
            onPress={() => handleMarkerPress(lot)}
            />
            )
        })}
       
      </MapView>
    
      <RBSheet
        ref={bottomSheetRef}
        closeOnDragDown={true}
        customStyles={{
          container: {
            zIndex: 10,
            height: '50%',
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
            alignItems: 'center',
            zIndex: 2,
            backgroundColor: Colors.primaryLight1,
          }}
        >
          <View style={{flexDirection:'column'}}>

          <View style={{width:windowWidth,
      justifyContent:'center',
      alignItems:'center',
      height:150}}>
          <Image source={{ uri: markerData.img_url }} style={{ ...StyleSheet.absoluteFill, borderRadius:7.5, alignItems:'center', justifyContent:'center'}} />
            </View>
            <View style={{flexDirection:'column', marginHorizontal:15, marginVertical:15}}>
          <Text style={{fontFamily:'WorkSans-Bold', fontSize:20, marginTop:15}}>
            {markerData.name}
          </Text>
          <Text style={{fontFamily:'WorkSans-Medium', fontSize:15, marginVertical:2.5}}>
            in {markerData.location}
          </Text>
          <Text style={{fontFamily:'WorkSans-Light', fontSize:15, marginVertical:2.5}}>
            ~ {markerDist} away
          </Text>
         {realTime==null ? null : parseInt(realTime.id) === markerData.id ?  <Text style={{fontFamily:'WorkSans-Regular', fontSize:15, marginVertical:2.5, color:'green'}}>
            Spaces Available: {realTime.vacant}
          </Text>: console.log('error', realTime, markerData, realTime.id)}
              </View>
          </View>
         <View style={{flex:1,justifyContent:'center', alignItems:'center', zIndex:2, marginBottom:25}}>
       <TouchableOpacity style={{borderRadius:15, backgroundColor:Colors.primary, justifyContent:'center', alignItems:'center'}} onPress={() => openGMaps(markerData.latitude, markerData.longitude)}>
        <Text style={{color:'#fff', fontFamily:'WorkSans-SemiBold', paddingVertical:10, fontSize:20, paddingHorizontal:20}}>Get Directions</Text>
       </TouchableOpacity>
      </View>
        </View>
      </RBSheet>
    </View>
  );
};

export default HomeScreen;
