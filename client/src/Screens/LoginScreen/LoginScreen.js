import React,{useState} from 'react';
import { 
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    Keyboard,
    KeyboardAvoidingView,
    Dimensions,
    Image} from 'react-native';
import { database } from '../../../Config';
import Icon from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Fontisto from 'react-native-vector-icons/Fontisto';
import auth from '@react-native-firebase/auth';
import { Colors } from '../../../Config';


const {  height } = Dimensions.get("window");

const PhoneIcon = <FontAwesome name="phone" size={32} color={Colors.primaryShade3} /> 
const ContinueIcon = <Icon name="ios-arrow-forward" size={32} color={Colors.primaryShade3} /> 
const MobileIcon = <Fontisto name="mobile-alt" size={24} color={Colors.primaryShade3} />


const LoginScreen = ({ navigation }) => {
    const [number,setNumber] = useState('');
    const [OTP,setOTP]=useState('');
    const [selectedCode]=useState('+91');
    const [otpView,setOtpView]=useState(false);
    const [info, setInfo] = useState("")
    
    

    const login = () => {
        console.log('Pressed')
        if (number === "") {
            Alert.alert("Please enter the Mobile Number.")

        }

        else {
            
                let phonenumber = selectedCode + number
                console.log(phonenumber)
                signInWithPhoneNumber(phonenumber)

                setOtpView(true);
                setOTP('')

        }



    }

    const  signInWithPhoneNumber = async (phoneNumber) => {
        try {
            const confirmation = await auth().signInWithPhoneNumber(phoneNumber);


            // result = confirmation
            setInfo(confirmation);
            
        } catch (error) {
           
            console.log(error.message)
            alert(error.message)
        }


    }

    const handleVerifyCode = async () => {
        // Request for OTP verification
        console.log(OTP)
        if (OTP.length == 6) {
           await info
            .confirm(OTP)
            .then(
                    auth().onAuthStateChanged(async (user) => {
                        // console.log('user id', user.uid)
                        if (user) {
                            await database.ref('Users/' + user.uid).once('value').then(snapshot => {
                                if (snapshot.exists()) {
                                     navigation.replace('HomeScreen')
                                    }
                                else {
                                    database.ref('Users/' + user.uid).push({
                                        Phone: number,
                                        UID: user.uid,
                                    })


                                    navigation.replace('HomeScreen');

                                }
                            })


                        }
                        else {
                            //do nothing
                        }
                    })
                )
        }
    }

return(  
    <View style={{flex:1,}}>
        <KeyboardAvoidingView behavior="padding" enabled style={{ flex: 1, alignItems: 'center', backgroundColor: Colors.primaryShade2, justifyContent:'center'}}>
         <TouchableOpacity onPress={() => Keyboard.dismiss()} >
            <Image source={require('../../Assets/Images/Logo/logo-1.png')} style={{ width: 180*1.25, height: 55*1.25, bottom:150}}/>
            <View style={{width:250, height:250, bottom:50}}>
            <Image source={require('../../Assets/Images/Illustration/Illustration.png')} style={{ width: undefined, height: '100%', aspectRatio:1}}/>
                </View>
            </TouchableOpacity>         
                    <View style={{ position: 'absolute', bottom: 0, left: 0, right: 0, alignItems: 'center' }}>

                        {/* Bottom View start*/}

                        {!otpView ? <View
                            style={{
                                flexDirection: 'column',
                                width: '100%', backgroundColor: 'rgba(240,235,250,0.8)', borderTopRightRadius: 50, borderTopLeftRadius: 50,
                            }}>




                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 45, marginHorizontal: 20 }}>
                                {PhoneIcon}

                                <Text style={{ color: Colors.primaryShade3, marginLeft: 15, fontSize: 20 }} onPress={() => bottomSheetRef.current.open()}>{selectedCode}</Text>
                                <TextInput
                                    placeholder="Mobile Number"
                                    keyboardType={'phone-pad'}
                                    maxLength={10}
                                    value={number}
                                    onChangeText={setNumber}
                                    placeholderTextColor={Colors.primaryShade3}
                                    style={{ marginLeft: 15, marginRight: 15, borderBottomWidth: 0.5, borderBottomColor: Colors.primaryShade3, alignSelf: 'flex-start', textAlign: 'center', color: "#fff", padding: 0, height: 30, width: '50%', fontSize: 20 }} />


                                {/* Continue button start */}

                                <View style={{ borderRadius: 20, overflow: 'hidden' }}>

                                 <TouchableOpacity onPress={() => login()} rippleColor='gray'>
                                        {ContinueIcon}
                                    </TouchableOpacity> 
                                </View>

                                {/* Continue button end*/}



                            </View>

                            {/* Continue with OTP start*/}

                            <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', margin: 30, flexDirection: 'row' }}>
                                <Text style={{ color: Colors.primaryShade3 }}>Continue with </Text>
                                <Text style={{ color: Colors.primaryShade3, fontWeight:'bold'}}>OTP</Text>
                            </View>
                            {/* Continue with OTP end*/}


                            {/* Condition end */}


                        </View> :


                            <View
                                style={{
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    width: '100%', backgroundColor: 'rgba(240,235,250,0.8)', borderTopRightRadius: 50, borderTopLeftRadius: 50
                                }}>

                                {/* OTP AUTHENTICATION */}



                                {/* OTP ENTER START */}

                                <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginVertical: 25, flexDirection: 'row' }}>
                                    <Text style={{  color: Colors.primaryShade3 }}>Enter OTP sent to</Text>
                                    <Text style={{  color: Colors.primaryShade3 }}>{' '}{selectedCode}{'-'}{number}</Text>
                                </View>
                                {/* OTP ENTER END*/}

                                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 5, marginBottom: 15 }}>

                                    {MobileIcon}



                                    <View style={{}}>

                                        <TextInput
                                            placeholder="Enter OTP"
                                            keyboardType={'phone-pad'}
                                            maxLength={6}
                                            placeholderTextColor={'grey'}
                                            value={OTP}
                                            onChangeText={value => setOTP( value )}
                                            placeholderTextColor="rgba(255,255,255,0.4)"
                                            style={{ marginLeft: 15, marginRight: 25, width: '80%', borderBottomWidth: 0.5, borderBottomColor: "#fff", alignSelf: 'flex-start', textAlign: 'center', color: "#fff", fontSize: 20 }} />
                                    </View>

                                    {/* VERIFY button start */}

                                    <View style={{ borderRadius: 20, overflow: 'hidden' }}>

                                        <TouchableOpacity onPress={handleVerifyCode} rippleColor='gray'>
                                            {ContinueIcon}
                                        </TouchableOpacity>


                                    </View>


                                    {/* VERIFY button end*/}



                                </View>

                                <View style={{ alignSelf: 'center', alignContent: 'center', marginBottom: 20 }}>
                                    <TouchableOpacity onPress={() => {
                                        setOtpView({ otpView: false })
                                    }}>
                                        <Text style={{  padding: 20, color: "#fff", textDecorationLine: 'underline', fontSize: 12 }}>Resend OTP</Text>
                                    </TouchableOpacity>
                                </View>



                                {/* Condition end */}


                            </View>}
                    </View>
                    {/* Bottom View end*/}
                    </KeyboardAvoidingView>
    </View>
    
    
)

}

const styles = StyleSheet.create({
    backgroundVideo: {
        height: height,
        position: "absolute",
        top: 0,
        left: 0,
        alignItems: "stretch",
        bottom: 0,
        right: 0
    }
});

export default LoginScreen;
