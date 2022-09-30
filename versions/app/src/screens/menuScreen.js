/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useEffect, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

//OTHER DEPENDENCIES
import { firebase, configKeys } from '../config/config'
import { useFocusEffect } from '@react-navigation/native';

// COMPONENTS
import { Text, StyleSheet, View, Image, TouchableOpacity, ScrollView, RefreshControl } from 'react-native'
import AppContext from '../components/AppContext'
import {CustomButton} from '../components/Button'
import MenuListing from '../components/MenuListing'
import {getEndpoint} from '../helpers/helpers'


// STYLES
import { globalStyles, modal, footer, forms } from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { FontAwesome, FontAwesome5, Ionicons, AntDesign, MaterialIcons } from '@expo/vector-icons'


/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function MenuScreen({navigation, route}) {

    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID

    const menuPageName = route.name
    const [refreshing, setRefreshing] = useState(false);
    const [menuTemplates,setMenuTemplates] = useState(null)


    const getMenus = async (menuPageName) => {
        try{
            if(menuPageName == 'Templates'){
                console.log(getEndpoint(appsGlobalContext,'menu_templates'))
                const result = await fetch(getEndpoint(appsGlobalContext,'menu_templates')); //apiBase
                const json = await result.json()
                setMenuTemplates(json)
            }
            else if(menuPageName == 'Your Menus'){
                console.log("Looking for your menus")
                const menusRef = await firebase.firestore().collection('chefs').doc(uid).collection('menus').get();
                if (!menusRef.empty) {
                    let menus = []
                    menusRef.forEach(doc => {
                        let menu = doc.data()
                        console.log(menu)
                        menu.id = doc.id
                        menus.push(menu)
                    })
                    setMenuTemplates(menus)
                }
                else{
                    console.log("No menus found")
                }
            }
        }
        catch(error){
            console.log(error);
        }       
    }

    const onRefresh = () => {
        getMenus(menuPageName)
        setRefreshing(false)
    }


    useEffect(() => {
        getMenus(menuPageName)
    }, [])

    /*************************************************************/
    // RUN FOCUS EFFECT TO CHECK VARIOUS STATES ON LOAD
    /*************************************************************/
    useFocusEffect(
        React.useCallback(() => {
            getMenus(menuPageName)
            console.log("Menu screen is focused")
        }, [1])
    )










    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <View style={[globalStyles.page,{padding:0}]}>
                {menuTemplates
                ? <MenuListing menuTemplates={menuTemplates}  chefID={uid} pageName={menuPageName} navigation={navigation} key={menuPageName}/>
                : <View style={globalStyles.empty_state}>
                    <Image style={globalStyles.empty_image} source={require('../assets/empty_calendar.png')} />
                    <Text style={globalStyles.empty_text}>You don't have any menus yet</Text>
                </View>
                }
                {menuPageName == 'Your Menus' && 
                    <TouchableOpacity
                        onPress={() => navigation.navigate('Create Menu')}
                        style={{
                        position: 'absolute',
                        right: 15,
                        bottom: 15,
                        width: 50,
                        height: 50,
                        borderRadius: 100,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: Theme.SECONDARY_COLOR,
                        }}
                    >
                        <MaterialIcons name='add' size={25} color={Theme.WHITE} />
                    </TouchableOpacity>
                }

            </View>
        </SafeAreaView>
    )

    

}

const styles = StyleSheet.create({
    no_menu:{
        flex:1,
        width:'100%',
        height:'100%',
        justifyContent: 'center', 
        alignItems: 'center',
    },
})
