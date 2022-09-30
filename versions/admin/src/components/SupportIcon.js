/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from 'react'
import { StyleSheet } from 'react-native'

//Styles
import { MaterialCommunityIcons } from '@expo/vector-icons'
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function SupportIcon({ navigation }) {
    return (
        <MaterialCommunityIcons name='room-service' size={26} onPress={() => navigation.navigate('Contact', { names: ['Brent', 'Satya', 'Michaś'] })} style={styles.icon} />       
    )
}
const styles = StyleSheet.create({
    icon: {
        color: Theme.SECONDARY_COLOR,
        position: 'absolute',
        right: 9,
        padding:8,
        paddingTop:9,
    }
})