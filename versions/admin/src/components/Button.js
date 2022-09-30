/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React from 'react'
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


function CustomButton({ text, onPress, size, disabled  }) {
    return (
        <TouchableOpacity activeOpacity={0.8} onPress={onPress} style={[
            styles.buttonContainer,
            size === "big" && {
                paddingVertical: 11,
                paddingHorizontal: 18,
                borderRadius: 10,
            },
            disabled && styles.submitButtonDisabled
        ]}>
            <Text style={[
                styles.buttonText,
                size === "big" && { fontSize: 16 },
                disabled && styles.submitButtonDisabledText
            ]}>{text}</Text>
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
        backgroundColor: Theme.SECONDARY_COLOR,
        margin:5,
        borderRadius: 10,
        paddingVertical: 9,
        paddingHorizontal: 14,
    },
    buttonText: {
        fontSize: 12,
        fontFamily: Theme.FONT_BOLD,
        color: Theme.TEXT_ON_SECONDARY_COLOR,
        alignSelf: "center",
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

export {CustomButton, SubmitButton}