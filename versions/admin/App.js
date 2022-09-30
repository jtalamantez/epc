/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useEffect, useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context' 
import {Text, StatusBar, Platform} from 'react-native'

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


/*******************************************************************************/
//MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function App() {
    //LOAD FONTS
    let [fontsLoaded] = useFonts({
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
    const [userID,setUserID] = useState('')
    const [userLoggedIn, setUserLoggedIn] = useState(false)
    const [userData,setUserData] = useState(null)

    //DIAGNOSTICS OF APP STATE
    console.log("FONTS LOADED: "+fontsLoaded)
    console.log("APP IS READY: "+appIsReady)
    console.log("AWAITING OTA UPDATES: "+appIsAwaitingOTAUpdates)
    console.log("USER ID: "+userID)
    console.log("USER LOGGED IN: "+userLoggedIn)
    
    //SETUP GLOBALS TO BE USED WITH APP CONTEXT
    const appGlobals = {
        userID: userID,
        userData: userData,
        configKeys: configKeys,
        apiMode: 'api_live', //possible options: local, live, dev
        setUserID //Pass any functions that contexts needs to edit
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
                console.log("Checking for updates")
                const update = await Updates.checkForUpdateAsync();
                if (update.isAvailable) {
                    const updated = await Updates.fetchUpdateAsync();
                    console.log("Updates found")
                    // ... notify user of update ...
                    await Updates.reloadAsync();
                }
                else{
                    console.log("No Updates detected")
                }
            } catch (e) {
                //console.log(e)
            }
            setAppIsAwaitingOTAUpdates(false)
        }
    }

    //IMMEDIATE CHECK FOR CREDENTIALS
    useEffect(() => {
        holdSplashScreen()
        checkForUpdates()
        //SETUP FUNCTION TO MANAGE GOOGLE AUTH STATE CHANGES
        const unsubscribe = firebase.auth().onAuthStateChanged((currentUser) => {
            if(currentUser) {
                const uid = currentUser.uid
                console.log("cyrrent user",uid)
                //Being inside useEffect, we have to create async function here and call it after
                async function getUserData(uid) {
                    const usersRef = firebase.firestore().collection('users');
                    const user = await usersRef.doc(uid).get();
                    if (user.exists) {
                        setUserData(user.data())
                        if(Platform.OS != 'web'){
                            //Setup Sentry user vairables to track
                            //Sentry.Native.setUser({ uid: uid, username: user.data().name});
                        }
                    }
                }
                //Call Async function
                if(!userData) getUserData(uid)
                setUserID(uid)
                setUserLoggedIn(true)  
            } 
            else {
                setUserLoggedIn(false)
            }
            if(!appIsReady) setAppIsReady(true)
        });
        return () => unsubscribe(); 
    }, []);



    //LOAD CONTENT
    if(fontsLoaded){
        console.log("APP GLOBALS",appGlobals)
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
