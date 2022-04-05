import { StyleSheet, Text, View, FlatList, StatusBar, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image'
import { FAB, Portal, Provider } from 'react-native-paper';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import AdmobScreen from '../admob';
import admob,{AdEventType, InterstitialAd, TestIds} from '@react-native-firebase/admob'


const { width, height } = Dimensions.get("screen")

export default function Index() {

    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const [imgData, setImgData] = React.useState([])
    const { open } = state;
    // const accessKey = 'TU9-3CGxuCfpnegh-3jRnqr_vIJb-xafQ8jHPJkFtW4'
    // const api = 'https://api.unsplash.com/photos?page=${page}&client_id=${accessKey}'
    const [page, setPage] = React.useState(1)
    const [load, setLoad] = React.useState(true)

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

    const getImages = async () => {
        // setLoad(true)
        fetch(`https://twittermemes-somy.herokuapp.com/memes?page=${page}&limit=100`)
            .then((response) => response.json())
            .then((json) => {
                // console.log(json.data)
                if(json.data === [])
                {
                    return
                }
                setImgData(imgData.concat(json.data))
            })
            .catch((error) => {
                console.error(error);
            })
            // .finally(() => {
            //     setLoad(false)
            // })
    };

    React.useEffect(() => {
        getImages()
    }, [page])



    const onShare = (url) => {

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

    const shareOnWhatsapp = (url) => {
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

    const OnListEnd = () => {
        setPage(page + 1)
    }

    const Footer = () => {
        return (
            load ?
                <View style={{ alignSelf: 'center', marginVertical: 20 }}>
                    <ActivityIndicator color={'white'} size='large' />
                </View>
                : null
        )
    }

    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: 'black' }}>
            <StatusBar translucent backgroundColor={"transparent"} barStyle={'light-content'} />
            <FlatList
                keyExtractor={item => item._id}
                data={imgData}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                onEndReached={OnListEnd}
                onEndReachedThreshold={.003}
                ListFooterComponent={Footer}
                renderItem={({ item }) => (
                    <View style={{ height: height, width: width }}>
                        <FastImage
                            style={{ height: height, width: width }}
                            source={{
                                uri: `${item.url}`,
                                priority: FastImage.priority.normal,
                            }}
                            
                            onError = {(error)=>{

                                console.log("==========")
                                console.log(error.message)
                                console.log("==========")
                            
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Provider>
                            <Portal>
                                <FAB.Group
                                style={{bottom: 100, right: 0}}
                                    open={open}
                                    icon={open ? 'close' : 'plus'}
                                    actions={[
                                        {
                                            icon: 'share',
                                            label: 'Share',
                                            onPress: () => { onShare(`${item.url}`) },
                                            small:false,
                                        },
                                        {
                                            icon: 'whatsapp',
                                            label: 'Whatsapp',
                                            onPress: () => {
                                                // push()
                                                showIntertitialAds()
                                                shareOnWhatsapp(`${item.url}`)
                                            },
                                            small: false
                                        },
                                    ]}
                                    onStateChange={onStateChange}
                                    onPress={() => {
                                        if (open) {
                                            // do something if the speed dial is open
                                        }
                                    }}
                                />
                            </Portal>
                        </Provider>
                    </View>
                )}
                pagingEnabled
            />
            <View style={{zIndex:100, position: 'absolute', bottom: 0, left: 0}}>
                <AdmobScreen/>
            </View>
            
        </SafeAreaView>


    );
}

const styles = StyleSheet.create({});
