import React, { Component } from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, Image, AsyncStorage, StatusBar, Dimensions} from 'react-native';
import {Text, Button, Divider} from 'react-native-elements';
import Modal from 'react-native-modal';

import config from '../utils/config';
import {fromNow} from '../utils/time';
import {constructImageLink} from '../utils/image';
import {getShelf, removeFromShelf} from '../services/persistence';
import {fetchBookDetail} from '../services/books';
import Loading from '../components/Loading';

const {height, width} = Dimensions.get('window');
 
const Item = ({cover, title, updated, lastChapter, _id, onLongPress, onPress}) => (
  <TouchableOpacity onLongPress={() => onLongPress({title, _id})} activeOpacity={1} onPress={() => onPress(_id)}>
    <View style={{flexDirection: 'row', alignItems: 'center', padding: 10}}>
      <View style={{flex: 1, justifyContent: 'center'}}>
        <Image 
          source={{uri: constructImageLink(cover)}}
          style={{width: 40, height: 55}}
        />
      </View>
      <View style={{flex: 5, justifyContent: 'center'}}>
        <Text numberOfLines={1} style={styles.titleText}>{title}</Text>
        <Text numberOfLines={1} style={styles.descText}>{fromNow(updated)}: {lastChapter}</Text>
      </View>
    </View>
    <Divider style={{ backgroundColor: '#eee' }} />
  </TouchableOpacity>
);

class ShelfTab extends Component {
  state = {
    books: [],
    loading: true,
    showModal: false,
    selectedBook: {},
  }


  async componentDidMount() {
    this.focusListener = this.props.navigation.addListener('willFocus', async (playload)=>{
      await this.fetchBooks();
      this.setState({loading: false});
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  fetchBooks = async() => {
    const books = [];
    const bookIds = await getShelf();
    if (bookIds) {
      for (const bookId of bookIds) {
        const response = await fetchBookDetail(bookId);
        const bookDetail = await response.json();
        books.push(bookDetail);
      }
    }
    this.setState({books});
  }

  handleLongPress = (book) => {
    this.setState({showModal: true, selectedBook: book});
  }

  handleRemove = async (bookId) => {
    await removeFromShelf(bookId);
    const books = this.state.books.filter(book => book._id !== bookId);
    this.setState({showModal: false, books});
  }

  handlePress = (bookId) => {
    this.props.navigation.navigate('Reader', {bookId})
  }

  render(){
    const {books, loading, showModal, selectedBook} = this.state;
    if (loading) {
      return (
      <View style={{flex: 1}}>
        <StatusBar 
          backgroundColor={config.style.color.appTabBg}
          barStyle='light-content'
        />
        <Loading />
      </View>);
    }
    if (books.length === 0) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
          <StatusBar 
            backgroundColor={config.style.color.appTabBg}
            barStyle='light-content'
          />
          <Text style={styles.descText}>去添加些书吧 ~~</Text>
        </View>
      );
    }
    return (

      <View style={{backgroundColor: '#fff', flex: 1}}>
        <Modal 
          onBackdropPress={() => this.setState({showModal: false})} 
          onBackButtonPress={() => this.setState({showModal: false})}
          isVisible={showModal}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>  
            <View style={{backgroundColor: '#fff', width: width / 5 * 4, padding: 20}}>
              <Text style={{fontSize: 18, color: config.style.color.appTabBg, lineHeight: 60}}>{selectedBook.title}</Text>
              <Divider />
              <Text onPress={() => this.handleRemove(selectedBook._id)} style={{fontSize: 14, color: config.style.color.black3, lineHeight: 40}}>删除</Text>
            </View>
          </View>
        </Modal> 
        <ScrollView contentContainerStyle={styles.container}>
          <StatusBar 
            backgroundColor={config.style.color.appTabBg}
            barStyle='light-content'
          />
          {
            books.map((book, index) => {
              return <Item 
                onLongPress={this.handleLongPress} 
                key={index} 
                {...book} 
                onPress={this.handlePress} />;
            })
          }
        </ScrollView>
      </View>
    );
  }
}

export default ShelfTab;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    // paddingTop: 20,
    paddingLeft: 10,
    paddingRight: 10,
  },
  titleText: {
    fontSize: 16,
    color: config.style.color.black2,
    lineHeight: 30,
  },
  descText: {
    fontSize: 14,
    lineHeight: 25,
    color: config.style.color.black3,
  }
});