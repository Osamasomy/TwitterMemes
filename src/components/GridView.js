import React from 'react'
import { TouchableOpacity } from 'react-native'
import FastImage from 'react-native-fast-image'
import { constants } from '../helper/constants'

export default function GridView({item, index, setIsGrid}) {
  return (
    <>
      <TouchableOpacity
        style={{ height: constants.screenHeight / 4.5, width: constants.screenWidth / 3, padding: 2, borderWidth: 1, borderColor: 'black' }}
        onPress={() => { setIsGrid({ gridView: true, index }) }}
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
    </>
  )
}
