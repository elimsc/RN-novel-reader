import React, { Component } from 'react';

import {View, Image, StyleSheet, Dimensions, ToastAndroid, ScrollView} from 'react-native';
import {Text, Button, Divider} from 'react-native-elements';

import {fetchBookDetail} from '../services/books';
import {isInShelf, removeFromShelf, saveToShelf} from '../services/persistence';
import config from '../utils/config';
import {constructImageLink} from '../utils/image';
import {fromNow} from '../utils/time';
import Loading from '../components/Loading';

const {height, width} = Dimensions.get('window');

class BookDetail extends Component {
  static navigationOptions = {
    title: '书籍详情',
  }

  state = {
    bookInfo: {},
    inShelf: null,
    loading: true,
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const bookId = navigation.getParam('bookId', null);
    if (bookId === null) {
      return;
    }
    console.log(bookId);

    // 获取书籍信息
    const response = await fetchBookDetail(bookId);
    const bookInfo = await response.json();
    // 判断是否在书架中 
    const inShelf = await isInShelf(bookId);

    this.setState({bookInfo, inShelf, loading: false});
  }

  _addToShelf = async () => {
    await saveToShelf(this.state.bookInfo._id);
    ToastAndroid.show(`已添加《${this.state.bookInfo.title}》`, ToastAndroid.SHORT);
    this.setState({inShelf: true});
  }

  _removeFromShelf = async () => {
    await removeFromShelf(this.state.bookInfo._id);
    ToastAndroid.show(`已移除《${this.state.bookInfo.title}》`, ToastAndroid.SHORT);
    this.setState({inShelf: false});
  }

  goReader = () => {
    const {navigation} = this.props;
    navigation.navigate('Reader', {bookId: this.state.bookInfo._id});
  }

  render() {
    const {bookInfo, inShelf, loading} = this.state;
    const {navigation} = this.props;
    if (loading) {
      return <Loading />;
    }
    return (
      <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{padding: 10, backgroundColor: '#fff', flexDirection: 'row'}}>
          <View style={{flex: 1}}>
            <Image 
              style={{width: 60, height: 80}}
              source={{uri: constructImageLink(bookInfo.cover)}}
            />
          </View>
          <View style={{flex: 4}}>
            <Text style={styles.bookTitle}>{bookInfo.title}</Text>
            <Text style={styles.descText}>
              <Text style={{color: config.style.color.appTabBg}} onPress={() => navigation.navigate('AuthorBooks', {author: bookInfo.author})}>{bookInfo.author}</Text> 
              <Text> | </Text>{bookInfo.cat}<Text> | </Text>{Math.floor(bookInfo.wordCount / 10000)}万字</Text>

            <Text style={styles.descText}>
              {fromNow(bookInfo.updated)}
            </Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-around', paddingTop: 10, paddingBottom: 10}}>
          {
            inShelf ? 
            <Button onPress={this._removeFromShelf} textStyle={{color: config.style.color.black3}} fontSize={14} buttonStyle={{width: width / 2 - 20}} backgroundColor='#ccc' title="不追了" /> :
            <Button onPress={this._addToShelf} fontSize={14} buttonStyle={{width: width / 2 - 20}} backgroundColor={config.style.color.appTabBg} title="追更新" />
          }
          <Button onPress={this.goReader} fontSize={14} buttonStyle={{width: width / 2 - 20}} backgroundColor={config.style.color.appTabBg} title="开始阅读" />
        </View>
        <Divider />
        <View style={{padding: 10, flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-around'}}>
          <View style={styles.otherInfoContainer}>
            <Text style={styles.otherInfo}>追书人气</Text>
            <Text style={styles.otherInfo}><Text style={{color: '#111'}}>{bookInfo.latelyFollower}</Text></Text>
          </View>
          <View style={styles.otherInfoContainer}>
            <Text style={styles.otherInfo}>追书评分</Text>
            <Text style={styles.otherInfo}><Text style={{color: '#111'}}>{bookInfo.rating.score.toFixed(1)}</Text></Text>
          </View>
          <View style={styles.otherInfoContainer}>
            <Text style={styles.otherInfo}>读者留存</Text>
            <Text style={styles.otherInfo}><Text style={{color: '#111'}}>{bookInfo.retentionRatio}%</Text></Text>
          </View>
          <View style={styles.otherInfoContainer}>
            <Text style={styles.otherInfo}>社区帖子</Text>
            <Text style={styles.otherInfo}><Text style={{color: '#111'}}>{bookInfo.postCount}</Text></Text>
          </View>
        </View>
        <Divider />
        <View style={{backgroundColor: '#fff', padding: 10}}>
          <View style={{borderLeftColor: config.style.color.appTabBg, borderLeftWidth: 3, marginBottom: 10}}>
            <Text style={{paddingLeft: 5, fontSize: 16, color: config.style.color.black2}}>简介</Text>
          </View>
          <View>
            <Text numberOfLines={3} style={{lineHeight: 18, fontSize: 12, color: config.style.color.black3}}>{bookInfo.longIntro}</Text>
          </View>
        </View>
      </ScrollView>
    );
  }
}

export default BookDetail;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
  },
  bookTitle: {
    color: config.style.color.black2,
    fontSize: 16,
    lineHeight: 30,
  },
  descText: {
    color: config.style.color.black3,
    fontSize: 12,
    lineHeight: 25,
  },
  otherInfoContainer: {
    flex: 1, 
    flexDirection: 'column'
  },
  otherInfo: {
    textAlign: 'center',
    color: config.style.color.black3,
    fontSize: 14,
    lineHeight: 20
  }
});