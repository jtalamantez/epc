/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useEffect } from 'react'
import { Button, Image, View, Platform, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';


// OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'
import uuid from "uuid";

// COMPONENTS
import {CustomButton} from '../components/Button'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

//Styles
import Theme from '../styles/theme.style.js';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function ImageUploader({currentImg, getImageUrl, shape = 'rectangle'}) {
    console.log("HAs current image", currentImg)
    const [image, setImage] = (currentImg) ? useState(currentImg) : useState(null)
    const [loadingImage,setLoadingImage] = useState(false)

    const pickImage = async () => {
        setLoadingImage(true)
        console.log("Loading image")
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.cancelled) {
            const uploadUrl = await uploadImageAsync(result.uri);
            console.log("DownloadedURL",uploadUrl)
            getImageUrl(uploadUrl)
            setImage(uploadUrl); //result.uri
        }
        setLoadingImage(false)
        console.log("image loaded")

    }


    async function uploadImageAsync(uri) {
        // Why are we using XMLHttpRequest? See:
        // https://github.com/expo/expo/issues/2402#issuecomment-443726662
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            }
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            }
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        })
      
        const ref = firebase.storage().ref().child(uuid.v4());
        const snapshot = await ref.put(blob);
        // We're done with the blob, close and release it
        blob.close();
        return await snapshot.ref.getDownloadURL();
    }

    useEffect(() => {
        (async () => {
            if (Platform.OS !== 'web') {
                const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    return (
        <>
            {image || loadingImage
            ? 
                loadingImage ?
                <View style={styles.container}>
                    <ActivityIndicator size="small" color={Theme.SECONDARY_COLOR} />
                </View>
                : <View style={styles.container}>
                    <View style={{alignItems: 'flex-end',  width: '100%', padding:0}}>
                        <MaterialCommunityIcons name="circle-edit-outline" size={24} style={styles.edit} onPress={pickImage}/>
                    </View>
                    <Image source={{ uri: image }} style={(shape == 'rectangle') ? styles.square_img : styles.round_img} />
                </View>
            : <CustomButton text='Choose Image'  onPress={pickImage} size="big" />
            }
        </>
    )
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        alignItems: 'center',
        padding:5
    },
    round_img: {
        width: 200,
        height:200,
        borderRadius: 100,
        borderWidth: 5,
        borderColor: Theme.SECONDARY_COLOR,
        marginTop: -20 //So it overlaps on the edit icon above it
    },
    square_img: {
        //flex:1,
        width: (windowWidth*.9),
        height: 240,
        //alignSelf: 'stretch',
        //borderWidth: 1,
        borderColor: Theme.SECONDARY_COLOR,
        resizeMode: 'contain',
    },
    edit: {
        color: Theme.SECONDARY_COLOR,
        textAlign: 'right',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
        padding:10,
        margin:5
    }
})
    