/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// COMPONENTS
import { Text, StyleSheet, View, Alert } from 'react-native'
import {CustomButton} from '../components/Button'

// STYLES
import {globalStyles} from '../styles/styles';
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function PasswordScreen({navigation}) {
    const buttonPress = () => {
        Alert.alert("Button Pressed")
    }
    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={[globalStyles.page,{paddingTop:70}]}>
                <Text>PASSWORD RECOVERY SCREEN</Text>
                <CustomButton text='Press Me' onPress={() => buttonPress()} ></CustomButton>
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
})
