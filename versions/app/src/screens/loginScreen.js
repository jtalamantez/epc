/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

//OTHER DEPENDENCIES
import { firebase } from '../config/config'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

// COMPONENTS
import { Image, Text, TextInput, StyleSheet, View, KeyboardAvoidingView, Platform, Alert } from 'react-native'
import {CustomButton, SubmitButton} from '../components/Button'
import AppContext from '../components/AppContext'
import {getEndpoint} from '../helpers/helpers'

// STYLES
import {globalStyles, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function LoginScreen({route,navigation}) {
    const chosenFlow = route.params.chosenFlow //used for registration route down below
    console.log("LOGIN: Chosen Flow",chosenFlow)

    const appsGlobalContext = useContext(AppContext);
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [hide_password,toggleShowPassword] = useState(true)
    const [focusName, setFocusName] = useState(null)


    /*****************************************************/
    // LOGIN WITH EMAIL
    /*****************************************************/
    const loginWithEmail = async () => {
        if(email && password){
            try {
                await firebase.auth().signInWithEmailAndPassword(email, password).then((response)=>{
                    console.log("Signed in with firebase auth",response)
                })
            } catch (error) {
                alert(error)
            }
        }
        else{
            Alert.alert("Error","Please use your email address and password to sign up")
        }
    }

    /*****************************************************/
    // RENDER THE SCREEN
    /*****************************************************/
    return (
        <SafeAreaView style={[globalStyles.safe_light,styles.arrange_page]}>
            <KeyboardAwareScrollView>
            <View style={[styles.login_section,{paddingTop:30}]}>
                {/*
                <View style={styles.logos}>
                    <Image style={styles.logo} source={require('../assets/logo.png')} />
                </View>
                */}
            </View>
            <View style={[styles.login_section,{paddingTop:50}]}>
                <Text style={globalStyles.h1}>Welcome back!</Text>
                <View style={[globalStyles.container,{width:'70%'}]}>
                    <View style={[forms.input_container,focusName == 'email' ? forms.focused_light: forms.notFocused]}>
                        <MaterialIcons name="email" size={27} style={[forms.input_icon,focusName == 'email' ? forms.focused_light: forms.notFocused]} />
                        <TextInput
                            style={forms.custom_input}
                            placeholder='Email'
                            placeholderTextColor={Theme.FAINT}
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
                    <View style={[forms.input_container,focusName == 'password' ? forms.focused_light: forms.notFocused]}>
                        <MaterialIcons name="vpn-key" size={27} style={[forms.input_icon,focusName == 'password' ? forms.focused_light: forms.notFocused]} />
                        <TextInput
                            name="password"
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
                            setFocus={focusName}
                        />    
                        <FontAwesome name={hide_password ? 'eye-slash' : 'eye'} size={20} color={Theme.SECONDARY_COLOR} style={forms.password_icon}  onPress={() => toggleShowPassword(!hide_password)}/>
                   </View>     
                    <CustomButton text='Login to Account' size="big" onPress={() => loginWithEmail()} />
                    {/*
                    <View style={styles.textLink}>
                        <Text onPress={() => navigation.navigate('Password')}  style={styles.textLinkTextSm}>Forgot Password?</Text>
                    </View>
                    */}
                </View>
            </View>

            <View style={[styles.login_section,{paddingTop:30}]}>
                <View style={styles.textLink}>
                    <Text onPress={() => navigation.navigate('Register',{chosenFlow:chosenFlow})} style={styles.textLinkText}>Not a member? <Text style={styles.textLinkHighlighted}>Sign Up</Text></Text>
                </View>
            </View>
            </KeyboardAwareScrollView>
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
        height: 63,
        alignSelf: "center",
        resizeMode: 'contain'
    },
    textLink: {
        alignItems: "center",
        marginVertical: 20,
        padding:15,
    },
    textLinkTextSm: {
        textAlign:'center',
        fontFamily: Theme.FONT_MEDIUM,
        fontSize: 10,
        padding:5,
        color:Theme.PRIMARY_COLOR
    },
    textLinkHighlightedSm: {
        fontSize: 14,
        color: Theme.SECONDARY_COLOR,
    },
    textLinkText: {
        fontSize: 16,
        color: Theme.TEXT_ON_SURFACE_COLOR
    },
    textLinkHighlighted: {
        fontSize: 16,
        color: Theme.SECONDARY_COLOR,
    }
})
