import React, { Component } from 'react';
import { WebView } from 'react-native';
import {Header} from 'react-navigation';


class ZhuiShu extends Component {
  static navigationOptions = {
    title: '追书神器H5'
  }

  state = {
    leave: false,
  }

  componentDidMount() {
    this.focusListener = this.props.navigation.addListener('willFocus', async (playload)=>{
      if (this.state.leave) {
        this.viewRef.goBack();
        this.setState({leave: false});
      }
    });
  }

  componentWillUnmount() {
    this.focusListener.remove();
  }

  handleMessage = (data) => {
    const {navigation} = this.props;
    if (data.startsWith('https://h5.zhuishushenqi.com/books/')) {
      this.setState({leave: true});
      const bookId = data.split('/books/')[1];
      navigation.navigate('BookDetail', {bookId});
    } 
  }

  render() {
    const injectedJavaScript = `
      window.addEventListener('click', () => {
        window.postMessage(window.location.href);
      });
    `;
    return (
      <WebView
        ref={c => this.viewRef = c}
        onMessage={e => this.handleMessage(e.nativeEvent.data)}
        injectedJavaScript={injectedJavaScript}
        source={{uri: 'https://h5.zhuishushenqi.com/home'}}
        style={{marginTop: 5}}
      />
    );
  }
}

export default ZhuiShu;