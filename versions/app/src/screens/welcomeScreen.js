/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// COMPONENTS
import { Image, Text, StyleSheet, View, ScrollView,Dimensions, ActivityIndicator } from 'react-native'
import {CustomButton} from '../components/Button'
import AppContext from '../components/AppContext'
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
    const appsGlobalContext = useContext(AppContext);

    //Check if first launch so we can run a carosouel
    const [firstLaunch,setFirstLaunch] = useState(false)
    const checkForFirstLaunch = async () => {
        try {
            const storedLaunchFlag = await AsyncStorage.getItem('hasLaunched')
            console.log("First Launch Flag Set?",storedLaunchFlag)
            if(storedLaunchFlag === null){
                setFirstLaunch(true)
            }
            console.log("This is what Welcome thinks context is",appsGlobalContext)
        } catch (e) {
            console.warn(e);
        }
    }
    checkForFirstLaunch()

    /***********************************************/
    // SETUP CHEF/GUEST SCREEN CHOICES
    /***********************************************/

    const chefFlow = ([
        {   title:<Text style={styles.benefit_text}>Host <Text style={globalStyles.italic}>your</Text> unique events!</Text>,
            img:require('../assets/onboard/events.png')
        },
        {   title:<Text style={styles.benefit_text}>Control <Text style={globalStyles.italic}>your</Text> schedule.</Text>,
            img:require('../assets/onboard/calendar.png')
        },
        {   title:<Text style={styles.benefit_text}>Create <Text style={globalStyles.italic}>your</Text> menus. {"\n"}Cook <Text style={globalStyles.italic}>your</Text> food!</Text>,
            img:require('../assets/onboard/menu.png')
        },
        {   title:<Text style={styles.benefit_text}>Set <Text style={globalStyles.italic}>your</Text> pricing.</Text>,
            img:require('../assets/onboard/calculator.png')
        },
        {   title:<Text style={styles.benefit_text}>Save for retirement!</Text>,
            img:require('../assets/onboard/chart.png')
        },
    ])

    const guestFlow = ([
        {   title:<Text style={styles.benefit_text}>Browse culinary events{"\n"}happening around you.</Text>,
            img:require('../assets/onboard/browse.png')
        },
        {   title:<Text style={styles.benefit_text}>See events you like? Book{"\n"}your reservation in minutes!</Text>,
            img:require('../assets/onboard/reserve.png')
        },
        {   title:<Text style={styles.benefit_text}>Need to customize an event?{"\n"}Contact the chef directly!</Text>,
            img:require('../assets/onboard/customize.png')
        },
        {   title:<Text style={styles.benefit_text}>Enjoy the experience!{"\n"}It’s as simple as that.</Text>,
            img:require('../assets/onboard/table.png')
        },
    ])

    const [activeFlow,setActiveFlow] = useState(null)
    const [chosenFlow,setChosenFlow] = useState(null) //will be 'chefs' or 'guests'

    /***********************************************/
    // SETUP SCROLLING CAROSUEL
    /***********************************************/
    let totalScreens = (chosenFlow == 'chefs') ? 5 : 4
    let scrollerWidth = Math.trunc(windowWidth * totalScreens)
    
    //Setup Pager Dots
    const [activeImage, setActiveImage] = useState(1) //the first image is active
    const determineCurrentImage = (offset) => {
        /*
        console.log("*************************")
        console.log("OFFSET",offset)
        console.log("windowWidth",windowWidth)
        console.log("dividded", (offset / windowWidth))
        console.log("rounded", Math.round(offset / windowWidth))
        */
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

    const onBoardingComplete = async (goToPage,chosenFlow) => {
        await AsyncStorage.setItem('hasLaunched', 'yes')
        appsGlobalContext.setActiveFlow(chosenFlow)
        navigation.navigate(goToPage,{chosenFlow:chosenFlow})
    }

    return (
        <SafeAreaView style={globalStyles.safe_light}>
        {firstLaunch
        ?  !activeFlow
                ? <View style={[globalStyles.page_centered,{backgroundColor:Theme.SURFACE_COLOR}]}>
                    <Text style={globalStyles.h1}>Welcome! Let’s get started.</Text>
                    <Text style={globalStyles.subtitle}>First, tell us what brings you to EPC.</Text>
                    <View style={styles.choose_flow}>
                        <Image style={styles.empty_image} source={require('../assets/onboard/table.png')} />
                        <CustomButton text="I'm a Diner"
                            onPress={() => {
                                setActiveFlow(guestFlow)
                                setChosenFlow('guests')
                            }} size="big" 
                        />
                    </View>
                    <View style={[styles.choose_flow]}>
                        <Image style={styles.empty_image} source={require('../assets/onboard/standing_chefs.png')} />
                        <CustomButton text="I'm a Chef" 
                            onPress={() => {
                                setActiveFlow(chefFlow) 
                                setChosenFlow('chefs')
                            }} size="big"
                        />
                    </View>
                    <Text style={[globalStyles.p]}>And don't worry, <Text style={{fontStyle:'italic',fontWeight:'bold'}}>you can always be both! </Text></Text>
                </View>
                : <View style={styles.carousel}>
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
                        {activeFlow ?
                                activeFlow.map((flow,index) => {
                                    return(
                                        <View style={styles.screen} key={index}>
                                            <>{flow.title}</>
                                            <Image style={styles.benefit_icon} resizeMode='contain' source={flow.img} />
                                        </View>
                                    )
                                })
                            : <ActivityIndicator />
                        }
        
                    </ScrollView>
                    <View style={styles.onboard_float}>
                        <View style={styles.bullets}>{bullets}</View>
                        <Text style={styles.signin_text} onPress={() => onBoardingComplete('Login',chosenFlow) }>Been here before? Sign in</Text>
                        <View style={styles.button_bg}>
                            <View style={styles.button_container}>
                                <CustomButton text="Sign Up" size="big" onPress={()=> onBoardingComplete('Register',chosenFlow) }/>
                            </View>
                        </View>
                    </View>
                </View>
        :   <View style={[globalStyles.page_centered,{padding:30}]}>
                <Text style={globalStyles.h1}>Welcome back!</Text>
                <Text style={globalStyles.subtitle}>Please choose how you will login.</Text>
                <View style={styles.choose_flow}>
                    <Image style={styles.empty_image} source={require('../assets/onboard/table.png')} />
                    <CustomButton text="I'm a Diner"
                        onPress={() => {
                            /* in this case they don't need to see the onbaording slides.
                            We just need to them to choose a path for the login screen to determine
                            how to get them signed up */
                            onBoardingComplete('Login','guests')
                        }} size="big" 
                    />
                </View>
                <View style={[styles.choose_flow]}>
                    <Image style={styles.empty_image} source={require('../assets/onboard/standing_chefs.png')} />
                    <CustomButton text="I'm a Chef" 
                        onPress={() => {
                            /* in this case they don't need to see the onbaording slides.
                            We just need to them to choose a path for the login screen to determine
                            how to get them signed up */
                            onBoardingComplete('Login','chefs')
                        }} size="big"
                    />
                </View>
            </View>
        }
        </SafeAreaView>
  )
}

const styles = StyleSheet.create({
    choose_flow:{
        flex:1,
        width:'100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding:15
    },
    empty_image: {
        flex:1,
        resizeMode: 'contain',
        width:'100%',
        padding: 0
    },
    flow_choice_cont: {
        width:'50%',
        padding:10,
        alignItems: 'center'
    },
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
        width: '100%',
        paddingTop:10
    },
    button_container: {
        justifyContent: 'center',
        width: '90%',
        marginBottom:35
    },
})
