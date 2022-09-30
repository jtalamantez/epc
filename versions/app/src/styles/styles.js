import { StyleSheet } from 'react-native';
import Theme from '../styles/theme.style.js';

const globalStyles =  StyleSheet.create({
    safe_dark: {
        flex:1,
        backgroundColor: Theme.PRIMARY_COLOR
    },
    safe_light: {
        flex:1,
        backgroundColor: Theme.BACKGROUND_COLOR,
        padding:0,
        margin:0,
    },
    safe_trans: {
        flex:1,
    },
    scrollContainer: {
        flex: 1,
    },
    page: {
        flex: 1,
        backgroundColor: Theme.BACKGROUND_COLOR,
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
    h1: {
        fontFamily: Theme.FONT_STANDARD,
        fontWeight: Theme.FONT_WEIGHT_MEDIUM,
        fontSize: Theme.FONT_SIZE_XL,
        color:Theme.TEXT_ON_SURFACE_COLOR,
        lineHeight: 33,
        paddingVertical:10,
    },
    h2: {
        fontFamily: Theme.FONT_STANDARD,
        fontSize: Theme.FONT_SIZE_LARGE,
        color:Theme.TEXT_ON_SURFACE_COLOR,
        lineHeight: 20,
        paddingVertical:8,
    },
    h3: {
        fontFamily: Theme.FONT_STANDARD,
        fontSize: Theme.FONT_SIZE_MEDIUM_PLUSM,
        fontWeight: 'bold',
        color:Theme.TEXT_ON_SURFACE_COLOR,
        lineHeight: 16,
        paddingVertical:6,
    },
    subtitle: {
        fontFamily: Theme.FONT_STANDARD,
        fontSize: Theme.FONT_SIZE_SMALL,
        fontSize:13,
        lineHeight:16,
        color: Theme.TEXT_ON_SURFACE_COLOR_LIGHT
    },
    p: {
        fontFamily: Theme.FONT_STANDARD,
        fontSize: Theme.FONT_SIZE_SMALL,
        color:Theme.TEXT_ON_SURFACE_COLOR,
        fontSize: 14,
        lineHeight: 20,
    },
    card: {
        paddingVertical:15,
        paddingHorizontal:12,
        borderRadius: 8,
        backgroundColor: Theme.SURFACE_COLOR,
        margin: 5,
        shadowColor: Theme.FAINT,
        shadowOffset: {
            width: 2,
            height: 2,
        },
        shadowOpacity: .4,
        shadowRadius: 3,
        elevation: 3,
    },
    card_header: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    divider: {
        borderBottomColor: Theme.FAINT,
        borderBottomWidth: 1,
        paddingBottom: 15
    },
    list_cont: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10
    },
    list_bullet: {
        fontFamily: Theme.FONT_STANDARD,
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.TEXT_ON_SURFACE_COLOR_LIGHT,
        fontSize: 26,
        lineHeight: 30,
        paddingLeft: 5,
    },
    list_item: {
        fontFamily: Theme.FONT_STANDARD,
        fontSize: Theme.FONT_SIZE_SMALL,
        color: Theme.TEXT_ON_SURFACE_COLOR_LIGHT,
        fontSize: 13,
        lineHeight: 16,
        paddingLeft: 8,
    },
    blurb_text_large: {
        fontSize: Theme.FONT_SIZE_MEDIUM,
        textAlign: 'center'
    },
    italic: {
        fontStyle: 'italic'
    },
    badge_small: {
        padding: 10,
        marginHorizontal: 5,
        marginVertical: 1,
        width: undefined,
        height: undefined,
        resizeMode: 'contain'
    },
    badge_large: {
        padding: 25,
        marginHorizontal: 5,
        marginVertical: 1,
        width: undefined,
        height: undefined,
        resizeMode: 'contain',
    },
    empty_state:{
        flex:1,
        width:'100%',
        justifyContent: 'center', 
        alignItems: 'center'
    },
    empty_image: {
        height: '40%',
        resizeMode: 'contain',
        margin: 0,
        padding: 0
    },
    empty_text: {
        fontSize: 13,
        fontWeight: 'bold',
        textAlign: 'center',
        padding:20,
        color: Theme.GRAY
    },
    navigate_away: {
        width: '100%',
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        paddingHorizontal: 15,
        borderBottomWidth:1,
        borderColor: Theme.BORDER_COLOR
    },
    navigate_away_content:{
        flex:1,
        fontWeight: 'bold',
        color: Theme.PRIMARY_COLOR,
        fontSize: 13,
    },
})


const menusStyles = StyleSheet.create({
    menu_course_cont: {
        marginBottom:20
    },
    menu_course: {
        fontFamily: Theme.FONT_STANDARD,
        fontSize: Theme.FONT_SIZE_SMALL,
        color:Theme.FAINT,
        fontStyle: 'italic',
        fontSize: 18,
        lineHeight: 20,
        textAlign: 'center',
        paddingBottom: 10
    },
    menu_item_cont: {
        paddingVertical:10,
        marginBottom:10
    },
    menu_name: {
        fontFamily: Theme.FONT_STANDARD,
        fontSize: Theme.FONT_SIZE_SMALL,
        color:Theme.TEXT_ON_SURFACE_COLOR,
        fontSize: 15,
        lineHeight: 20,
        fontWeight:'bold',
        textAlign: 'center',
        marginBottom:2
    },
    menu_desc: {
        fontFamily: Theme.FONT_STANDARD,
        fontSize: Theme.FONT_SIZE_SMALL,
        color:Theme.TEXT_ON_SURFACE_COLOR,
        fontSize: 14,
        lineHeight: 20,
        textAlign: 'center'
    },
})

const modal = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: 'rgba(12,30,52, 0.9)'
    },
    modalView: {
        margin: 20,
        backgroundColor: Theme.SURFACE_COLOR,
        justifyContent: 'flex-start',
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
        height:420,
        borderWidth:1,
        borderColor: Theme.WHITE
    },
    close_button: {
        position: 'absolute',
        top: 0,
        right:0,
        padding: 10,
        zIndex:10000,
        fontWeight:Theme.FONT_WEIGHT_HEAVY
    },
    modalHeader: {
        alignItems: 'center',
        width: '100%',
        color:Theme.SECONDARY_COLOR,
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
        width: '100%',
        fontSize:15,
        lineHeight:17,
        backgroundColor: Theme.SURFACE_COLOR,
        color:Theme.TEXT_ON_SURFACE_COLOR,
        marginVertical:15,
        padding:10,
        borderRadius: 5,
        borderColor: Theme.FAINT,
        overflow: 'hidden',
        borderWidth:1,
        backgroundColor: Theme.SURFACE_COLOR,
        borderColor: Theme.BORDER_COLOR
    },
    textarea: {
        height: 120,
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
        borderColor: Theme.BORDER_COLOR
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
        color:Theme.PRIMARY_COLOR,
        fontSize:15,
        paddingVertical:16,
        alignItems: 'center',
        justifyContent: 'center'
    },
    small_input_container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    small_field: {
        flex:2,
        marginRight: 5,
    },
    password_icon: {
        padding:8,
        opacity: .5,
        alignItems: 'center',
    },
    has_comment: {
        marginBottom:5
    },
    input_comment: {
        width: '100%',
        fontSize: 11,
        paddingLeft:5,
        color: Theme.GRAY,
        textAlign: 'left'
    }
})


export {globalStyles, menusStyles, forms, modal}