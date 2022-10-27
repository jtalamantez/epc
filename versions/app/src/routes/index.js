/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useContext } from 'react'
import {Image, StatusBar, Platform, StyleSheet} from 'react-native'


// OTHER DEPENDENCIES
import _ from 'underscore'
import { firebase, configKeys } from '../config/config'
//import Icon from 'react-native-vector-icons/FontAwesome';
import { createIconSetFromIcoMoon } from 'react-native-vector-icons';
import iconConfig from '../assets/fonts/selection.json';
const Icon = createIconSetFromIcoMoon(iconConfig,'custom-icons');

//COMPONENTS
import SupportIcon from '../components/SupportIcon'
import AppContext from '../components/AppContext';



//THEMES AND FONTS SETUP
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons'
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
//REACT NAVIGATION DEPENDENCIES
/*******************************************************************************/
import { NavigationContainer, getFocusedRouteNameFromRoute} from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

/*******************************************************************************/
//ESTABLISH STACK VARIABLES
/*******************************************************************************/
const RootStack = createStackNavigator();
const AuthorizedStackNav = createMaterialTopTabNavigator(); //This can be drawers, stacks, tabs, etc.
const UnAuthorizedStackNav = createStackNavigator(); //This can be drawers, stacks, tabs, etc.

/*******************************************************************************/
//LIST OF SCREENS 
/*******************************************************************************/
/*** AUTHORIZED ****/
import HomeScreen from '../screens/homeScreen'
import EventsScreen from '../screens/eventsScreen'
import CreateEventScreen from '../screens/createEventScreen'
import EventDetailScreen from '../screens/eventDetailScreen'
import MenuScreen from '../screens/menuScreen'
import CreateMenuScreen from '../screens/createMenuScreen'
import MenuDetailScreen from '../screens/menuDetailScreen'
import ChefsScreen from '../screens/chefsScreen'
import ChefDetailScreen from '../screens/chefDetailScreen'
import ChefEventsScreen from '../screens/chefEventsScreen'
import ReservationsScreen from '../screens/reservationsScreen'
import AccountScreen from '../screens/accountScreen'
import ProfileScreen from '../screens/profileScreen'
import MessageScreen from '../screens/messageScreen'
import ReferScreen from '../screens/referScreen'
import PaymentsScreen from '../screens/paymentsScreen'

import WaiverScreen from '../screens/waiverScreen'
import BackgroundCheckScreen from '../screens/backgroundCheckScreen'
import ResumeScreen from '../screens/resumeScreen'
import FoodHandlerScreen from '../screens/foodHandlerScreen'
import LicenseScreen from '../screens/licenseScreen'
import SanitationScreen from '../screens/sanitationScreen'
import LiabilityScreen from '../screens/liabilityScreen'
import ContactScreen from '../screens/contactScreen'
import FaqScreen from '../screens/faqScreen'
import PlaygroundScreen from '../screens/playgroundScreen'


/*** UNAUTHORIZED ****/
import WelcomeScreen from '../screens/welcomeScreen'
import RegistrationScreen from '../screens/registrationScreen'
import LoginScreen from '../screens/loginScreen'
import PasswordScreen from '../screens/passwordScreen'
import TermsScreen from '../screens/termsScreen'


/*******************************************************************************/
//ADDITIONAL STACKS OF SCREENS 
/*******************************************************************************/

const AccountScreenStackNav = createStackNavigator(); 
const AccountScreenStack = () => {
    return (
        <AccountScreenStackNav.Navigator screenOptions={{
            headerShown:true,
            headerTruncatedBackTitle: true,
            headerBackTitleVisible: false,
        }}>
            <AccountScreenStackNav.Screen name="Account" component={AccountScreen} />
            <AccountScreenStackNav.Screen name="Profile" component={ProfileScreen} />
            <AccountScreenStackNav.Screen name="Refer" component={ReferScreen} />
            <AccountScreenStackNav.Screen name="Terms" component={TermsScreen} />
            <AccountScreenStackNav.Screen name="Payments" component={PaymentsScreen} />



            <AccountScreenStackNav.Screen name="Waiver of Liability" component={WaiverScreen} />
            <AccountScreenStackNav.Screen name="Background Check" component={BackgroundCheckScreen} /> 
            <AccountScreenStackNav.Screen name="Professional Resume" component={ResumeScreen} /> 
            <AccountScreenStackNav.Screen name="Food Handler's License" component={FoodHandlerScreen} /> 



            <AccountScreenStackNav.Screen name="Professional Licenses" component={LicenseScreen} />
            <AccountScreenStackNav.Screen name="Sanitation Manager License" component={SanitationScreen} />
            <AccountScreenStackNav.Screen name="Liability Insurance" component={LiabilityScreen} />



            <AccountScreenStackNav.Screen name="Contact" component={ContactScreen}  options={{ headerShown: true }}/>
            <AccountScreenStackNav.Screen name="FAQ" component={FaqScreen}  options={{ headerShown: true }}/>


            <AccountScreenStackNav.Screen name="Playground" component={PlaygroundScreen}/>
        </AccountScreenStackNav.Navigator>       
    )
}



const EventsStackForChefsTabNav = createMaterialTopTabNavigator(); //This can be drawers, stacks, tabs, etc.
const EventsStackForChefsTab = () => {
    return (
        <EventsStackForChefsTabNav.Navigator
            headerTintColor = "red"
            tabBarOptions={{
                showIcon: true,
                activeTintColor: Theme.TEXT_ON_SURFACE_COLOR,
                inactiveTintColor: Theme.TEXT_ON_SURFACE_COLOR_LIGHT,
                labelStyle: { 
                    fontSize: 10
                },
                iconStyle: {
                    color: 'pink'
                },
                indicatorStyle: {
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: Theme.SECONDARY_COLOR,
                },
                style:{
                    backgroundColor:Theme.SURFACE_COLOR,
                }
            }}
        >
            <EventsStackForChefsTabNav.Screen name="Your Events" component={ChefEventsScreen}/>
            <EventsStackForChefsTabNav.Screen name="Templates" component={ChefEventsScreen}/>
        </EventsStackForChefsTabNav.Navigator>       
    )
}


const MenusStackTabNav = createMaterialTopTabNavigator(); //This can be drawers, stacks, tabs, etc.
const MenusStackTab = () => {
    return (
        <MenusStackTabNav.Navigator
            headerTintColor = "red"
            tabBarOptions={{
                showIcon: true,
                activeTintColor: Theme.TEXT_ON_SURFACE_COLOR,
                inactiveTintColor: Theme.TEXT_ON_SURFACE_COLOR_LIGHT,
                labelStyle: { 
                    fontSize: 10
                },
                iconStyle: {
                    color: 'pink'
                },
                indicatorStyle: {
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: Theme.SECONDARY_COLOR,
                },
                style:{
                    backgroundColor:Theme.SURFACE_COLOR,
                }
            }}
        >
            <MenusStackTabNav.Screen name="Your Menus" component={MenuScreen}/>
            <MenusStackTabNav.Screen name="Templates" component={MenuScreen}/>
        </MenusStackTabNav.Navigator>       
    )
}



const ChecfStackNav = createMaterialTopTabNavigator(); //This can be drawers, stacks, tabs, etc.
const ChefStack = () => {
    const appsGlobalContext = useContext(AppContext);
    return (
        <ChecfStackNav.Navigator
            headerTintColor = "red"
            tabBarOptions={{
                showIcon: true,
                activeTintColor: Theme.TEXT_ON_SURFACE_COLOR,
                inactiveTintColor: Theme.TEXT_ON_SURFACE_COLOR_LIGHT,
                labelStyle: { 
                    fontSize: 10
                },
                iconStyle: {
                    color: 'pink'
                },
                indicatorStyle: {
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: Theme.SECONDARY_COLOR,
                },
                style:{
                    backgroundColor:Theme.SURFACE_COLOR,
                }
            }}
        >
            <ChecfStackNav.Screen name="Chefs" component={ChefsScreen} />
            <ChecfStackNav.Screen name="Chef Map View" component={ChefsScreen} />

        </ChecfStackNav.Navigator>       
    )
}


const EventsStackNav = createMaterialTopTabNavigator(); //This can be drawers, stacks, tabs, etc.
const EventsStack = () => {
    const appsGlobalContext = useContext(AppContext);
    return (
        <EventsStackNav.Navigator
            headerTintColor = "red"
            tabBarOptions={{
                showIcon: true,
                activeTintColor: Theme.TEXT_ON_SURFACE_COLOR,
                inactiveTintColor: Theme.TEXT_ON_SURFACE_COLOR_LIGHT,
                labelStyle: { 
                    fontSize: 10
                },
                iconStyle: {
                    color: 'pink'
                },
                indicatorStyle: {
                    position: 'absolute',
                    bottom: 0,
                    backgroundColor: Theme.SECONDARY_COLOR,
                },
                style:{
                    backgroundColor:Theme.SURFACE_COLOR,
                }
            }}
        >
            <EventsStackNav.Screen name="Events" component={EventsScreen} />
            <EventsStackNav.Screen name="Map View" component={EventsScreen} />

        </EventsStackNav.Navigator>       
    )
}


/*******************************************************************************/
//CREATE STACKS
/*******************************************************************************/
const UnAuthorizedStack = () => {
    return (
        <UnAuthorizedStackNav.Navigator>
            <UnAuthorizedStackNav.Screen name="Welcome" component={WelcomeScreen}  options={{ headerShown: false }}/>
            <UnAuthorizedStackNav.Screen name="Login" component={LoginScreen}  options={{ headerShown: false }}/>
            <UnAuthorizedStackNav.Screen name="Register" component={RegistrationScreen}  options={{ headerShown: false }}/>
            <UnAuthorizedStackNav.Screen name="Password" component={PasswordScreen} />
            <UnAuthorizedStackNav.Screen name="Terms" component={TermsScreen} />
        </UnAuthorizedStackNav.Navigator>       
    )
}

const AuthorizedStack = () => {
    const appsGlobalContext = useContext(AppContext);
    return (
        <AuthorizedStackNav.Navigator
            initialRouteName = "Home"
            tabBarPosition = "bottom"
            //initialLayout = {{ width: windowWidth }}
            headerTintColor = "red"
            tabBarOptions={{
                showIcon: true,
                activeTintColor: Theme.SECONDARY_COLOR,
                inactiveTintColor: Theme.TEXT_ON_PRIMARY_COLOR,
                labelStyle: { 
                    fontSize: 8
                },
                iconStyle: {
                    color: 'pink'
                },
                indicatorStyle: {
                    position: 'absolute',
                    top: 0,
                    backgroundColor: Theme.SECONDARY_COLOR,
                },
                style:{
                    paddingVertical: 10,
                    backgroundColor:Theme.PRIMARY_COLOR,
                }
            }}
        >
            {appsGlobalContext.activeFlow == 'chefs'
            ? <>
                <AuthorizedStackNav.Screen name="Dashboard" component={HomeScreen}  options={({route, navigation}) => ({
                    tabBarIcon:({color, focused})=>(  
                        <Icon name="dashboard" size={20} color={focused ? color : Theme.WHITE} style={styles.tabBarIcon}/>
                    )                   
                })} />
                <AuthorizedStackNav.Screen name="Menu" component={MenusStackTab}
                    options={({route, navigation}) => ({
                        //headerShown: false
                        tabBarIcon:({color, focused})=>(  
                            <Image style={styles.tabBarIcon} color={focused ? color : Theme.WHITE} source={require('../assets/icons/menu.png')} />
                        )
                })}/>
                <AuthorizedStackNav.Screen name="Events" component={EventsStackForChefsTab} 
                    options={({route, navigation}) => ({
                        tabBarIcon:({color, focused})=>(  
                            //<MaterialIcons name={focused ? 'star' : 'star'} size={20} color={color}  />
                            <Icon name="events" size={20} color={focused ? color : Theme.WHITE} style={styles.tabBarIcon}/>
                        )
                })}/>
            </>
            : <>
                <AuthorizedStackNav.Screen name="Chefs" component={ChefStack}
                    options={({route, navigation}) => ({
                        //headerShown: false
                        tabBarIcon:({color, focused})=>(  
                            <MaterialCommunityIcons name="chef-hat" size={20} color={focused ? color : Theme.WHITE} style={styles.tabBarIcon} />
                        )
                })}/>
                <AuthorizedStackNav.Screen name="Reservations" component={ReservationsScreen}
                    options={({route, navigation}) => ({
                        //headerShown: false
                        tabBarIcon:({color, focused})=>(  
                            <FontAwesome name="ticket" size={20} color={focused ? color : Theme.WHITE} style={styles.tabBarIcon} />
                        )
                })}/>
                <AuthorizedStackNav.Screen name="Events" component={EventsStack} 
                    options={({route, navigation}) => ({
                        tabBarIcon:({color, focused})=>(  
                            //<MaterialIcons name={focused ? 'star' : 'star'} size={20} color={color}  />
                            <Icon name="events" size={20} color={focused ? color : Theme.WHITE} style={styles.tabBarIcon}/>
                        )
                })}/>
            </>
            }



            {/*
            <AuthorizedStackNav.Screen name="Messages" component={MessageScreen}
                options={({route, navigation}) => ({
                    //headerShown: false
                    tabBarIcon:({color, focused})=>(  
                        <MaterialIcons name="message" size={20} color={focused ? color : Theme.WHITE} style={styles.tabBarIcon} />
                    )
                })}/>
            */}
            <AuthorizedStackNav.Screen name="Account" component={AccountScreenStack}
                options={({route, navigation}) => ({
                    headerShown: false,
                    tabBarIcon:({color, focused})=>(  
                        <MaterialIcons name="person" size={20} color={focused ? color : Theme.WHITE} style={styles.tabBarIcon} />
                    )
                })}/>
        </AuthorizedStackNav.Navigator>      
    )
}

/*******************************************************************************/
//EXPORT NAVIGATOR
/*******************************************************************************/
function Navigator({ userLoggedIn }) {
    console.log("Navigator login check: ",userLoggedIn)
    return (
    <NavigationContainer>
        <RootStack.Navigator> 
            {/**********************************************************
            * //If the user is logged in, show the "AUTHORIZED" screens
            **********************************************************/ }
            {userLoggedIn ? ( 
                <>
                    <RootStack.Screen name="Dashboard" component={AuthorizedStack} 
                        options={({route, navigation}) => ({
                            headerShown: (getFocusedRouteNameFromRoute(route) == 'Account') ? false : true,
                            headerTintColor:  Theme.TEXT_ON_SURFACE_COLOR,
                            headerTitle: getFocusedRouteNameFromRoute(route),
                            /*
                            headerRight: () => (
                                //<Text style={{color:'orange'}}>{getFocusedRouteNameFromRoute(route)}</Text>
                                <MaterialIcons name="notifications-none" style={{padding:10}} size={24} color={Theme.PRIMARY_COLOR} />
                            ),   
                            */
                        })}
                    
                    />
                    <RootStack.Screen name="Menu Details" component={MenuDetailScreen} 
                        options={({route}) => ({
                            //headerShown: false,
                            headerTintColor: Theme.WHITE,
                            headerTransparent: true,
                            headerTruncatedBackTitle: true,
                            headerBackTitleVisible: false,
                            title: '',
                            headerTitle: null,
                            headerBackground: () => (
                                <LinearGradient
                                    start={{x: 1, y: 0}}
                                    end={{x: 1, y: 1}}
                                    colors={['rgba(0,0,0,0.8)', 'transparent']}
                                    style={{ flex: 1 }}
        
                                />
                            ),
                        })}
                    />
                    <RootStack.Screen name="Event Details" component={EventDetailScreen} 
                        options={({route}) => ({
                            //headerShown: false,
                            headerTintColor: Theme.WHITE,
                            headerTransparent: true,
                            headerTruncatedBackTitle: true,
                            headerBackTitleVisible: false,
                            title: '',
                            headerTitle: null,
                            headerBackground: () => (
                                <LinearGradient
                                    start={{x: 1, y: 0}}
                                    end={{x: 1, y: 1}}
                                    colors={['rgba(0,0,0,0.8)', 'transparent']}
                                    style={{ flex: 1 }}
                                />
                            ),
                        })}
                    />
                    <RootStack.Screen name="Chef Details" component={ChefDetailScreen} 
                        options={({route}) => ({
                            //headerShown: false,
                            headerTintColor: Theme.WHITE,
                            headerTransparent: true,
                            headerTruncatedBackTitle: true,
                            headerBackTitleVisible: false,
                            title: '',
                            headerTitle: null,
                            headerBackground: () => (
                                <LinearGradient
                                    start={{x: 1, y: 0}}
                                    end={{x: 1, y: 1}}
                                    colors={['rgba(0,0,0,0.8)', 'transparent']}
                                    style={{ flex: 1 }}
        
                                />
                            ),
                        })}
                    />
                    <RootStack.Screen name="Create Event" component={CreateEventScreen} 
                        options={({route}) => ({
                            //headerShown: false,
                            /*
                            headerTintColor: Theme.WHITE,
                            headerTransparent: true,
                            headerTruncatedBackTitle: true,
                            headerBackTitleVisible: false,
                            title: '',
                            headerTitle: null,
                            headerBackground: () => (
                                <LinearGradient
                                    start={{x: 1, y: 0}}
                                    end={{x: 1, y: 1}}
                                    colors={['rgba(0,0,0,0.8)', 'transparent']}
                                    style={{ flex: 1 }}
        
                                />
                            ),
                            */
                        })}
                    />
                    <RootStack.Screen name="Create Menu" component={CreateMenuScreen} 
                        options={({route}) => ({
                            //headerShown: false,
                            /*
                            headerTintColor: Theme.WHITE,
                            headerTransparent: true,
                            headerTruncatedBackTitle: true,
                            headerBackTitleVisible: false,
                            title: '',
                            headerTitle: null,
                            headerBackground: () => (
                                <LinearGradient
                                    start={{x: 1, y: 0}}
                                    end={{x: 1, y: 1}}
                                    colors={['rgba(0,0,0,0.8)', 'transparent']}
                                    style={{ flex: 1 }}
        
                                />
                            ),
                            */
                        })}
                    />
                </>
            ) : (
            <>
                <RootStack.Screen name="UNAUTHORIZED" component={UnAuthorizedStack} options={{ headerShown: false }}/>
            </>
        )}
        </RootStack.Navigator>
    </NavigationContainer>
    )
}

//EXPORT WHOLE NAVIGATOR
export default Navigator


const styles = StyleSheet.create({
    tabBarIcon: {
        //resizeMode: 'contain',
        width: 26,
        height: 26,
    },
    custom_icon: {
    }
}) 