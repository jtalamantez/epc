/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View,  FlatList, Dimensions } from 'react-native'
//Other Dependencies
import _ from 'underscore'

//Custom Components
import MenuItem from '../components/MenuItem';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

//Styles
import { globalStyles, modal, footer, forms } from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { CustomButton } from './Button';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function MenuListing ({menuTemplates, chefID, pageName, navigation }) {

    const renderItem = ({ item }) => {
        item.chefID = chefID
        return (<MenuItem details={item} pageName={pageName} navigation={navigation} key={item.id} />)
    }

    return (
        <View style={{flex:1,width:'100%'}}>
            <FlatList
                data={menuTemplates}
                renderItem={renderItem}
                keyExtractor={item => item.id}
                />
        </View>
    )

}
