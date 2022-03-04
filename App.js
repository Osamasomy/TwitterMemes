import { StyleSheet, Text, View, FlatList, StatusBar, Dimensions } from 'react-native';
import React from 'react';
import FastImage from 'react-native-fast-image'


const {width, height} = Dimensions.get("window")

export default function App() {
  return (
    <View style={{flex: 1}}>
      <StatusBar translucent backgroundColor = {"transparent"}  />
      <FlatList
        keyExtractor = {item=> item}
        data ={[1,2,34,5,6,7]}
        renderItem = {({item})=>(
          <View style={{height: height, width: width, backgroundColor: '#eee', alignItems: 'center', justifyContent: "center"}}>
            <FastImage
                style={{ width: "100%", height: "100%" }}
                source={{
                    uri: 'https://unsplash.it/400/400?image=1',
                    priority: FastImage.priority.normal,
                }}
                resizeMode={FastImage.resizeMode.contain}
            />
          </View>
        )}
        pagingEnabled
      />
    </View>
  );
}

const styles = StyleSheet.create({});
