import React, { Component } from 'react';

import {searchByAuthor} from '../services/search';
import BookList from '../components/BookList';
import Loading from '../components/Loading';

class AuthorBooks extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('author', '结果'),
    };
  };

  state = {
    books: []
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const author = navigation.getParam('author', null);
    const response = await searchByAuthor(author);
    const json = await response.json();
    const books = json.books;
    this.setState({books});
  }

  render() {
    const {navigation} = this.props;
    if (this.state.books.length === 0) {
      return <Loading />;
    }
    return <BookList navigation={navigation} books={this.state.books} />
  }
}

export default AuthorBooks;