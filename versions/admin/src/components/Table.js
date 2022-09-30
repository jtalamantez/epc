/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from 'react'
import { StyleSheet, Text, View,  TouchableWithoutFeedback, Dimensions } from 'react-native'
//Other Dependencies
import _ from 'underscore'

//Custom Components
import AppContext from '../components/AppContext';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

//Styles
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function Table ({headers,data}) {
    return (

            <View style={styles.table}>
                    <View style={styles.header_row}>
                        {headers.map((details,index) => { // This will render a row for each data element.
                        return(
                            <View style={styles.header_cell} key={index}>
                                <Text style={styles.header_text}>{details}</Text>
                            </View>
                        )
                        })}

 
                    </View>
                        {data.map((details,index) => { // This will render a row for each data element.
                        return(
                            <TouchableWithoutFeedback>
                            <View style={styles.row}>
                                <View style={styles.cell} >
                                    <Text>{details.first_name}</Text>
                                </View>
                                <View style={styles.cell} >
                                    <Text>{details.last_name}</Text>
                                </View>
                                <View style={styles.cell} >
                                    <Text>{details.email}</Text>
                                </View>
                                <View style={styles.cell} >
                                    <Text>{details.password}</Text>
                                </View>
                                <View style={styles.cell} >
                                    <Text>{details.bio}</Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>)
                        })}
                </View>



    )
}

const styles = StyleSheet.create({
    table: {
        flex: 1,
        width: '100%', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: 'pink'
     },
     header_row: {
         //flex: 1,
         flexDirection: 'row',
         alignSelf: 'stretch',
     },
     header_cell: {
         flex: 1, 
         alignSelf: 'stretch',
         justifyContent: 'center',
         alignItems: 'flex-start',
         backgroundColor: 'green',
         padding: 10,
         borderWidth: 1,
         borderColor: 'black'
     },
     header_text: {
         fontSize: Theme.FONT_SIZE_MEDIUM,
         fontWeight: Theme.FONT_WEIGHT_HEAVY
    },
    row: {
        //flex: 1,
        flexDirection: 'row',
        alignSelf: 'stretch',
    },
    cell: {
        flex: 1, 
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'flex-start',
        backgroundColor: 'yellow',
        padding: 10,
        borderWidth: 1,
        borderColor: 'black'
    }
})
