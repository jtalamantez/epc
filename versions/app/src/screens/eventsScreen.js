/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

//OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'
import { useFocusEffect } from '@react-navigation/native';
import _ from 'underscore'
import MapView, { Marker } from 'react-native-maps';

// COMPONENTS
import { Text, StyleSheet, View, Image, Dimensions, FlatList, TouchableWithoutFeedback, RefreshControl, Alert, ScrollView } from 'react-native'
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


export default function EventsScreen({navigation,route}) {
    
    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID
    const eventPageName = route.name
    
    const [refreshing, setRefreshing] = useState(false);
    const [hasEvents,setHasEvents] = useState(null)
    const [coordinates,setCoordinates] = useState(null)
    

    const [initialRegion,setInitialRegion] = useState({
        latitude: 41.8781, 
        longitude: -87.6298,
        latitudeDelta: 0.2022,
        longitudeDelta: 0.0721,
    })
    
    
    const getEvents = async (eventPageName) => {
        console.log("Getting events: "+eventPageName)
        const result = await fetch(getEndpoint(appsGlobalContext,'events')); //apiBase
        const json = await result.json()
        if(!json.error){
            //console.log(json)
            setHasEvents(json)
            //Generate fake event coordinates
            let coors = []
            json.map((marker, index) => {
                let coordinate = {
                    latitude: (41.8+ (Math.random()*.1)),
                    longitude: (-87.71 + (Math.random()*.1)),
                }
                coors.push(coordinate)
            })
            setCoordinates(coors)
        }
        else{
            setHasEvents(null)
            console.log("No event found")
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
                        {eventPageName == 'Events'
                        ? <Text style={styles.date_time}>{item.event_date} | {item.start_time}-{item.end_time}</Text>
                        : <Text style={styles.date_time}>{item.readable_date}</Text>
                        }
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
            console.log("Event screen is focused:"+eventPageName)
        }, [1])
    )


    const mapRef = useRef(null);

    const goToMarker = (latlng) => {
        console.log(latlng)
        mapRef.current.animateToRegion(latlng, 300);

    }

    const onRegionChange = (region) => {
        //console.log(region)
    }

    const markers = [
        {
            title: 'Car Wash',
            description: 'They do good',
            latlng:{
                latitude: 37.78825,
                longitude: -122.4324,
            }
        },
        {
            title: 'Car Wash 2',
            description: 'They do good',
            latlng:{
                latitude: 37.78835,
                longitude: -122.4334,
            }
        },
    ]

    return (
            <View style={[globalStyles.page,{padding:0}]}>
                {hasEvents
                ? eventPageName == 'Events'
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
                    : <View style={styles.container}>
                        <MapView 
                            ref={mapRef} //assign our ref to this MapView
                            initialRegion={initialRegion}
                            onRegionChange={onRegionChange}
                            style={styles.map} 
                        >
                            {coordinates && hasEvents.map((marker, index) => {
                                return(<Marker
                                    key={index}
                                    coordinate={coordinates[index]}
                                    title={marker.title}
                                />)
                                
                            })}
                        </MapView>
                        <ScrollView style={styles.places} horizontal={true}>
                            {coordinates && hasEvents.map((item, index) => (
                                 <TouchableWithoutFeedback
                                    key={index}
                                    onPress={() => goToMarker(coordinates[index]) }
                                    onLongPress={() => navigation.navigate('Event Details', {details:item})}
                                >
                                <View style={styles.scroller}>
                                    <Image source={require('../assets/food_pasta.png')} style={styles.scroller_img} />
                                    <View style={styles.scroller_content}>
                                        <View style={styles.upper_content}>
                                            <View>
                                                <Text style={styles.scroller_title}>{item.title}</Text>
                                                <Text style={styles.scroller_date_time}>{item.event_date}</Text>
                                                <Text style={styles.scroller_date_time}>{item.start_time}-{item.end_time}</Text>
                                            </View>
                                            <View>
                                                <Text style={styles.scroller_price}>${item.cpp}</Text>
                                                <Text style={styles.scroller_price_label}>Per Person</Text>
                                            </View>
                                        </View>
                                        <View style={styles.lower_content}>
                                            <Text style={styles.scroller_name}>{(item.chef_name) ? item.chef_name : 'Chef Name'}</Text>
                                            <View style={styles.reviews_and_rating}>
                                                <FontAwesome name="star" size={12} color={Theme.SECONDARY_COLOR} />
                                                <Text style={styles.rating}>{(item.chef_rating) ? item.chef_rating : '4.8'}</Text>
                                                <Text style={styles.reviews}>(120)</Text>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                                </TouchableWithoutFeedback>
                            ))}
                        </ScrollView>
                    </View>
                : <View style={globalStyles.empty_state}>
                <Image style={globalStyles.empty_image} source={require('../assets/empty_calendar.png')} />
                <Text style={globalStyles.empty_text}>There are no posted events yet</Text>
            </View>
                }
            </View>
    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
      },
      map: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
      },
      places:{
          position: 'absolute',
          width: '100%',
          height:220,
          bottom:0,
          flexDirection: 'row'
      },
      place:{
          backgroundColor: 'pink',
          padding:5,
          margin:5
      },
      scroller:{
          width:270,
          margin:3,
          backgroundColor: 'white'
      },
      scroller_img:{
        resizeMode: 'cover',
        width:'100%',
        height:120,
        margin:0,
        padding:0,
        backgroundColor: 'yellow'
      },
      scroller_content:{
          flex:1,
          paddingVertical:5,
          paddingHorizontal:8,
          justifyContent: 'space-between'
      },
      upper_content:{
        flexDirection: 'row',
        justifyContent: 'space-between'
      },
      lower_content:{
          flexDirection: 'row',
          justifyContent: 'space-between'
      },

    scroller_title:{
        fontWeight: 'bold',
        color: Theme.PRIMARY_COLOR,
        fontSize: 18,
    },
    scroller_date_time:{
        color: Theme.FAINT,
        fontSize: 13,
    },
    scroller_price: {
        fontSize: 17,
        color: Theme.PRIMARY_COLOR,
        fontWeight: 'normal',
        textAlign: 'right'
    },
    scroller_price_label: {
        fontSize: 10,
        color: Theme.PRIMARY_COLOR,
        textAlign: 'center'
    },
    scroller_name:{
        fontWeight: 'bold',
        color: Theme.TEXT_ON_SURFACE_COLOR,
        fontSize: 14,
    },





      
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
