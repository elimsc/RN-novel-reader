import React, { Component } from 'react';
import {View, StyleSheet, FlatList, ScrollView, Dimensions} from 'react-native';
import {Text, Divider} from 'react-native-elements';

import config from '../utils/config';
import {fetchRankingList} from '../services/rankings';
import Loading from '../components/Loading';

class Ranking extends Component {
  static navigationOptions = {
    title: '排行榜'
  }

  state = {
    loading: true,
    maleRanking: [], // 男生排行榜
    femaleRanking: [], // 女生排行榜 
    epubRanking: [], // 出版排行榜
  }

  async componentDidMount() {
    // 获取排行榜
    const response = await fetchRankingList();
    const rankingList = await response.json();
    const maleRanking = rankingList.male;
    const femaleRanking = rankingList.female;
    const epubRanking = rankingList.epub;

    this.setState({maleRanking, femaleRanking, epubRanking, loading:false});
  }


  onItemPress = (item) => {
    const {navigation} = this.props;
    navigation.navigate('RankingBooks', {rankingId: item._id, title: item.title});
  }

  render() {
    const {maleRanking,  femaleRanking, epubRanking, loading} = this.state;
    if (loading) {
      return <Loading />;
    }
    return (
      <ScrollView style={{backgroundColor: '#fff'}}>
        <Text style={styles.title}>
          男生
        </Text>
        <View style={styles.itemContainer}>
          {
            maleRanking.map((item, i) => (
              <Text onPress={() => this.onItemPress(item)} key={i} style={styles.item}>{item.shortTitle}</Text>
            ))
          }
        </View>

        <Text style={styles.title}>
          女生 
        </Text>
        <View style={styles.itemContainer}>
          {
            femaleRanking.map((item, i) => (
              <Text onPress={() => this.onItemPress(item)} key={i} style={styles.item}>{item.shortTitle}</Text>
            ))
          }
        </View>

        {/* <Text style={styles.title}>
          出版
        </Text>
        <View style={styles.itemContainer}>
          {
            epubRanking.map((item, i) => (
              <Text onPress={() => this.onItemPress(item)} key={i} style={styles.item}>{item.shortTitle}</Text>
            ))
          }
        </View> */}
      </ScrollView>
    );
  }
}

export default Ranking;

const {height, width} = Dimensions.get('window');


const styles = StyleSheet.create({
  selectText: {
    fontSize: 12, 
    height: 35, 
    lineHeight: 35, 
    color: config.style.color.black3, 
    marginLeft: 10, 
    marginRight: 10
  }, 

  title: {
    fontSize: 12, 
    color: config.style.color.black3, 
    margin: 10
  },
  itemContainer: {
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    borderTopColor: config.style.color.divider, 
    borderTopWidth: 1,
    marginBottom: 10,
  },
  item: {
    width: width / 3, 
    height: 40, 
    color: config.style.color.black2,
    lineHeight: 40, 
    textAlign: 'center', 
    borderColor: config.style.color.divider, 
    borderBottomWidth: 1,
    borderRightWidth: 1,
  }
})