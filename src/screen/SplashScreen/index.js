import {View, Image } from 'react-native'
import React from 'react'
import { constants } from '../../helper/constants'

const SplashScreen = () => {
  return (
    <View style={{backgroundColor: 'black', flex: 1, justifyContent: 'center', alignItems:'center', height: constants.screenHeight, width:constants.screenWidth}}>
      <Image source={require('../../assets/launch_screen.png')} style={{height: '100%', width:'100%'}} resizeMode='cover'/>
    </View>
  )
}

export default SplashScreen