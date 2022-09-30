/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// OTHER DEPENDENCIES
import _ from 'underscore'

// COMPONENTS
import { Text, StyleSheet, View, Image, Dimensions } from 'react-native'
import {CustomButton} from '../components/Button'
import MenuItem from '../components/MenuItem'
import AppContext from '../components/AppContext';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// STYLES
import {globalStyles, TouchableHighlight, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function DetailScreen({ route, navigation }) {

    //Determine details of restaurant
    let details = route.params.details

    console.log(details)

    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={[globalStyles.page,{paddingTop:0}]}>
                <View style={globalStyles.container}>
                    <Image source={{ uri:details.image }} style={styles.image} />
                    <Text>{details.guid}</Text>
                    <Text>{details.name}</Text>
                    <Text>{details.description}</Text>
                </View>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image:{
        width: windowWidth,
        height: 260,
        backgroundColor: Theme.PRIMARY_COLOR
    }
})