/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'
import _ from 'underscore'

// COMPONENTS

import { Text, StyleSheet, View, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native'
import {CustomButton} from '../components/Button'
import Table from '../components/Table'
import AppContext from '../components/AppContext';
import {getEndpoint} from '../helpers/helpers'


// STYLES
import {globalStyles, TouchableHighlight, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';



/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function HomeScreen({navigation}) {
    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID
    const [wholeMenu,setWholeMenu] = useState('')
    const [chefs,setChefs] = useState(null)
    const [headers,setHeaders] = useState(['a','b','c'])

    const getMenu = async (values) => {
        try{
            /*
            const result = await fetch(getEndpoint(appsGlobalContext,'menu')); //apiBase
            const json = await result.json()
            */
            const json = require('../data/menu.json');
            setWholeMenu(json.menus[0].menuGroups[0].menuItems)
        }
        catch(error){
            console.log(error);
        }
    }    

    const getChefs = async () => {
        console.log("CHEFS",chefs)
        const dbh = firebase.firestore();
        const citiesRef = dbh.collection('chefs');
        const snapshot = await citiesRef.get();
        let chefs = []
        snapshot.forEach(doc => {
          console.log(doc.id, '=>', doc.data());
          chefs.push(doc.data())
        });
        setChefs(chefs)
    }

   
    useEffect(() => {
        getChefs()
    }, [])

    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={globalStyles.page}> 
                {(chefs) ?
                <Table headers={headers} data={chefs}/>
                : <ActivityIndicator />
                }
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    flatlist: {
        width: '100%',
    }
})