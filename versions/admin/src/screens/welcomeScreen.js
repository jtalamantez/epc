/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// COMPONENTS
import { Image, Text, StyleSheet, View, ScrollView,Dimensions } from 'react-native'
import {CustomButton} from '../components/Button'
import AsyncStorage from '@react-native-async-storage/async-storage';
const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// STYLES
import {globalStyles, TouchableHighlight, footer, forms} from '../styles/styles';
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'; 
import Theme from '../styles/theme.style.js';

/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export default function WelcomeScreen({navigation}) {
    //Check if first launch so we can run a carosouel
    const [firstLaunch,setFirstLaunch] = useState(false)
    const checkForFirstLaunch = async () => {
        try {
            const firstLaunch = await AsyncStorage.getItem('hasLaunched')
            console.log("First Launch",firstLaunch)
            if(firstLaunch === null){
                setFirstLaunch(true)
            }
        } catch (e) {
            console.warn(e);
        }
    }
    checkForFirstLaunch()

    /***********************************************/
    // SETUP SCROLLING CAROSUEL
    /***********************************************/
    let totalScreens = 5
    let scrollerWidth = Math.trunc(windowWidth * totalScreens)
    
    //Setup Pager Dots
    const [activeImage, setActiveImage] = useState(1) //the first image is active
    const determineCurrentImage = (offset) => {
        console.log("*************************")
        console.log("OFFSET",offset)
        console.log("windowWidth",windowWidth)
        console.log("dividded", (offset / windowWidth))
        console.log("rounded", Math.round(offset / windowWidth))
        //The current image is based on dividing the X position of the scroller
        //by the width of the screen and adding 1 to figure out the active one
        return Math.round((offset / windowWidth)) + 1
    }
    //Create array of pager dots
    let bullets = [];
    for (let i = 1; i <= totalScreens; i++) {
        //If the bullet number matches the active image then change its opacity
        bullets.push(<Text key={i} style={[styles.bullet,{opacity: activeImage=== i ? 0.9 : 0.3}]}>&bull;</Text>)
    }    
    /***********************************************/
    // END SCROLLING CAROSUEL
    /***********************************************/

    const onBoardingComplete = async () => {
        await AsyncStorage.setItem('hasLaunched', 'yes')
        setFirstLaunch(false)
    }

    return (
        <SafeAreaView style={globalStyles.safe_dark}>
        {firstLaunch
        ?   <View style={styles.carousel}>
                <ScrollView
                    horizontal={true}
                    contentContainerStyle={{ width: scrollerWidth }}
                    showsHorizontalScrollIndicator={false}
                    scrollEventThrottle={200}
                    decelerationRate="fast"
                    pagingEnabled
                    //Using Momemtum End we can get the X value of where the scroller is after it stops
                    onMomentumScrollEnd={data => {
                        setActiveImage(determineCurrentImage(data.nativeEvent.contentOffset.x));
                    }}
                >
                    <View style={styles.screen}>
                        <Text style={styles.benefit_text}>Host <Text style={globalStyles.italic}>your</Text> unique events!</Text>
                        <Image style={styles.benefit_icon} resizeMode='contain' source={require('../assets/onboard/events.png')} />
                    </View>
                    <View style={styles.screen}>
                        <Text style={styles.benefit_text}>Control <Text style={globalStyles.italic}>your</Text> schedule.</Text>
                        <Image style={styles.benefit_icon} resizeMode='contain' source={require('../assets/onboard/calendar.png')} />
                    </View>
                    <View style={styles.screen}>
                        <Text style={styles.benefit_text}>Create <Text style={globalStyles.italic}>your</Text> menus. {"\n"}Cook <Text style={globalStyles.italic}>your</Text> food!</Text>
                        <Image style={styles.benefit_icon} resizeMode='contain' source={require('../assets/onboard/menu.png')} />
                    </View>
                    <View style={styles.screen}>
                        <Text style={styles.benefit_text}>Set <Text style={globalStyles.italic}>your</Text> pricing.</Text>
                        <Image style={styles.benefit_icon} resizeMode='contain' source={require('../assets/onboard/calculator.png')} />
                    </View>
                    <View style={styles.screen}>
                        <Text style={styles.benefit_text}>Save for retirement!</Text>
                        <Image style={styles.benefit_icon} resizeMode='contain' source={require('../assets/onboard/chart.png')} />
                    </View>
                </ScrollView>
                <View style={styles.onboard_float}>
                    <View style={styles.bullets}>{bullets}</View>
                    <Text style={styles.signin_text} onPress={() => navigation.navigate('Login')}>Been here before? Sign in</Text>
                    <View style={styles.button_bg}>
                        <View style={styles.button_container}>
                            <CustomButton text="Sign Up" size="big" onPress={()=> onBoardingComplete()}/>
                        </View>
                    </View>
                </View>
            </View>
        :   <>
                <View style={[globalStyles.page_top,{backgroundColor:Theme.PRIMARY_COLOR}]}>
                    <View style={styles.logos}>
                        <Image style={styles.logo} source={require('../assets/icon.png')} />
                    </View>
                </View>
                <View style={[globalStyles.page_bottom,{backgroundColor:Theme.PRIMARY_COLOR}]}>
                    <View style={styles.buttons}>
                        <View style={styles.button_space}>
                            <CustomButton text='Login' onPress={() => navigation.navigate('Login')} size="big"></CustomButton>
                        </View>
                        <View style={styles.button_space}>
                            <CustomButton text='Register' onPress={() => navigation.navigate('Register')} size="big"></CustomButton>
                        </View>
                    </View>
                </View>
            </>
        }
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
    logo: {
        width:239,
        height: 33,
        alignSelf: "center",
    },
    buttons: {
        flexDirection:'row',
        alignItems: 'center',
        justifyContent:'space-evenly',
        paddingBottom:45,
        //fontFamily: Theme.FONT_STANDARD,
    },
    button_space: {
        width:'48%',
    },
    carousel:{
        backgroundColor: Theme.SURFACE_COLOR,
        width: windowWidth,
        height: windowHeight,
    },
    screen:{
        flex:1,
        width: windowWidth,
        height: (windowHeight-10),
        alignItems: 'center',
        justifyContent: 'flex-start',
    },
    benefit_text: {
        justifyContent: 'flex-start',
        fontFamily: Theme.FONT_STANDARD,
        fontSize: Theme.FONT_SIZE_LARGE,
        lineHeight: 28,
        width:'80%',
        paddingVertical:70,
        textAlign: 'center',
        color:Theme.TEXT_ON_SURFACE_COLOR,
    },
    benefit_icon: {
        width:'70%',
        height:'40%',
        margin: 0,
        padding: 0
    },
    onboard_float: {
        flex: 1,
        position: 'absolute',
        left: 0,
        bottom: 0,
        right: 0,
        justifyContent: 'center',
        alignItems: 'center',
        paddingBottom: 35,
    },
    bullets: {
        justifyContent: 'center',
        flexDirection: 'row',
        marginBottom: 10
    },
    bullet: {
        color:Theme.PRIMARY_COLOR,
        paddingHorizontal: 5,
        fontSize: 40,
    },
    signin_text: {
        fontFamily: Theme.FONT_STANDARD,
        lineHeight: 20,
        padding:8,
        textAlign: 'center',
        color:Theme.TEXT_ON_SURFACE_COLOR,
    },
    button_bg: {
        alignItems: 'center',
        width: '100%'
    },
    button_container: {
        justifyContent: 'center',
        width: '90%'
    },
})
