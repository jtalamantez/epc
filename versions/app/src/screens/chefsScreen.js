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
    const chefPageName = route.name
    
    const [refreshing, setRefreshing] = useState(false);
    const [hasChefs,setHasChefs] = useState(null)
    const [coordinates,setCoordinates] = useState(null)
    

    const [initialRegion,setInitialRegion] = useState({
        latitude: 41.8781, 
        longitude: -87.6298,
        latitudeDelta: 0.2022,
        longitudeDelta: 0.0721,
    })
    

    const getChefs = async (uid) => {
        const result = await fetch(getEndpoint(appsGlobalContext,'chefs')); //apiBase
        const json = await result.json()
        if(!json.error){
            setHasChefs(json)
            //Generate fake event coordinates
            let coors = []
            json.push(...json) //Double the array for testing purposes
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
            setHasChefs(null)
            console.log("No chefs found")
        }
        setRefreshing(false)
    }


    const renderChef = ( {item} ) => {
        return (<TouchableWithoutFeedback key={item.index} onPress={() => navigation.navigate('Chef Details', {details:item})}>
                <View style={styles.chef_cont}>
                    <View style={styles.chef_img}>
                        <Image source={{ uri: item.profile_img }} style={styles.profile_img} />
                    </View>
                    <View style={styles.chef_profile}>
                        <View style={styles.profile_top}>
                            <Text style={styles.name}>{item.name}</Text>
                            <Text style={styles.bio} numberOfLines={2}>{item.bio}</Text>
                        </View>
                        <View style={styles.profile_bottom}>
                            {/*
                            <View style={styles.reviews_and_rating}>
                                <FontAwesome name="star" size={12} color={Theme.SECONDARY_COLOR} />
                                <Text style={styles.rating}>4.8</Text>
                                <Text style={styles.reviews}>(120)</Text>
                            </View>
                            */}
                            <Text style={styles.cuisines} numberOfLines={1}>{(item.cuisines) ? Object.values(item.cuisines).join(",") : ''}</Text>
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
        getChefs(chefPageName)
        setRefreshing(false)
    }


    useEffect(() => {
        getChefs(chefPageName)
    }, [1])

    /*************************************************************/
    // RUN FOCUS EFFECT TO CHECK VARIOUS STATES ON LOAD
    /*************************************************************/
    useFocusEffect(
        React.useCallback(() => {
            getChefs(chefPageName)
            console.log("Chef screen is focused:"+chefPageName)
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
                {hasChefs
                ? chefPageName == 'Chefs'
                    ? <>
                        <View style={{flex:1,width:'100%'}}>
                            <FlatList
                                data={hasChefs}
                                renderItem={renderChef}
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
                            {coordinates && hasChefs.map((marker, index) => {
                                return(<Marker
                                    key={index}
                                    coordinate={coordinates[index]}
                                    title={marker.title}
                                />)
                                
                            })}
                        </MapView>
                        <ScrollView style={styles.places} horizontal={true}>
                            {coordinates && hasChefs.map((item, index) => (
                                 <TouchableWithoutFeedback
                                    key={index}
                                    onPress={() => goToMarker(coordinates[index]) }
                                    onLongPress={() => navigation.navigate('Chef Details', {details:item})}
                                >
                                <View style={styles.scroller}>
                                    <Image source={{ uri: item.profile_img }} style={styles.scroller_img} />
                                    <View style={styles.scroller_content}>
                                        <View style={styles.upper_content}>
                                            <View>
                                                <Text style={styles.scroller_title}>{item.name}</Text>
                                            </View>
                                        </View>
                                        <View style={styles.lower_content}>
                                            <Text style={styles.cuisines} numberOfLines={1}>{(item.cuisines) ? Object.values(item.cuisines).join(",") : ''}</Text>
                                            <View style={styles.reviews_and_rating}>
                                                {/*
                                                <FontAwesome name="star" size={12} color={Theme.SECONDARY_COLOR} />
                                                <Text style={styles.rating}>{(item.chef_rating) ? item.chef_rating : '4.8'}</Text>
                                                <Text style={styles.reviews}>(120)</Text>
                                                */}
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
                <Text style={globalStyles.empty_text}>There are no chefs found</Text>
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
          height:150,
          bottom:0,
          flexDirection: 'row'
      },
      place:{
          backgroundColor: 'pink',
          padding:5,
          margin:5
      },
      scroller:{
          width:180,
          margin:3,
          backgroundColor: 'white'
      },
      scroller_img:{
        resizeMode: 'cover',
        width:'100%',
        height:80,
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


    chef_cont: {
        width:'100%',
        flexDirection:'row',
        textAlign: 'left',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        alignContent: 'flex-start',
        backgroundColor: Theme.SURFACE_COLOR,
        marginVertical: 5,
        borderRadius: 10,
        borderWidth:1,
        borderColor: Theme.BORDER_COLOR,
        shadowColor: Theme.FAINT,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: .4,
        shadowRadius: 3,
        elevation: 3,
    },
    profile_img:{
        textAlign: 'left',
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        width:160,
        height:140,
        overflow: 'hidden',
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        resizeMode: 'cover'
    },
    chef_profile: {
        flex:1,
        flexDirection: 'column',
        alignContent: 'space-between',
        justifyContent:'space-evenly',
        padding:10
    },
    profile_top:{
        flex:1
    },
    profile_bottom: {
    },
    name:{
        fontWeight: 'bold',
        color: Theme.TEXT_ON_SURFACE_COLOR,
        fontSize: 13,
    },
    bio:{
        fontWeight: 'normal',
        color: Theme.TEXT_ON_SURFACE_COLOR_LIGHT,
        fontSize: 11,
        paddingBottom:15
    },
    cuisines:{
        fontWeight: 'normal',
        color: Theme.TEXT_ON_SURFACE_COLOR_LIGHT,
        fontSize: 12,
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
