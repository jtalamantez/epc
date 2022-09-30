/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

//OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'
import { useFocusEffect } from '@react-navigation/native';
import _ from 'underscore'

// COMPONENTS
import { Text, StyleSheet, View, Image, TouchableOpacity, FlatList, TouchableWithoutFeedback, RefreshControl, Alert } from 'react-native'
import AppContext from '../components/AppContext';
import {CustomButton} from '../components/Button'
import MenuListing from '../components/MenuListing'
import {getEndpoint} from '../helpers/helpers'


// STYLES
import {globalStyles, TouchableHighlight, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import {FontAwesome, MaterialIcons, Octicons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function ChefEventsScreen({navigation,route}) {
    
    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID
    const [refreshing, setRefreshing] = useState(false);
    const [hasEvents,setHasEvents] = useState(null)
    
    
    const getEvents = async () => {
        //Your Events show what a guest has signed up 
        const result = await fetch(getEndpoint(appsGlobalContext,'events/'+uid)); //apiBase
        const json = await result.json()
        console.log(json.transactions)
        if(!json.error){ //&& _.has(json,'transactions') <- removed 1/10 not sure why we needed it
            //console.log(json)
            setHasEvents(json.transactions ? json.transactions : json)
        }
        else{
            setHasEvents(null)
            console.log("No events found for you")
        }
        setRefreshing(false)
    }

    const renderEvent = ( {item} ) => {
        console.log(item)
        return (
            <TouchableWithoutFeedback key={item.index} onPress={() => navigation.navigate('Event Details', {details:item})}>
                <View style={styles.navigate_away}>
                    <Image source={require('../assets/food_pasta.png')} style={styles.image} />
                    <View style={styles.navigate_away_content}>
                        <Text style={styles.date_time}>{item.readable_date}</Text>
                        <Text style={styles.title}>{item.title}</Text>
                    </View>
                    <View style={styles.chef_and_price}>
                        <View>
                            <Text style={styles.name}>{(item.chef_name) ? item.chef_name : 'Chef Name'}</Text>
                            <View style={styles.reviews_and_rating}>
                                <FontAwesome name="star" size={12} color={Theme.SECONDARY_COLOR} />
                                <Text style={styles.rating}>{(item.chef_rating) ? item.chef_rating : '4.8'}</Text>
                                <Text style={styles.reviews}>(120)</Text>
                            </View>
                        </View>
                        <View style={styles.price_cont}>
                            <Text style={styles.price}>${item.cpp}</Text>
                            <Text style={styles.price_label}>Per Person</Text>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        )
    }


    const openFilters = () => {
        Alert.alert("Opening Filters")
    }

    const onRefresh = () => {
        getEvents()
        setRefreshing(false)
    }


    useEffect(() => {
        getEvents()
    }, [1])

    /*************************************************************/
    // RUN FOCUS EFFECT TO CHECK VARIOUS STATES ON LOAD
    /*************************************************************/
    useFocusEffect(
        React.useCallback(() => {
            getEvents()
            console.log("Event screen is focused")
        }, [1])
    )

    return (
            <View style={[globalStyles.page,{padding:0}]}>
                {hasEvents
                ? <>
                    <View style={{flex:1,width:'100%'}}>
                        <FlatList
                            data={hasEvents}
                            renderItem={renderEvent}
                            keyExtractor={event => event.id}
                            refreshControl={
                                <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                />
                            }
                            />
                    </View>
                    {/*
                    <TouchableOpacity style={styles.filter_bar} onPress={() => openFilters()}>
                        <Text style={styles.filter_text}>Filters</Text>
                        <Octicons name="settings" size={16} color={Theme.TEXT_ON_PRIMARY_COLOR} />
                    </TouchableOpacity>
                    */}
                </>
                : <View style={globalStyles.empty_state}>
                    <Image style={globalStyles.empty_image} source={require('../assets/empty_calendar.png')} />
                    <Text style={globalStyles.empty_text}>You dont' have any events yet</Text>
                </View>
                }
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
            </View>
    )
}

const styles = StyleSheet.create({
    navigate_away: {
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        padding: 15,
        paddingHorizontal: 15,
        borderWidth:1,
        borderColor: Theme.BORDER_COLOR,
        marginBottom:10
    },
    navigate_away_content:{
        flex:1,
        paddingTop:8
    },
    image:{
        width:'100%',
        height:200
    },
    title:{
        fontWeight: 'bold',
        color: Theme.PRIMARY_COLOR,
        fontSize: 17,
    },
    name:{
        fontWeight: 'bold',
        color: Theme.TEXT_ON_SURFACE_COLOR,
        fontSize: 13,
        paddingBottom:4
    },
    date_time:{
        color: Theme.FAINT,
        fontSize: 12,
    },
    chef_and_price: {
        flex:1,
        width:'100%',
        paddingTop: 30,
        textAlign: 'left',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    price_cont: {
        //alignContent: 'flex-end'
    },
    price: {
        fontSize: 20,
        color: Theme.PRIMARY_COLOR,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    price_label: {
        fontSize: 14,
        color: Theme.PRIMARY_COLOR,
        textAlign: 'center'
    },
    reviews_and_rating:{
        flexDirection: 'row',
        alignItems: 'center',
        paddingBottom:2
    },
    rating:{
        paddingHorizontal: 4,
        fontWeight: 'bold',
        color: Theme.TEXT_ON_SURFACE_COLOR_LIGHT,
        fontSize: 12,
    },
    reviews:{
        fontWeight: 'normal',
        color: Theme.FAINT,
        fontSize: 12,
    },
    filter_bar: {
        position: 'absolute',
        bottom:0,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Theme.TEXT_ON_SURFACE_COLOR,
        paddingVertical:6,
        paddingHorizontal:12,
        marginBottom:5,
        borderRadius:10
    },
    filter_text:{
        fontSize: 12,
        paddingRight:10,
        color: Theme.TEXT_ON_PRIMARY_COLOR
    }
})
