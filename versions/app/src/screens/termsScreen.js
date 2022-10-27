/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// COMPONENTS
import { Text, StyleSheet, View } from 'react-native'

//DELETE AFTER DRISHAY GOOGLE TEST
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';


// STYLES
import {globalStyles, TouchableHighlight, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function TermsScreen({navigation}) {
    const [eventLocation,setEventLocation] = useState(null)

    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={[globalStyles.page,{paddingTop:70}]}>
                <Text>TERMS &amp; CONDITONS SCREEN</Text>


                <GooglePlacesAutocomplete
                    placeholder='Location'
                    listViewDisplayed={true} // true/false/undefined
                    onPress={(data, details = null) => {
                        // 'details' is provided when fetchDetails = true
                        console.log(data, details);
                        setEventLocation(data.description)
                    }}
                    query={{
                        key: 'AIzaSyBNszkGed_0yWGVbllKvCElBiZrCxywKXo',
                        language: 'en',
                        components: 'country:us',
                    }}
                    styles={{
                        container: {
                            flex:1,
                            width:'99%',
                            borderWidth:1,
                            borderRadius:10,
                            marginTop:10,
                            borderColor: Theme.BORDER_COLOR,
                            zIndex:10000
                        },
                        poweredContainer: {
                        }
                    }}
                />
                

            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
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
