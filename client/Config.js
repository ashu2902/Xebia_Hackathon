import { StyleSheet } from 'react-native';
import React from 'react';

//d

/**
 * Colors
 */
export const Colors = {
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  white: '#ffffff',
  text: '#000000',
  primary: '#2F195F', //temporary
  secondary: '#292929', //temporary
  tertiary: '#fcca03', //temporary
  success: '#28a745',
  error: '#dc3545',
  gray: '#e0e0e0',
  darkGray: '#808080',
};

export const appVersion = {
  iOS: '1.0.0',
  Android: '1.0.0',
};

/**
 * FontSize
 */

export const FontSize = {
  teeny: 12,
  tiny: 15,
  small: 18,
  regular: 20,
  large: 25,
  extraLarge: 35,
};

/**
 * Metrics Sizes
 */

const tiny = 5; // 10
const small = tiny * 2; // 10
const regular = tiny * 3; // 15
const large = regular * 2; // 30
export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
};

// export const Styles = StyleSheet.create({
//   loading: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor:'#F5FCFF99'
//   },

//   above: {
//     position: 'absolute',
//     top: 100,
//     alignItems: 'center',
//     backgroundColor:'#F5FCFF99',...StyleSheet.absoluteFill

//   },

//   loading_HideScreen: {
//     position: 'absolute',
//     left: 0,
//     right: 0,
//     top: 0,
//     bottom: 0,
//     alignItems: 'center',
//     justifyContent: 'center',
//     backgroundColor:'#FFFFFF'
//   }
// })

export const fontSheet = StyleSheet.create({
  /* EXTRA LIGHT */
  Thin_Tiny: {
    fontFamily: 'Raleway-Thin',
    fontSize: FontSize.tiny,
  },
  Thin_Small: {
    fontFamily: 'Raleway-Thin',
    fontSize: FontSize.small,
  },
  Thin_Normal: {
    fontFamily: 'Raleway-Thin',
    fontSize: FontSize.regular,
  },
  Thin_Large: {
    fontFamily: 'Raleway-Thin',
    fontSize: FontSize.large,
  },

  /* LIGHT */
  Light_Teeny: {
    fontFamily: 'Raleway-Light',
    fontSize: FontSize.teeny,
  },
  Light_Tiny: {
    fontFamily: 'Raleway-Light',
    fontSize: FontSize.tiny,
  },
  Light_Small: {
    fontFamily: 'Raleway-Light',
    fontSize: FontSize.small,
  },
  Light_Normal: {
    fontFamily: 'Raleway-Light',
    fontSize: FontSize.regular,
  },
  Light_Large: {
    fontFamily: 'Raleway-Light',
    fontSize: FontSize.large,
  },

  /* Medium */
  Medium_Teeny: {
    fontFamily: 'Raleway-Medium',
    fontSize: FontSize.teeny,
  },
  Medium_Tiny: {
    fontFamily: 'Raleway-Medium',
    fontSize: FontSize.tiny,
  },
  Medium_Small: {
    fontFamily: 'Raleway-Medium',
    fontSize: FontSize.small,
  },
  Medium_Normal: {
    fontFamily: 'Raleway-Medium',
    fontSize: FontSize.regular,
  },
  Medium_Large: {
    fontFamily: 'Raleway-Medium',
    fontSize: FontSize.large,
  },

  /* Normal */

  Normal_Tiny: {
    fontFamily: 'Raleway-Regular',
    fontSize: FontSize.tiny,
  },
  Normal_Small: {
    fontFamily: 'Raleway-Regular',
    fontSize: FontSize.small,
  },
  Normal_Normal: {
    fontFamily: 'Raleway-Regular',
    fontSize: FontSize.regular,
  },
  Normal_Large: {
    fontFamily: 'Raleway-Bold',
    fontSize: FontSize.large,
  },

  /* Bold */

  Bold_Tiny: {
    fontFamily: 'Raleway-Bold',
    fontSize: FontSize.tiny,
  },
  Bold_Small: {
    fontFamily: 'Raleway-Bold',
    fontSize: FontSize.small,
  },
  Bold_Normal: {
    fontFamily: 'Raleway-Bold',
    fontSize: FontSize.regular,
    marginBottom: 10,
  },
  Bold_Large: {
    fontFamily: 'Raleway-Bold',
    fontSize: FontSize.large,
  },

  SemiBold: {
    fontFamily: 'Raleway-SemiBold',
  },
  ExtraBold: {
    fontFamily: 'Raleway-ExtraBold',
  },
  ExtraLight: {
    fontFamily: 'Raleway-ExtraLight',
  },
  Black: {
    fontFamily: 'Raleway-Black',
  },
});
