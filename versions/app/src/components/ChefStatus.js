/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React, { useState, useContext, useEffect } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context';

// OTHER DEPENDENCIES
import _ from 'underscore'
import { firebase, configKeys } from '../config/config'
import { useFocusEffect } from '@react-navigation/native';


// COMPONENTS
import { Text, StyleSheet, View, Image, ActivityIndicator, ScrollView, RefreshControl, TouchableOpacity, Modal } from 'react-native'
import {GoToButton, CustomButton} from '../components/Button'
import Certification from '../components/Certification'
import AppContext from '../components/AppContext';
import {getEndpoint} from '../helpers/helpers'

// STYLES
import {globalStyles, TouchableHighlight, footer, modal} from '../styles/styles';
import Theme from '../styles/theme.style.js';
import { FontAwesome, FontAwesome5, Ionicons, AntDesign, MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons'


/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/
export default function ChefStatus ({certifications,navigation}) {
    console.log("Init Chef Status component...")

    const modalTypes = {
        'home': {
            title: 'Home Chef',
            copy: 'Home Chef is for Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue libero ac massa egestas vehicula. Aenean fermentum finibus fermentum.',
            icon:require('../assets/badges/status_home_chef.png')
        },
        'pro': {
            title: 'Pro Chef',
            copy: 'Pro Chef is for Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue libero ac massa egestas vehicula. Aenean fermentum finibus fermentum.',
            icon:require('../assets/badges/status_pro_chef.png')
        },
        'elite': {
            title: 'Elite Chef',
            copy: 'Elite Chef is for Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed congue libero ac massa egestas vehicula. Aenean fermentum finibus fermentum.',
            icon:require('../assets/badges/status_elite_chef.png')
        },
    }
    
    const [modalVisible,setModalVisible] = useState(false)
    const [modalType,setModalType] = useState('home')
    const [chefStatus,setChefStatus] = useState(null)
    const [homeChefPercent,setHomeChefPercent] = useState(0)
    const [proChefPercent,setProChefPercent] = useState(0)
    const [eliteChefPercent,setEliteChefPercent] = useState(0)

    let stat = 'pro_chef'
    const iconURL = "../assets/badges/status_"+stat+".png"

    /*************************************************************/
    // DETERMINE CHEF STATUS
    /*************************************************************/
    const getChefStatus = async (userData = null) => {
        console.log("Getting chef status...")
        if(certifications){
            //setChefStatus('home_chef')
            let currentCertifications = []
            for (let certification in certifications) {
                let certificationDetail = certifications[certification]
                if(certificationDetail.is_approved) currentCertifications.push(certification)
            }
            determineCertificationLevel(currentCertifications)
        }
        //8-22: everyone is an elite chef
        setChefStatus('elite_chef')

    }

    const determineCertificationLevel = (currentCertifications) => {
        console.log("Determing Certification Level...")
        let homeChef = ['Complete Profile', 'Waiver of Liability', 'Background Check' ]
        let proChef  = [...homeChef,"Food Handler's License", 'Professional Resume']
        let eliteChef =  [...proChef, 'Sanitation Manager License', 'Liability Insurance', 'Professional Licenses']
        let homeIntersect = _.intersection(currentCertifications,homeChef)
        let proIntersect = _.intersection(currentCertifications,proChef)
        let eliteIntersect = _.intersection(currentCertifications,eliteChef)
        
            let percent1 = parseInt((homeIntersect.length / homeChef.length) * 100)
            setHomeChefPercent(percent1)
            console.log("Home Chef Complete "+percent1)

            let percent2 = parseInt((proIntersect.length / proChef.length) * 100)
            setProChefPercent(percent2)
            console.log("Pro Chef Complete "+percent2)
        
            let percent3 = parseInt((eliteIntersect.length / eliteChef.length) * 100)
            setEliteChefPercent(percent3)
            console.log("Elite Chef Complete "+percent3)
      
    }

    if(!chefStatus){
        getChefStatus()
    }


    if(certifications){
        return (
            <>
            {chefStatus &&
            <View style={{flexDirection: 'row', paddingVertical:5}}>
                <Text style={{fontSize:14, color:Theme.PRIMARY_COLOR, fontWeight: 'bold'}}>Chef Status: {chefStatus.replace(/_/g, ' ').toUpperCase()}</Text>
                <Image style={globalStyles.badge_small} source={require(iconURL)} />
            </View>
            }



            {/* HOME CHEF */}
            <View style={{paddingVertical:5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity style={{alignItems: 'center', padding:10, alignContent: 'center'}} onPress={()=>{
                    setModalVisible(true)
                    setModalType('home')
                }}>
                    <Image style={globalStyles.badge_large} source={require('../assets/badges/status_home_chef.png')} />
                    <Text style={{fontSize:14, color:Theme.PRIMARY_COLOR, fontWeight: 'bold'}}>Home Chef</Text>
                </TouchableOpacity>
                <View style={styles.status_bar_cont}>
                    <View style={styles.status_bar}></View>
                    <View style={[styles.status_bar_progress,{width:homeChefPercent+'%'}]}></View>
                    <Text style={{textAlign:'center',padding:5}}>{homeChefPercent}% Complete</Text>
                </View>
            </View>
            <Certification certifications={certifications} title="Complete Profile" navigation={navigation}  page="Chef Profile" />
            <Certification certifications={certifications} title="Waiver of Liability" navigation={navigation}  page="Waiver of Liability" />
            <Certification certifications={certifications} title="Background Check" navigation={navigation}  page="Background Check" />

            {/* PRO CHEF */}
            <View style={{paddingVertical:5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity style={{alignItems: 'center', padding:10, alignContent: 'center'}} onPress={()=>{
                    setModalVisible(true)
                    setModalType('pro')
                }}>
                    <Image style={globalStyles.badge_large} source={require('../assets/badges/status_pro_chef.png')} />
                    <Text style={{fontSize:14, color:Theme.PRIMARY_COLOR, fontWeight: 'bold'}}>Pro Chef</Text>
                </TouchableOpacity>
                <View style={styles.status_bar_cont}>
                    <View style={styles.status_bar}></View>
                    <View style={[styles.status_bar_progress,{width:proChefPercent+'%'}]}></View>
                    <Text style={{textAlign:'center',padding:5}}>{proChefPercent}% Complete</Text>
                </View>
            </View>
            <Certification certifications={certifications} title="Food Handler's License" navigation={navigation} page="Food Handler's License" />
            <Certification certifications={certifications} title="Professional Resume" navigation={navigation} page="Professional Resume"/>


            {/* ELITE CHEF */}
            <View style={{paddingVertical:5, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <TouchableOpacity style={{alignItems: 'center', padding:10, alignContent: 'center'}} onPress={()=>{
                    setModalVisible(true)
                    setModalType('elite')
                }}>
                    <Image style={globalStyles.badge_large} source={require('../assets/badges/status_elite_chef.png')} />
                    <Text style={{fontSize:14, color:Theme.PRIMARY_COLOR, fontWeight: 'bold'}}>Elite Chef</Text>
                </TouchableOpacity>
                <View style={styles.status_bar_cont}>
                    <View style={styles.status_bar}></View>
                    <View style={[styles.status_bar_progress,{width:eliteChefPercent+'%'}]}></View>
                    <Text style={{textAlign:'center',padding:5}}>{eliteChefPercent}% Complete</Text>
                </View>
            </View>
            <Certification certifications={certifications} title="Sanitation Manager License" navigation={navigation} page="Sanitation Manager License"/>
            <Certification certifications={certifications} title="Liability Insurance" navigation={navigation} page="Liability Insurance"/>
            <Certification certifications={certifications} title="Professional Licenses" navigation={navigation} page="Professional Licenses"/>

                <Modal animationType="slide" transparent={true} visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
                >
                    <View style={modal.modalBackground}>
                        <View style={modal.modalView}>
                            <TouchableOpacity activeOpacity={.7}  style={[modal.close_button]} onPress={() => {
                                setModalVisible(false)
                            }}>
                                <AntDesign name="closecircleo" size={25} color={Theme.SECONDARY_COLOR} />
                            </TouchableOpacity>
                            <View style={modal.modalHeader}>
                                <Text style={{fontSize:17,color:Theme.PRIMARY_COLOR}}>{modalTypes[modalType].title}</Text>
                                <Image style={[globalStyles.badge_large,{marginTop:7,marginBottom:20}]} source={modalTypes[modalType].icon} />
                            </View>
                            <View>
                                <Text>{modalTypes[modalType].copy}</Text>
                            </View>
                        </View>
                    </View>
                </Modal>
            </>
        )
    }
}


const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        borderRadius: 6,
        padding:15,
        marginVertical:5,
        backgroundColor: Theme.CREAM,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
        elevation: 3,
    },
    thumbnail: {
        flex:1,
        backgroundColor: 'green'
    },
    content: {
        flex:3,
    },
    name_and_price:{
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    description:{
        fontSize:12,
        color:Theme.PRIMARY_COLOR
    }
})
