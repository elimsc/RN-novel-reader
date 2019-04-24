import React, { Component } from 'react';
import {View, Image, Dimensions, TouchableOpacity} from 'react-native';
import { Avatar, Text } from 'react-native-elements';

import config from '../utils/config';
import {constructImageLink} from '../utils/image';

const {height, width} = Dimensions.get('window');

class BookItem extends React.PureComponent {

  _onPress = () => this.props.onPress({_id: this.props._id});

  render() {
    const {
      _id,
      containerStyle,
      title, 
      author, 
      shortIntro, 
      cover, 
      latelyFollower, 
      onPress,
      majorCate,
      cat,
      retentionRatio
    } = this.props;

    return (
      <TouchableOpacity activeOpacity={1} onPress={this._onPress} 
        style={{height: 110, alignItems: 'center', flexDirection: 'row', ...containerStyle}}>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <Image 
            source={{uri: constructImageLink(cover)}}
            style={{width: width / 6, height: 80}}
          />
        </View>
        <View style={{flex: 4, paddingLeft: 15}}>
          <Text numberOfLines={1} style={{fontSize: 16, color: config.style.color.black2, lineHeight: 25}}>{title}</Text>
          <Text numberOfLines={1} style={{fontSize: 12, color: config.style.color.black4, lineHeight: 20}}>{author} | {majorCate ? majorCate:cat}</Text>
          <Text numberOfLines={1} style={{fontSize: 12, color: config.style.color.black4, lineHeight: 20}}>{shortIntro}</Text>
          <Text style={{fontSize: 12, fontWeight: '300', lineHeight: 25, color: config.style.color.black4}}>
            <Text style={{color: config.style.color.appTabBg}}>{latelyFollower}</Text>人气<Text> | </Text> 
            <Text style={{color: config.style.color.appTabBg}}>{retentionRatio ? retentionRatio : 0}%</Text>
            读者留存
          </Text>
        </View>
      </TouchableOpacity>
      );
  }
}


 export default BookItem;