/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React from 'react'
import {Image, StatusBar, Platform} from 'react-native'

//COMPONENTS
import SupportIcon from '../components/SupportIcon'

//THEMES AND FONTS SETUP
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons'
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
//REACT NAVIGATION DEPENDENCIES
/*******************************************************************************/
import { NavigationContainer} from '@react-navigation/native';
import { createStackNavigator} from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

/*******************************************************************************/
//ESTABLISH STACK VARIABLES
/*******************************************************************************/
const RootStack = createStackNavigator();
const AuthorizedStackNav = createDrawerNavigator(); //This can be drawers, stacks, tabs, etc.
const UnAuthorizedStackNav = createStackNavigator(); //This can be drawers, stacks, tabs, etc.

/*******************************************************************************/
//LIST OF SCREENS 
/*******************************************************************************/
/*** AUTHORIZED ****/
import HomeScreen from '../screens/homeScreen'
import DetailScreen from '../screens/detailScreen'
import ContactScreen from '../screens/contactScreen'
import ProfileScreen from '../screens/profileScreen'
import PlaygroundScreen from '../screens/playgroundScreen'

/*** UNAUTHORIZED ****/
import WelcomeScreen from '../screens/welcomeScreen'
import RegistrationScreen from '../screens/registrationScreen'
import LoginScreen from '../screens/loginScreen'
import PasswordScreen from '../screens/passwordScreen'
import TermsScreen from '../screens/termsScreen'

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
    return (
        <AuthorizedStackNav.Navigator
            drawerType="permanent"
            screenOptions={{
            }}
            drawerStyle={{
                backgroundColor: Theme.PRIMARY_COLOR,
                width: 240,
            }}
            drawerContentOptions={{
                inactiveTintColor: Theme.SECONDARY_COLOR,
                activeTintColor: Theme.WHITE,
                itemStyle: { marginVertical: 30 },
            }}
        >
            
            <AuthorizedStackNav.Screen name="Home" component={HomeScreen} />
            <AuthorizedStackNav.Screen name="Playground" component={PlaygroundScreen} />
            <AuthorizedStackNav.Screen name="Contact" component={ContactScreen} />
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
            {!userLoggedIn ? ( 
                <RootStack.Screen name="AUTHORIZED" component={AuthorizedStack} options={{ headerShown: false }}/>
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