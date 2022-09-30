/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useRef, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

// OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import Constants from 'expo-constants';
import _ from 'underscore'

// COMPONENTS
import { StyleSheet, Text, TextInput, ScrollView, View, ActivityIndicator, Platform, Modal, Alert, TouchableOpacity, TouchableWithoutFeedback} from 'react-native'
import AppContext from '../components/AppContext';
import {CustomButton, SubmitButton} from '../components/Button'
import {convertTimestamp} from '../helpers/helpers'
import { TextInputMask, TextMask } from 'react-native-masked-text'
import {gotoWebLink} from '../helpers/helpers'
import {getEndpoint} from '../helpers/helpers'


// STYLES
import {globalStyles, forms, modal} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { MaterialCommunityIcons,FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function ProfileScreen({navigation}) {
    //Get global vars from app context
    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID
    const [user,setUserData] = useState(false)
    const [startDate,setStartDate] = useState('')
    const [dataLoaded,setDataLoaded] = useState(false)
    const [ccIcon,setCCIcon] = useState("cc-visa")
    const [editProfileSection,setEditProfileSection] = useState(false)
    const [sectionName,setSectionName] = useState(false)
    const [editCredit,setEditCredit] = useState(false)


    /*************************************************************/
    // GET USER DATA TO RENDER PAGE WITH
    /*************************************************************/
    const getUserData = async (uid = 'tempuser') => {
        console.log("Loading user data")
        const usersRef = firebase.firestore().collection('users');
        const firebaseUser = await usersRef.doc(uid).get();
        if (firebaseUser.exists) {
            let userData = firebaseUser.data()
            let userDate = convertTimestamp(userData.createdAt)

            //Set user data throughout page
            setUserData(userData);
            setStartDate(userDate[0])
            setDataLoaded(true)

            //Check to see if there are badge alerts we can show
            /*
            const newAlerts = checkForBadgeAlerts(appsGlobalContext)
            console.log("Are there new Alerts?",newAlerts)
            if(newAlerts){
                appsGlobalContext.bagdeAlerts = newAlerts
            }
            */
        }
        else{
            console.log("No user found")
        }
    }

    if(!dataLoaded){
        getUserData(uid)
    }

    /*************************************************************/
    // EDIT INFO
    /*************************************************************/
    const updateProfile = () => {
        if(sectionName == 'phone'){
            updatePhone()
        }
        if(sectionName == 'email'){
            updateEmail()
        }
        if(sectionName == 'birthday'){
            updateBirthday()
        }
    }

    /*************************************************************/
    // UPDATE EMAIL
    /*************************************************************/
    const [email, setNewEmail] = useState('')
    const updateEmail = async () => {
        const userData = {
            email: email
        }
        const usersRef = firebase.firestore().collection('users');
        await usersRef.doc(uid).update(userData);
        //Clean up and refresh profile editing
        setSectionName(false)
        setEditProfileSection(false)
        setDataLoaded(false)
    }

    /*************************************************************/
    // UPDATE BIRTHDAY
    /*************************************************************/
    const [birthday, setNewBirthday] = useState('')
    const updateBirthday = async () => {
        const userData = {
            birthday: birthday
        }
        const usersRef = firebase.firestore().collection('users');
        await usersRef.doc(uid).update(userData);
        //Clean up and refresh profile editing
        setSectionName(false)
        setEditProfileSection(false)
        setDataLoaded(false)
    }

    /*************************************************************/
    // UPDATE PHONE
    /*************************************************************/
    const [isDisabled,setIsDisabled] = useState(false)
    const [modalVisible, setModalVisible] = useState(false);
    const recaptchaVerifier = useRef(null);
    const [phone, setNewPhone] = useState('')
    const [verificationId, setVerificationId] = useState();
    const [verificationCode, setVerificationCode] = useState();


    const updatePhone = async () => {
        if(phone != ''){
            try {
                const phoneProvider = new firebase.auth.PhoneAuthProvider()
                const verificationId = await phoneProvider.verifyPhoneNumber('+1'+phone,recaptchaVerifier.current)
                setVerificationId(verificationId);
                setModalVisible(true)
            } catch (err) {
                console.log("ERROR",err.message)
            }
        }
        else{
            Alert.alert("Please enter a valid phone number")
        }
    }

    const confirmCode = async () => {
        setIsDisabled(true) //Disable resubmits
        try {
            const phoneCredential = await firebase.auth.PhoneAuthProvider.credential(verificationId,verificationCode)
            const user = await firebase.auth().currentUser;
            const updatedUser = await user.updatePhoneNumber(phoneCredential)
            const usersRef = firebase.firestore().collection('users');
            const snapshot = await usersRef.doc(uid).update({phone:phone});
            setIsDisabled(false)
            setModalVisible(false)
            //Clean up and refresh profile editing
            setSectionName(false)
            setEditProfileSection(false)
            setDataLoaded(false)
        }
        catch (error) {
            console.log(error);
            console.log('Invalid code what');
            setIsDisabled(false)
            alert(error);
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
                    if(!updated.error){
                        //setIsDisabled(false)
                        setEditCredit(false)
                        setDataLoaded(false)
                        setIsDisabled(false)

                    }
                    else{
                        Alert.alert(updated.error.raw.message)
                        setEditCredit(false)
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

    /*************************************************************/
    // EFFECT TO SHOW DEV SCREEN ON CLICKS
    /*************************************************************/
    const [theCount,setTheCount] = useState(0)
    const [devVisible,setDevVisible] = useState(false)

    const checkForCount = () => {
        let newCount = theCount + 1
        setTheCount(newCount)
        if(newCount > 6){
            setDevVisible(true)
        }
        console.log(theCount)
    }


    /*************************************************************/
    // ONLY SHOW IF WE HAVE USER
    /*************************************************************/

    if(user){
        return (
            <SafeAreaView style={globalStyles.safe_light}>
            <View style={globalStyles.scrollContainer}>
                <ScrollView >
                    <View style={globalStyles.page} >
                        <View style={styles.profile_header}>
                            <MaterialIcons name="person" size={60} color={Theme.SECONDARY_COLOR} style={styles.person_icon}/>                        
                            <View>
                                <Text style={styles.profile_name}>{user.name}</Text>
                                <Text style={styles.profile_id}>User ID: {user.short_id}</Text>
                            </View>
                        </View>
                        <View style={[globalStyles.container,{width:'90%',paddingBottom:5}]}>
                            <Text style={styles.section_header}>Member Info</Text>
                            <View style={[styles.info_container,{width:'100%'}]}>
                                <View style={styles.member_detail}>
                                    <MaterialIcons name="date-range" size={27} style={styles.detail_icons} />
                                    <Text style={styles.member_info_text}>Member Since: {startDate}</Text>
                                </View>
                                <View style={styles.member_detail}>
                                    <MaterialIcons name="phone" size={27} style={styles.detail_icons} />
                                    {sectionName == 'phone'
                                    ?   <TextInputMask
                                            type={'custom'}
                                            options={{
                                                mask: '(999) 999-9999'
                                            }}
                                            style={[forms.custom_input,styles.edit_input]}
                                            placeholder='Mobile Number'
                                            placeholderTextColor='rgba(203, 165, 44, 0.4)'
                                            keyboardType='phone-pad'
                                            onChangeText={(text) => setNewPhone(text)}
                                            value={phone}
                                            underlineColorAndroid="transparent"
                                        />    
                                    :   <TextMask 
                                            type={'custom'}
                                            options={{
                                                mask: '(999) 999-9999'
                                            }}
                                            value={user.phone}
                                            style={styles.member_info_text} />
                                    }
                                    {editProfileSection && sectionName === false &&
                                        <MaterialIcons name="edit" size={15} style={styles.edit_icon}  onPress={() => setSectionName("phone")}/>
                                    }
                                </View>
                                <View style={styles.member_detail}>
                                    <MaterialIcons name="email" size={27} style={styles.detail_icons} />
                                    {sectionName == 'email'
                                    ?   <TextInput
                                            style={[forms.custom_input,styles.edit_input]}
                                            placeholder='Email'
                                            placeholderTextColor='rgba(203, 165, 44, 0.4)'
                                            keyboardType='default'
                                            onChangeText={(text) => setNewEmail(text)}
                                            value={email}
                                            underlineColorAndroid="transparent"
                                        />   
                                    :   <Text style={styles.member_info_text}>{(user.email) ? user.email : <Text style={styles.promo_text}>Add in an email to receive bonus</Text>}</Text>
                                    }
                                    {editProfileSection && sectionName === false &&
                                        <MaterialIcons name="edit" size={15} style={styles.edit_icon}  onPress={() => setSectionName("email")}/>
                                    }
                                </View>
                                <View style={styles.member_detail}>
                                    <TouchableWithoutFeedback  onPress={checkForCount}>
                                        <FontAwesome name="birthday-cake" size={27} style={styles.detail_icons} />
                                    </TouchableWithoutFeedback>
                                    {sectionName == 'birthday'
                                    ?   <TextInputMask
                                            type={'datetime'}
                                            options={{
                                                format: 'DD/MM/YYYY'
                                            }}    
                                            style={[forms.custom_input,styles.edit_input]}
                                            placeholder='MM/DD/YYYY'
                                            placeholderTextColor='rgba(203, 165, 44, 0.4)'
                                            keyboardType='default'
                                            onChangeText={(text) => setNewBirthday(text)}
                                            value={birthday}
                                            underlineColorAndroid="transparent"
                                        />   
                                    :   <Text style={styles.member_info_text}>{(user.birthday) ? user.birthday : <Text style={styles.promo_text}>Add in your birthday to receive bonus</Text>}</Text>
                                    }
                                    {editProfileSection && sectionName === false && !user.birthday && //If a birthday exists they can no longer edit
                                        <MaterialIcons name="edit" size={15} style={styles.edit_icon}  onPress={() => setSectionName("birthday")}/>
                                    }
                                </View>
                                <View style={[styles.member_detail,{justifyContent:'flex-end'}]}>
                                    {sectionName
                                    ?   <>
                                            <CustomButton text='Cancel' onPress={() => {
                                                setSectionName(false)
                                                setEditProfileSection(false)
                                            }} ></CustomButton>
                                            <CustomButton text='Update' onPress={() => updateProfile(sectionName)} ></CustomButton>
                                        </>
                                    :   <CustomButton text='Edit' onPress={() => setEditProfileSection(!editProfileSection)} ></CustomButton>
                                    }
                                </View>
                            </View>
                        </View>


                        {/*
                        <View style={[globalStyles.container,{width:'90%',paddingBottom:20}]}>
                            <Text style={styles.section_header}>Credit Cards</Text>
                            <View style={[styles.info_container,{width:'100%'}]}>
                                <View style={styles.member_detail}>
                                    {editCredit
                                    ? <View style={{width:'100%', alignItems:'center',textAlign:'center'}}>
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
                                    :    <>
                                            <TouchableWithoutFeedback  onPress={checkForCount}>
                                                <FontAwesome name={ccIcon} size={30} style={styles.detail_icons} />
                                            </TouchableWithoutFeedback>
                                            <View>
                                                <Text style={[styles.member_info_text,{marginBottom:8,textAlignVertical:'center'}]}>{formatCardNumbers(ccIcon)}{user.stripe_info.last4}</Text>
                                                <Text style={styles.member_info_text}>{user.stripe_info.expiration}</Text>
                                            </View>
                                        </>
                                    }
                                </View>
                                <View style={[styles.member_detail,{justifyContent:'flex-end'}]}>
                                    {editCredit
                                    ?   <>
                                            <CustomButton text='Cancel' onPress={() => setEditCredit(false)} ></CustomButton>
                                            <CustomButton text='Update' onPress={() => updateCC()} disabled={isDisabled} ></CustomButton>
                                        </>
                                    :   <CustomButton text='Edit' onPress={() => setEditCredit("credit")} ></CustomButton>

                                    }
                                </View>
                                <View>
                                    <Text onPress={() => gotoWebLink('https://www.hogsalt.com/wp-hogsalt/terms-conditions/')} style={styles.textLinkText}>Terms &amp; Conditions</Text>
                                </View>
                            </View>
                        </View>
                        */}


                        <View>
                            <Text onPress={() => logout()}  style={styles.textLinkText}>LOG OUT</Text>
                            <Text style={styles.versionText}>App Version: {Constants.nativeAppVersion}</Text>
                        </View>
                        {devVisible &&
                            <View>
                                <Text onPress={() => navigation.navigate('Playground')}  style={styles.textLinkText}>DEVELOPER</Text>
                            </View>
                        }

                        {/************ START PHONE VERIFICATION MODAL ***************/}
                        <FirebaseRecaptchaVerifierModal
                            ref={recaptchaVerifier}
                            firebaseConfig={configKeys}
                            //attemptInvisibleVerification={true | false }
                        />
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
                </ScrollView>
            </View>
            </SafeAreaView>
        )
    }
    else{
        return (
            <View style={[globalStyles.container,{flex:1, alignItems:'center', justifyContent: 'center'}]}>
                <ActivityIndicator size="large" color={Theme.SECONDARY_COLOR} />
            </View>
        )
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

const logout = () =>
  Alert.alert(
    "Logout",
    "Would you like to log out?",
    [
        {
            text: "Cancel",
            style: "cancel",
        },
        {
            text: "Logout",
            onPress: () =>  firebase.auth().signOut()
        },
    ],
    {
      cancelable: true,
    }
);


const styles = StyleSheet.create({
    profile_header: {
        marginBottom:15,
        flexDirection: 'row',
        alignItems: 'center',
    },
    person_icon: {
        padding:5,
        marginRight:10
    },
    profile_name:{
        fontSize:23,
        color:Theme.TEXT_ON_SURFACE_COLOR,
        fontFamily: Theme.FONT_STANDARD,
        textTransform: 'capitalize'
    },
    profile_id:{
        fontSize:17,
        color: Theme.PRIMARY_COLOR,
        fontFamily: Theme.FONT_LIGHT
    },
    section_header: {
        fontFamily: Theme.FONT_MEDIUM,
        color:Theme.TEXT_ON_SURFACE_COLOR,
        fontSize:16,
        padding:5,
        marginTop:10,
        marginBottom:5
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
    member_detail: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical:10,
    },
    member_info_text: {
        flex:1,
        color: Theme.TEXT_ON_SURFACE_COLOR,
        fontSize:14
    },
    detail_icons: {
        paddingRight: 15,
        color:Theme.PRIMARY_COLOR
    },
    edit_icon: {
        color:Theme.SECONDARY_COLOR,
        padding:10
    },
    promo_text: {
        color: Theme.SECONDARY_COLOR,
        fontSize: 12,
        fontWeight: 'bold'
    },
    textLinkText: {
        textAlign:'center',
        fontFamily: Theme.FONT_MEDIUM,
        textDecorationLine: 'underline',
        fontSize: 13,
        padding:10,
        marginTop:6,
        color:Theme.PRIMARY_COLOR
    },
    versionText: {
        textAlign:'center',
        fontFamily: Theme.FONT_STANDARD,
        fontSize: 10,
        padding:5,
        marginTop:2,
        color:Theme.TEXT_ON_SURFACE_COLOR_LIGHT
    },
    edit_input: {
        borderWidth: 1,
        borderColor: Theme.SECONDARY_COLOR,
        borderRadius: 8,
        paddingLeft:11
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
})