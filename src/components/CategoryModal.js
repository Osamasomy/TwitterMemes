import { StyleSheet, Text, View, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import React, { useEffect } from 'react'
import Modal from "react-native-modal";
import { constants } from '../helper/constants';
import { RadioButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'




const CategoryModal = ({ visible, setShowModal, setCategory, category, loading, setName }) => {

    const [categoryFromApi, setCategoryFromApi] = React.useState(false)

    useEffect(() => {
        getCategories()
    }, [])


    const getCategories = () => {
        fetch(`https://twittermemes-somy.herokuapp.com/memes/categories`)
            .then((response) => response.json())
            .then((res) => {
                setCategoryFromApi(res.data)
            })
    }

    const [checked, setChecked] = React.useState(category);
    return (
        <Modal animationIn={'fadeInUp'} isVisible={visible} animationOutTiming={400}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                {
                    loading ? <ActivityIndicator size={'large'} color="#fff" /> : (
                        <View style={styles.body}>
                            <TouchableOpacity onPress={setShowModal} style={{ alignSelf: 'flex-end', padding: 5 }}>
                                <MaterialCommunityIcons name='close-circle' color={'white'} size={24} />
                            </TouchableOpacity>
                            <Text style={[styles.textHeader]}>Choose Category</Text>
                            <View style={{alignSelf: 'flex-start', marginTop: 10}}>
                                <FlatList
                                    data={categoryFromApi}
                                    keyExtractor={item => item._id}
                                    renderItem={(item) => {
                                        return (
                                            <View style={{ flexDirection: 'row-reverse', alignItems: 'center', alignSelf: 'flex-start' }}>
                                                <Text style={styles.radioTxt}>
                                                    {item.item.name}
                                                </Text>
                                                <RadioButton
                                                    value={`${item.item.name}`}
                                                    status={checked === `${item.item.name}` ? 'checked' : 'unchecked'}
                                                    onPress={() => {
                                                        setCategory(`${item.item._id}`)
                                                        setChecked(`${item.item.name}`)
                                                        setName(`${item.item.name}`)
                                                    }
                                                    }
                                                />
                                            </View>
                                        )
                                    }}
                                    ListHeaderComponent={ () => {
                                        return (
                                        <View style={{ flexDirection: 'row-reverse', alignItems: 'center', alignSelf: 'flex-start' }}>
                                            <Text style={styles.radioTxt}>
                                                All
                                            </Text>
                                            <RadioButton
                                                value="All"
                                                status={checked === "All" || !checked ? 'checked' : 'unchecked'}
                                                onPress={() => {
                                                    setCategory(null)
                                                    setChecked("All")
                                                    setName("All")
                                                }
                                                }
                                            />
                                        </View>
                                    )}}
                                />
                            </View>

                        </View>
                    )
                }

            </View>
        </Modal>
    )
}

export default CategoryModal

const styles = StyleSheet.create({
    body: {
        backgroundColor: 'rgba(52, 52, 52, 0.9)',
        height: constants.screenHeight / 2.5,
        width: constants.screenWidth / 1.2,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 10,
        borderRadius: 10
    },
    textHeader: {
        fontSize: 19,
        color: '#fff',
        fontWeight: '700',
        marginTop: 10
    },
    radioTxt: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16
    },
})