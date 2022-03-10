import { StyleSheet, Text, View, FlatList, StatusBar, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image'
import { FAB, Portal, Provider } from 'react-native-paper';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import { AppInstalledChecker } from 'react-native-check-app-install';



const { width, height } = Dimensions.get("window")

export default function Index() {

    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const [imgData, setImgData] = React.useState([])
    const { open } = state;
    const accessKey = 'TU9-3CGxuCfpnegh-3jRnqr_vIJb-xafQ8jHPJkFtW4'
    const [page, setPage] = React.useState(1)
    const [load, setLoad] = React.useState(true)



    const getImages = async () => {
        setLoad(true)
        fetch(`https://api.unsplash.com/photos?page=${page}&client_id=${accessKey}`)
            .then((response) => response.json())
            .then((json) => {
                setImgData(imgData.concat(json))
            })
            .catch((error) => {
                console.error(error);
            })
            .finally(() => {
                setLoad(false)
            })
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

        AppInstalledChecker
            .isAppInstalled('whatsapp')
            .then((isInstalled) => {
                if (isInstalled) {
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
                else {
                    alert("Whatsapp is not installed")
                }
            });
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
                keyExtractor={item => item.id}
                data={imgData}
                horizontal={false}
                showsVerticalScrollIndicator={false}
                onEndReached={OnListEnd}
                onEndReachedThreshold={0}
                ListFooterComponent={Footer}
                renderItem={({ item }) => (
                    <View
                        style={{ height: height, width: width, alignItems: 'center', justifyContent: "center" }}
                    >
                        <FastImage
                            style={{ width: "100%", height: "100%" }}
                            source={{
                                uri: `${item.urls.small}`,
                                priority: FastImage.priority.normal,
                            }}
                            resizeMode={FastImage.resizeMode.contain}
                        />
                        <Provider>
                            <Portal>
                                <FAB.Group
                                    open={open}
                                    icon={open ? 'close' : 'plus'}
                                    actions={[
                                        {
                                            icon: 'share',
                                            label: 'Share',
                                            onPress: () => { onShare(`${item.urls.small}`) },
                                        },
                                        {
                                            icon: 'whatsapp',
                                            label: 'Whatsapp',
                                            onPress: () => {
                                                shareOnWhatsapp(`${item.urls.small}`)
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
        </SafeAreaView>


    );
}

const styles = StyleSheet.create({});
