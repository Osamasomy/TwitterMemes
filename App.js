import React from 'react';
import MainScreen from './src/screen/MainScreen'
import AdmobScreen from "./src/screen/admob";
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
    <MainScreen />
  );
}
