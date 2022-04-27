import { StyleSheet, Text, View, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import React from 'react';
import AdmobScreen from '../admob';
import { AdEventType, InterstitialAd } from '@react-native-firebase/admob'
import AsyncStorage from '@react-native-async-storage/async-storage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Ionicons from 'react-native-vector-icons/Ionicons'
import FullView from '../../components/FullView';
import { constants } from '../../helper/constants';
import GridView from '../../components/GridView';
import SplashScreen from '../SplashScreen';
import Tooltip from 'react-native-walkthrough-tooltip';
import CategoryModal from '../../components/CategoryModal';

const limit = 50;

export default function Index() {



    /**
     * State Management
     */
    const [imgData, setImgData] = React.useState([])
    const [totalWithOutLimit, setTotalWithOutLimit] = React.useState(null)
    const [page, setPage] = React.useState(1)
    const [isLoading, setIsLoading] = React.useState(true)
    const [isGrid, setIsGrid] = React.useState({ gridView: true, index: 0 })
    const [state, setState] = React.useState({
        showTip1: null,
        showTip2: null,
        showGesture: null,
    })
    const [showModal, setShowModal] = React.useState(false)
    const [category, setCategory] = React.useState(false)
    const [categoryName, setCategoryName] = React.useState('Category')
    const [modalLoading, setModalLoading] = React.useState(false)
    const [isEmpty, setIsEmpty] = React.useState(false)

    /**
     * Check First Time
     */
    const checkFirstTime = async () => {
        let check = await AsyncStorage.getItem('checkFirstTime');
        check = JSON.parse(check)
        if (!check) {
            console.log('check first time => true')
            check = true
            setState({ ...state, showTip1: true })
            await AsyncStorage.setItem('checkFirstTime', JSON.stringify(check))
        }
        else {
            console.log('not first time')
            setState({ ...state, showTip1: false })
        }
    }


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
    const apiCall = async (pageIndex, category) => {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
            "categoryId": category ? `${category}` : null
        });
        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: raw,
            redirect: 'follow'
        };

        fetch(`https://twittermemes-somy.herokuapp.com/memes/memesByCategory?page=${pageIndex}&limit=${limit}`, requestOptions)
            .then((response) => response.json())
            .then((res) => {
                AsyncStorage.setItem('pageNumber', JSON.stringify(pageIndex))
                if (pageIndex === 1) {
                    console.log(res.data)
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
                setShowModal(false)
                setIsLoading(false)
                setModalLoading(false)
            })
    }


    /**
     * Fetch page data on Page Change
     */
    React.useEffect(() => {
        checkFirstTime()
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
            <SplashScreen />
        )
    }


    /**
     * Main Entry Point
     */
    return (
        <>
            <View style={[styles.header, { marginTop: StatusBar.currentHeight }]}>
                {
                    isEmpty ? <></> : <CategoryModal visible={showModal} setShowModal={() => { setShowModal(!showModal) }} setCategory={(val) => { setCategory(val); apiCall(1, val) }} category={category} setModalLoading={(val) => { setModalLoading(val) }} loading={modalLoading} setName={(val) => { setCategoryName(val) }} setEmpty={(val) => { setIsEmpty(val) }} />
                }
                <Tooltip
                    isVisible={state.showTip2}
                    content={
                        <View>
                            <Text style={{ color: '#000' }}>You can select diffrent categories</Text>
                        </View>
                    }
                    onClose={() => { setState({ ...state, showTip2: false, showGesture: true }) }}
                    placement="bottom"
                    // below is for the status bar of react navigation bar
                    topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                >
                    <TouchableOpacity onPress={() => {
                        setShowModal(!showModal)
                        // filter()
                    }} style={{ flexDirection: 'row', alignItems: 'flex-end' }}>
                        <Text style={[styles.headerTxt, { marginRight: 5 }]}>{`${categoryName}`}</Text>
                        <Ionicons name='md-caret-down' color={'white'} size={20} />
                    </TouchableOpacity>
                </Tooltip>

                <Tooltip
                    isVisible={state.showTip1}
                    content={
                        <View>
                            <Text style={{ color: '#000' }}>You can toggle between grid and full view</Text>
                        </View>
                    }
                    onClose={() => { setState({ ...state, showTip1: false, showTip2: true }) }}
                    placement="bottom"
                    // below is for the status bar of react navigation bar
                    topAdjustment={Platform.OS === 'android' ? -StatusBar.currentHeight : 0}
                >
                    <MaterialCommunityIcons onPress={toggleView} style={{ marginRight: 10 }} name={isGrid.gridView == false ? "grid" : 'grid-off'} size={30} color='white' />
                </Tooltip>
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
                                onScroll={() => { setState({ ...state, showGesture: false }) }}
                                getItemLayout={(data, index) => (
                                    { length: constants.screenWidth, offset: constants.screenWidth * index, index }
                                )}
                                renderItem={({ item }) => <FullView item={item} showIntertitialAds={showIntertitialAds} firstTime={state.showGesture} />}
                                keyExtractor={data => data._id}
                                onEndReachedThreshold={0.5}
                                onEndReached={onListEndHandler}
                            />

                            :
                            <View style={{ flexWrap: 'wrap', flex: 1, marginBottom: '1%' }}>
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
                <View style={{ bottom: 0, left: 0, }}>
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
        fontSize: 21,
        fontWeight: 'bold',
    }
});