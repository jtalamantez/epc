/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { TextInput, Text, StyleSheet, View, ScrollView, Dimensions , Image, Alert} from 'react-native'

//Other Dependencies
import { firebase, configKeys } from '../config/config'
import _ from 'underscore'

// COMPONENTS
import AppContext from '../components/AppContext'
import { CustomButton } from '../components/Button'
import {getEndpoint} from '../helpers/helpers'
import MenuListing from '../components/MenuListing'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// STYLES
import {globalStyles, menusStyles, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import {AntDesign, MaterialIcons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons'




/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function ChefDetailScreen({route,navigation}) {
    const details = route.params.details
    const chefID = details.id
    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID
    const user = appsGlobalContext.userData
    const activeFlow = appsGlobalContext.activeFlow
    const [menuTemplates,setMenuTemplates] = useState(null)

    const [showContact,setShowContact] = useState(false)
    const [msg,setMsg] = useState("")
    
                 
    const getMenus = async (details) =>{
        //If this is a template page look for the menu in templates
        //otherwise look into the chefs colelction of menus
        console.log("Looking for chef menus: "+chefID)
        const menusRef = await firebase.firestore().collection('chefs').doc(chefID).collection('menus').get();
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

    const contactChef = () =>{
        setShowContact(true)
        console.log("contact chef")
    }

    const sendMessage = () =>{
        Alert.alert("Submitting message to Chef: "+msg)
        setShowContact(false)
        setMsg("")
    }

    useEffect(() => {
        getMenus(details)
    }, [])


    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <ScrollView showsVerticalScrollIndicator={false} style={{width:'100%'}}>
                {_.has(details, 'profile_img')  && details.profile_img
                    ? <Image source={{ uri: details.profile_img }} style={styles.image} />  
                    : <Image source={require('../assets/food_pasta.png')} style={styles.image} />
                }
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.title}>
                            <Text style={globalStyles.h1}>{details.name}</Text>
                        </View>
                        {/*
                        <View style={styles.price_cont}>
                            {_.has(details, 'profile_img')  && details.profile_img &&
                                <Image source={{ uri: details.profile_img }} style={styles.profile_img} />  
                            }
                        </View>
                        */}
                    </View>
                    <View style={[globalStyles.card,{width:'100%'}]}>
                        <View style={globalStyles.card_header}>
                            <Text style={globalStyles.h3}>About Chef {details.name}</Text>
                        </View>
                        <Text style={globalStyles.card_content,styles.card_content}>{details.bio}</Text>
                        <View style={styles.details_cont}>
                            {_.has(details, 'certifications')  &&
                                Object.keys(details.certifications).map((certName,index) => {
                                    if(details.certifications[certName].is_approved){
                                        return (<>
                                            <View style={{flexDirection:'row', alignItems: 'center',justifyContent:'flex-start'}}>
                                                <MaterialCommunityIcons name="check-circle" size={20} color={Theme.SECONDARY_COLOR} style={{paddingHorizontal:5}}/>
                                                <Text style={styles.certification_name}>{certName}</Text>
                                            </View>
                                        </>)
                                    }
                                })
                            }
                        </View>

                        <View style={globalStyles.card_header}>
                            <Text style={globalStyles.h3}>Fun Facts</Text>
                        </View>
                        {details.facts1 &&
                        <Text style={globalStyles.card_content,styles.card_content}>{details.facts1}</Text>
                        }
                        {details.facts2 &&
                        <Text style={globalStyles.card_content,styles.card_content}>{details.facts2}</Text>
                        }
                        {details.facts3 &&
                        <Text style={globalStyles.card_content,styles.card_content}>{details.facts3}</Text>
                        }

                        {/*
                        <View style={styles.details_cont}>
                            <View style={styles.detail}>
                                <FontAwesome5 name="calendar" size={20} style={styles.detail_icon}/>
                                <Text style={styles.detail_label}>{details.event_date}</Text>
                            </View>
                            <View style={styles.detail}>
                                <AntDesign name="clockcircle" size={17}  style={styles.detail_icon}/>
                                <Text style={styles.detail_label}>{details.start_time}-{details.end_time}</Text>
                            </View>
                            <View style={styles.detail}>
                                <MaterialIcons name="location-on" size={23}  style={[styles.detail_icon,{marginLeft:-3,width:33}]}/>
                                <Text style={styles.detail_label}>{details.location}</Text>
                            </View>
                            <View style={styles.detail}>
                                <Ionicons name="md-person" size={20}  style={[styles.detail_icon,{marginLeft:-1,width:31}]}/>
                                <Text style={styles.detail_label}>{details.guests} guests</Text>
                            </View>
                        </View>
                        */}
                    </View>
                   

                    {menuTemplates &&
                        <View style={[globalStyles.card,{width:'100%'}]}>
                            <View style={globalStyles.card_header}>
                                <Text style={globalStyles.h3}>Menus</Text>
                            </View>
                            <MenuListing menuTemplates={menuTemplates} chefID={chefID} pageName="Your Menus" navigation={navigation} key="Your Menus"/>
                        </View>
                    }

                    <View style={{marginVertical:20, width:'100%'}}>
                        {!showContact &&
                            <CustomButton text='Contact the Chef' onPress={() => contactChef()} size="big" />
                        }
                        {showContact &&
                            <View style={styles.contact}>
                                <TextInput 
                                    multiline={true}
                                    textAlignVertical="top" 
                                    style={[forms.input,forms.textarea]} 
                                    placeholder="Send a message..."
                                    onChangeText={(text) => setMsg(text)}
                                    value={msg}
                                />
                                <CustomButton text='Send message' onPress={() => sendMessage()} size="big" />
                            </View>
                        }
                    </View>


                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    image:{
        width: windowWidth,
        height: 260,
        backgroundColor: Theme.PRIMARY_COLOR
    },
    content: {
        padding:15,
        alignItems: 'center',
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title:{
        flex:1,
    },
    profile_img:{
        width: 70,
        height: 70,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: Theme.SECONDARY_COLOR,
        marginRight: 15 //So it overlaps on the edit icon above it        
    },
    price_cont: {
        //flex:1,
    },
    price: {
        fontSize: 20,
        color: Theme.PRIMARY_COLOR,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    card_content: {
        color: Theme.FAINT
    },




    price_label: {
        fontSize: 14,
        color: Theme.PRIMARY_COLOR,
        textAlign: 'center'
    },
    btn_cont: {
        width:'100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical:13
    },
    details_cont:{
        paddingVertical:8,
    },
    certification_name:{
        color: Theme.FAINT,
        fontSize: 16
    },
    detail:{
        flexDirection: 'row',
        paddingVertical:5
    },
    detail_icon:{
        width:30,
        padding:0,
        marginRight: 8,
        color: Theme.PRIMARY_COLOR,
    },
    detail_label:{
        fontSize: 13,
        lineHeight:20,
        color: Theme.FAINT,
    },
    rules: {
        fontSize: 15,
        paddingVertical: 15
    },
    guest: {
        flexDirection: 'row',
        paddingVertical:10
    },
    contact:{
        backgroundColor: Theme.FAINT,
        padding:15,
        width:'100%',
        marginVertical:10
    }
})
