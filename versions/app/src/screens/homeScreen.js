/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// OTHER DEPENDENCIES
import _ from 'underscore'
import { firebase, configKeys } from '../config/config'
import { useFocusEffect } from '@react-navigation/native';

// COMPONENTS
import { Text, StyleSheet, View, Image, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity } from 'react-native'
import {GoToButton, CustomButton} from '../components/Button'
import ChefStatus from '../components/ChefStatus'
import AppContext from '../components/AppContext';
import {getEndpoint} from '../helpers/helpers'

// STYLES
import {globalStyles, TouchableHighlight, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { FontAwesome, FontAwesome5, Ionicons, AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'
import { TextInput } from 'react-native-gesture-handler';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function HomeScreen({navigation}) {
    //Get global vars from app context
    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID
    const [refreshing, setRefreshing] = useState(false);
    const [user,setUserData] = useState(false)
    const [emailIsNotVerified,setEmailIsNotVerified] = useState(false)
    
    
    /*************************************************************/
    // GET USER DATA TO RENDER PAGE WITH
    /*************************************************************/
    const getUserData = async (uid) => {
        console.log("HOME SCREEN, Loading user data")
        const usersRef = firebase.firestore().collection('chefs');
        const firebaseUser = await usersRef.doc(uid).get();
        if (firebaseUser.exists) {
            let userData = firebaseUser.data()
            console.log("Setting new user data")
            console.log("Is this user verified?")
            if(_.has(userData,'isEmailVerified') && userData.isEmailVerified == false){
                console.log("They are not verified, show the verification page")
                setEmailIsNotVerified(true)
            }
            else{
                setEmailIsNotVerified(false)
            }
            appsGlobalContext.setUserData(userData)
            setUserData(userData);
        }
        else{
            console.log("No user found",uid)
            const signout = await firebase.auth().signOut();
        }
    }

    const checkForVerifiedEmail = () => {
        getUserData(uid)
    }

    const onRefresh = () => {
        getUserData(uid)
        setRefreshing(false)
    }

    useEffect(() => {
        getUserData(uid)
    }, [])

    /*************************************************************/
    // RUN FOCUS EFFECT TO CHECK VARIOUS STATES ON LOAD
    /*************************************************************/
    useFocusEffect(
        React.useCallback(() => {
            console.log("Home screen is focused")
            getUserData(uid)
        }, [1])
    )

    if(user){
        return (
            <SafeAreaView style={globalStyles.safe_light}>
                <View style={[globalStyles.page,{marginTop:-50}]}>
                    <ScrollView 
                        style={{width:'100%', flex:1}}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                            />
                        }
                    >
                    <View style={globalStyles.card}>
                        <View style={globalStyles.card_header}>
                            <Text style={globalStyles.h3}>Net Income</Text>
                            <Text style={styles.dropdown}>This Week</Text>
                        </View>
                        <Text style={styles.featured_content}>$0</Text>
                    </View>

                    {emailIsNotVerified && 
                        <View style={globalStyles.card}>
                            <View style={[globalStyles.card_header,styles.divider]}>
                                <Text style={[globalStyles.h3]}>Email Not Verified</Text>
                            </View>
                            <TouchableOpacity style={styles.navigate_away} onPress={() => checkForVerifiedEmail()}>
                                <Text style={[styles.navigate_away_content]}>Click here if you have already verified your email.</Text>
                                <AntDesign name="right" size={20} color={Theme.FAINT} style={{paddingLeft:5}}/>
                            </TouchableOpacity>
                        </View>
                    }

                    {_.has(user,'isOnboarded') && user.isOnboarded === true
                        ? <>
                            {/*
                            <View style={globalStyles.card}>
                                <View style={globalStyles.card_header}>
                                    <Text style={[globalStyles.h3,{fontSize:17}]}>Stand Out from the Crowd!</Text>
                                </View>
                                <Text style={globalStyles.card_content}>We recommend doing these things to make your profile stand out. Earn fun badges along the way.</Text>
                                <ChefStatus certifications={user.certifications} navigation={navigation}/>
                            </View>
                            */}
                            <View style={globalStyles.card}>
                                <View style={{flexDirection: 'row', paddingVertical:5}}>
                                    <Text style={{fontSize:14, color:Theme.PRIMARY_COLOR, fontWeight: 'bold'}}>Chef Status: ELITE CHEF</Text>
                                    <Image style={globalStyles.badge_small} source={require('../assets/badges/status_elite_chef.png')} />
                                </View>
                            </View>
                            <View style={globalStyles.card}>
                                <View style={[globalStyles.card_header,styles.divider]}>
                                    <Text style={globalStyles.h3}>Refer A Chef</Text>
                                </View>
                                <TouchableOpacity style={styles.navigate_away} onPress={() => navigation.navigate("Account", { screen: "Refer" })}>
                                    <Text style={[styles.navigate_away_content,{color:Theme.FAINT, fontWeight: 'normal'}]}>Earn $50 for every chef you refer</Text>
                                    <AntDesign name="right" size={20} color={Theme.FAINT} style={{paddingLeft:5}}/>
                                </TouchableOpacity>
                            </View>
                        </>
                        : <>
                            <View style={globalStyles.card}>
                                <View style={[globalStyles.card_header]}>
                                    <Text style={[globalStyles.h3]}>Complete your profile</Text>
                                </View>
                                <TouchableOpacity style={styles.navigate_away} onPress={() => navigation.navigate("Account", { screen: "Profile" })}>
                                    <Text style={styles.navigate_away_content}>Hey Chef, let's finish up your profile so you{'\n'}can start booking!</Text>
                                    <AntDesign name="right" size={20} color={Theme.SECONDARY_COLOR} style={{paddingLeft:5}}/>
                                </TouchableOpacity>
                            </View>
                        </>
                    }
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

const styles = StyleSheet.create({
    dropdown: {
        fontSize:12,
        color: Theme.TEXT_ON_SURFACE_COLOR_LIGHT
    },
    featured_content: {
        fontSize: 30,
        fontWeight: '700',
        color: Theme.PRIMARY_COLOR
    },
    content: {
        flex:1,
        padding:15,
        alignItems: 'center',
        backgroundColor: 'blue',
        width:'100%'
    },
    card_content: {
        color: Theme.TEXT_ON_SURFACE_COLOR,
        fontSize: 12,
        marginTop: 20
    },
    flatlist: {
        width: '100%',
    },
    status_bar_cont:{
        flex:1,
        alignContent: 'flex-start',
    },
    status_bar:{
        height:8,
        borderRadius:10,
        backgroundColor: Theme.FAINT
    },
    status_bar_progress:{
        position:'absolute',
        height:8,
        borderRadius:10,
        backgroundColor: 'green'
    },
    navigate_away: {
        width: '100%',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
    },
    navigate_away_content:{
        flex:1,
        fontWeight: 'bold',
        color: Theme.SECONDARY_COLOR,
        fontSize: 13,
    },
})