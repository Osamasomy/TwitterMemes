import {View, Image , Text, ActivityIndicator} from 'react-native'
import React from 'react'
import { constants } from '../../helper/constants'

const SplashScreen = () => {
  return (
    <View style={{backgroundColor: 'black', flex: 1, justifyContent: 'center', alignItems:'center', height: constants.screenHeight, width:constants.screenWidth}}>
      <Image source={require('../../assets/splashLogo.png')} style={{height: '30%', width:'60%'}} resizeMode='contain'/>
      <View>
        <Text style={{fontSize: 27, fontWeight: 'bold', color: '#fff', marginVertical: 10}}>Twimemes 😂</Text>
      </View>
    </View>
  )
}

export default SplashScreen