import { firebase } from '@react-native-firebase/database';


/**
 * Colors
 */
 export const database = firebase.app().database('https://xebiahackathon-39a47-default-rtdb.asia-southeast1.firebasedatabase.app');

 export const Colors = {
  transparent: 'rgba(0,0,0,0)',
  inputBackground: '#FFFFFF',
  white: '#ffffff',
  text: '#000000',
  primary: '#2F195F', 
  primaryShade1: '#1e103c', 
  primaryShade2: '#140b28', 
  primaryShade3: '#0a0514', 
  primaryLight1: '#f0ebfa',
  primaryLight2: '#d1c3ef',
  primaryLight3: '#c1aeea',
  secondary: '#292929', 
  tertiary: '#fcca03', 
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

const tiny = 5; 
const small = tiny * 2; 
const regular = tiny * 3; 
const large = regular * 2; 
export const MetricsSizes = {
  tiny,
  small,
  regular,
  large,
};
