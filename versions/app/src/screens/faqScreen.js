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


export default function FaqScreen({navigation}) {
    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={[globalStyles.page,{justifyContent:'flex-start'}]}>
                <Text style={styles.question}>How do I find a...?</Text>
                <Text style={styles.answer}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed rhoncus est. Cras mollis metus vitae ligula imperdiet iaculis. Nullam rutrum sed lorem vitae facilisis. Se</Text>
                <Text style={styles.question}>How do I find a...?</Text>
                <Text style={styles.answer}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed rhoncus est. Cras mollis metus vitae ligula imperdiet iaculis. Nullam rutrum sed lorem vitae facilisis. Se</Text>
                <Text style={styles.question}>How do I find a...?</Text>
                <Text style={styles.answer}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed rhoncus est. Cras mollis metus vitae ligula imperdiet iaculis. Nullam rutrum sed lorem vitae facilisis. Se</Text>
                <Text style={styles.question}>How do I find a...?</Text>
                <Text style={styles.answer}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed rhoncus est. Cras mollis metus vitae ligula imperdiet iaculis. Nullam rutrum sed lorem vitae facilisis. Se</Text>
                <Text style={styles.question}>How do I find a...?</Text>
                <Text style={styles.answer}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed rhoncus est. Cras mollis metus vitae ligula imperdiet iaculis. Nullam rutrum sed lorem vitae facilisis. Se</Text>
                <Text style={styles.question}>How do I find a...?</Text>
                <Text style={styles.answer}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed rhoncus est. Cras mollis metus vitae ligula imperdiet iaculis. Nullam rutrum sed lorem vitae facilisis. Se</Text>
          
                <Text style={styles.question}>How do I find a...?</Text>
                <Text style={styles.answer}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas sed rhoncus est. Cras mollis metus vitae ligula imperdiet iaculis. Nullam rutrum sed lorem vitae facilisis. Se</Text>
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
    },
    question:{
        textAlign:'left',
        width:'100%',
        fontSize:14,
        fontWeight:'bold',
        color: Theme.SECONDARY_COLOR,
        paddingBottom:7
    },
    answer:{
        fontSize:13,
        width:'100%',
        color: Theme.PRIMARY_COLOR,
        marginBottom:30
    },
})
