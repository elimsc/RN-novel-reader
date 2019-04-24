import React, { Component } from 'react';
import {FlatList, View, StyleSheet, Dimensions} from 'react-native';
import { Divider, Text } from 'react-native-elements';

import {fetchSingleRanking} from '../services/rankings';
import BookItem from '../components/BookItem';
import config from '../utils/config';
import Loading from '../components/Loading';

const {width, height} = Dimensions.get('window');

// 排行榜书籍列表
class RankingDetail extends React.PureComponent {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', '排行榜'),
    };
  };

  state = {
    loading: true,
    active: 'week', // 当前选中：week, month, total
    weekRank: null, // 周榜id
    monthRank: null, // 月榜id
    totalRank: null, // 总榜id
    weekRankBooks: [], // 周榜书籍
    monthRankBooks: [], // 月榜书籍 
    totalRankBooks: [], // 总榜书籍
  }

  async componentDidMount() {
    const {navigation} = this.props;
    // 获取书籍列表
    const rankingId = navigation.getParam('rankingId', null);
    if (rankingId === null) {
      return;
    }
    const response = await fetchSingleRanking(rankingId);
    const json = await response.json();
    const books = json.ranking.books;
    
    // 不同类型榜单的id
    const weekRank = json.ranking._id;
    const monthRank = json.ranking.monthRank;
    const totalRank = json.ranking.totalRank;

    this.setState({weekRankBooks: books, weekRank, monthRank, totalRank, loading: false});
  }

  // 选择榜单类型: 周榜、月榜、总榜
  async onSelectRankingType(type) {
    if (type === this.state.active) { // 如果选中的是当前榜单类型，什么也不做
      return;
    }
    this.setState({loading: true});

    // 数据已经存在了
    // if (this.state[`${type}RankBooks`].length !== 0) {
    //   this.setState({active: type, loading: false});
    //   return;
    // }
    const rankingId = this.state[`${type}Rank`];
    const response = await fetchSingleRanking(rankingId);
    const json = await response.json();
    const books = json.ranking.books;

    if (type === 'week') {
      this.setState({weekRankBooks: books});
    }
    if (type === 'month') {
      this.setState({monthRankBooks: books});
    }
    if (type === 'total') {
      this.setState({totalRankBooks: books});
    }
    this.setState({loading: false, active: type});
  }

  currentColor(name) {
    if (name === this.state.active) {
      return config.style.color.appTabBg;
    }
    return config.style.color.black3;
  }

  renderHeader = () => (
    <View style={{backgroundColor: '#fff', position: 'absolute', width: width, top: 0, zIndex: 10}}>
      <View style={{flexDirection: 'row'}}>
        <Text onPress={() => this.onSelectRankingType('week')} style={{...styles.selectText, color: this.currentColor('week')}}>周榜</Text>
        <Text onPress={() => this.onSelectRankingType('month')} style={{...styles.selectText, color: this.currentColor('month')}}>月榜</Text>
        <Text onPress={() => this.onSelectRankingType('total')} style={{...styles.selectText, color: this.currentColor('total')}}>总榜</Text>
      </View>
    </View>
  )

  keyExtractor = (item, index) => `${item._id}`

  renderItem = ({item}) => (
    <BookItem onPress={this.handleItemPress} {...item} containerStyle={{padding: 10}}  />
  );

  handleItemPress = (item) => {
    const {navigation} = this.props;
    navigation.navigate('BookDetail', {bookId: item._id});
  }

  render() {
    const {active, monthRank, loading} = this.state;
    let books = this.state[`${active}RankBooks`];
    // if (loading) {
    //   return <Loading />;
    // }
    return (
      <View>
        {monthRank ? this.renderHeader() : null}
        {loading ? 
        <Loading /> :
        <FlatList
          ItemSeparatorComponent={() => <Divider />}
          data={books}
          getItemLayout={(data, index) => (
            {length: 111, offset: 111 * index, index}
          )}
          ListHeaderComponent={() => <View style={{height: this.state.monthRank ? 40 : 0}} />}
          initialNumToRender={10}
          removeClippedSubviews
          keyExtractor={this.keyExtractor}
          renderItem={this.renderItem}
        />
        }
      </View>
    );
  }
}

export default RankingDetail;

const styles = {
  selectText: {
    fontSize: 12, 
    height: 40, 
    lineHeight: 40, 
    // color: config.style.color.black3, 
    paddingLeft: 12, 
    paddingRight: 12
  }
};