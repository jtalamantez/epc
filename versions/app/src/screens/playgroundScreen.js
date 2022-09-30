/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useEffect, useRef, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// OTHER DEPENDENCIES
import _ from 'underscore'
import { firebase, configKeys } from '../config/config'
import * as Updates from 'expo-updates';
import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';

// COMPONENTS
import { Image, Text, TextInput, StyleSheet,  TouchableWithoutFeedback, View, ScrollView,  TouchableOpacity, Alert, Modal } from 'react-native'
import {CustomButton} from '../components/Button';
import AppContext from '../components/AppContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {getEndpoint} from '../helpers/helpers'


// STYLES
import {globalStyles, forms, flatlist} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { MaterialIcons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function PlaygroundScreen({navigation}) {

    const appsGlobalContext = useContext(AppContext);
    const [apiEndpointResult, setTestEndpointResult] = useState('')

    
    const logout = async () => {
        try {
            const signout = await firebase.auth().signOut();
        } catch (error) {
            alert("Signout error "+error);
        }
    }

    const checkForUpdates = async () => {
        try {
            const update = await Updates.checkForUpdateAsync();
            console.log(update);
            const uid = "UIC" //await AsyncStorage.getItem('uid');
            if (update.isAvailable) {
                //alert("Updates Found Nex");
                const updated = await Updates.fetchUpdateAsync();
                console.log(updated);
                // ... notify user of update ...
                await Updates.reloadAsync();
            }
        } catch (e) {
            //alert("Sync update errors")
            console.log(e)
        }
    }

    const clearLocalStorage = async () => {
        await AsyncStorage.clear()
        logout()
    }


    const testApiEndpoint = async (values) => {
        try{
            const result = await fetch(getEndpoint(appsGlobalContext,'hello')); //apiBase
            //Added stringify to avoid error "log messages development error"
            console.log("POST RESPONSE: "+JSON.stringify(result));
            const text = await result.text()
            setTestEndpointResult(text)
        }
        catch(error){
            console.log(error);
            setTestEndpointResult(JSON.stringify(error))
        }
    }    

    
    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={[globalStyles.page,{paddingVertical:70, justifyContent: 'space-evenly'}]}>
                <ScrollView>
                    <Text style={globalStyles.dev_text}>Nothing to see here. This is for development diagnostics only - not intended for production.</Text>
                    <Text>API BASE: {appsGlobalContext.apiBase}</Text>
                    <CustomButton text='Test API Endpoint' onPress={() => testApiEndpoint()}/>
                    <Text>{apiEndpointResult}</Text>
                    <CustomButton text='Clear Local Storage' onPress={() => clearLocalStorage()}/>
                    <CustomButton text='Logout' onPress={() => logout()}/>        
                    <CustomButton text='Check For Updates' onPress={() => checkForUpdates()}/>
                    <Text>App Version: {Constants.nativeAppVersion}</Text>
                    <Text>Build Version: {Constants.nativeBuildVersion}</Text>
                    <Text>Update Channel: {Updates.releaseChannel}</Text>
                </ScrollView>
            </View>
        </SafeAreaView>
    ); 
}



const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(5, 15, 44, 0.9)'
    },
    modalView: {
        margin: 20,
        backgroundColor: "white",
        justifyContent: "space-between",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
        width: '90%',
        height: '80%'
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center"
    },
});