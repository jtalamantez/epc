/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

//OTHER DEPENDENCIES
import { firebase } from '../config/config'

// COMPONENTS
import { Image, Text, TextInput, StyleSheet, View, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import {SubmitButton} from '../components/Button'
import AppContext from '../components/AppContext'
import {getEndpoint} from '../helpers/helpers'

// STYLES
import {globalStyles, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function LoginScreen({navigation,onSignIn}) {

    const appsGlobalContext = useContext(AppContext);
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [hide_password,toggleShowPassword] = useState(true)
    const [focusName, setFocusName] = useState(null)

    /*****************************************************/
    // LOGIN WITH PHONE
    /*****************************************************/
    const loginWithPhone = async () => {
        if(phone && password){
            try{
                const result = await fetch(getEndpoint(appsGlobalContext,'login_with_phone'), {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        phone: phone,
                        password: password,
                    })
                });
                if (result.status >= 400 && result.status < 600) {
                    throw new Error("Bad response from server");
                }
                const usertoken = await result.text();
                firebase.auth().signInWithCustomToken(usertoken).then((userCredential) => {
                    // Signed in
                    var user = userCredential.user;
                })
                .catch((error) => {
                    var errorCode = error.code;
                    var errorMessage = error.message;
                    // ...
                });
            }
            catch(error){
                Alert.alert("Phone and password not combination not located. Please try again.")
            }
        }
        else{
            Alert.alert("Please add a mobile number and a password")
        }
    }

    /*****************************************************/
    // LOGIN WITH EMAIL
    /*****************************************************/
    const loginWithEmail = async () => {
        try {
            const provider = new firebase.auth.GoogleAuthProvider();
            const response = await firebase.auth().signInWithEmailAndPassword(email, password);
            const uid = response.user.uid
            appsGlobalContext.setUserID(uid)
            const usersRef = firebase.firestore().collection('users');
            const firestoreDocument = await usersRef.doc(uid).get();
            if (!firestoreDocument.exists) {
                alert("User does not exist anymore.")
                return;
            }
            else{
                console.log("user found!")
            }
            //await AsyncStorage.setItem('uid', uid);
        } catch (error) {
            alert(error)
        }
    }

    /*****************************************************/
    // RENDER THE SCREEN
    /*****************************************************/
    return (
        <SafeAreaView style={[globalStyles.safe_dark,styles.arrange_page]}>
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} >
            <View style={[styles.login_section,{paddingTop:30}]}>
                <View style={styles.logos}>
                    <Image style={styles.logo} source={require('../assets/icon.png')} />
                </View>
            </View>
            <View style={[styles.login_section,{paddingTop:50}]}>
                <View style={[globalStyles.container,{width:'70%'}]}>
                    <View style={[forms.input_container,{backgroundColor: Theme.PRIMARY_COLOR},focusName == 'phone' ? forms.focused_dark: forms.notFocused]}>
                        <MaterialIcons name="phone" size={27} style={[forms.input_icon,focusName == 'phone' ? forms.focused_dark: forms.notFocused,]} />
                        <TextInput
                            name="mobile"
                            style={forms.custom_input}
                            placeholder='Mobile'
                            placeholderTextColor='rgba(203, 165, 44, 0.4)'
                            keyboardType='phone-pad'
                            onChangeText={(text) => setPhone(text)}
                            value={phone}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            onFocus={() => setFocusName("phone")}
                            onBlur={() => setFocusName(null)}
                            setFocus={focusName}
                        />    
                    </View> 
                    {/*
                    <View style={[forms.input_container,{backgroundColor: Theme.PRIMARY_COLOR},focusName == 'email' ? forms.focused_dark: forms.notFocused]}>
                        <MaterialIcons name="email" size={27} style={[forms.input_icon,focusName == 'email' ? forms.focused_dark: forms.notFocused]} />
                        <TextInput
                            style={forms.custom_input}
                            placeholder='Email'
                            placeholderTextColor='rgba(203, 165, 44, 0.4)'
                            keyboardType='default'
                            onChangeText={(text) => setEmail(text)}
                            value={email}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            onFocus={() => setFocusName("email")}
                            onBlur={() => setFocusName(null)}
                            setFocus={focusName}
                        />    
                    </View>  
                    */}
                    <View style={[forms.input_container,{backgroundColor: Theme.PRIMARY_COLOR},focusName == 'password' ? forms.focused_dark: forms.notFocused]}>
                        <MaterialIcons name="vpn-key" size={27} style={[forms.input_icon,focusName == 'password' ? forms.focused_dark: forms.notFocused]} />
                        <TextInput
                            name="password"
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
                            setFocus={focusName}
                        />    
                        <FontAwesome name={hide_password ? 'eye-slash' : 'eye'} size={20} color={Theme.SECONDARY_COLOR} style={forms.password_icon}  onPress={() => toggleShowPassword(!hide_password)}/>
                   </View>     
                    <SubmitButton text='Login to Account' onPress={() => loginWithPhone()} ></SubmitButton>
                    {/*
                    <View style={styles.textLink}>
                        <Text onPress={() => navigation.navigate('Password')}  style={styles.textLinkTextSm}>Forgot Password?</Text>
                    </View>
                    */}
                </View>
            </View>

            <View style={[styles.login_section,{paddingTop:30}]}>
                <View style={styles.textLink}>
                    <Text onPress={() => navigation.navigate('Register')} style={styles.textLinkText}>Not a member? <Text onPress={() => navigation.navigate('Register')} style={styles.textLinkHighlighted}>Register</Text></Text>
                </View>
            </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
  )
}


const styles = StyleSheet.create({
    arrange_page: {
        justifyContent: 'space-evenly'
    },
    login_section: {
        alignItems: 'center',
        justifyContent:'flex-start',
        padding: 10,        
    },
    logos: {
        alignItems: 'center',
        justifyContent:'center',
        paddingTop:50,
        //fontFamily: Theme.FONT_STANDARD,
    },
    logo: {
        width:239,
        height: 33,
        alignSelf: "center",
    },
    textLink: {
        alignItems: "center",
        marginVertical: 20,
        padding:15,
    },
    textLinkTextSm: {
        fontSize: 14,
        color: Theme.TEXT_ON_PRIMARY_COLOR
    },
    textLinkHighlightedSm: {
        fontSize: 14,
        color: Theme.SECONDARY_COLOR,
    },
    textLinkText: {
        fontSize: 16,
        color: Theme.TEXT_ON_PRIMARY_COLOR
    },
    textLinkHighlighted: {
        fontSize: 16,
        color: Theme.SECONDARY_COLOR,
    }
})
