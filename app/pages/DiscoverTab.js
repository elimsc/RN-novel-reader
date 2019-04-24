import React, { Component } from 'react';
import {StyleSheet} from 'react-native';
import {Text, List, ListItem} from 'react-native-elements';

import config from '../utils/config';

class DiscoverTab extends Component {

  render(){
    return (
      <List containerStyle={{marginTop: 0, flex: 1}}>
        <ListItem 
          containerStyle={styles.itemContainer}
          titleStyle={styles.itemTitle}
          title="排行榜"
          onPress={() => this.props.navigation.navigate('H5Ranking')}
        />
        <ListItem
          onPress={() => this.props.navigation.navigate('Category')}
          containerStyle={styles.itemContainer}
          titleStyle={styles.itemTitle}
          title="分类"
        />
        <ListItem
          onPress={() => this.props.navigation.navigate('H5BookList')}
          containerStyle={styles.itemContainer}
          titleStyle={styles.itemTitle}
          title="主题书单"
        />
      </List>
    );
  }
}

export default DiscoverTab;

const styles = StyleSheet.create({
  itemContainer: {
    borderBottomColor: '#eee',
    // borderBottomColor: config.style.color.divider,
    height: 60,
  },
  itemTitle: {
    fontSize: 16, 
    color: config.style.color.black2, 
    lineHeight: 60
  }
});