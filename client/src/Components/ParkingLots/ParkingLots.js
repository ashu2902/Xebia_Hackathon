import React from 'react'
import {
    View,
    Text,
    StyleSheet,
    Image,
} from "react-native";


const ParkingLots = ({
    name, longitude, latitude, url, location
}) => {
    return (
        <View style={styles.wrapper}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: url }} style={{ ...StyleSheet.absoluteFill, borderRadius:7.5, alignItems:'center', justifyContent:'center'}} />
            </View>
        <View style={styles.textContainer}>
          <Text numberOfLines={2} style={textStyles.title}>{name}</Text>
          <Text style={textStyles.subtitle}>in {location}</Text>
        </View>
      </View>
    )
}

const styles = StyleSheet.create({
    wrapper: {
      marginVertical: 10,
      backgroundColor: "#ffffff",
      width: 250,
      height: 200,
      elevation: 5,
      borderRadius: 7.5,
      marginHorizontal: 10,
      justifyContent:'center',
      alignContent:'center'
    },
    imageContainer: {
      width:250,
      justifyContent:'center',
      alignItems:'center',
      height:100,
      borderRadius:7.5,
    },
    textContainer: {
      flex:1,
      marginVertical:5, marginHorizontal:7.5,
    },
  });
  
  const textStyles = StyleSheet.create({
    title: {
      fontFamily:'WorkSans-Medium',
      color:'#000',
      fontSize:15,
      marginVertical:2.5
    },
    subtitle : {
      fontFamily:'WorkSans-SemiBold',
      fontWeight:'700',
      fontSize:13,
      color:'#000',
      textTransform: 'uppercase',
      marginVertical:2.5
      
    },
    
  })
  

export default ParkingLots;
