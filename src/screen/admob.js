import { Text, View } from 'react-native'
import React, { Component } from 'react'
import admob, {BannerAd,MaxAdContentRating,TestIds, BannerAdSize} from '@react-native-firebase/admob' 


export default class AdmobScreen extends Component {
    componentDidMount(){
        admob()
        .setRequestConfiguration({
            maxAdContentRating: MaxAdContentRating.PG,
            tagForChildDirectTreatment: true,
            tagForUnderAgeOfConsent: true
        }).then(()=>{

        })
    }
  render() {
    return (
      <View style={{alignSelf: 'center'}}>
        <BannerAd size={BannerAdSize.FULL_BANNER} unitId={TestIds.BANNER}></BannerAd>
        </View>
    )
  }
}