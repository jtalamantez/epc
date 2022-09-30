/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

//Other Dependencies
import _ from 'underscore'
import { Formik } from 'formik'
import * as yup from 'yup'
import BouncyCheckbox from "react-native-bouncy-checkbox";


// COMPONENTS
import { Image, Text, StyleSheet, View, ScrollView,Dimensions, TouchableOpacity, ActivityIndicator } from 'react-native'
import {CustomButton} from '../components/Button'

// STYLES
import {globalStyles, modal, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { FontAwesome, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function Cuisines() {

    return (
        <Formik
            initialValues={{ 
                cuisines: {},
            }}
            onSubmit={values => {
                console.log("cusinies",_.keys(values.cuisines))
                //console.log("cusinies",_.keys(values.cuisines))
                //handleModifier(values.modifications)    
            }}
            validationSchema={yup.object().shape({
                //name: yup.string().required('Please, provide your name!'),
            })}
        >
        {({
            values, 
            errors,
            handleChange, 
            setFieldTouched,
            setFieldValue,
            handleBlur,
            touched,
            isValid,
            handleSubmit
        }) => (
            <View style={styles.formContainer}>
                <View style={styles.checkboxes}>
                    <BouncyCheckbox onPress={(isChecked) => {
                        let key =  'cuisines.american'
                        let value = (isChecked) ? 'american' : undefined
                        setFieldValue(key,value, false )
                    }
                    } />
                    <Text>American {'\n'}</Text>
                    <BouncyCheckbox onPress={(isChecked) => {
                        let key =  'cuisines.asian'
                        let value = (isChecked) ? 'asian' : undefined
                        setFieldValue(key,value, false )
                    }
                    } />
                    <Text>Asian {'\n'}</Text>
                    <BouncyCheckbox onPress={(isChecked) => {
                        let key =  'cuisines.chinese'
                        let value = (isChecked) ? 'chinese' : undefined
                        setFieldValue(key,value, false )
                    }
                    } />
                    <Text>Chinese {'\n'}</Text>
                    <BouncyCheckbox onPress={(isChecked) => {
                        let key =  'cuisines.french'
                        let value = (isChecked) ? 'french' : undefined
                        setFieldValue(key,value, false )
                    }
                    } />
                    <Text>French {'\n'}</Text>
                    <BouncyCheckbox onPress={(isChecked) => {
                        let key =  'cuisines.indian'
                        let value = (isChecked) ? 'indian' : undefined
                        setFieldValue(key,value, false )
                    }
                    } />
                    <Text>Indian {'\n'}</Text>
                    <BouncyCheckbox onPress={(isChecked) => {
                        let key =  'cuisines.italian'
                        let value = (isChecked) ? 'italian' : undefined
                        setFieldValue(key,value, false )
                    }
                    } />
                    <Text>Italian {'\n'}</Text>
                </View>
                <CustomButton text="ADD" disabled={!isValid} onPress={handleSubmit} />
            </View>
        )}
    </Formik>
    )
}

const styles = StyleSheet.create({
    screen:{
        flex:1,
        backgroundColor: Theme.SURFACE_COLOR,
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    headline_text: {
        textAlign: 'left',
    },
    onboard_float: {
        flex: 1,
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'green',
        paddingBottom: 35,
    },
    bullets: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10
    },
    bullet: {
        color:Theme.PRIMARY_COLOR,
        paddingHorizontal: 5,
        fontSize: 40,
    },
    signin_text: {
        fontFamily: Theme.FONT_STANDARD,
        lineHeight: 20,
        padding:8,
        textAlign: 'center',
        color:Theme.TEXT_ON_SURFACE_COLOR,
    },
    button_bg: {
        alignItems: 'center',
        width: '100%'
    },
    button_container: {
        justifyContent: 'center',
        width: '90%'
    }
})
