/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useRef } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'


//Other Dependencies
import _ from 'underscore'
import { Formik, useFormikContext, Field } from 'formik'
import * as yup from 'yup'
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { MultiSelect } from 'react-native-element-dropdown';


// COMPONENTS
import { TextInput, Text, StyleSheet, View, ScrollView, Dimensions, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView } from 'react-native'
import ImageUploader from '../components/ImageUploader';
import { CustomButton } from '../components/Button'
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// STYLES
import { globalStyles, modal, footer, forms } from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { FontAwesome, AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function ProfileSlider({handleFormUpdates,userData}) {


    const DATA = [
        { label: 'African', value: 'African' },
        { label: 'Algerian', value: 'Algerian' },
        { label: 'American', value: 'American' },
        { label: 'Asian', value: 'Asian' },
        { label: 'Austrailian', value: 'Austrailian' },
        { label: 'BBQ', value: 'BBQ' },
        { label: 'Belgian', value: 'Belgian' },
        { label: 'Brazilian', value: 'Brazilian' },
        { label: 'British', value: 'British' },
        { label: 'Brunch', value: 'Brunch' },
        { label: 'Burritos', value: 'Burritos' },
        { label: 'Cajun', value: 'Cajun' },
        { label: 'Carribean', value: 'Carribean' },
        { label: 'Chinese', value: 'Chinese' },
        { label: 'Chocolate', value: 'Chocolate' },
        { label: 'Cookies', value: 'Cookies' },
        { label: 'Cuban', value: 'Cuban' },
        { label: 'Cupcakes', value: 'Cupcakes' },
        { label: 'Dessert', value: 'Dessert' },
        { label: 'Dim Sum', value: 'Dim Sum' },
        { label: 'Doughnuts', value: 'Doughnuts' },
        { label: 'Drunk Food', value: 'Drunk Food' },
        { label: 'Egyptian', value: 'Egyptian' },
        { label: 'Empanadas', value: 'Empanadas' },
        { label: 'Filipino', value: 'Filipino' },
        { label: 'Fish & Chips', value: 'Fish & Chips' },
        { label: 'Fondue', value: 'Fondue' },
        { label: 'French', value: 'French' },
        { label: 'Fried Chicken', value: 'Fried Chicken' },
        { label: 'German', value: 'German' },
        { label: 'Greek', value: 'Greek' },
        { label: 'Habachi', value: 'Habachi' },
        { label: 'Haitian', value: 'Haitian' },
        { label: 'Haute', value: 'Haute' },
        { label: 'Healthy', value: 'Healthy' },
        { label: 'Indian', value: 'Indian' },
        { label: 'Indonesian', value: 'Indonesian' },
        { label: 'Irish', value: 'Irish' },
        { label: 'Island', value: 'Island' },
        { label: 'Italian', value: 'Italian' },
        { label: 'Japanese', value: 'Japanese' },
        { label: 'Jerk', value: 'Jerk' },
        { label: 'Jewish', value: 'Jewish' },
        { label: 'Korean', value: 'Korean' },
        { label: 'Korean BBQ', value: 'Korean BBQ' },
        { label: 'Korean Hot Pot', value: 'Korean Hot Pot' },
        { label: 'Labanese', value: 'Labanese' },
        { label: 'Late Night', value: 'Late Night' },
        { label: 'Latvian', value: 'Latvian' },
        { label: 'Libyan', value: 'Libyan' },
        { label: 'Mediterranean', value: 'Mediterranean' },
        { label: 'Mexican', value: 'Mexican' },
        { label: 'Moroccan', value: 'Moroccan' },
        { label: 'Nashville Hot Chicken', value: 'Nashville Hot Chicken' },
        { label: 'New Zealand', value: 'New Zealand' },
        { label: 'Nigerian', value: 'Nigerian' },
        { label: 'Noodles', value: 'Noodles' },
        { label: 'Omakase', value: 'Omakase' },
        { label: 'Oysters', value: 'Oysters' },
        { label: 'Pakistani', value: 'Pakistani' },
        { label: 'Pasta', value: 'Pasta' },
        { label: 'Peruvian', value: 'Peruvian' },
        { label: 'Pho', value: 'Pho' },
        { label: 'Pizza', value: 'Pizza' },
        { label: 'Polish', value: 'Polish' },
        { label: 'Portugese', value: 'Portugese' },
        { label: 'Ramen', value: 'Ramen' },
        { label: 'Russian', value: 'Russian' },
        { label: 'Salvadoran', value: 'Salvadoran' },
        { label: 'Seafood', value: 'Seafood' },
        { label: 'Shellfish', value: 'Shellfish' },
        { label: 'Sicilian', value: 'Sicilian' },
        { label: 'Sous Vide', value: 'Sous Vide' },
        { label: 'Smoothies', value: 'Smoothies' },
        { label: 'South African', value: 'South African' },
        { label: 'Southern BBQ', value: 'Southern BBQ' },
        { label: 'Spanish Tapas', value: 'Spanish Tapas' },
        { label: 'Sushi', value: 'Sushi' },
        { label: 'Swedish', value: 'Swedish' },
        { label: 'Sweets', value: 'Sweets' },
        { label: 'Tacos', value: 'Tacos' },
        { label: 'Tamales', value: 'Tamales' },
        { label: 'Tex Mex', value: 'Tex Mex' },
        { label: 'Thai', value: 'Thai' },
        { label: 'Tibetan', value: 'Tibetan' },
        { label: 'Turkish', value: 'Turkish' },
        { label: 'United Kingdom', value: 'United Kingdom' },
        { label: 'Vietnamese', value: 'Vietnamese' },
        { label: 'Welsh', value: 'Welsh' },
        { label: 'Wild Game', value: 'Wild Game' },
    ];

    const [cuisines, setCuisines] = useState([]);

    const renderDataItem = (item) => {
        return (
            <View style={styles.item}>
                <Text style={styles.selectedTextStyle}>{item.label}</Text>
                <AntDesign style={styles.icon} color="black" name="check" size={20} />
            </View>
        );
    };




    /***********************************************/
    // SAVE PROFILE IMAGE
    /***********************************************/
    const [profileImg,setProfileImg] = useState(null)
    const getImageUrl = async (url)=> {
        console.log("Got the image",url)
        setProfileImg(url)
    }

    /***********************************************/
    // SETUP SCROLLING CAROSUEL
    /***********************************************/
    let totalScreens = 3
    let screenWidth = Math.trunc(windowWidth * .9)
    let scrollerWidth = screenWidth * totalScreens
    const [activeImage, setActiveImage] = useState(1) //the first image is active

    /*******************/
    // Setup Pager Dots
    /*******************/
    const determineCurrentImage = (offset) => {
        console.log("*************************")
        console.log("OFFSET", offset)
        console.log("windowWidth", windowWidth)
        console.log("divided", (offset / windowWidth))
        console.log("rounded", Math.round(offset / windowWidth))
        console.log("active image", Math.round(offset / windowWidth) + 1)
        //The current image is based on dividing the X position of the scroller
        //by the width of the screen and adding 1 to figure out the NEW active one
        return Math.round((offset / windowWidth)) + 1
    }
    //Create array of pager dots
    let bullets = [];
    for (let i = 1; i <= totalScreens; i++) {
        //If the bullet number matches the active image then change its opacity
        bullets.push(<Text key={i} style={[styles.bullet, { opacity: activeImage === i ? 0.9 : 0.3 }]}>&bull;</Text>)
    }

    /*******************/
    // Setup Prev/Next Button
    /*******************/

    const scrollViewRef = useRef();
    const goToPrev = () => {
        //Make sure current screen isn't 1 because otherwise there is no prev
        if (activeImage > 1) {
            //Get the x coordinates of the prev screen
            let prevScreen = (activeImage - 2) * screenWidth

            console.log("ACTIVE - 1", (activeImage - 1))
            console.log("REV", prevScreen)
            //Scroll to the point in the carousuel
            scrollViewRef.current.scrollTo({ x: prevScreen, animated: true })
            //increment the active image which in turn will uppdate the bullet
            setActiveImage(activeImage - 1)
        }
    }

    const goToNext = () => {
        //Make sure current screen isn't equal to the number of total screens (otherwise there is no next)
        if (activeImage < totalScreens) {
            //Get the x coordinates of the next screen
            let nextScreen = activeImage * screenWidth

            console.log("ACTIVE + 1", (activeImage + 1))
            console.log("NEXT", nextScreen)

            //Scroll to the point in the carousuel
            scrollViewRef.current.scrollTo({ x: nextScreen, animated: true })
            //increment the active image which in turn will uppdate the bullet
            setActiveImage(activeImage + 1)
        }
    }


    /***********************************************/
    // END SCROLLING CAROSUEL
    /***********************************************/

    return (
        <View style={styles.carousel}>
            <Formik
                enableReinitialize={true}
                initialValues={userData}
                onSubmit={values => {
                    //If an image was added make sure we add it
                    console.log("Is there profile image?",profileImg)
                    if(profileImg) values.profile_img = profileImg
                    //Add an onboarding flag as complete IF they have added:
                    // photo, bio, cuisines
                    if(values.cuisines && values.profile_img && values.bio) values.isOnboarded = true
                    //Upda the form
                    handleFormUpdates(values)
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
            <>

            <View style={[styles.header, modal.close_button,{position:'relative'}]} />
            <KeyboardAvoidingView behavior={Platform.OS == 'ios' ? 'padding' : 'height'} >
                <ScrollView
                    horizontal={true}
                    contentContainerStyle={{ width: scrollerWidth }}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={200}
                    decelerationRate="fast"
                    ref={scrollViewRef}
                    pagingEnabled
                    //Using Momemtum End we can get the X value of where the scroller is after it stops
                    onMomentumScrollEnd={data => {
                        setActiveImage(determineCurrentImage(data.nativeEvent.contentOffset.x));
                    }}
                >


                    {/*********************   
                     * SCREEN 1 - CUISINES 
                     ********************/}

                    

                    <View style={styles.screen}>

                        <Text style={[globalStyles.h1, styles.headline_text]}>Which cuisines do you serve, Chef?</Text>
                        <Text style={[globalStyles.subtitle, styles.subtitle_text]}> Tap any that apply</Text>
                            <MultiSelect
                                style={styles.dropdown}
                                placeholderStyle={styles.placeholderStyle}
                                selectedTextStyle={styles.selectedTextStyle}
                                inputSearchStyle={styles.inputSearchStyle}
                                iconStyle={styles.iconStyle}
                                data={DATA}
                                labelField="label"
                                valueField="value"
                                placeholder="Cuisines"
                                value={cuisines}
                                search
                                searchPlaceholder="Search..."
                                onChange={item => {
                                    setCuisines(item)
                                    setFieldValue(cuisines,cuisines)
                                    console.log("selected items",cuisines)
                                }}
                                renderLeftIcon={() => (
                                    <MaterialCommunityIcons
                                        style={styles.icon}
                                        color="black"
                                        name="silverware-fork-knife"
                                        size={20}
                                    />
                                )}
                                renderItem={renderDataItem}
                                renderSelectedItem={(item, unSelect) => (
                                    <TouchableOpacity onPress={() => unSelect && unSelect(item)}>
                                        <View style={styles.selectedStyle}>
                                            <Text style={styles.textSelectedStyle}>{item.label}</Text>
                                            <AntDesign color="black" name="delete" size={17} />
                                        </View>
                                    </TouchableOpacity>
                                )}
                            />
                    </View>

                    {/***************   
                     * SCREEN 2 - BIO 
                     ***************/}
                    <View style={styles.screen}>
                            <ScrollView showsVerticalScrollIndicator={false}>
                                <Text style={[globalStyles.h1, styles.headline_text]}>Introduce Yourself</Text>
                                <Text style={[globalStyles.subtitle, styles.subtitle_text]}>Talk about your background and achievements. Show off a little!</Text>
                                <TextInput 
                                    multiline={true}
                                    textAlignVertical="top" 
                                    style={[forms.input,forms.textarea]} 
                                    placeholder="Start Typing..."
                                    onChangeText={handleChange('bio')}
                                    onBlur={handleBlur('bio')}
                                    value={values.bio}
                                />
                                <Text style={globalStyles.h2}>How about some fun facts? (Optional)</Text>
                                <TextInput 
                                    multiline={true}
                                    textAlignVertical="top" 
                                    style={[forms.input,forms.textarea_short]} 
                                    placeholder="Fun Fact 1"
                                    onChangeText={handleChange('facts1')}
                                    onBlur={handleBlur('facts1')}
                                    value={values.facts1}
                                />
                                <TextInput 
                                    multiline={true}
                                    textAlignVertical="top" 
                                    style={[forms.input,forms.textarea_short]} 
                                    placeholder="Fun Fact 2"
                                    onChangeText={handleChange('facts2')}
                                    onBlur={handleBlur('facts2')}
                                    value={values.facts2}
                                />
                            </ScrollView>
                    </View>

                    {/*******************   
                     * SCREEN 3 - PICTURE 
                    ******************/}
                    <View style={styles.screen}>
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Text style={[globalStyles.h1, styles.headline_text]}>Hey Chef, let’s set up your profile photo</Text>
                            <Text style={[globalStyles.subtitle, styles.subtitle_text]}>First impressions matter. Upload a professional and clear photo.</Text>
                            <ImageUploader currentImg={values.profile_img} getImageUrl={getImageUrl} shape="round"/>
                            <Text style={globalStyles.p}>Tips:</Text>
                            <View style={globalStyles.list_cont}><Text style={globalStyles.list_bullet}>•</Text><Text style={globalStyles.list_item}>Use a picture of yourself or cooking instead of a logo. It’s more personal that way.</Text></View>
                            <View style={globalStyles.list_cont}><Text style={globalStyles.list_bullet}>•</Text><Text style={globalStyles.list_item}>Try to use a solid background.</Text></View>
                            <View style={globalStyles.list_cont}><Text style={globalStyles.list_bullet}>•</Text><Text style={globalStyles.list_item}>Use a clear photo.</Text></View>
                        </ScrollView>
                    </View>


                </ScrollView>
            </KeyboardAvoidingView>
            <View style={styles.footer}>
                <View style={styles.button_container}>
                    <TouchableOpacity style={{ padding: 8 }} onPress={() => goToPrev()}>
                        <AntDesign name="left" size={20} color={Theme.SECONDARY_COLOR} style={{ paddingLeft: 5 }} />
                    </TouchableOpacity>
                    <View style={styles.bullets}>{bullets}</View>
                    <TouchableOpacity style={{ padding: 8 }} onPress={() => goToNext()}>
                        <AntDesign name="right" size={20} color={Theme.SECONDARY_COLOR} style={{ paddingLeft: 5 }} />
                    </TouchableOpacity>
                </View>
                <View>
                    <TouchableOpacity activeOpacity={.7}  style={[styles.close_button,{position:'relative'}]} disabled={!isValid} onPress={handleSubmit} >
                        <Text style={{color:Theme.SECONDARY_COLOR,fontWeight:'bold',textAlign:'right'}}>DONE</Text>
                    </TouchableOpacity>
                </View>
            </View>
            </>
            )}
            </Formik>
        </View>
    )
}

const styles = StyleSheet.create({
    carousel:{
        justifyContent: 'flex-start',
        width: windowWidth * .9,
        height: windowHeight * .9,
    },
    header: {
        backgroundColor: Theme.SURFACE_COLOR,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        alignItems: 'flex-end',
        marginTop:20
    },
    screen: {
        flex: 1,
        padding: 20,
        paddingTop:5,
        backgroundColor: Theme.SURFACE_COLOR,
        justifyContent: 'flex-start',
    },
    headline_text: {
        paddingTop: 0,
        textAlign: 'left',
    },
    subtitle_text: {
        textAlign: 'left',
    },
    bullets: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10
    },
    bullet: {
        color: Theme.SECONDARY_COLOR,
        paddingHorizontal: 5,
        fontSize: 40,
    },
    close_button:{
        color: Theme.SECONDARY_COLOR,
        padding: 10,
        zIndex:10000,
        fontWeight:Theme.FONT_WEIGHT_HEAVY
    },
    checkboxes: {
        flex:1,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    checkbox_group: {
        justifyContent: 'space-around',
    },
    checkbox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop:20,
        marginRight:10
    },
    long_list_group: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        flexWrap: 'wrap',

        
    },
    bouncy_checkbox: {
        color: Theme.PRIMARY_COLOR,
        width: 35,
    },
    footer: {
        backgroundColor: Theme.SURFACE_COLOR,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
        padding: 10,
        borderTopColor: Theme.FAINT,
        borderTopWidth:1
    },
    button_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'
    },













    dropdown: {
        height: 50,
        marginTop:30,
        backgroundColor: 'white',
        borderRadius: 12,
        padding: 12,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    placeholderStyle: {
        fontSize: 16,
    },
    selectedTextStyle: {
        fontSize: 14,
    },
    iconStyle: {
        width: 20,
        height: 20,
    },
    inputSearchStyle: {
        height: 40,
        fontSize: 16,
    },
    icon: {
        marginRight: 5,
    },
    item: {
        padding: 17,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    selectedStyle: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 14,
        backgroundColor: 'white',
        shadowColor: '#000',
        marginTop: 8,
        marginRight: 12,
        paddingHorizontal: 12,
        paddingVertical: 8,
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,

        elevation: 2,
    },
    textSelectedStyle: {
        marginRight: 5,
        fontSize: 16,
    },
})
