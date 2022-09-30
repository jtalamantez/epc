import { StyleSheet } from 'react-native';
import Theme from '../styles/theme.style.js';

const globalStyles =  StyleSheet.create({
    safe_dark: {
        flex:1,
        backgroundColor: Theme.PRIMARY_COLOR
    },
    safe_light: {
        flex:1,
        backgroundColor: Theme.BACKGROUND_COLOR
    },
    safe_trans: {
        flex:1,
    },
    scrollContainer: {
        flex: 1,
        marginTop:72,
    },
    page: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'flex-start',
        padding: 10,
    },
    page_centered: {
        flex: 1,
        alignItems: 'center',
        justifyContent:'center',
        padding: 10,
    },
    page_top: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent:'flex-start',
        padding: 10,
    },
    page_bottom: {
        flex: 1,
        alignItems: 'stretch',
        justifyContent:'flex-end',
        padding: 10,
    },
    container: {
        alignItems: 'center',
        justifyContent:'flex-start',
    },
    p: {
        fontSize: 14,
        lineHeight: 20,
        color:Theme.TEXT_ON_PRIMARY_COLOR,
    },
    blurb_text_large: {
        fontSize: Theme.FONT_SIZE_MEDIUM,
        textAlign: 'center'
    },
    italic: {
        fontStyle: 'italic'
    }
})

const modal = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(0, 0, 0, 0.4)'
    },
    modalView: {
        margin: 20,
        backgroundColor: Theme.SURFACE_COLOR,
        justifyContent: 'space-around',
        borderRadius: 10,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        width: '90%',
        height: '80%',
        borderWidth:1,
        borderColor: Theme.WHITE
    },
    close_button: {
        position: 'absolute',
        top: 2,
        right:7,
        padding: 10,
        fontWeight:Theme.FONT_WEIGHT_HEAVY
    },
    modalHeader: {
        fontSize: 30,
        marginBottom: 15,
        textAlign: "center",
        color:Theme.SECONDARY_COLOR
    }
})


const forms =  StyleSheet.create({
    formContainer: {
        flexDirection: 'row',
        height: 80,
        marginTop: 40,
        marginBottom: 20,
        flex: 1,
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 30,
        paddingRight: 30,
        justifyContent: 'center',
        alignItems: 'center'
    },
    input: {
        height: 48,
        borderRadius: 25,
        borderColor: 'black',
        borderWidth: 1,
        overflow: 'hidden',
        backgroundColor: Theme.WHITE,
        paddingLeft: 16,
        marginBottom: 35
    },
    input_wide: {
        width: 300,
        height: 55,
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: Theme.SURFACE_COLOR,
        color:Theme.TEXT_ON_SURFACE_COLOR,
        fontSize: 15,
        marginTop: 10,
        marginBottom: 20,
        marginLeft: 30,
        marginRight: 30,
        paddingLeft: 16,
    },
    search_bar: {
        height: 48,
        borderRadius: 25,
        overflow: 'hidden',
        backgroundColor: Theme.SURFACE_COLOR,
        color:Theme.SECONDARY_COLOR,
        borderWidth:1,
        borderColor: Theme.PRIMARY_COLOR,
        paddingLeft: 16,
    },
    placeholder_on_dark: {
        color: 'rgba(203, 165, 44, 0.4)'
    },
    input_container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft:8,
        height: 58,
        borderRadius: 8,
        marginVertical: 20,
        borderWidth:1,
        backgroundColor: Theme.SURFACE_COLOR,
        borderColor: Theme.SECONDARY_COLOR,
    },
    input_icon: {
        color: Theme.SECONDARY_COLOR,
        padding:8,
        alignItems: 'center',
    },
    focused_dark:{
        color: Theme.WHITE,
        borderColor: Theme.WHITE
    },
    focused_light:{
        color: Theme.PRIMARY_COLOR,
        borderColor: Theme.PRIMARY_COLOR
    },
    notFocused:{
    },
    custom_input: {
        flex: 1,
        height: 50,
        color:Theme.SECONDARY_COLOR,
        fontSize:18,
        paddingVertical:16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    password_icon: {
        padding:8,
        opacity: .5,
        alignItems: 'center',
    },
})


export {globalStyles, forms, modal}