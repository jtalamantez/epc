/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

//OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";

// COMPONENTS
import { ActivityIndicator, StyleSheet, Text, TextInput, ScrollView, View, KeyboardAvoidingView, Platform, Modal, TouchableOpacity, Alert} from 'react-native'
import AppContext from '../components/AppContext'
import {CustomButton, SubmitButton} from '../components/Button'
import { TextInputMask } from 'react-native-masked-text'
import {getEndpoint} from '../helpers/helpers'

// STYLES
import {globalStyles, forms, modal} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { MaterialCommunityIcons,FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function RegistrationScreen({navigation}) {
    console.log("REG SCREEN RUNNING")

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
        try {
            const response = await firebase.auth().createUserWithEmailAndPassword(email, password)
            const uid = response.user.uid
            const register = await completeRegistration(uid)
        } catch (err) {
            console.log("ERROR",err.message)
        }
    }

    /*************************************************************/
    // FIREBASE REGISTRATION
    /*************************************************************/
    const completeRegistration = async (uid) => {
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        const userData = {
            id: uid,
            phone: phone.replace(/[^\d]/g, ''), //remove () and all non-digits from phone number
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

        //ADD USER TO FIREBASE DB
        const usersRef = firebase.firestore().collection('users');
        appsGlobalContext.setUserID(uid)
        await usersRef.doc(uid).set(userData);


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
            console.log(error);
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
            console.log(encryptedPassword)
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
        <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} style={{flex:1}}>
        <View style={[globalStyles.scrollContainer,{marginTop:70}]}>
            <ScrollView >
                <View style={globalStyles.page} >
                    <Text style={globalStyles.blurb_text_large}>We're happy you're joining us.{"\n"}Signup for an account to start earning now.</Text>
                    <View style={[globalStyles.container,{width:'90%',paddingBottom:20}]}>
                        <View style={[styles.cc_container,{width:'100%', alignItems:'center',textAlign:'center'}]}>
                            <View style={[forms.input_container,focusName == 'name' ? forms.focused_light: forms.notFocused]}>
                                <MaterialIcons name="person-pin" size={27} style={[forms.input_icon,focusName == 'name' ? forms.focused_light: forms.notFocused]} />
                                <TextInput
                                    style={[forms.custom_input,{textTransform:'capitalize'}]}
                                    placeholder='Full Name'
                                    placeholderTextColor='rgba(203, 165, 44, 0.4)'
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
                            <View style={[forms.input_container,focusName == 'mobile'  ? forms.focused_light: forms.notFocused]}>
                                <MaterialIcons name="phone" size={27} style={[forms.input_icon,focusName == 'mobile'  ? forms.focused_light: forms.notFocused]} />
                                <TextInputMask
                                    type={'custom'}
                                    options={{
                                        mask: '(999) 999-9999'
                                    }}
                                    // add the ref to a local var
                                    style={forms.custom_input}
                                    placeholder='Mobile Number'
                                    placeholderTextColor='rgba(203, 165, 44, 0.4)'
                                    keyboardType='phone-pad'
                                    onChangeText={(text) => setPhone(text)}
                                    value={phone}
                                    underlineColorAndroid="transparent"
                                    onFocus={() => setFocusName("mobile")}
                                    onBlur={() => setFocusName(null)}
                                    setFocus={focusName}
                                />    
                            </View>  
                            <FirebaseRecaptchaVerifierModal
                                ref={recaptchaVerifier}
                                firebaseConfig={configKeys}
                                //attemptInvisibleVerification={true | false }
                            />
                            { /*
                            <View style={[forms.input_container,focusName == 'email' ? forms.focused_light: forms.notFocused]}>
                                <MaterialIcons name="email" size={27} style={[forms.input_icon,focusName == 'email' ? forms.focused_light: forms.notFocused]} />
                                <TextInput
                                    style={forms.custom_input}
                                    placeholder='Email'
                                    placeholderTextColor='rgba(203, 165, 44, 0.4)'
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
                            */ }
                            <View style={[forms.input_container,focusName == 'password'  ? forms.focused_light: forms.notFocused]}>
                                <MaterialIcons name="vpn-key" size={27} style={[forms.input_icon,focusName == 'password' ? forms.focused_light: forms.notFocused]} />
                                <TextInput
                                    style={forms.custom_input}
                                    placeholder='Password'
                                    placeholderTextColor='rgba(203, 165, 44, 0.4)'
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
                            <View>
                                <Text onPress={() => navigation.navigate('Terms')}  style={styles.textLinkText}>Terms &amp; Conditions</Text>
                            </View>  
                        </View>
                    
                        {/*
                        <View style={[styles.cc_container,{width:'100%', alignItems:'center',textAlign:'center'}]}>
                            <Text style={globalStyles.blurb_text_large}>We’ll need your credit card to {"\n"}gain points and pay through the app.</Text>
                            <View style={[forms.input_container,focusName == 'card' ? forms.focused_light: forms.notFocused]}>
                                <MaterialIcons name="credit-card" size={27} style={[forms.input_icon,focusName == 'card' ? forms.focused_light: forms.notFocused]} />
                                <TextInputMask
                                    type={'credit-card'}
                                    style={forms.custom_input}
                                    placeholder='Credit Card Number'
                                    placeholderTextColor='rgba(203, 165, 44, 0.4)'
                                    keyboardType='number-pad'
                                    onChangeText={(text) => setCardNumber(text)}
                                    value={number}
                                    underlineColorAndroid="transparent"
                                    autoCapitalize="none"
                                    onFocus={() => setFocusName("card")}
                                    onBlur={() => setFocusName(null)}
                                />    
                            </View>  
                            <View style={styles.cc_detail_container}>
                                <View style={[forms.input_container, styles.small_field,focusName == 'expiration' ? forms.focused_light: forms.notFocused]}>
                                    <MaterialIcons name="date-range" size={27} style={[forms.input_icon,focusName  == 'expiration' ? forms.focused_light: forms.notFocused]} />
                                    <TextInputMask
                                        type={'datetime'}
                                        options={{
                                            format: 'MM/YY'
                                        }}
                                        style={forms.custom_input}
                                        placeholderTextColor='rgba(203, 165, 44, 0.4)'
                                        placeholder='MM/YY'
                                        keyboardType='number-pad'
                                        onChangeText={(text) => setExpiration(text)}
                                        value={expiration}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="none"
                                        onFocus={() => setFocusName("expiration")}
                                        onBlur={() => setFocusName(null)}
                                    />    
                                </View>  
                                <View style={[forms.input_container, styles.small_field, {marginRight:0,marginLeft:5}, focusName == 'cvc'  ? forms.focused_light: forms.notFocused]}>
                                    <MaterialCommunityIcons name="credit-card-refund-outline" size={27} style={[forms.input_icon,focusName == 'cvc' ? forms.focused_light: forms.notFocused]} />
                                    <TextInput
                                        style={forms.custom_input}
                                        placeholder='CVC'
                                        placeholderTextColor='rgba(203, 165, 44, 0.4)'
                                        keyboardType='number-pad'
                                        onChangeText={(text) => setCvc(text)}
                                        value={cvc}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="none"
                                        onFocus={() => setFocusName("cvc")}
                                        onBlur={() => setFocusName(null)}
                                        maxLength={4}
                                    />    
                                </View>  
                            </View>
                            <View>
                                <Text onPress={() => navigation.navigate('Terms')}  style={styles.textLinkText}>Terms &amp; Conditions</Text>
                            </View>
                        </View>
                        */}
                    
                        <SubmitButton text='Create Account' onPress={() => signupWithPhone()} style="on_white" disabled={isDisabled}></SubmitButton>

                        {/************ START PHONE VERIFICATION MODAL ***************/}
                        <View style={globalStyles.container}>
                            <Modal animationType="slide" transparent={true} visible={modalVisible}
                                onRequestClose={() => {
                                    setModalVisible(!modalVisible);
                                }}
                            >
                                <View style={modal.modalBackground}>
                                    <View style={modal.modalView}>
                                        <TouchableOpacity style={modal.close_button} onPress={() => setModalVisible(!modalVisible)} >
                                            <Ionicons name="ios-close-circle-outline" size={35} color={Theme.PRIMARY_COLOR} />
                                        </TouchableOpacity>
                                        <Text style={modal.modalHeader}>VERIFY NUMBER</Text>
                                        <Text style={styles.modal_text}>Verify your number by inputting the code that has been text to your phone.</Text>
                                        <TextInput
                                            style={[forms.input_wide,styles.verify_input]}
                                            placeholder='Verification Code'
                                            placeholderTextColor="#aaaaaa"
                                            onChangeText={(text) => setVerificationCode(text)}
                                            value={verificationCode}
                                            underlineColorAndroid="transparent"
                                            autoCapitalize="none"
                                            keyboardType='number-pad'
                                            maxLength={6}
                                        />
                                        <SubmitButton text='Verify Code' onPress={() => confirmCode()} style="on_white" disabled={isDisabled}></SubmitButton>
                                    </View>
                                </View>
                            </Modal>
                        </View>
                        {/************ END PHONE VERIFICATION MODAL ***************/}


                    </View>
                </View>
            </ScrollView>
        </View>
        </KeyboardAvoidingView>
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
    textLinkText: {
        textAlign:'center',
        fontFamily: Theme.FONT_MEDIUM,
        fontSize: 10,
        padding:5,
        marginTop:10,
        color:Theme.PRIMARY_COLOR
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
    }
})