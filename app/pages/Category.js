import React, { Component } from 'react';
import {View, StyleSheet, FlatList, ScrollView, Dimensions, TouchableOpacity} from 'react-native';
import {Text, Divider} from 'react-native-elements';

import config from '../utils/config';
import {fetchTopCategory} from '../services/category';

class Category extends Component {
  static navigationOptions = {
    title: '分类'
  }

  state = {
    maleCategory: [], // 男生分类
    femaleCategory: [], // 女生分类 
  }

  async componentDidMount() {
    // 获取排行榜
    const response = await fetchTopCategory();
    const allCategory = await response.json();
    const maleCategory = allCategory.male;
    const femaleCategory = allCategory.female;

    this.setState({maleCategory, femaleCategory});
  }


  handleItemPress = (item) => {
    const {navigation} = this.props;
    navigation.navigate('H5CategoryDetail', {title: item.name, url: encodeURI(`https://h5.zhuishushenqi.com/category/${item.name}?gender=${item.gender}`)});
  }

  render() {
    const {maleCategory,  femaleCategory} = this.state;
    return (
      <ScrollView style={{backgroundColor: '#fff'}}>
        <Text style={styles.title}>
          男生
        </Text>
        <View style={styles.categoryContainer}>
          {
            maleCategory.map((item, i) => (
              <TouchableOpacity activeOpacity={1} onPress={() => this.handleItemPress({...item, gender: 'male'})}  key={i} style={styles.itemContainer}>
                <Text style={{textAlign: 'center', fontSize: 15, fontWeight: '700', color: '#333', lineHeight: 24}}>{item.name}</Text>
                <Text style={{textAlign: 'center', fontSize: 12, color: '#ccc', lineHeight: 18}}>{item.bookCount}本</Text>
              </TouchableOpacity>
            ))
          }
        </View>

        <Text style={styles.title}>
          女生 
        </Text>
        <View style={styles.categoryContainer}>
          {
            femaleCategory.map((item, i) => (
              <TouchableOpacity activeOpacity={1} onPress={() => this.handleItemPress({...item, gender: 'female'})}  key={i} style={styles.itemContainer}>
                <Text style={{textAlign: 'center', fontSize: 15, fontWeight: '700', color: '#333', lineHeight: 24}}>{item.name}</Text>
                <Text style={{textAlign: 'center', fontSize: 12, color: '#ccc', lineHeight: 18}}>{item.bookCount}本</Text>
              </TouchableOpacity>
            ))
          }
        </View>
      </ScrollView>
    );
  }
}

export default Category;

const {height, width} = Dimensions.get('window');


const styles = StyleSheet.create({

  title: {
    marginLeft: 15,
    fontSize: 12, 
    color: '#999', 
    lineHeight: 50,
    fontWeight: '400',
  },
  categoryContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    borderTopColor: config.style.color.divider, 
    borderTopWidth: 1,
    marginBottom: 10,
  },
  itemContainer: {
    paddingBottom: 10,
    paddingTop: 10,
    width: width / 3, 
    // height: 40, 
    // color: config.style.color.black2,
    // lineHeight: 40, 
    // textAlign: 'center', 
    borderColor: config.style.color.divider, 
    borderBottomWidth: 1,
    borderRightWidth: 1,
  }
})