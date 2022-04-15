import React from 'react';
import MainScreen from './src/screen/MainScreen'
import {StatusBar} from "react-native"
import PushNotification from "react-native-push-notification";


export default function App() {

  const createChannels = () => {
    PushNotification.createChannel(
      {
        channelId: 'Notification-Channel',
        vibrate: true,
        playSound: true,
        channelName: 'TestTime'
      }
    )
  }

  React.useEffect(()=>{
    createChannels()
  },[])

  return (
    <>
    <StatusBar translucent={true} backgroundColor={"#2AC8FE"} barStyle={'light-content'} />
    <MainScreen />
    </>
  );
}
