/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context' 
import {Text, StatusBar, Platform, LogBox, AsyncStorage} from 'react-native'

//import Sentry from './src/components/Sentry';

//EXPO DEPENDENCIES
import * as Updates from 'expo-updates';
import AppLoading from 'expo-app-loading';
import * as SplashScreen from 'expo-splash-screen';

// FIREBASE AND CONFIG DEPENDENCIES
import { firebase, configKeys } from './src/config/config'

//COMPONENTS
import AppContext from './src/components/AppContext';
import Navigator from "./src/routes";

//THEMES AND FONTS SETUP
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons'
import Theme from './src/styles/theme.style.js';

//FONTS SETUP
/*
https://docs.expo.io/guides/using-custom-fonts/
https://fonts.google.com/
https://directory.vercel.app/
*/
import {
    useFonts,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
} from '@expo-google-fonts/roboto';
import { 
    NotoSerif_400Regular
} from '@expo-google-fonts/noto-serif';
  

/***** assign a default text to the whole app ******/
Text.defaultProps = Text.defaultProps || {}
Text.defaultProps.style =  { fontFamily: 'Roboto_400Regular' }


//Ignore Yellow Timer Warnings caused by firebase
LogBox.ignoreLogs(['Setting a timer']);

/*******************************************************************************/
//MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function App() {

    /* MANUAL RESET APP FOR DEV TESTING */
    //firebase.auth().signOut();
    //AsyncStorage.removeItem('hasLaunched')

    //LOAD FONTS
    let [fontsLoaded] = useFonts({
        'custom-icons': require('./src/assets/fonts/icomoon.ttf'),
        Roboto_300Light,
        Roboto_400Regular,
        Roboto_400Regular_Italic,
        Roboto_500Medium,
        Roboto_700Bold,
        Roboto_900Black,
        NotoSerif_400Regular,
    });
 
    //SET STATE OF LOGIN/READINESS VARIABLES
    const [appIsReady, setAppIsReady] = useState(false)
    const [appIsAwaitingOTAUpdates,setAppIsAwaitingOTAUpdates] = useState(false)
    const [activeFlow,setActiveFlow] = useState(null) //chefs or guests
    const [userID,setUserID] = useState('')
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [userData,setUserData] = useState(null)

    //DIAGNOSTICS OF APP STATE
    console.log("APP: FONTS LOADED: "+fontsLoaded)
    console.log("APP: APP IS READY: "+appIsReady)
    console.log("APP: AWAITING OTA UPDATES: "+appIsAwaitingOTAUpdates)
    console.log("APP: USER ID: "+userID)
    console.log("APP: USER LOGGED IN: "+userLoggedIn)
    
    //SETUP GLOBALS TO BE USED WITH APP CONTEXT
    const appGlobals = {
        userID: userID,
        userData: userData,
        configKeys: configKeys,
        activeFlow: activeFlow,
        userLoggedIn,userLoggedIn,
        apiMode: 'api_live', //possible options: local, live, dev
        setActiveFlow,
        setUserLoggedIn,
        setUserID, //Pass any functions that contexts needs to edit
        setUserData //Pass any functions that contexts needs to edit
    }

    //KEEP SPLASHSCREEN UP WHILE APP LOADS
    const holdSplashScreen = async () => {
        try {
            await SplashScreen.preventAutoHideAsync();
        } catch (e) {
            //console.warn(e);
        }
    }

    //CHECK FOR OTA UPDATES
    const checkForUpdates = async () => {
        if(Platform.OS != 'web'){
            setAppIsAwaitingOTAUpdates(true)
            try {
                console.log("APP: Checking for updates")
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    const updated = await Updates.fetchUpdateAsync();
                    console.log("Updates found")
                    // ... notify user of update ...
                    await Updates.reloadAsync();
                }
                else{
                    console.log("APP: No Updates detected")
                }
            } catch (e) {
                //console.log(e)
            }
            setAppIsAwaitingOTAUpdates(false)
        }
    }

    //IMMEDIATE CHECK FOR CREDENTIALS
    useEffect(() => {
        console.log("++++++++++++++++ USE EFFECT IS RUNNING: FONTS LOADED ++++++++++++++++=")
        holdSplashScreen()
        checkForUpdates()

        //SETUP FUNCTION TO MANAGE GOOGLE AUTH STATE CHANGES
        const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
            if(currentUser) {
                const uid = currentUser.uid
                console.log("APP: Current User",uid)
                //Being inside useEffect, we have to create async function here and call it after
                async function getUserData(uid) {
                    const allUsersRef = firebase.firestore().collection('users');
                    const allUser = await allUsersRef.doc(uid).get();
                    if (allUser.exists) {
                        let allUserData = allUser.data()
                        let userType = allUserData.user_type
                        const usersRef = firebase.firestore().collection(userType);
                        const user = await usersRef.doc(uid).get();
                        if (user.exists) {
                            console.log("APP: User exists from "+userType)
                            appGlobals.setActiveFlow(userType)
                            appGlobals.setUserData(user.data())
                            if(Platform.OS != 'web'){
                                //Setup Sentry user vairables to track
                                //Sentry.Native.setUser({ uid: uid, username: user.data().name});
                            }
                        }
                    }
                }
                //Call Async function
                if(!userData) getUserData(uid)
                setUserID(uid)
                setUserLoggedIn(true)  
            } 
            else {
                console.log('********************************* NO CURRENT USER. USER LOGGEDIN FALSE')
                appGlobals.setUserID('')
                appGlobals.setUserData(null)
                setUserLoggedIn(false)
            }
            if(!appIsReady) setAppIsReady(true)
        });
        return () => unsubscribe(); 
    }, [fontsLoaded]);



    //LOAD CONTENT
    if(fontsLoaded && appIsReady){
        return(
            <AppContext.Provider value={appGlobals}> 
                <SafeAreaProvider>
                    <StatusBar animated={true} backgroundColor={Theme.PRIMARY_COLOR} barStyle='default' />
                    <Navigator userLoggedIn={userLoggedIn}/>
                </SafeAreaProvider>
            </AppContext.Provider>
        )
    }
    else{
        return (
            <AppLoading/>
        )
    }
}
