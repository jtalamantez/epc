/*******************************************************************************/
//IMPORT DEPENDENCIES
/*******************************************************************************/
import React from 'react'

//OTHER DEPENDENCIES
import moment from "moment";
import * as WebBrowser from 'expo-web-browser';



/*******************************************************************************/
// MAIN EXPORT FUNCTION
/*******************************************************************************/

export const convertTimestamp = (dateObj) => {
    //depending on if its a snapshot or not, seconds can be returned with an "_" prepemded or not
    const seconds = (dateObj._seconds) ? dateObj._seconds : dateObj.seconds
    const dateString = new Date(seconds * 1000).toLocaleDateString("en-US")

    //Figure out difference between timestamp and now
    const now = moment();
    const eventTime = moment(dateString);
    const timeDiff = Math.abs(eventTime.diff(now, 'days'));
    let timeDiffString
    //If its less than 1 day (0 days), then get the hours
    if(timeDiff < 1){
        timeDiffString = Math.abs(eventTime.diff(now, 'hours')) +" hours ago"
    }
    else if(timeDiff == 1){
        timeDiffString = "Yesterday"
    }
    else{
        timeDiffString = dateString
    }

    //Return both datestring and how long ago event was
    return [dateString,timeDiffString]
}


export const gotoWebLink = (link) => {
    WebBrowser.openBrowserAsync(link)
}

export const getEndpoint = (appsGlobalContext, endpoint) => {
    const apiMode = appsGlobalContext.apiMode
    const apiBase = appsGlobalContext.configKeys[apiMode]
    return apiBase+endpoint
}
