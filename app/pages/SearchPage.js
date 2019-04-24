import React, { Component } from 'react';
import {View, Text, StatusBar, FlatList, ScrollView, TouchableOpacity} from 'react-native';
import {SearchBar, Button, Divider} from 'react-native-elements';

import config from '../utils/config';
import {search, autoComplete} from '../services/search';
import BookItem from '../components/BookItem';
import BookList from '../components/BookList';

class SearchPage extends Component {
  static navigationOptions = {
    header: null,
  }

  state = {
    loading: false,
    text: '',
    books: [],
    complete: [], //自动补全的内容
  }

  handSearch = async () => {
    this.setState({loading: true, complete: []})
    const response = await search(this.state.text);
    const json = await response.json();
    const books = json.books;
    this.setState({books, loading: false});
  }

  handleItemPress = (item) => {
    const {navigation} = this.props;
    navigation.navigate('BookDetail', {bookId: item._id});
  }

  handleInput = async(text) => {
    this.setState({text, books: []})
    const response = await autoComplete(text);
    const json = await response.json();
    const complete = json.keywords;
    this.setState({complete});
  }

  handleSelect = async (item) => {
    const {navigation} = this.props;
    if (item.tag === 'cat') {
      navigation.navigate('H5CategoryDetail', {url: item.url, title: item.text});
      return;
    }
    if (item.tag === 'bookauthor') {
      console.log('author')
      navigation.navigate('AuthorBooks', {author: item.text});
      return;
    }
    if (item.tag === 'bookname') {
      navigation.navigate('BookDetail', {bookId: item.id});
      return;
    }
    this.searchRef.blur();
    this.setState({text, loading: true, complete: []});
    const response = await search(text);
    const json = await response.json();
    const books = json.books;
    this.setState({books, loading: false});
  }

  renderItem = ({item}) => (
    <BookItem onPress={this.handleItemPress} {...item} containerStyle={{padding: 10, backgroundColor: '#fff'}}  />
  );

  render(){
    const {loading, books, complete} = this.state;
    return (
      <TouchableOpacity activeOpacity={1} style={{backgroundColor: '#fff',flex: 1}}>
        <StatusBar 
          backgroundColor={config.style.color.appTabBg}
          barStyle='light-content'
        />
        <View style={{height: StatusBar.currentHeight, backgroundColor: config.style.color.appTabBg}}></View>
        <SearchBar
          ref = {c => this.searchRef = c}
          autoFocus
          // style={{}}
          inputStyle={{backgroundColor: '#fff'}}
          lightTheme
          containerStyle={{backgroundColor: '#fff'}}
          onChangeText={(text) => this.handleInput(text)}
          onSubmitEditing={this.handSearch}
          showLoadingIcon={loading}
          value={this.state.text}
          placeholder='书名、作者、分类' />
        <TouchableOpacity activeOpacity={1}>
          <ScrollView>
            {complete.map((item, i) => {
              if (item.tag === 'tag') {
                return null;
              }
              let text = item.text;
              if (item.tag === 'cat') {
                text += '（分类）'
              } else if (item.tag === 'tag') {
                text += '（标签）'
              } else if (item.tag === 'bookauthor') {
                text += '（作者）'
              }
              return (
                <TouchableOpacity activeOpacity={1} onPress={() => this.handleSelect(item)}  key={i}>
                <Text style={{
                  fontSize: 14, 
                  color: '#666', 
                  lineHeight: 50,
                  paddingLeft: 20,
                  }}>
                  {text}
                  </Text>
              </TouchableOpacity>
              );
            })}
          </ScrollView>
        </TouchableOpacity>
        <BookList navigation={this.props.navigation} books={books} />
      </TouchableOpacity>
    );
  }
}

export default SearchPage;