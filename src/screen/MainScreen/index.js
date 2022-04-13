import { StyleSheet, Text, View, FlatList, Dimensions, StatusBar, ActivityIndicator, Image, TouchableOpacity, ScrollView, VirtualizedList } from 'react-native';
import React from 'react';
import AdmobScreen from '../admob';
import { AdEventType, InterstitialAd } from '@react-native-firebase/admob'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import FullView from '../../components/FullView';
import { constants } from '../../helper/constants';
import GridView from '../../components/GridView';
import SplashScreen from '../SplashScreen';

const limit = 50;

export default function Index() {


    /**
     * State Management
     */
    const [imgData, setImgData] = React.useState([])
    const [totalWithOutLimit, setTotalWithOutLimit] = React.useState(null)
    const [firstTime, setFirstTime] = React.useState(true)
    const [page, setPage] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(true)
    const [isGrid, setIsGrid] = React.useState({ gridView: false, index: 0 })


    /**
     * Interstitial Ad
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
     * API Call To fetch memes
     */
    const apiCall = async (pageIndex) => {

        fetch(`${constants.baseURL}/memes?page=${pageIndex}&limit=${limit}`)
            .then((response) => response.json())
            .then((res) => {
                AsyncStorage.setItem('pageNumber', JSON.stringify(pageIndex))
                if (pageIndex === 1) {
                    setImgData(res.data)
                }
                else {
                    setImgData([...imgData, ...res.data])
                }
                setTotalWithOutLimit(res.totalWithOutLimit)
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
     * Fetch page data on Page Change
     */
    React.useEffect(() => {
        apiCall(page);
    }, [page])




    /**
     * on list ending function
     */
    const onListEndHandler = async () => {
        const totalPages = Math.ceil(totalWithOutLimit / limit)
        if (page >= totalPages) return;
        else {
            setPage(page + 1)

        }
    }

    /**
     * Toggle Between Views
     */
    const toggleView = () => {
        setIsGrid({ ...isGrid, gridView: !isGrid.gridView })
    }



    /**
     * App Loader
     */
    if (isLoading) {
        return (
            <SplashScreen/>
        )
    }


    /**
     * Main Entry Point
     */
    return (
        <>

            <View style={[styles.header, { height: 60, marginTop: StatusBar.currentHeight }]}>
                <Text style={styles.headerTxt}>Twimemes 😂</Text>
                <MaterialCommunityIcons onPress={toggleView} style={{ marginRight: 10 }} name={isGrid.gridView == false ? "grid" : 'grid-off'} size={30} color='white' />
            </View>
            <View style={{ flex: 1 }}>
                <View showsVerticalScrollIndicator={false} style={{ flex: 1, backgroundColor: 'black' }}>
             
                    {
                        isGrid.gridView ?
                            <FlatList
                                horizontal={true}
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                data={imgData}
                                initialScrollIndex={isGrid.index}
                                // initialNumToRender= {isGrid.index}
                                getItemLayout={(data, index) => (
                                    { length: constants.screenWidth, offset: constants.screenWidth * index, index }
                                )}
                                renderItem={({ item }) => <FullView item={item} showIntertitialAds={showIntertitialAds} />}
                                keyExtractor={data => data._id}
                                onEndReachedThreshold={0.5}
                                onEndReached={onListEndHandler}
                            />

                            :
                            <View style={{ flexWrap: 'wrap', flex: 1, marginBottom: '20%' }}>
                                <FlatList
                                    horizontal={false}
                                    keyExtractor={item => item._id}
                                    data={imgData}
                                    showsVerticalScrollIndicator={false}
                                    numColumns={3}
                                    onEndReachedThreshold={0.5}
                                    onEndReached={onListEndHandler}
                                    renderItem={({ item, index }) => <GridView item={item} index={index} setIsGrid={setIsGrid} />}
                                />
                            </View>

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10
    },
    headerTxt: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '700',
    }
});


