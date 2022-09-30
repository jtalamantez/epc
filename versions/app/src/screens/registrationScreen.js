/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useRef, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

//OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

// COMPONENTS
import { ActivityIndicator, StyleSheet, Text, TextInput, ScrollView, View, KeyboardAvoidingView, Platform, Image, TouchableOpacity, Alert} from 'react-native'
import AppContext from '../components/AppContext'
import {CustomButton, SubmitButton} from '../components/Button'
import { TextInputMask } from 'react-native-masked-text'
import {getEndpoint} from '../helpers/helpers'

// STYLES
import {globalStyles, forms, modal} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { MaterialCommunityIcons,FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons'


import * as WebBrowser from 'expo-web-browser';
import { ResponseType } from 'expo-auth-session';
import * as Google from 'expo-auth-session/providers/google';


//import * as Google from "expo-google-app-auth";
//import { getAuth, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
//WebBrowser.maybeCompleteAuthSession();


export default function RegistrationScreen({route,navigation}) {
    let chosenFlow = route.params.chosenFlow
    console.log("Chosen Flow",chosenFlow)

    //STATE GLOBALS FOR MANAGING REGISTRATION
    const appsGlobalContext = useContext(AppContext);
    const [isDisabled,setIsDisabled] = useState(false)

    //FORM SETUP STATE VARIABLES
    const [focusName, setFocusName] = useState(null)
    const [password, setPassword] = useState('')
    const [hide_password,toggleShowPassword] = useState(true)
    const [fullName, setName] = useState('')
    const [email, setEmail] = useState('')
    const [number, setCardNumber] = useState('')
    const [expiration, setExpiration] = useState('')
    const [cvc, setCvc] = useState('')

    //PHONE VERIFICATION
    const [modalVisible, setModalVisible] = useState(false);
    const recaptchaVerifier = useRef(null);
    const [phone, setPhone] = useState('')
    const [verificationId, setVerificationId] = useState();
    const [verificationCode, setVerificationCode] = useState();

    

    /*************************************************************/
    // SIGNUP WITH PHONE
    /*************************************************************/
    const signupWithPhone = async () => {
        if(fullName && phone && password){
            const validated = true //await validateCreditCard()
            if(!validated.error){
                try {
                    const phoneProvider = new firebase.auth.PhoneAuthProvider()
                    const verificationId = await phoneProvider.verifyPhoneNumber('+1'+phone,recaptchaVerifier.current)
                    setVerificationId(verificationId);
                    setModalVisible(true)
                } catch (err) {
                    console.log("ERROR",err.message)
                    Alert.alert("Error","Invalid phone number format. Please use 10 digits: xxx-xxx-xxxx")
                }
            }
            else{
                Alert.alert("Error",validated.error)
            }
        }
        else{
            let blank = ''
            if(!fullName) blank += ' Name cannot be blank \r\n'
            if(!phone) blank += ' Phone number cannot be blank \r\n'
            if(!password) blank += ' Password cannot be blank \r\n'
            Alert.alert("Error",blank)
        }
    }

    const confirmCode = async () => {
        setIsDisabled(true) //Disable resubmits
        try {
            const phoneCredential = await firebase.auth.PhoneAuthProvider.credential(verificationId,verificationCode)
            const newUser = await firebase.auth().signInWithCredential(phoneCredential)
            const uid = newUser.user.uid
            console.log("New User ID:",uid)
            const register = await completeRegistration(uid)
        }
        catch (error) {
            console.log(error);
            console.log('Invalid code what');
            setIsDisabled(false)
            alert("That verification code is invalid please try again");
        }
    }

     
    /*************************************************************/
    // SIGNUP WITH EMAIL
    /*************************************************************/
    const signupWithEmail = async () => {
        if(email && password){
            try {
                const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
                const uid = response.user.uid

                //COMPLETE REGISTRATION
                const register = await completeRegistration(uid)
            } catch (err) {
                Alert.alert("Signup Error",err.message)
                console.log("REGISTRATION ERROR",err.message)
            }
        }
        else{
            let blank = ''
            if(!email) blank += ' Email address cannot be blank \r\n'
            if(!password) blank += ' Password cannot be blank \r\n'
            Alert.alert("Error",blank)
        }
    }

    /*************************************************************/
    // SIGNUP WITH GOOGLE
    /*************************************************************/

    /*
    const signInAsync = async () => {
        console.log("LoginScreen.js 6 | loggin in");
        try {
          const { type, accessToken, idToken, refreshToken, user } = await Google.logInAsync({
            iosClientId: '303224229260-0l9dc3i70jg3upu0767f6agfbp1cjpg4.apps.googleusercontent.com',
            //androidClientId: `<YOUR_ANDROID_CLIENT_ID>`,
          });
    
          if (type === "success") {
              console.log(type,type)
              console.log(accessToken,accessToken)
              console.log(idToken,idToken)
              console.log(refreshToken,refreshToken)
              console.log(user,user)
            // Then you can use the Google REST API
            console.log("LoginScreen.js 17 | success, navigating to profile");

            let userInfoResponse = await fetch('https://www.googleapis.com/userinfo/v2/me', {
                headers: { Authorization: `Bearer ${accessToken}` },
              });
              console.log("userInfoResponse",userInfoResponse)

              await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
              const credential = firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
              console.log("credential",credential)

              const googleProfileData = await firebase.auth().signInWithCredential(credential);
              console.log("googleProfileData",googleProfileData)



            }
        } catch (error) {
          console.log("LoginScreen.js 19 | error with login", error);
          alert(error)
        }
      };
*/




    const [request, response, promptAsync] = Google.useIdTokenAuthRequest(
        {
          clientId: '303224229260-hmq2f3de692741h623p2v6180d0hdirk.apps.googleusercontent.com',
          },
      );



React.useEffect(() => {
    console.log("Use Effect called REGISTRATION")
    if (response?.type === 'success') {
        console.log("Respoonse",response)
    
        const { id_token } = response.params;
        console.log(response.params)


        const provider = new firebase.auth.GoogleAuthProvider()
        //const provider = new GoogleAuthProvider();

        
        
        const credential = provider.credential(id_token);
        console.log("CREDETNETILA",credential)
        const newUser = firebase.auth().signInWithCredential(credential)
        console.log("newUser",newUser)
        //const uid = newUser.user.uid
        //console.log("New User ID:",uid)

    }
    else{
        console.log("No response")
    }
  }, [response]);








        /*
    async signInWithGoogle() {
        try {
          const result = await Expo.Google.logInAsync({
            androidClientId: androidClientId,
            iosClientId: IOSClientId,
            behavior: 'web',
            iosClientId: '', //enter ios client id
            scopes: ['profile', 'email']
          });
          
          if (result.type  === 'success') {
            await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL);
            const credential = firebase.auth.GoogleAuthProvider.credential(data.idToken, data.accessToken);
            const googleProfileData = await firebase.auth().signInWithCredential(credential);
            this.onLoginSuccess.bind(this);
          }
        } catch ({ message }) {
          alert('login: Error:' + message);
        }
      }
*/


    /*************************************************************/
    // FIREBASE REGISTRATION
    /*************************************************************/
    const completeRegistration = async (uid) => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const userData = {
            id: uid,
            //phone: phone.replace(/[^\d]/g, ''), //remove () and all non-digits from phone number
            email: email,
            name: fullName,
            password: await encryptPassword(password),
            createdAt: timestamp,
            short_id: String(Math.floor(Math.random()*90000) + 10000),
            avatar: {
                //hexColor: generateProfileColor(),
                url: null
            },
            searchable: {
                name: fullName.toLowerCase(),
                first_name: fullName.toLowerCase().split(' ').slice(0, -1).join(' '),
                last_name: fullName.toLowerCase().split(' ').slice(-1).join(' ')
            }
        }

        //ADD CERTIFICATIONS FOR CHEFS
        if(chosenFlow == 'chefs'){
            userData.chef_status = 'Elite Chef'
            userData.certifications = {
                'Complete Profile': {
                    is_submitted:true,
                    is_approved:true,
                },
                'Waiver of Liability': {   
                    is_submitted:false,
                    is_approved:false,
                },
                'Background Check': {
                    is_submitted:false,
                    is_approved:false,
                },        
                "Food Handler's License": {
                    is_submitted:false,
                    is_approved:false,
                },
                "Professional Resume": {
                    is_submitted:false,
                    is_approved:false,
                },
                'Sanitation License': {
                    is_submitted:false,
                    is_approved:false,
                },
                'Liability Insurance': {
                    is_submitted:false,
                    is_approved:false,
                },
                'Professional Licenses': {
                    is_submitted:false,
                    is_approved:false,
                },
            }
        }

        //ADD USER TO CHEF/GUEST DB
        const usersRef = firebase.firestore().collection(chosenFlow);
        await usersRef.doc(uid).set(userData);

        //ADD USER TO THE ALL USERS DB
        const allUsersRef = firebase.firestore().collection('users');
        await allUsersRef.doc(uid).set({createdAt: timestamp, user_type:chosenFlow});

        //UPDATE CONTEXT VARS
        appsGlobalContext.setUserID(uid)
        appsGlobalContext.setUserData(userData)
        
        //Create customer account on server if needed
        /*
        try{
            const cardHolder = await fetch(getEndpoint(appsGlobalContext,'stripe/customer'), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    full_name: fullName,
                    phone: phone,
                    number: number,
                    expiration: expiration,
                    cvc: cvc,
                })
            });
            const stripe_info = await cardHolder.json();
            if(!stripe_info.error){
                //Add the new stripe to user data and create the user in the DB
                const usersRef = firebase.firestore().collection('users');
                userData.stripe_info = stripe_info
                const snapshot = await usersRef.doc(uid).set(userData);
                appsGlobalContext.setUserID(uid)
            }
            console.log("Added")
        }
        catch(error){
            console.log(error);
        }
        */

    }

     
    /*************************************************************/
    // VALIDATIONS
    /*************************************************************/
    const validateCreditCard = async () => {
        try{
            const result = await fetch(getEndpoint(appsGlobalContext,'stripe/validate'), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    number: number,
                    expiration: expiration,
                    cvc: cvc,
                })
            });
            const validated = await result.json();
            if(!validated.error){
                return "valid"
            }
            else{
                let errorMsg = (validated.error.code == 'parameter_invalid_integer') ? 'Please use valid numbers for credit card, expiration and CVC values' : validated.error.raw.message
                return {error: errorMsg}
            }
        }
        catch(error){
            console.log('CC ERROR',error);
        }   
    }

    const encryptPassword = async (password) => {
        try{
            const result = await fetch(getEndpoint(appsGlobalContext,'auth/encrypt'), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    password: password,
                })
            });
            const encryptedPassword = await result.text();
            return encryptedPassword
        }
        catch(error){
            console.log(error);
        }        
    }


    /*************************************************************/
    // OUTPUT FORM
    /*************************************************************/
    return (
        <SafeAreaView style={globalStyles.safe_light}>
        <KeyboardAwareScrollView>
        <View style={globalStyles.scrollContainer}>
            <ScrollView >
                <View style={[globalStyles.page,{padding:20}]} >
                    <Text style={globalStyles.h1}>Let's Sign Up</Text>
                    <View style={[globalStyles.container,{width:'90%',paddingBottom:20}]}>
                        <View style={[forms.input_container,forms.has_comment,focusName == 'name' ? forms.focused_light: forms.notFocused]}>
                            <MaterialIcons name="person-pin" size={27} style={[forms.input_icon,focusName == 'name' ? forms.focused_light: forms.notFocused]} />
                            <TextInput
                                style={[forms.custom_input,{textTransform:'capitalize'}]}
                                placeholder='Full Name'
                                placeholderTextColor={Theme.FAINT}
                                keyboardType='default'
                                onChangeText={(text) => setName(text)}
                                value={fullName}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                onFocus={() => setFocusName("name")}
                                onBlur={() => setFocusName(null)}
                                setFocus={focusName}
                            />    
                        </View>  
                        <Text style={forms.input_comment}>This is something other users and chefs will see when you write reviews or have conversations.</Text>
                       
                        <View style={[forms.input_container,forms.has_comment,focusName == 'email' ? forms.focused_light: forms.notFocused]}>
                            <MaterialIcons name="email" size={27} style={[forms.input_icon,focusName == 'email' ? forms.focused_light: forms.notFocused]} />
                            <TextInput
                                style={forms.custom_input}
                                placeholder='Email'
                                placeholderTextColor={Theme.FAINT}
                                keyboardType='email-address'
                                onChangeText={(text) => setEmail(text)}
                                value={email}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                onFocus={() => setFocusName("mobile")}
                                onBlur={() => setFocusName(null)}
                                setFocus={focusName}
                            />    
                        </View>  
                        <Text style={forms.input_comment}>Your email will not be publicly available to anyone in the app.</Text>


                        <View style={[forms.input_container,focusName == 'password'  ? forms.focused_light: forms.notFocused]}>
                            <MaterialIcons name="vpn-key" size={27} style={[forms.input_icon,focusName == 'password' ? forms.focused_light: forms.notFocused]} />
                            <TextInput
                                style={forms.custom_input}
                                placeholder='Password'
                                placeholderTextColor={Theme.FAINT}
                                keyboardType='default'
                                onChangeText={(text) => setPassword(text)}
                                value={password}
                                underlineColorAndroid="transparent"
                                autoCapitalize="none"
                                secureTextEntry={hide_password}
                                onFocus={() => setFocusName("password")}
                                onBlur={() => setFocusName(null)}

                            />    
                            <FontAwesome name={hide_password ? 'eye-slash' : 'eye'} size={20} color={Theme.SECONDARY_COLOR} style={forms.password_icon}  onPress={() => toggleShowPassword(!hide_password)}/>
                        </View>  
                        <CustomButton text='Create Account' onPress={() => signupWithEmail()} size="big" disabled={isDisabled} />
                        {/*
                        <View style={styles.social_signup}>
                            <Text style={styles.social_signup_text}>Or</Text>
                            <View style={styles.sign_btn_container}>
                                <Image style={styles.social_btn} source={require('../assets/btn_google.png')} />
                            </View>
                        </View>
                        */}
                    </View>
                    <Text onPress={() => navigation.navigate('Terms')}  style={styles.textLinkTextSm}>Terms &amp; Conditions</Text>
                </View>
            </ScrollView>
        </View>
        <View style={styles.login_section}>
            <View style={styles.textLink}>
                <Text onPress={() => navigation.navigate('Login',{chosenFlow:chosenFlow})} style={styles.textLinkText}>Already a member? <Text style={styles.textLinkHighlighted}>Log In</Text></Text>
            </View>
        </View>


        </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}



const styles = StyleSheet.create({
    cc_container: {
        borderRadius: 17,
        borderWidth:1,
        borderColor: Theme.BORDER_COLOR,
        padding:25,
        marginVertical:16,
        backgroundColor: Theme.SURFACE_COLOR,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    cc_detail_container: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    small_field: {
        flex:2,
        marginRight: 5,
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        alignItems: 'flex-start'
    },
    modal_text: {
        textAlign: 'center',
        color:Theme.TEXT_ON_SURFACE_COLOR,
        fontSize:15,
    },
    verify_input:{
        paddingLeft:0,
        borderWidth:2,
        borderColor:Theme.PRIMARY_COLOR,
        textAlign: 'center',
        fontSize:16,
        lineHeight: 20, 
        width:200,
        height:45,
        borderRadius: 20,
        fontFamily:Theme.FONT_MEDIUM,
    },
    social_signup: {
        width:'100%',
        marginTop:15,
        paddingVertical:10,
        marginBottom: 0,
        borderTopColor:Theme.BORDER_COLOR,
        borderTopWidth:1,
        alignItems: 'center',
        textAlign: 'center',
    },
    social_signup_text: {
        fontSize:11,
        color: Theme.GRAY,
    },
    sign_btn_container: {
        paddingVertical:10,
        width: '100%',
    },
    social_btn: {
        width:191,
        height: 46,
        alignSelf: 'center'
    },
    login_section: {
        alignItems: 'center',
        justifyContent:'flex-start',
        paddingVertical:20
    },
    textLink: {
        alignItems: "center",
    },
    textLinkTextSm: {
        textAlign:'center',
        fontFamily: Theme.FONT_MEDIUM,
        fontSize: 10,
        padding:5,
        color:Theme.PRIMARY_COLOR
    },
    textLinkText: {
        fontSize: 14,
        color: Theme.TEXT_ON_SURFACE_COLOR
    },
    textLinkHighlighted: {
        fontSize: 14,
        color: Theme.SECONDARY_COLOR,
    }
})