import React, { Component } from 'react';

import {View, Text,  WebView} from 'react-native';


class Demo extends Component {
  render() {
    return (
      <WebView
        source={{uri: 'https://h5.zhuishushenqi.com/home'}}
      />
    );
  }
}

export default Demo;