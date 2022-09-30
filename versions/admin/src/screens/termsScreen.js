/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// COMPONENTS
import { Text, StyleSheet, View } from 'react-native'

// STYLES
import {globalStyles, TouchableHighlight, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function TermsScreen({navigation}) {
    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={[globalStyles.page,{paddingTop:70}]}>
                <Text>TERMS &amp; CONDITONS SCREEN</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    logos: {
        alignItems: 'center',
        justifyContent:'center',
        paddingTop:130,
        //fontFamily: Theme.FONT_STANDARD,
    },
    hogsalt_logo: {
        width:239,
        height: 33,
        alignSelf: "center",
    },
    loyalty_logo: {
        width:156,
        height: 27,
        alignSelf: "center",
        marginTop:20
    },
    buttons: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-evenly',
        paddingBottom:45,
        //fontFamily: Theme.FONT_STANDARD,
    },
    button_space: {
        width:'48%',
    }
})
