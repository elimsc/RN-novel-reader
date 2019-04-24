import React, { Component } from 'react';

import {ActivityIndicator, View, Dimensions} from 'react-native';
import config from '../utils/config';

const {height, width} = Dimensions.get('window');


const Loading = ({containerStyle}) => (
  // <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', position: 'absolute', top: 0, width: width, height: height - 100, backgroundColor: '#fff', ...containerStyle}}>
  //   <ActivityIndicator size="large" animating />
  // </View>
  <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#fff',  ...containerStyle}}>
    <ActivityIndicator size="large" animating />
  </View>
);

export default Loading;