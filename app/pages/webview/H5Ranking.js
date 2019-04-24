import React, { Component } from 'react';
import { WebView, BackHandler, StatusBar, Dimensions } from 'react-native';


class H5Ranking extends Component {
  static navigationOptions = {
    title: '排行榜'
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
        document.getElementsByClassName('inner-loading')[0].addEventListener('transitionend',function(e){
          if (e.target.style.height === '0px') {
            setTimeout(function() {
              const nodeList = document.querySelectorAll('a[data-hybrid-params]');
                for(var i=0; i< nodeList.length; i++) {
                  nodeList[i].addEventListener('click', function(e) {
                    window.postMessage(e.target.parentNode.parentNode.parentNode.href);
                    e.preventDefault();
                  });
                }
            }, 100)
          }
        })
      }

      
    `;
    // const nodeList = document.querySelectorAll('a[data-hybrid-params]');
    //           for(let i=0; i< nodeList.length; i++) {
    //             nodeList[i].addEventListener('click', function(e) {
    //               window.postMessage(e.target.parentNode.parentNode.parentNode.href);
    //               e.preventDefault();
    //             });
    //           }

    return (
      <WebView
        javaScriptEnabled={true}
        mixedContentMode='compatibility'
        injectedJavaScript={injectedJavaScript}
        onMessage={e => this.handleMessage(e.nativeEvent.data)}
        ref={c => this.viewRef = c}
        source={{uri: 'https://h5.zhuishushenqi.com/ranking'}}
        style={{marginTop: -((1.06667+1.6+4/3)*36)}}
      />
    );
  }
}

export default H5Ranking;