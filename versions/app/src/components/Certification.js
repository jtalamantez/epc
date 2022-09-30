/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from 'react'

//Other Dependencies
import _ from 'underscore'

//Custom Components
import { StyleSheet, Text, View,  TouchableWithoutFeedback, Dimensions } from 'react-native'
import {GoToButton, CustomButton} from '../components/Button'

//Styles
import {globalStyles, TouchableHighlight, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { FontAwesome, FontAwesome5, Ionicons, AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function Certification ({certifications,title,navigation}) {

    if(_.has(certifications,title)){
        return (
            <>
                <View style={{flexDirection:'row',alignContent: 'center', alignItems: 'center',justifyContent:'space-evenly'}}>
                    <MaterialCommunityIcons name="check-circle" size={20} color={(certifications[title].is_approved == true) ? Theme.SECONDARY_COLOR : Theme.FAINT} style={{paddingLeft:5}}/>
                    <GoToButton navigation={navigation} navigator="Account" page={title} copy={title} params={certifications[title]} pending={(certifications[title].is_submitted == true && certifications[title].is_approved == false) ? true : false}/>
                </View>
            </>
        )
    }
    else{
        return (
            <>
                <View style={{flexDirection:'row',alignContent: 'center', alignItems: 'center',justifyContent:'space-evenly'}}>
                    <MaterialCommunityIcons name="check-circle" size={20} color={Theme.FAINT} style={{paddingLeft:5}}/>
                    <GoToButton navigation={navigation} navigator="Account" page={title} copy={title} />
                </View>
            </>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 6,
        padding:15,
        marginVertical:5,
        backgroundColor: Theme.CREAM,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    thumbnail: {
        flex:1,
        backgroundColor: 'green'
    },
    content: {
        flex:3,
    },
    name_and_price:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    description:{
        fontSize:12,
        color:Theme.PRIMARY_COLOR
    }
})
