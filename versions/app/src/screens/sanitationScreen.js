/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'
import _ from 'underscore'

// COMPONENTS
import { Text, StyleSheet, View, TouchableOpacity, Button } from 'react-native'
import AppContext from '../components/AppContext';
import {getEndpoint,pickFile,uploadFile} from '../helpers/helpers'


// STYLES
import {globalStyles, TouchableHighlight, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { FontAwesome, FontAwesome5, Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function SanitationScreen({navigation,route}) {
    const params = route.params
    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID
    const [fileUploaded, setFileUploaded] = useState(false);
    const [uploading, startUploading] = useState(false);

    const loadDoc = async (title) => {
        const uri = await pickFile()
        console.log("RSULT",uri)
        startUploading(true)
        const uploadedUrl = await uploadFile(uri)
        console.log("RSULT2",uploadedUrl)
        try{
            const result = await fetch(getEndpoint(appsGlobalContext,'certification'), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },                
                body: JSON.stringify({
                    file: uploadedUrl,
                    uid: uid,
                    title: title
                })
            })
            const response = await result.text();
            console.log(response)
            startUploading(false);
            setFileUploaded(true);
        }
        catch(error){
            console.log(error)
        }   
    }


    return (   
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={[globalStyles.page,{paddingTop:70}]}>
                <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras lacinia arcu nec magna fringilla gravida a at dui. Aliquam a eros et arcu hendrerit auctor</Text>
                { (params && params.details) || fileUploaded
                ?   <TouchableOpacity style={styles.uploaded}>
                        <Ionicons name="cloud-done" size={50} color={Theme.SECONDARY_COLOR} />
                        <Text>Upload Complete</Text>
                    </TouchableOpacity>
                :   
                    <TouchableOpacity style={styles.upload_btn} onPress={() => loadDoc('Sanitation Manager License')}  >
                        <MaterialIcons name="add-circle-outline" size={50} color={Theme.SECONDARY_COLOR} />
                    </TouchableOpacity>
                }

                <View style={{ height: 50 }}/>
                { uploading && <Text>Uploading</Text> }


            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    upload_btn: {
        margin:30,
        height:160,
        width:160,
        borderRadius:15,
        borderColor: Theme.FAINT,
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    uploaded: {
        margin:30,
        height:160,
        width:160,
        borderRadius:15,
        borderColor: Theme.SECONDARY_COLOR,
        borderWidth: 2,
        justifyContent: 'center',
        alignItems: 'center'
    }
})


