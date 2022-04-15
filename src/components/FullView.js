import { Image, StatusBar, View, TouchableOpacity, Text, StyleSheet } from 'react-native'
import React from 'react'
import FastImage from 'react-native-fast-image'
import { FloatingAction } from "react-native-floating-action";
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import { constants } from '../helper/constants';

const actions = [
    {
        icon: <Image resizeMode='contain' source={require("../assets/others.png")} style={{ height: 25, width: 25 }} />,
        name: "OTHERS",
        text: 'Others',
        color: "rgba(255,255,255,.5)",
        position: 1,
    },
    {
        icon: <Image resizeMode='contain' source={require("../assets/whatsAppShare.png")} style={{ height: 25, width: 25 }} />,
        name: "WHATSAPP",
        text: 'Whatsapp',
        color: "rgba(255,255,255,.5)",
        position: 2
    },
];


export default function FullView({ showIntertitialAds, item, firstTime }) {


    /**
     * 
     * @param {It is the indicator for one of the option} name 
     * @param {It is the link for the image} url 
     */
    const onShareHandler = (name, url) => {

        if (name == 'WHATSAPP') {
            showIntertitialAds()
            RNFetchBlob.fetch('GET', `${url}`)
                .then(async (res) => {
                    const shareOption = {
                        url: `data:image/jpeg;base64,${res.base64()}`,
                        social: Share.Social.WHATSAPP
                    }
                    try {
                        await Share.shareSingle(shareOption)
                    }
                    catch (e) {
                        console.log(e)
                    }
                })
        }
        else if (name == 'OTHERS') {
            RNFetchBlob.fetch('GET', `${url}`)
                .then(async (res) => {
                    const shareOption = {
                        url: `data:image/jpeg;base64,${res.base64()}`,
                    }
                    try {
                        await Share.open(shareOption)
                    }
                    catch (e) {
                        console.log(e)
                    }
                })
        }
    }

    console.log(firstTime)

    return (
        <View style={{ height: constants.screenHeight - StatusBar.currentHeight - 60, width: constants.screenWidth, flex: 1, backgroundColor: 'black' }}>
            {
                firstTime ? <View style={{ zIndex: 100, position: 'absolute', top: constants.screenHeight / 3, alignSelf: 'center' }}>
                    <Image source={require('../assets/gesture.gif')} style={{ height: 140 }} resizeMode='contain' />
                </View> : <></>
            }


            <FastImage
                style={{ height: '90%', width: '102%', zIndex: -100 }}
                source={{
                    uri: `${item.url}`,
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
            />

            <View style={{ bottom: '1%', right: '-5%' }}>
                <FloatingAction
                    animated={true}
                    color="#2AC8FE"
                    floatingIcon={<Image style={{ width: 22, height: 22 }} tintColor='#fff' source={require('../assets/shareout.png')} />}
                    actions={actions}
                    onPressItem={name => onShareHandler(name, item.url)}

                />
            </View>
        </View>
    )
}