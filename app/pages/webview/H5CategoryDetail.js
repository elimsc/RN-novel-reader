import React, { Component } from 'react';
import { WebView, StatusBar } from 'react-native';
import {Header} from 'react-navigation';
import Loading from '../../components/Loading';

class H5CategoryDetail extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam('title', '分类'),
    };
  };

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
    if (data.includes('h5.zhuishushenqi.com/books/')) {
      const bookId = data.split('/books/')[1];
      navigation.navigate('BookDetail', {bookId});
    }
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
        source={{uri: this.state.url}}
        onMessage={e => this.handleMessage(e.nativeEvent.data)}
        style={{marginTop: -35}}
      />
    );
  }
}

export default H5CategoryDetail;