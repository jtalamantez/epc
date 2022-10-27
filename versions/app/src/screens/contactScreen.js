/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

// COMPONENTS
import { Text, TextInput, StyleSheet, View } from 'react-native'
import {CustomButton, SubmitButton} from '../components/Button'
import AppContext from '../components/AppContext'
import {getEndpoint} from '../helpers/helpers'


// STYLES
import {globalStyles} from '../styles/styles';
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function ContactScreen({navigation}) {
    const appsGlobalContext = useContext(AppContext);
    const [message,setMessage] = useState()
    const [msgSent,setMsgSent] = useState(false)
    const [isDisabled,setIsDisabled] = useState(false)

    const submitForm = async () => {
        setIsDisabled(true)
        console.log(getEndpoint(appsGlobalContext,'contact/contact'))
        try{
            const result = await fetch(getEndpoint(appsGlobalContext,'contact/contact'), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    message: message,
                    user: appsGlobalContext.userData,
                })
            })
            const response = await result.text();
            console.log(response)
            setIsDisabled(false)
            setMsgSent(response)
        }
        catch(error){
            console.log(error)
        }        
    }


    return (
        <SafeAreaView style={globalStyles.safe_light} >
            <KeyboardAwareScrollView>
                <View style={styles.message}>
                    {msgSent 
                    ? <Text style={styles.input_label}>{msgSent}</Text>
                    : 
                    <>
                        <Text style={styles.input_label}>Hi, how can{"\n"} we help you?</Text>
                        <TextInput
                            style={styles.input}
                            placeholder='Message'
                            placeholderTextColor='rgba(203, 165, 44, 0.4)'
                            keyboardType='default'
                            onChangeText={(text) => setMessage(text)}
                            value={message}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                            multiline
                            //onFocus={() => setFocusName("phone")}
                            //onBlur={() => setFocusName(null)}
                            //setFocus={focusName}
                        />
                        <SubmitButton text='Submit' onPress={() => submitForm()}  disabled={isDisabled}></SubmitButton>
                    </>
                    }
                </View>
            </KeyboardAwareScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    message: {
        alignItems: 'center',
        width:'100%',
        padding:10
    },
    input_label: {
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        textAlign: 'center',
        fontFamily: Theme.FONT_STANDARD,
        fontSize: 20,
        lineHeight: 25,
        paddingVertical: 20,
        color: Theme.PRIMARY_COLOR
    },
    input: {
        width:'90%',
        height: 200,
        fontSize: 17,
        lineHeight:25,
        borderRadius: 15,
        borderColor: Theme.PRIMARY_COLOR,
        borderWidth: 1,
        overflow: 'hidden',
        backgroundColor: Theme.SURFACE_COLOR,
        textAlignVertical: 'top',
        padding: 15,
        marginVertical: 15
    },
    chatbox_container: {
        width:'100%',
    }
})
