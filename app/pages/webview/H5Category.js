import React, { Component } from 'react';
import { WebView, StatusBar } from 'react-native';
import {Header} from 'react-navigation';
import Loading from '../../components/Loading';

class H5Category extends Component {
  static navigationOptions = {
    title: '分类'
  }

  handleMessage = (data) => {
    const {navigation} = this.props;
    // this.setState({currentHref: data});
    console.log(data);
    if (data.indexOf('?') != -1) {
      navigation.navigate('H5CategoryDetail', {url: data, title: decodeURI(data.split('/category/')[1].split('?')[0])});
    }
  }

  render() {
    const injectedJavaScript = `
      window.onload = function(){
        setTimeout(() => {
          const nodeList = document.querySelectorAll('a[data-hybrid-params]');
          for(var i=0; i< nodeList.length; i++) {
            nodeList[i].addEventListener('click', function(e){
              window.postMessage(e.target.parentNode.href);
              e.preventDefault();
            });
          }
        }, 100)
      }
    `;
    
    return (
      <WebView
        injectedJavaScript={injectedJavaScript}
        onMessage={e => this.handleMessage(e.nativeEvent.data)}
        source={{uri: 'https://h5.zhuishushenqi.com/category'}}
        style={{marginTop: -((1.06667+1.6+4/3)*36)}}
      />
    );
  }
}

export default H5Category;