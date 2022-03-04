import { StyleSheet, Text, View, FlatList, StatusBar, Dimensions } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image'
import { FAB, Portal, Provider } from 'react-native-paper';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob'



const { width, height } = Dimensions.get("window")

export default function Index() {

    const [state, setState] = React.useState({ open: false });
    const onStateChange = ({ open }) => setState({ open });
    const [imgData, setImgData] = React.useState([])
    const { open } = state;
    const accessKey = 'TU9-3CGxuCfpnegh-3jRnqr_vIJb-xafQ8jHPJkFtW4'
    const [page, setPage] = React.useState(1)



    const getImages = async () => {
        fetch(`https://api.unsplash.com/photos?page=${page}&client_id=${accessKey}`)
            .then((response) => response.json())
            .then((json) => {
                setImgData(imgData.concat(json))
            })
            .catch((error) => {
                console.error(error);
            });
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


    return (

        <View style={{ flex: 1 }}>
            <StatusBar translucent backgroundColor={"transparent"} barStyle={'dark-content'} />
            <FlatList
                keyExtractor={item => item.id}
                data={imgData}
                onEndReached={() => { setPage(page + 1) }}
                renderItem={({ item }) => (
                    <View
                        style={{ height: height, width: width, backgroundColor: '#eee', alignItems: 'center', justifyContent: "center" }}
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
                                        // {
                                        //     icon: 'share',
                                        //     label: 'Share',
                                        //     onPress: () => console.log('Pressed notifications'),
                                        // },
                                        {
                                            icon: 'share',
                                            label: 'Share',
                                            onPress: () => { onShare(`${item.urls.small}`) },
                                            small: false,
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
        </View>


    );
}

const styles = StyleSheet.create({});
