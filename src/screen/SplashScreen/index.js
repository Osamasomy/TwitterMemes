import {View } from 'react-native'
import React from 'react'
import { constants } from '../../helper/constants'
import * as Animatable from 'react-native-animatable';

const SplashScreen = () => {
  return (
    <View style={{backgroundColor: 'black', flex: 1, justifyContent: 'center', alignItems:'center'}}>
        <Animatable.Image duration={500} animation={'fadeIn'} source={require('../../assets/splashLogo.png')} resizeMode='contain' style={{width: constants.screenWidth/1.7}}/>
    </View>
  )
}

export default SplashScreen