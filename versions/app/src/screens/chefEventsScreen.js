/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

//OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'
import { useFocusEffect } from '@react-navigation/native';

// COMPONENTS
import { Text, StyleSheet, View, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import AppContext from '../components/AppContext'
import {CustomButton} from '../components/Button'
import EventListing from '../components/EventListing'
import {getEndpoint} from '../helpers/helpers'


// STYLES
import { globalStyles, modal, footer, forms } from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { FontAwesome, FontAwesome5, Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons'


/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function ChefEventScreen({navigation, route}) {

    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID

    const eventPageName = route.name
    const [refreshing, setRefreshing] = useState(false);
    const [eventTemplates,setEventTemplates] = useState(null)


    const getEvents = async (eventPageName) => {
        try{
            if(eventPageName == 'Templates'){
                console.log("Checking for templates")
                //CHANGE TO EVENT TEMPLATES
                const result = await fetch(getEndpoint(appsGlobalContext,'event_templates')); //apiBase
                const json = await result.json()
                console.log("a",json)
                setEventTemplates(json)
            }
            else if(eventPageName == 'Your Events'){
                console.log("your events",uid)
                //Your Events show what a guest has signed up 
                const result = await fetch(getEndpoint(appsGlobalContext,'events/'+uid)); //apiBase
                const json = await result.json()
                console.log("b",json.transactions)
                if(!json.error){ //&& _.has(json,'transactions') <- removed 1/10 not sure why we needed it
                    //console.log(json)
                    setEventTemplates(json.transactions ? json.transactions : json)
                }
                else{
                    setEventTemplates(null)
                    console.log("No events found for you")
                }
                setRefreshing(false)
            }
        }
        catch(error){
            console.log(error);
        }       
    }

    const onRefresh = () => {
        getEvents(eventPageName)
        setRefreshing(false)
    }


    useEffect(() => {
        getEvents(eventPageName)
    }, [1])

    /*************************************************************/
    // RUN FOCUS EFFECT TO CHECK VARIOUS STATES ON LOAD
    /*************************************************************/
    useFocusEffect(
        React.useCallback(() => {
            getEvents(eventPageName)
            console.log("Chef Event screen is focused")
        }, [1])
    )

    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={[globalStyles.page,{padding:0}]}>
                {eventTemplates
                ? <EventListing eventTemplates={eventTemplates}  pageName={eventPageName} navigation={navigation} key={eventPageName}/>
                : <View style={globalStyles.empty_state}>
                    <Image style={globalStyles.empty_image} source={require('../assets/empty_calendar.png')} />
                    <Text style={globalStyles.empty_text}>You dont' have any events yet</Text>
                </View>
                }
                {eventPageName == 'Your Events' && 
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Create Event')}
                        style={{
                        position: 'absolute',
                        right: 15,
                        bottom: 15,
                        width: 50,
                        height: 50,
                        borderRadius: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Theme.SECONDARY_COLOR,
                        }}
                    >
                        <MaterialIcons name='add' size={25} color={Theme.WHITE} />
                    </TouchableOpacity>
                }

            </View>
        </SafeAreaView>
    )

    

}

const styles = StyleSheet.create({
    no_menu:{
        flex:1,
        width:'100%',
        height:'100%',
        justifyContent: 'center', 
        alignItems: 'center',
    },
})
