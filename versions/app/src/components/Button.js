/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Theme from '../styles/theme.style.js';
import { AntDesign } from '@expo/vector-icons'
import { globalStyles } from '../styles/styles.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


function GoToButton({ navigation, navigator = null, page = null, copy,noBorderBottom = null, pending =false ,params }) {
    return (
        <TouchableOpacity style={[globalStyles.navigate_away,noBorderBottom && {borderBottomWidth:0}]} onPress={() => navigation.navigate(navigator, { screen: page,details:params })}>
            <Text style={globalStyles.navigate_away_content}>{copy}</Text>
            {pending && <Text style={styles.pending}>PENDING</Text>}
            <AntDesign name="right" size={20} color={Theme.FAINT} style={{paddingLeft:5}}/>
        </TouchableOpacity>
    )
}

function CustomButton({ text, onPress, size, disabled, checkmark  }) {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[
            styles.buttonContainer,
            size === "big" && {
                paddingVertical: 13,
                paddingHorizontal: 40,
                borderRadius: 30,
            },
            disabled && styles.submitButtonDisabled
        ]}>
                {checkmark &&
                <AntDesign name="checkcircleo" size={17} color={Theme.SECONDARY_COLOR} style={{marginRight:10}}/>
                }
            <Text style={[
                styles.buttonText,
                size === "big" && { fontSize: 17,lineHeight:17 },
                disabled && styles.submitButtonDisabledText
            ]}>

                {text}
            </Text>
        </TouchableOpacity>
    )
}

function SubmitButton({ text, onPress, style, disabled }) {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[styles.submitButtonContainer, disabled && styles.submitButtonDisabled]}>
            <Text style={[
                styles.submitButtonText,
                style === "on_white" && { color: Theme.WHITE },
                disabled && styles.submitButtonDisabledText
            ]}>{text}</Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Theme.SECONDARY_COLOR,
        margin:5,
        borderRadius: 12,
        paddingVertical: 9,
        paddingHorizontal: 14,
    },
    buttonText: {
        fontSize: 12,
        fontFamily: Theme.FONT_BOLD,
        color: Theme.TEXT_ON_SECONDARY_COLOR,
        alignSelf: "center",
    },
    pending:{
        backgroundColor: Theme.SECONDARY_COLOR_LIGHT,
        color: Theme.SECONDARY_COLOR,
        paddingVertical:2,
        paddingHorizontal:5,
        marginTop:2,
        marginRight:5,
        borderRadius:4,
        fontSize:7,
        fontWeight:'bold',
        lineHeight:12
    },
    submitButtonContainer: {
        backgroundColor: Theme.PRIMARY_COLOR,
        borderColor: Theme.WHITE,
        margin:5,
        borderRadius: 12,
        paddingVertical: 11,
        paddingHorizontal: 18,
        borderWidth: 1.5,
    },
    submitButtonText: {
        fontSize: 16,
        fontFamily: Theme.FONT_BOLD,
        color: Theme.SECONDARY_COLOR,
        fontWeight: Theme.FONT_WEIGHT_MEDIUM,
        alignSelf: "center",
        textTransform: "uppercase"
    },
    submitButtonDisabled: {
        backgroundColor: Theme.DISABLED_BG
    },
    submitButtonDisabledText: {
        color: Theme.DISABLED_TEXT
    },
});

export {GoToButton, CustomButton, SubmitButton}