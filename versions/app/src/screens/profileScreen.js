/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

//OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'

// COMPONENTS
import { Text, StyleSheet, View, Modal, TouchableOpacity, Dimensions } from 'react-native'
import ProfileSlider from '../components/ProfileSlider';
import AppContext from '../components/AppContext';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// STYLES
import {globalStyles, modal} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { MaterialCommunityIcons,FontAwesome, MaterialIcons, Ionicons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function ProfileScreen({navigation}) {
    
    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID
    const userData = appsGlobalContext.userData
    const [modalVisible,setModalVisible] = useState(true)

    const handleFormUpdates = async (values)=> {
        console.log("VAlues to be updated",values)
        const usersRef = firebase.firestore().collection('chefs');
        await usersRef.doc(uid).update({...values});
        await getUserData(uid)
        navigation.navigate('Dashboard')
        setModalVisible(false)
    }

    async function getUserData(uid) {
        const usersRef = firebase.firestore().collection('chefs');
        const user = await usersRef.doc(uid).get();
        if (user.exists) {
            appsGlobalContext.setUserData(user.data())
            appsGlobalContext.setUserLoggedIn(true)
        }
    }

    useEffect(() => {
        getUserData(uid)
    }, [appsGlobalContext.userLoggedIn])

    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={globalStyles.page}>
                <Modal animationType="slide" transparent={true} visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                    }}
                >
                    <View style={modal.modalBackground}>
                        <ProfileSlider handleFormUpdates={handleFormUpdates} userData={userData}/>
                    </View>
                </Modal>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
})
