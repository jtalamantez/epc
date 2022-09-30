/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React from 'react'
import { StyleSheet } from 'react-native'
import { DrawerActions } from '@react-navigation/native';
import { SimpleLineIcons } from '@expo/vector-icons'
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function HamburgerIcon({ navigation }) {
    return (
        <SimpleLineIcons name='menu' size={28} onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} style={styles.icon} />       
    )
}
const styles = StyleSheet.create({
    icon: {
        color: Theme.SECONDARY_COLOR,
        position: 'absolute',
        left: 16,
        padding:8,
        paddingTop:11
    }
})