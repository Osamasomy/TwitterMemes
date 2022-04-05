/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from "react-native-push-notification";


PushNotification.configure({

    onRegister: function (token) {
        console.log("TOKEN:", token);
      },


    onNotification: function (notification) {
        console.log("NOTIFICATION:", notification);
        PushNotification.localNotification({
            channelId: `${notification.channelId}`,
            subText: `${notification.subText}`,
            id: notification.id,
            message: `${notification.message}`,
            title: `${notification.title}`,
            smallIcon: notification.smallIcon,
            vibrate: true,
            vibration: 400
        })
        // PushNotification.localNotification({
        //     channelId: "Notification-Channel",
        // })
    },
    onAction: function (notification) {
        console.log("ACTION:", notification.action);
        // console.log("NOTIFICATION:", notification);
    
        // process the action
      },
    permissions: {
        alert: true,
        badge: true,
        sound: true
    },
    popInitialNotification: true,
    requestPermissions: true,
})

AppRegistry.registerComponent(appName, () => App);
