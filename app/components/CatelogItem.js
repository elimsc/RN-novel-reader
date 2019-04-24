import React, { Component } from 'react';
import {TouchableOpacity, Text} from 'react-native';

import config from '../utils/config';

class CatelogItem extends React.PureComponent {
  _onPress = () => {
    this.props.onPress(this.props.index);
  }
  
  render() {
    const {item, currentChapterIndex, index} = this.props;

    return (
      <TouchableOpacity activeOpacity={1} onPress={this._onPress}>
        <Text numberOfLines={1} style={{
          marginLeft: 15,
          fontSize: 16, 
          lineHeight: 40, 
          color: index === currentChapterIndex ? config.style.color.appTabBg : config.style.color.black3,
        }}> {item.title}</Text>
      </TouchableOpacity>
    );
  }
}

export default CatelogItem;