/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'

// FIREBASE DEPENDENCIES
import _ from 'underscore'
import DropDownPicker from 'react-native-dropdown-picker';
import { firebase, configKeys } from '../config/config'
import { DraxProvider, DraxList } from 'react-native-drax';


// COMPONENTS
import { Text, StyleSheet, View, TextInput, ScrollView, Dimensions, TouchableOpacity, Modal, Alert, Switch,ActivityIndicator, Platform} from 'react-native'
import AppContext from '../components/AppContext';
import {getEndpoint} from '../helpers/helpers'
import { CustomButton } from '../components/Button'
import { Formik, useFormikContext, Field } from 'formik'
import ImageUploader from '../components/ImageUploader';
import * as yup from 'yup'
import BouncyCheckbox from "react-native-bouncy-checkbox";
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// STYLES
import {globalStyles, TouchableHighlight, modal, forms} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { Entypo, FontAwesome, FontAwesome5, MaterialCommunityIcons, AntDesign, MaterialIcons } from '@expo/vector-icons'



/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/


export default function CreateMenuScreen({route,navigation}) {

    console.log("P",route.params)


    const appsGlobalContext = useContext(AppContext);
    const uid = appsGlobalContext.userID
    const [modalVisible,setModalVisible] = useState(false)
    const [isCourse, setIsCourse] = useState(true);
    const [coursesList, setCoursesList] = useState([]);
    const [newItem, setNewItem] = useState(null);
    const [newCourse, setNewCourse] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [open, setOpen] = useState(false);
    const [isPhotoMode, setPhotoMode] = useState(false);    
    const [alphaData, setAlphaData] = useState((route.params) ? route.params.menu : []);
    const [menuID, setMenuID] = useState((route.params) ? route.params.menuID : null);
    const [descriptionText, setDescriptionText] = useState(null);





    /***********************************************/
    // COURSE MGMT
    /***********************************************/
    const toggleCourse = () => setIsCourse(previousState => !previousState);

    const getCourses = () => {
        let courseArray = []
        let courses = _.where(alphaData,{type:'course'})
        for(let course in courses){
            let courseName = courses[course].title
            courseArray.push({label: courseName, value: courseName})
        }
        setCoursesList(courseArray)
    }

    const getCourseIndex = (course = 'Dessesrt') => {
        let index =_.findLastIndex(alphaData, {
            title: course
          });
        return (index > -1) ? index : null
    }
    

    /***********************************************/
    // ITEM MGMT - ADD
    /***********************************************/
    const addNewMenuItem = async () => {
        if(newItem){
            let item
            let newUsers
            if(isCourse){
                item =  {
                    type: 'course',
                    title: newItem,
                }
                if(isEdit){
                    newUsers = [...alphaData];
                    newUsers.splice(isEdit.editIndex, 1, item);
                }
                else{
                    newUsers = [...alphaData, item];
                }
            }
            else{
                item =  {
                    type: 'item',
                    title: newItem,
                    description: descriptionText,
                    course: newCourse
                }
                const courseIndex = getCourseIndex(newCourse)
                if(courseIndex === null){
                    newUsers = [...alphaData, item];
                    if(isEdit){
                        newUsers = [...alphaData];
                        newUsers.splice(isEdit.editIndex, 1, item);
                        setIsEdit(false)
                    }
                    else{
                        newUsers = [...alphaData, item];
                        setIsEdit(false)
                    }
                }
                else{
                    if(isEdit){
                        console.log("removeing items")
                        updatedUsers = await removeItem(isEdit.editIndex)
                        setIsEdit(false)
                        newUsers = [...updatedUsers];
                        //console.log("adding item")
                        //newUsers.splice(courseIndex + 1, 0, item);
                    }
                    else{
                        newUsers = [...alphaData];
                        newUsers.splice(courseIndex + 1, 0, item);
                    }
                }
            }
            setAlphaData(newUsers)
            console.log(newUsers)
            setModalVisible(false)
            clearItems()
        }
        else{
            Alert.alert("Error", "Please insert an item or course")
        }
    }

    /***********************************************/
    // ITEM MGMT - EDIT
    /***********************************************/
    const editMenuItems = (newItem,index) => {
        newItem.editIndex = index
        setIsEdit(newItem)
        //Chek if its a course
        setIsCourse((newItem.type == 'course') ? true : false)
        setNewItem(newItem.title);
        if(newItem.description) setDescriptionText(newItem.description)
        getCourses()
        setModalVisible(true)
    }

    /***********************************************/
    // ITEM MGMT - REMOVE
    /***********************************************/
    const removeItem = async (index) => {
        const newUsers = [...alphaData];
        newUsers.splice(index, 1);
        setAlphaData(newUsers);
        return newUsers    
    }

    const removeConfirm = (index) => {
        Alert.alert(
            "Remove Item",
            "Are you sure you want to remove this item?",
            [
              {
                text: "Cancel",
                onPress: () => console.log("Cancel Pressed"),
                style: "cancel"
              },
              { text: "OK", onPress: () => {
                  removeItem(index)
              }}
            ]
        );
    }

    const clearItems = () => {
        setNewItem('')
        setDescriptionText('')
        setNewCourse('')
    }


    /***********************************************/
    // SUBMIT MENU
    /***********************************************/

    const generateMenu = async (values) => {
        if(_.isEmpty(values)){
            Alert.alert("Error","Please make sure you create a title and description.")
            return
        }

        const courses = []
        let itemIndex
        let currentCourse = null
        let courseObject = {}
        for (const key in alphaData){
            let itemDetail = alphaData[key]
            if(itemDetail.type == 'course'){
                //if we've estalised a current course then its not our first time and
                //we need to push the previous courseObject to the courses array
                if(!_.isEmpty(courseObject)){
                    courses.push(courseObject)
                    courseObject = {}
                }
                currentCourse = itemDetail.title
                courseObject.course = currentCourse
                courseObject.items = []
                itemIndex = 1
            }
            //Its an item, add it tot he active course object
            else{
                itemDetail.course = currentCourse
                itemDetail.order = itemIndex
                courseObject.items.push(itemDetail)
                itemIndex++
            }
        }
        courses.push(courseObject)
        const masterMenus = {
            title: values.title,
            description: values.description,
            courses: courses
        }
        console.log(masterMenus)
        //SEND MENU TO API
        try{
            const result = await fetch(getEndpoint(appsGlobalContext,'create_menu'), {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    chefID: uid,
                    menu: masterMenus,
                    menuID: menuID
                })
            });
            const response = await result.json()
            console.log('response',response)
            //SAVE MENU ID SO PHOTO CAN ACCESS IT
            setMenuID(response.menuID)
        }
        catch(error){
            console.log('Menu Create ERROR',error);
        }  
        //MENU ADDED NOW GO TO PHOTOS
        setPhotoMode(true)
    }

    /***********************************************/
    // PHOTO MODE
    /***********************************************/
    const [menuImg,setMenuImg] = useState((route.params) ? route.params.photo.uri : null)
    const getImageUrl = async (url)=> {
        console.log("Got the image",url)
        setMenuImg(url)
      }

    const addPhotoToMenu = async (url)=> {
        const usersRef = firebase.firestore().collection('chefs').doc(uid).collection('menus')
        await usersRef.doc(menuID).update({
            photos: firebase.firestore.FieldValue.arrayUnion(menuImg)
        });
        setPhotoMode(false)
        Alert.alert(
            "Congratulations",
            "Your menu has been created.",
            [
                { text: "View Menus", onPress: () => navigation.navigate('Menu') }
            ]
        )
    }
      
    /***********************************************/
    // USE EFFECT
    /***********************************************/
    useEffect(() => {
        console.log("Hello editor")
        //getMenus(uid)
    }, [1])


    /***********************************************/
    // RENDER SCREEN
    /***********************************************/
    if(alphaData){
        return (
            <SafeAreaView style={globalStyles.safe_light}>
                <KeyboardAwareScrollView>
                {isPhotoMode 
                ? <View style={[globalStyles.page,{alignItems: 'center', justifyContent: 'center'}]}>
                    <ScrollView>
                        <Text style={[globalStyles.h1, styles.headline_text]}>Photos</Text>
                        {!menuImg 
                            ? <Text style={[globalStyles.subtitle, styles.subtitle_text]}>Showcase your dishes with at least one high quality pic.</Text>
                            : <Text style={[globalStyles.subtitle, styles.subtitle_text]}>Update your photos or click continue to publish your menu.</Text>
                        }
                        <View style={{paddingVertical:20}}>
                            <ImageUploader currentImg={menuImg} getImageUrl={getImageUrl} shape="rectangle"/>
                        </View>
                        {menuImg &&
                        <CustomButton  size="big" onPress={() => addPhotoToMenu()} text="Continue" />
                        }
                        </ScrollView>
                </View>
                : <View style={[globalStyles.page,{alignItems: 'center'}]}>
                    <Formik
                        enableReinitialize={true}
                        initialValues={{
                            title:(route.params) ? route.params.name : '',
                            description:(route.params) ? route.params.description : '',
                        }}
                        onSubmit={values => {
                            //setIsDisabled(false)
                            //values.chef_id = uid
                            generateMenu(values)

                        }}
                        validationSchema={yup.object().shape({
                            //name: yup.string().required('Please, provide your name!'),
                        })}
                    >
                        {({
                            values,
                            errors,
                            handleChange,
                            setFieldValue,
                            handleBlur,
                            isValid,
                            handleSubmit
                        }) => (
                        <View style={styles.formik}>
                            <Text style={globalStyles.blurb}>Create your menu by filling out the following details and then adding courses and items down below.</Text>
                                <View style={styles.formik_section}>
                                    <TextInput 
                                        style={[forms.input]} 
                                        //multiline={true}
                                        textAlignVertical="top" 
                                        placeholder="Name of Meal (eg: 3 Course Italian Dinner)"
                                        onChangeText={handleChange('title')}
                                        onBlur={handleBlur('title')}
                                        value={values.title}
                                    />
                                    <TextInput 
                                        style={[forms.input]} 
                                        //multiline={true}
                                        textAlignVertical="top" 
                                        placeholder="Short Description"
                                        onChangeText={handleChange('description')}
                                        onBlur={handleBlur('description')}
                                        value={values.description}
                                    />

                                    {/******* PREPARE MENU EDITOR BOX *******/}
                                    {!_.isEmpty(alphaData)  
                                    ?  <DraxProvider>
                                        <View style={styles.drax_container}>
                                            <DraxList
                                            data={alphaData}
                                            lockItemDragsToMainAxis
                                            keyExtractor={(item,index) => index}
                                            renderItemContent={({ item, index }) => (
                                                <TouchableOpacity onPress={() => { editMenuItems(item,index)  }}>
                                                    <View style={[styles.draggableItem, getItemStyleTweaks(item)]}>
                                                        <View style={{flexDirection:'row',alignItems:'center'}}>
                                                            <MaterialCommunityIcons name="drag-vertical" size={14} color={Theme.PRIMARY_COLOR} />
                                                            <Text style={[styles.itemText, (item.type == 'item') ? {fontSize:16, marginLeft:20} : {fontSize:23}]}>{item.title}</Text>
                                                        </View>
                                                        <FontAwesome 
                                                            name="trash-o" 
                                                            size={15} 
                                                            color={Theme.PRIMARY_COLOR} 
                                                            style={{textAlign:'right',padding:6,marginRight:2}}
                                                            onPress={() => {
                                                                removeConfirm(index)
                                                            }}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            )}
                                            onItemReorder={({ fromIndex, toIndex }) => {
                                                const newData = alphaData.slice();
                                                newData.splice(toIndex, 0, newData.splice(fromIndex, 1)[0]);
                                                setAlphaData(newData);
                                            }}
                                            onItemDragStart ={({ dragged: { payload } }) => {
                                                console.log("DRAGGING HAS STARTED")
                                            }}
                                            />
                                        </View>
                                    </DraxProvider>
                                    : <View style={styles.no_items}><Text>NO MENU ITEMS</Text></View>
                                }
                            </View>

                            {/* BOTTOM TOOLBAR */}
                            <View style={styles.formik_section,styles.add_item_cont}>
                                <View style={styles.add_box}>
                                    <TouchableOpacity style={styles.add_course_item} onPress={() => {
                                        getCourses()
                                        setModalVisible(true)
                                    }} >
                                        <Entypo name="add-to-list" size={20} color={Theme.WHITE} />
                                        <Text style={styles.add_text}>Add Course or Item</Text>
                                    </TouchableOpacity>
                                </View>
                                {!_.isEmpty(alphaData) &&
                                    <View style={styles.add_box}>
                                        <TouchableOpacity style={styles.add_course_item} onPress={handleSubmit} >
                                            <Entypo name="check" size={20} color={Theme.WHITE} />
                                            <Text style={styles.add_text}>DONE</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                                </View>
                            </View>
                            )}
                        </Formik>


                        <Modal animationType="slide" transparent={true} visible={modalVisible}
                            onRequestClose={() => {
                                setModalVisible(false);
                                setIsEdit(false)
                            }}
                        >
                            <View style={modal.modalBackground}>
                                <View style={modal.modalView}>
                                    <TouchableOpacity activeOpacity={.7}  style={[modal.close_button]} onPress={() => {
                                        setModalVisible(false)
                                        setIsEdit(false)
                                    }}>
                                        <AntDesign name="closecircleo" size={25} color={Theme.SECONDARY_COLOR} />
                                    </TouchableOpacity>
                                    <View style={modal.modalHeader}>
                                        {isEdit &&
                                            <Text style={{fontSize:17,color:Theme.PRIMARY_COLOR}}>Edit {isEdit.type}</Text>
                                        }
                                    </View>

                                    {/* NOT EDITING MODE - SHOW TOGGLE */}
                                    {!isEdit &&
                                        <View style={styles.toggleBox}>
                                            <Text style={[styles.toggleLabel,(!isCourse ? styles.toggleActive : styles.toggleInActive)]}>Add Item</Text>
                                            <Switch
                                                trackColor={{ false: Theme.SECONDARY_COLOR_LIGHT, true: Theme.SECONDARY_COLOR_LIGHT}}
                                                thumbColor={isCourse ? Theme.SECONDARY_COLOR: Theme.SECONDARY_COLOR}
                                                ios_backgroundColor={Theme.SECONDARY_COLOR_LIGHT}
                                                onValueChange={toggleCourse}
                                                value={isCourse}
                                            />
                                            <Text style={[styles.toggleLabel,(isCourse ? styles.toggleActive : styles.toggleInActive)]}>Add Course</Text>
                                        </View>
                                    }

                                    {/* THIS INOPT WILL BE ITEM NAME OR COURSE NAME DEPENING ON TOGGLE */}
                                    <TextInput 
                                        style={[forms.input]} 
                                        textAlignVertical="top" 
                                        placeholder={isCourse ? "Course Name" : "Item Name"}
                                        placeholderTextColor={Theme.FAINT}
                                        onChangeText={(text) => setNewItem(text)}
                                        //onBlur={handleBlur('description')}
                                        value={newItem}
                                    />

                                    {/* ITEM CREATOR/EDITOR */}
                                    {!isCourse &&
                                        <>
                                        <TextInput 
                                            style={[forms.input,{marginBottom:30}]} 
                                            textAlignVertical="top" 
                                            placeholder="Short Description"
                                            placeholderTextColor={Theme.FAINT}
                                            onChangeText={(text) => setDescriptionText(text)}
                                            //onBlur={handleBlur('description')}
                                            value={descriptionText}
                                        />
                                        <DropDownPicker
                                            items={coursesList}
                                            open={open}
                                            setOpen={setOpen}
                                            zIndex={1000}
                                            closeAfterSelecting={true}
                                            itemSeparator={true}
                                            //setItems={setItems}
                                            value={newCourse}
                                            setValue={setNewCourse}
                                            onChangeValue={(value) => {
                                                setNewCourse(value)
                                            }}
                                            placeholder="Select a Course"
                                            placeholderStyle={{
                                                color: Theme.FAINT,
                                                fontSize:18
                                            }}
                                            style={{
                                                borderColor: Theme.BORDER_COLOR,
                                                marginBottom:20,
                                            }}
                                            dropDownContainerStyle={{
                                                borderColor: Theme.FAINT
                                            }}
                                            labelStyle={{
                                                color: Theme.PRIMARY_COLOR,
                                                fontSize:18
                                            }}
                                            listItemLabelStyle={{
                                                color: Theme.PRIMARY_COLOR,
                                                fontSize:18
                                            }}
                                            itemSeparatorStyle={{
                                                backgroundColor: Theme.BORDER_COLOR
                                            }}
                                        />
                                        </>
                                    }
                                    <CustomButton  size="big" onPress={() => addNewMenuItem()} text={(!isCourse) ? "ADD ITEM" : "ADD COURSE" } />
                                </View>
                            </View>
                        </Modal>
                    </View>
                }
                </KeyboardAwareScrollView>
            </SafeAreaView>
        )
    }
}


/***********************************/
// HELEPRS
/***********************************/
const getItemStyleTweaks = (alphaItem) => {
    if(alphaItem.type == 'item'){
        return {
            backgroundColor: Theme.SURFACE_COLOR,
            borderColor: Theme.BORDER_COLOR,
            borderBottomWidth: 1
        }
    }
};

/***********************************/
// STYLES
/***********************************/
const styles = StyleSheet.create({
    formik:{
        justifyContent: 'flex-start',
        width:'100%',
        flex:1
    },
    formik_section:{
        flex:1,
        margin:10,
    },
    no_items: {
        flex:1,
        backgroundColor:'red',
        justifyContent:'center',
        alignItems:'center',
        borderRadius:20,
        margin:10,
        backgroundColor: Theme.PRIMARY_COLOR_FAINT,
        borderColor:Theme.FAINT,
        borderWidth:1
    },
    add_item_cont:{
        width:'100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderTopColor: Theme.PRIMARY_COLOR,
        borderTopWidth: 1
    },
    add_box: {
        alignItems: 'center',
    },
    add_course_item: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        marginVertical:10,
        backgroundColor: Theme.SECONDARY_COLOR,
        borderRadius:12
    },
    add_text: {
        color: Theme.WHITE,
        fontSize: 16,
        marginLeft: 15
    },
    toggleBox:{
        flexDirection:'row',
        width:'100%',
        marginTop:10,
        paddingVertical:20,
        paddingHorizontal:10,
        alignItems:'center',
        justifyContent:'center'
    },
    toggleLabel: {
        padding:10,
        fontSize:14,
        fontWeight: 'normal'
    },
    toggleActive: {
        fontWeight: 'bold',
        color: Theme.TEXT_ON_SURFACE_COLOR
    },
    toggleInActive: {
        fontWeight: 'normal',
        color: Theme.TEXT_ON_SURFACE_COLOR_LIGHT
    },
    drax_container: {
        padding:10,
        backgroundColor: Theme.SURFACE_COLOR_LIGHT,
        borderColor: Theme.BORDER_COLOR,
        borderWidth:1
    },
    draggableItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Theme.PRIMARY_COLOR_FAINT,
        paddingVertical:20,
        paddingHorizontal:5,
    },
    itemText: {    
        paddingLeft:5
    },
})
