import { StyleSheet, Text, View, FlatList, Dimensions, SafeAreaView, ActivityIndicator, Image } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image'
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import AdmobScreen from '../admob';
import {AdEventType, InterstitialAd} from '@react-native-firebase/admob'
import { FloatingAction } from "react-native-floating-action";
import AsyncStorage from '@react-native-async-storage/async-storage';



export default function Index() {



    /**
     * initialization
     */
    const baseUrl = 'https://twittermemes-somy.herokuapp.com'
    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const [imgData, setImgData] = React.useState([])
    const [totalWithOutLimit, setTotalWithOutLimit] = React.useState(null)
    const [totalWithLimit, setTotalWithLimit] = React.useState(null)
    const [firstTime, setFirstTime] = React.useState(true)
    const { open } = state;
    const limit = 5;
    const [page, setPage] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(true)
    const [refresh, setRefresh] = React.useState(false)

    

    /*
     * 
    Interstitial Ad
     * 
     */
    const showIntertitialAds = () => {
        const interstitialAd = InterstitialAd.createForAdRequest("ca-app-pub-4611656971588059/4236783394");
        interstitialAd.onAdEvent((type, error) => {
            if(type == AdEventType.LOADED)
            {
                interstitialAd.show()
            }
        })
        interstitialAd.load()
    }

    /**
     * 
     * API Call 
     */

    const apiCall = async (pageIndex)=>{
        console.log("---------")
        console.log(pageIndex)
        console.log("---------")
        fetch(`${baseUrl}/memes?page=${pageIndex}&limit=${limit}`)
                .then((response) => response.json())
                .then((res) => {
                        if(pageIndex === 1){
                            setImgData([])
                            setImgData(imgData.concat(res.data))
                        }
                        else{
                            setImgData(imgData.concat(res.data))
                        }
                        setTotalWithOutLimit(res.totalWithOutLimit)
                        setTotalWithLimit(res.totalWithLimit)
                })
                .catch((error) => {
                    console.error(error);
                })
                .finally(() => {
                    setFirstTime(false)
                    setIsLoading(false)
                })
    }

    /**
     * Render Function
     */
    const getImages = async (page) => {
        let isPage = await AsyncStorage.getItem("pageNumber");
        isPage = JSON.parse(isPage)
        if(isPage){
            apiCall(isPage)
        }
        else{
            await AsyncStorage.setItem('pageNumber', JSON.stringify(page))
            apiCall(page)   
        }
    
    };



    React.useEffect(() => {
        getImages(page)
    }, [])


    /**
     * getting width and height of device
     */
    const { width, height } = Dimensions.get('window')


    /**
     * 
     * @param {It is the indicator for one of the option} name 
     * @param {It is the link for the image} url 
     */
    const onShareHandler = (name, url) => {

        if(name == 'WHATSAPP')
        {
            showIntertitialAds()
            RNFetchBlob.fetch('GET', `${url}`)
            .then(async (res) => {
                const shareOption = {
                    message: 'Test',
                    url: `data:image/jpeg;base64,${res.base64()}`,
                    social: Share.Social.WHATSAPP
                }
                try {
                    const shareRes = await Share.shareSingle(shareOption)
                }
                catch (e) {
                    console.log(e)
                }
            })
        }
        else if (name == 'OTHERS')
        {
            RNFetchBlob.fetch('GET', `${url}`)
                .then(async (res) => {
                    const shareOption = {
                        message: 'Test',
                        url: `data:image/jpeg;base64,${res.base64()}`,
                    }
                    try {
                        const shareRes = await Share.open(shareOption)
                    }
                    catch (e) {
                        console.log(e)
                    }
                })
        }

        
    }

    /**
     * on list ending function
     */
    const onListEndHandler = async() => {
        console.log("----CALL FROM HERE---")
        let totalPages = Math.ceil(totalWithOutLimit/limit)
        console.log(totalPages, '<---total pages')

        if(page >= totalPages) return;
        else
        {
            const temp = page +1
            await AsyncStorage.setItem('pageNumber', JSON.stringify(temp))
            setPage(temp)
            apiCall(temp)

        }
    }

    /**
     * function when pull down refresh
     */
    const onPullDownHandler = async() => {
        // let pageNo = await AsyncStorage.getItem('pageNumber')
        // pageNo = pageNo?JSON.parse(pageNo) : 0
        
        // if(pageNo){
            let tempPage = 1;
            await AsyncStorage.setItem('pageNumber', JSON.stringify(tempPage))
            setPage(tempPage)
            apiCall(tempPage)
        // }

        // if(pageNo > 1 || page > 1)
        // {
        //     setRefresh(true)
        //     pageNo = 1
        //     setPage(pageNo)
        //     AsyncStorage.setItem('pageNumber', JSON.stringify(pageNo))
        //     apiCall(pageNo)
        // }
        // setRefresh(false)
    }

    /**
     * 
     * @returns faltlist footer component
     */
    const footerComponent = () => {
        return !firstTime && totalWithLimit >= limit ? (
            <View style={{ justifyContent: 'center', marginHorizontal: 20, flexDirection: 'row', flex:1 }}>
            <ActivityIndicator color={'white'} size='large' />
            </View>
             ): (<></>)
    }





    if(isLoading){
        return (
                <View style={{height: height, width: width, justifyContent: 'center', alignItems: 'center', marginBottom: '-20%', backgroundColor: 'black', flexDirection: 'row'}}>
                     <ActivityIndicator color={'white'} size='large' />
                </View>
    )
    }
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            {
                firstTime ? (
                        <View style={{height: height, width: width, justifyContent: 'center', alignItems: 'center', marginBottom: '-20%'}}>
                            <ActivityIndicator color={'white'} size='large' />
                        </View>
            ) : <></>
            }
                    <FlatList
                        horizontal
                        keyExtractor={item => item._id}
                        data={imgData}
                        showsVerticalScrollIndicator={false}
                        pagingEnabled={true}
                        // ListfooterComponent={footerComponent}
                        // onRefresh={onPullDownHandler}
                        refreshing={refresh}
                        onEndReachedThreshold={0.003}
                        onEndReached={onListEndHandler}
                        renderItem={(item)=> {
                            return (
                                <View style={{height: height, width: width,flex:1,backgroundColor: 'black'}}>
                                    <FastImage
                                         style={{height: '100%', width: '100%' }}
                                         source={{
                                            uri: `${item.item.url}`,
                                            priority: FastImage.priority.normal,
                                        }}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                    <View style={{bottom: 80, right: '-5%'}}>
                                    <FloatingAction
                                            color="#2AC8FE"
                                            floatingIcon = {<Image style={{width:22,height:22}} tintColor='#fff'  source={require('../../assets/shareout.png')}/>}
                                            actions      = {actions}
                                            onPressItem  = {name => onShareHandler(name, item.item.url)}
                                            
                                        />
                                    </View>
                                </View>
                            )
                        }}
                    />
            <View style={{zIndex:100, position: 'absolute', bottom: 0, left: 0}}>
                <AdmobScreen/>
            </View>
            
        </SafeAreaView>


    );
}


const styles = StyleSheet.create({});


const actions = [
    {
      icon: <Image resizeMode='contain' source={require("../../assets/others.png")} style={{height: 25, width: 25}}/>,
      name: "OTHERS",
      text: 'Others',
      color: "rgba(255,255,255,.5)",
      position: 1,
    },
    {
      icon: <Image resizeMode='contain' source={require("../../assets/whatsAppShare.png")} style={{height: 25, width: 25}} />,
      name: "WHATSAPP",
      text: 'Whatsapp',
      color: "rgba(255,255,255,.5)",
      position: 2
    },
  ];