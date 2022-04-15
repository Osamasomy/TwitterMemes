import {View , Text, StyleSheet} from 'react-native'
import React, { Component } from 'react'
import admob, {BannerAd,MaxAdContentRating, BannerAdSize} from '@react-native-firebase/admob' 
import { constants } from '../helper/constants'


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
      <View style={{alignSelf: 'center', borderWidth:1, borderColor: '#333333', width: '99%', alignItems: 'center', justifyContent:'center', borderStyle:'dashed', backgroundColor: '#000'}}>
        <Text style={[styles.adsText]}>This Area Contain <Text style={[styles.adsText, {color: '#999999'}]}>Ads</Text></Text>
        <BannerAd size={BannerAdSize.ADAPTIVE_BANNER} unitId={"ca-app-pub-4611656971588059/9581427658"}></BannerAd>
        </View>
    )
  }
}

const styles = StyleSheet.create({
  adsText:{
    color: '#777777' , position: 'absolute', zIndex: -10, fontSize:12,
  }
})