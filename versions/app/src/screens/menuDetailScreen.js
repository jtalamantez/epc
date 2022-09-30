/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, StyleSheet, View, ScrollView, Dimensions , Image, ActivityIndicator, TextInput} from 'react-native'

//Other Dependencies
import { firebase, configKeys } from '../config/config'
import _ from 'underscore'

// COMPONENTS
import AppContext from '../components/AppContext';
import { CustomButton } from '../components/Button';
import {getEndpoint} from '../helpers/helpers'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// STYLES
import {globalStyles, menusStyles, footer, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';


/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function MenuDetailScreen({route,navigation}) {
    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID
    const activeFlow = appsGlobalContext.activeFlow
    console.log(activeFlow)
    console.log(uid)
    const [isEditable,setIsEditable] = useState(false)
    const [menuItems,setMenuItems] = useState(false)
    const pageName = route.params.pageName
    const details = route.params.details
    const [menuImg,setMenuImg] = useState(null)
    const [added,setAdded] = useState(false)


    const addToMyMenu = async (menuID) =>{
        console.log(menuID,uid)
        try{
            const result = await fetch(getEndpoint(appsGlobalContext,'copy_template'), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    menu_template_id: menuID,
                    user_id: uid,
                    add_data: {
                        is_custom:false,
                        is_published:false,
                        menu_template_id:menuID
                    }
                })
            });
            const json = await result.json()
            setAdded(true)
        }
        catch(error){
            console.log(error);
        } 
    }

    const editMenu = () => {
        let editableMenuFormat = []
        menuItems.map((menu,index) => {
            let addCourse = {
                type: 'course',
                title: menu.course,
            }
            editableMenuFormat.push(addCourse)
            menu.items.map((item) => {
                let addItem = {
                    type: 'item',
                    title: item.title,
                    description: (item.description) ? item.description : '',
                    course: item.course
                }
                editableMenuFormat.push(addItem)
            })
        })
        console.log(details)
        navigation.navigate('Create Menu', {
            name:details.title,
            description:details.description,
            photo: menuImg, //details.photos[0],
            menuID: details.id,
            menu:editableMenuFormat
        })
    }


               
    const getMenus = async (details) =>{
        console.log(uid,details.id)
        //If a chefID is passed in the details then use that as the ID of the chef to look for
        const chefID = (details.chefID) ? details.chefID : uid
        //If this is a template page look for the menu in templates
        //otherwise look into the chefs colelction of menus
        const firestore = firebase.firestore()
        const menuRef = (pageName == 'Templates') ? firestore.collection('menu_templates2').doc(details.id) : firestore.collection('chefs').doc(chefID).collection('menus').doc(details.id)
        const menuDoc = await menuRef.get();
        if (!menuDoc.exists) {
            console.log("No menu found")  
        }
        else{
            let menu = menuDoc.data()
            let courses = menu.courses
            let menuItems = []
            for await (const course of courses) {
                //Get all courses for this menu
                let courseSnapshot = await menuRef.collection(course).get()
                if (!courseSnapshot.empty) {
                    let items = []
                    courseSnapshot.forEach(doc => {
                        let item = doc.data()
                        items.push(item)
                    })
                    menuItems.push({items,course:course})
                }
            }
            //Set menu image if one exists
            if(menu.photos){
                console.log("FOUND IT")
                setMenuImg({ uri: menu.photos.pop() })
                //useState(require('../assets/food_pasta.png'))
            }
            else{
                setMenuImg(require('../assets/food_pasta.png'))
            }
            setMenuItems(menuItems)
        }
    }
    

    useEffect(() => {
        console.log("getting details formenu screen")
        console.log("ACTIVE FLOW",appsGlobalContext.activeFlow)
        getMenus(details)
    }, [])


    return (
        <SafeAreaView style={globalStyles.safe_light}>
            <ScrollView showsVerticalScrollIndicator={false} style={{width:'100%',flex:1}}>
                {menuImg 
                    ? <Image source={menuImg} style={styles.image} />
                    : <View style={styles.container}><ActivityIndicator size="small" color={Theme.SECONDARY_COLOR} style={styles.image} /></View>

                }
                <View style={styles.content}>
                    <View style={styles.header}>
                        <View style={styles.title}>
                            <Text style={globalStyles.h1}>{details.title}</Text>
                        </View>
                        {/*
                        <View style={styles.price_cont}>
                            <Text style={styles.price}>$120</Text>
                            <Text style={styles.price_label}>Per Person</Text>
                        </View>
                        */}
                    </View>
                    {pageName == 'Templates' &&
                    <View style={styles.btn_cont}>
                        {added
                        ? <CustomButton text='Added to My Menus' size="big" disabled="true" checkmark="true"/>
                        : <CustomButton text='Add to My Menus' onPress={() => addToMyMenu(details.id)} size="big" />
                        }
                    </View>
                    }
                    {pageName == 'Your Menus' && activeFlow == 'chefs' &&
                    <View style={styles.btn_cont}>
                        <CustomButton text='Edit' onPress={() => editMenu(true)} size="small" />
                    </View>
                    }
                    <View style={[globalStyles.card,{width:'100%'}]}>
                        <View style={globalStyles.card_header}>
                            <Text style={globalStyles.h3}>Description</Text>
                        </View>
                        <Text style={globalStyles.card_content}>{details.description}</Text>
                    </View>
                    <View style={[globalStyles.card,{width:'100%'}]}>
                    {menuItems  
                        ? menuItems.map((menu,index) => {
                            return(
                                <View style={menusStyles.menu_course_cont}  key={index}>
                                    {isEditable
                                    ? <TextInput
                                        style={[styles.custom_input]}
                                        placeholder='Course'
                                        placeholderTextColor={Theme.FAINT}
                                        keyboardType='default'
                                        //onChangeText={(text) => changeEmail(text)}
                                        //value={(menu.course) ? menu.course : newCourse}
                                        value="HI"
                                        underlineColorAndroid="transparent"
                                        autoCapitalize="none"
                                        //onFocus={() => setFocusField("email")}
                                        //onBlur={() => setFocusField(null)}
                                        //setFocus={focusField}
                                    />   
                                    : menu.course != 'blank' &&
                                        <Text style={menusStyles.menu_course}>- {menu.course} -</Text>
    
                                    }
                                    {menu.items.map((item,index2) => {
                                        return(
                                            <View style={menusStyles.menu_item_cont}  key={index2}>
                                                <Text style={menusStyles.menu_name}>{item.title || item.item_name}</Text>
                                                {item.description != '' &&
                                                    <Text style={menusStyles.menu_desc}>{item.description}</Text>
                                                }
                                            </View>
                                        )

                                    })}
                                </View>                            
                            )
                        })
                        : <ActivityIndicator size="large" color={Theme.SECONDARY_COLOR} /> 
                    }
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    custom_input:{
        borderColor: 'red',
        borderWidth: 1
    },
    image:{
        width: windowWidth,
        height: 260,
        backgroundColor: Theme.PRIMARY_COLOR
    },
    content: {
        flex:1,
        padding:15,
        alignItems: 'center',
        width:'100%'
    },
    header:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title:{
        flex:1,
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
})
