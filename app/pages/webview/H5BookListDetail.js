import React, { Component } from 'react';
import { WebView, BackHandler } from 'react-native';
import {Header} from 'react-navigation';

class H5BookListDetail extends Component {
  static navigationOptions = {
    title: '书单详情'
  }

  state = {
    url: null,
  }

  componentDidMount() {
    const {navigation} = this.props;
    const url = navigation.getParam('url', null);
    this.setState({url});
  }

  handleMessage = (data) => {
    const {navigation} = this.props;
    console.log(data);
    if (data.startsWith('https://h5.zhuishushenqi.com/books/')) {
      const bookId = data.split('/books/')[1];
      navigation.navigate('BookDetail', {bookId});
    }
  }


  render() {
    const injectedJavaScript = `

      window.onload = function() {
        var clickHandler = function(e) {
          var self = e.target;
          if (self.href) {
            window.postMessage(self.href);
          } else if (self.parentNode.href) {
            window.postMessage(self.parentNode.href);
          } else if (self.parentNode.parentNode.href) {
            window.postMessage(self.parentNode.parentNode.href);
          } else if (self.parentNode.parentNode.parentNode.href) {
            window.postMessage(self.parentNode.parentNode.parentNode.href);
          } else if (self.parentNode.parentNode.parentNode.parentNode.href) {
            window.postMessage(self.parentNode.parentNode.parentNode.parentNode.href);
          }
          e.preventDefault();
        };
        setTimeout(function() {
          const nodeList = document.querySelectorAll('a[data-hybrid-params]');
          for(var i=0; i< nodeList.length; i++) {
            nodeList[i].addEventListener('click', clickHandler);
          }
        }, 100);
      }
      
    `;

    return (
      <WebView
        onMessage={e => this.handleMessage(e.nativeEvent.data)}
        injectedJavaScript={injectedJavaScript}
        source={{uri: this.state.url}}
        style={{marginTop: -35}}
      />
    );
  }
}

export default H5BookListDetail;