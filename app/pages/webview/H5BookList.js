import React, { Component } from 'react';
import { WebView, BackHandler } from 'react-native';
import {Header} from 'react-navigation';

class H5BookList extends Component {
  static navigationOptions = {
    title: '主题书单'
  }

  handleMessage = (data) => {
    const {navigation} = this.props;
    navigation.navigate('H5BookListDetail', {url: data});
  }

  render() {
    const injectedJavaScript = `
      window.onload = function() {
        var clickHandler = function(e) {
          window.postMessage(e.target.parentNode.parentNode.parentNode.href);
          e.preventDefault();
        };
        setInterval(() => {
          const nodeList = document.querySelectorAll('a[data-hybrid-params]');
            for(var i=0; i< nodeList.length; i++) {
              nodeList[i].addEventListener('click', clickHandler);
            }
        }, 500)
      }
      
    `;
    return (
      <WebView
        injectedJavaScript={injectedJavaScript}
        source={{uri: 'https://h5.zhuishushenqi.com/bookList'}}
        style={{marginTop: -35}}
        onMessage={e => this.handleMessage(e.nativeEvent.data)}
      />
    );
  }
}

export default H5BookList;