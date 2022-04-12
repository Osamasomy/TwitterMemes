import { StyleSheet, Text, View, FlatList, Dimensions, StatusBar, ActivityIndicator, Image, TouchableOpacity, ScrollView, VirtualizedList } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image'
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import AdmobScreen from '../admob';
import { AdEventType, InterstitialAd } from '@react-native-firebase/admob'
import { FloatingAction } from "react-native-floating-action";
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'


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
    const limit = 50;
    const [imgIndex, setImgIndex] = React.useState(0)
    const [page, setPage] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(true)
    const [isGrid, setIsGrid] = React.useState({
        grid: false,
        index: 0
    })
    // const [refresh, setRefresh] = React.useState(false)

    /**
     * temp
     */
    const [data, setData] = React.useState([])
    const getApi = () => {
        fetch('https://jsonplaceholder.typicode.com/photos')
            .then(response => response.json())
            .then(json => {
                setData(json)
            })
    }

    /*
     * 
    Interstitial Ad
     * 
     */
    const showIntertitialAds = () => {
        const interstitialAd = InterstitialAd.createForAdRequest("ca-app-pub-4611656971588059/4236783394");
        interstitialAd.onAdEvent((type, error) => {
            if (type == AdEventType.LOADED) {
                interstitialAd.show()
            }
        })
        interstitialAd.load()
    }

    /**
     * 
     * API Call 
     */

    const apiCall = async (pageIndex) => {

        fetch(`${baseUrl}/memes?page=${pageIndex}&limit=${limit}`)
            .then((response) => response.json())
            .then((res) => {
                AsyncStorage.setItem('pageNumber', JSON.stringify(pageIndex))
                if (pageIndex === 1) {
                    setImgData(res.data)
                    // setImgData()
                }
                else {
                    setImgData([...imgData, ...res.data])
                }
                setTotalWithOutLimit(res.totalWithOutLimit)
                // setTotalWithLimit(res.totalWithLimit)
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
    const getImages = async () => {
        // let isPage = await AsyncStorage.getItem("pageNumber");
        // isPage = JSON.parse(isPage)
        // if(isPage){
        // apiCall(isPage)
        // }
        // else{
        // await AsyncStorage.setItem('pageNumber', JSON.stringify(page))
        apiCall()

        // }

    };



    React.useEffect(() => {
        // getImages()
        apiCall(page);
        getApi()
    }, [page])



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

        if (name == 'WHATSAPP') {
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
        else if (name == 'OTHERS') {
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
    const onListEndHandler = async () => {
        // console.log("----CALL FROM HERE---")
        let totalPages = Math.ceil(totalWithOutLimit / limit)
        // console.log(totalPages, '<---total pages')

        if (page >= totalPages) return;
        else {
            // const temp = page +1

            setPage(page + 1)
            // apiCall(temp)

        }
    }

    /**
     * function when pull down refresh
     */
    const onPullDownHandler = async () => {
        // let pageNo = await AsyncStorage.getItem('pageNumber')
        // pageNo = pageNo?JSON.parse(pageNo) : 0

        // if(pageNo){
        // let tempPage = 1;
        // await AsyncStorage.setItem('pageNumber', JSON.stringify(tempPage))
        setPage(1)
        // apiCall(tempPage)
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
    // const footerComponent = () => {
    //     return !firstTime && totalWithLimit >= limit ? (
    //         <View style={{ justifyContent: 'center', marginHorizontal: 20, flexDirection: 'row', flex:1 }}>
    //         <ActivityIndicator color={'white'} size='large' />
    //         </View>
    //          ): (<></>)
    // }

    /**
     * 
     * virtualized list
     */

     const getItem = (data, index) => {
         return data[index]
     }
      
      const Item = ({ url }) => (
        <View style={{ height: height - StatusBar.currentHeight - 50, width: width, flex: 1, backgroundColor: 'black' }}>
        <FastImage
            style={{ height: '100%', width: '100%' }}
            source={{
                uri: `${url}`,
                priority: FastImage.priority.normal,
            }}
            resizeMode={FastImage.resizeMode.contain}
        />
        <View style={{ bottom: 80, right: '-5%' }}>
            <FloatingAction
                color="#2AC8FE"
                floatingIcon={<Image style={{ width: 22, height: 22 }} tintColor='#fff' source={require('../../assets/shareout.png')} />}
                actions={actions}
                onPressItem={name => onShareHandler(name, url)}

            />
        </View>
    </View>
      );



    if (isLoading) {
        return (
            <View style={{ height: height, width: width, justifyContent: 'center', alignItems: 'center', marginBottom: '-20%', backgroundColor: 'black', flexDirection: 'row' }}>
                <ActivityIndicator color={'white'} size='large' />
            </View>
        )
    }
    return (
        <>
        <View style={{height: 50, backgroundColor: 'red', marginTop: StatusBar.currentHeight}}>
        <View style={styles.header}>
            <Text style={styles.headerTxt}>Twimemes 😂</Text>
            {
                isGrid == false ? (<MaterialCommunityIcons onPress={() => { setIsGrid(!isGrid) }} style={{ marginRight: 10 }} name='grid-off' size={30} color='white' />) : (<MaterialCommunityIcons onPress={() => { setIsGrid(!isGrid) }} style={{ marginRight: 10 }} name='grid' size={30} color='white' />)
            }

        </View>
        </View>
        <View style={{ flex: 1 }}>
            <View showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'black' }}>
                {
                    firstTime ? (
                        <View style={{ height: height, width: width, justifyContent: 'center', alignItems: 'center', marginBottom: '-20%' }}>
                            <ActivityIndicator color={'white'} size='large' />
                        </View>
                    ) : <></>
                }
                {
                    isGrid ? (
                        <VirtualizedList
                            horizontal={true}
                            pagingEnabled
                            data={imgData}
                            renderItem={({ item }) => <Item url={item.url} />}
                            keyExtractor={data => data._id}
                            getItemCount={data => data.length}
                            getItem={getItem}
                            onEndReachedThreshold={0.5}
                            onEndReached={onListEndHandler}
                        />

                    ) : (
                        <View style={{flexWrap: 'wrap', flex:1, marginBottom: '20%'}}>
                        <FlatList
                            horizontal={false}
                            keyExtractor={item => item._id}
                            data={imgData}
                            showsVerticalScrollIndicator={false}
                            numColumns={3}                            
                            // ListfooterComponent={footerComponent}
                            // onRefresh={onPullDownHandler}
                            // refreshing={refresh}
                            onEndReachedThreshold={0.5}
                            onEndReached={onListEndHandler}
                            renderItem={({item, index}) => {
                                console.log(index)
                                return (
                                    <TouchableOpacity 
                                        style={{ height : height/4.5, width: width/3, padding:2 , borderWidth:1, borderColor:'black'}}
                                        onPress={()=>{
                                            setIsGrid(true);
                                        }}
                                    >
                                        <FastImage
                                            style={{ height: '100%', width: '100%' }}
                                            source={{
                                                uri: `${item.url}`,
                                                priority: FastImage.priority.normal,
                                            }}
                                            resizeMode={FastImage.resizeMode.cover}
                                        />
                                    </TouchableOpacity>
                                )
                            }}
                        />
                        </View>
                    )
                }
            </View>
                <View style={{ zIndex: 100, position: 'absolute', bottom: 0, left: 0 }}>
                    <AdmobScreen />
                </View>
        </View>
        </>

    );
}


const styles = StyleSheet.create({
    header: {
        width: '100%',
        height: 50,
        backgroundColor: '#2AC8FE',
        // top: '%',
        // margintTop: StatusBar.currentHeight,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10
    },
    headerTxt: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
    }
});


const actions = [
    {
        icon: <Image resizeMode='contain' source={require("../../assets/others.png")} style={{ height: 25, width: 25 }} />,
        name: "OTHERS",
        text: 'Others',
        color: "rgba(255,255,255,.5)",
        position: 1,
    },
    {
        icon: <Image resizeMode='contain' source={require("../../assets/whatsAppShare.png")} style={{ height: 25, width: 25 }} />,
        name: "WHATSAPP",
        text: 'Whatsapp',
        color: "rgba(255,255,255,.5)",
        position: 2
    },
];