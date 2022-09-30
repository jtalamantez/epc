/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

//OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'

// COMPONENTS
import { Text, StyleSheet, View, Image, TouchableOpacity, FlatList, TouchableWithoutFeedback, RefreshControl } from 'react-native'
import AppContext from '../components/AppContext';
import {CustomButton} from '../components/Button'
import MenuListing from '../components/MenuListing'
import {getEndpoint} from '../helpers/helpers'


// STYLES
import {globalStyles, TouchableHighlight, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import {AntDesign, MaterialIcons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function MessageScreen({navigation}) {
    
    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID
    const activeFlow = appsGlobalContext.activeFlow
    
    const [refreshing, setRefreshing] = useState(false);
    const [hasMessages,setHasMessages] = useState(null)
    
    
    const getMessages = async (uid) => {
        let eventsEndpoint = (activeFlow == 'guests') ? 'events' : 'events/'+uid
        const result = await fetch(getEndpoint(appsGlobalContext,eventsEndpoint)); //apiBase
        const json = await result.json()
        if(!json.error){
            //console.log(json)
            setHasMessages(json)
        }
        else{
            setHasEvents(null)
            console.log("No event found")
        }
        setRefreshing(false)
    }


    const onRefresh = () => {
        //getMessages(uid)
        //setRefreshing(false)
    }

    const renderMessage = ( {item} ) => {
        return (<TouchableWithoutFeedback key={item.index} onPress={() => navigation.navigate('Message Details', {details:item})}>
                <View style={styles.navigate_away}>
                    <View style={styles.navigate_away_content}>
                        <Text style={styles.date_time}>{item.event_date} | {item.start_time}-{item.end_time}</Text>
                        <Text style={styles.title}>{item.title}</Text>
                    </View>
                    <AntDesign name="right" size={20} color={Theme.FAINT} style={{paddingLeft:5}}/>
                </View>
            </TouchableWithoutFeedback>
        )
    }

    useEffect(() => {
        //getMessages(uid)
    }, [1])


    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={[globalStyles.page,{padding:0}]}>
                <View style={globalStyles.empty_state}>
                    <Image style={globalStyles.empty_image} source={require('../assets/empty_messages.png')} />
                    <Text style={globalStyles.empty_text}>You have not sent or {'\n'}received any messages yet</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    no_event:{
        flex:1,
        width:'100%',
        justifyContent: 'center', 
        alignItems: 'center'
    },
    empty_image: {
        width:'70%',
        height:'40%',
        margin: 0,
        padding: 0
    },
    navigate_away: {
        width: '100%',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        paddingHorizontal: 15,
        borderWidth:1,
        borderColor: Theme.BORDER_COLOR
    },
    navigate_away_content:{
        flex:1,
    },
    title:{
        fontWeight: 'bold',
        color: Theme.PRIMARY_COLOR,
        fontSize: 13,
    },
    date_time:{
        color: Theme.FAINT,
        fontSize: 12,
    }
})
