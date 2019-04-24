import React, { Component } from 'react';
import {FlatList} from 'react-native';
import {Divider} from 'react-native-elements';

import BookItem from './BookItem';

class BookList extends React.PureComponent {

  handleItemPress = (item) => {
    const {navigation} = this.props;
    navigation.push('BookDetail', {bookId: item._id});
  }

  renderItem = ({item}) => {
    return <BookItem onPress={this.handleItemPress} {...item} containerStyle={{padding: 10, backgroundColor: '#fff'}}  />
  };

  render() {
    const {books, containerStyle} = this.props;
    return (
      <FlatList
          contentContainerStyle={{backgroundColor: '#fff', ...containerStyle}}
          ItemSeparatorComponent={() => <Divider />}
          data={books}
          getItemLayout={(data, index) => (
            {length: 111, offset: 111 * index, index}
          )}
          initialNumToRender={10}
          removeClippedSubviews
          keyExtractor={(item, index) => `${item._id}`}
          renderItem={this.renderItem}
        />
    );
  }
}

export default BookList;