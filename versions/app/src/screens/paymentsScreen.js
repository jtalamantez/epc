/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

//OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'
import _ from 'underscore'



// COMPONENTS
import { Image, StyleSheet, Text, TextInput, ScrollView, View, ActivityIndicator, Platform, Modal, Alert, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import { TextInputMask, TextMask } from 'react-native-masked-text'
import {CustomButton, GoToButton} from '../components/Button'
import {getEndpoint,gotoWebLink} from '../helpers/helpers'
import AppContext from '../components/AppContext'


// STYLES
import {globalStyles, TouchableHighlight, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { MaterialCommunityIcons,FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function PaymentScreen({route,navigation}) {
    //Get global vars from app context
    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID
    const activeFlow = appsGlobalContext.activeFlow
    const user = route.params.details
    const [hasCardOnFile,setHasCardOnFile] = useState((_.has(user,'stripe_info')) ? true : false)
    const [ccIcon,setCCIcon] = useState("cc-visa")
    const [isDisabled,setIsDisabled] = useState(false)


  
    /*************************************************************/
    // ADD CREDIT CARD
    /*************************************************************/    

    const addCreditCard = async () => {
        if(number && expiration && cvc){
            const cardHolderDetails = {
                full_name: user.name,
                number: number,
                expiration: expiration,
                cvc: cvc,
            }

            console.log("Card holder details",cardHolderDetails)

            //Create customer account with stripe
            try{
                //Crate customer via strip API
                const stripeURL = appsGlobalContext.configKeys.api_live+'stripe/customer'
                console.log(stripeURL)
                const cardHolder = await fetch(stripeURL, {
                    method: 'POST',
                    headers: {
                        Accept: 'application/json',
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(cardHolderDetails)
                });
                const stripe_info = await cardHolder.json();
                console.log(stripe_info)
                if(!stripe_info.error){
                    //Add the new stripe to user data and create the user in the DB
                    const usersRef = firebase.firestore().collection(activeFlow);
                    const snapshot = await usersRef.doc(uid).update({stripe_info:stripe_info});
                    //Update the user globally
                    user.stripe_info = stripe_info
                    appsGlobalContext.setUserData(user)
                    setHasCardOnFile(true)
                    console.log("Added")
                }
                else{
                    Alert.alert(stripe_info.error.raw.message)
                    setIsDisabled(false)
                }
            }
            catch(error){
                console.log(error);
            }
        }
        else{
            Alert.alert("Please enter a credit card number, expiration data and CVC")
        }
    }


    /*************************************************************/
    // UPDATE CREDIT CARD
    /*************************************************************/
    const [number, setCardNumber] = useState('')
    const [cvc, setCvc] = useState('')
    const [expiration, setExpiration] = useState('')
    
    const updateCC = async () =>{
        if(number && expiration && cvc){
            setIsDisabled(true) //Disable resubmits
            const validated = await validateCreditCard()
            if(!validated.error){
                try{
                    const result = await fetch(getEndpoint(appsGlobalContext,'stripe/update_payment'), {
                        method: 'POST',
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            uid: uid,
                            number: number,
                            expiration: expiration,
                            cvc: cvc,
                        })
                    });
                    const updated = await result.json();
                    console.log(updated)
                    if(!updated.error){
                        //setIsDisabled(false)
                        setDataLoaded(false)
                        setIsDisabled(false)

                    }
                    else{

                        console.log(updated.error)
                        Alert.alert("There was an error adding your card")
                        setIsDisabled(false)
                    }

                }
                catch(error){
                    console.log(error);
                    setIsDisabled(false)
                }  
            }
            else{
                Alert.alert("Error",validated.error)
                setIsDisabled(false)
            }
        }
        else{
            let blank = ''
            if(!number) blank += ' Credit card number cannot be blank \r\n'
            if(!expiration) blank += ' Expiration date cannot be blank \r\n'
            if(!cvc) blank += ' CVC number cannot be blank \r\n'
            Alert.alert("Error",blank)
        }
    }

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

    const formatCardNumbers = (ccIcon) => {
        return (ccIcon == 'cc-amex') ? "•••• •••••• •" : "•••• •••• •••• •••• " 
    }
    
    const determineCCIcon = (brand) => {
        const str = brand.toLowerCase()
        switch (str) {
            case 'mastercard':
                var icon = 'cc-mastercard'
                break
            case 'amex':
                var icon = 'cc-amex'
                break
            default:
                var icon = 'cc-visa'
                break
        }
        return icon
    }

    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={[globalStyles.page,{}]}>
                <Text>In-app payents will be chrged with a credit card on file. Please add one here.</Text>
                    <View style={styles.member_detail}>
                        {hasCardOnFile &&
                            <View style={{padding:10,justifyContent:'center',margin:20}}>
                                <Text>Active Card</Text>
                                <TouchableWithoutFeedback>
                                    <FontAwesome name={ccIcon} size={30} style={styles.detail_icons} />
                                </TouchableWithoutFeedback>
                                <View>
                                    <Text style={[styles.member_info_text,{marginBottom:8,textAlignVertical:'center'}]}>{formatCardNumbers(ccIcon)}{user.stripe_info.last4}</Text>
                                    <Text style={styles.member_info_text}>{user.stripe_info.expiration}</Text>
                                </View>
                            </View>
                        }
                        <View style={{width:'100%', alignItems:'center',textAlign:'center'}}>
                            <View style={forms.input_container}>
                                <MaterialIcons name="credit-card" size={27}   style={forms.input_icon}  />
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
                                />    
                            </View>  
                            <View style={styles.cc_detail_container}>
                                <View style={[forms.input_container, styles.small_field]}>
                                    <MaterialIcons name="date-range" size={27}   style={forms.input_icon} />
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

                                        maxLength={5}
                                    />   
                                </View>  
                                <View style={[forms.input_container, styles.small_field, {marginRight:0,marginLeft:5}]}>
                                    <MaterialCommunityIcons name="credit-card-refund-outline" size={27}    style={forms.input_icon} />
                                    <TextInput
                                        style={forms.custom_input}
                                        placeholder='CVC'
                                        placeholderTextColor='rgba(203, 165, 44, 0.4)'
                                        keyboardType='number-pad'
                                        onChangeText={(text) => setCvc(text)}
                                        value={cvc}
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="none"
                                    
                                        maxLength={4}
                                    />    
                                </View>  
                            </View> 
                        </View>
                    </View>
                    {/*
                    <View style={[styles.member_detail,{justifyContent:'flex-end'}]}>
                        {editCredit
                        ?   <>
                                <CustomButton text='Cancel' onPress={() => setEditCredit(false)} ></CustomButton>
                                <CustomButton text='Update' onPress={() => updateCC()} disabled={isDisabled} ></CustomButton>
                            </>
                        :   <CustomButton text='Edit' onPress={() => setEditCredit("credit")} ></CustomButton>

                        }
                    </View>
                    */}
                <CustomButton text={hasCardOnFile ? 'Update Card' : 'Add Card'} onPress={() => addCreditCard()} size="big"></CustomButton>
                    <View>
                        <Text onPress={() => gotoWebLink('https://www.google.com')} style={styles.textLinkText}>Terms &amp; Conditions</Text>
                    </View>

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    buttons: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-evenly',
        paddingBottom:45,
        //fontFamily: Theme.FONT_STANDARD,
    },
    button_space: {
        width:'48%',
    },
    info_container: {
        borderRadius: 17,
        borderWidth:1,
        borderColor: Theme.BORDER_COLOR,
        paddingHorizontal:25,
        paddingVertical:15,
        marginBottom:25,
        backgroundColor: Theme.SURFACE_COLOR,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    cc_container: {
        borderRadius: 17,
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
    textLinkText:{
        paddingTop:20
    }
})
