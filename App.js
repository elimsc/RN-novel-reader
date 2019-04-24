import React, { Component } from 'react';
import {createStackNavigator, createMaterialTopTabNavigator} from 'react-navigation';
import { Icon, Button } from 'react-native-elements';


import config from './app/utils/config';
import ShelfTab from './app/pages/ShelfTab';
import DiscoverTab from './app/pages/DiscoverTab';
import Ranking from './app/pages/Ranking';
import RankingDetail from './app/pages/RankingDetail';
import Reader from './app/pages/Reader';
import BookDetail from './app/pages/BookDetail';
import SearchPage from './app/pages/SearchPage';
import Category from './app/pages/Category';
import CategoryDetail from './app/pages/CategoryDetail';
import AuthorBooks from './app/pages/AuthorBooks';
import Demo from './app/pages/Demo';

import H5Ranking from './app/pages/webview/H5Ranking';
import H5Category from './app/pages/webview/H5Category';
import H5CategoryDetail from './app/pages/webview/H5CategoryDetail';
import H5BookList from './app/pages/webview/H5BookList';
import H5BookListDetail from './app/pages/webview/H5BookListDetail';
// import ZhuiShu from './app/pages/webview/ZhuiShu';



const TabStack = createMaterialTopTabNavigator({
  Shelf: {
    screen: ShelfTab,
    navigationOptions: {
      tabBarLabel: '书架'
    }
  },
  Discover: {
    screen: DiscoverTab,
    navigationOptions: {
      tabBarLabel: '发现'
    }
  },
}, {
  tabBarOptions: {
    style: {
      backgroundColor: config.style.color.appTabBg,
    },
    indicatorStyle: {
      height: 0
    }
  },
  lazy: true,
});

const App = createStackNavigator({
  Tab: {
    screen: TabStack,
    navigationOptions: ({navigation}) => ({
      headerTitle: '追书神器',
      headerRight: (
        <Icon
          onPress={() => navigation.navigate('SearchPage')}
          underlayColor={config.style.color.appTabBg}
          containerStyle={{paddingRight: 20, paddingLeft: 20}}
          type="ionicon"
          name="md-search"
          color="#fff"
        />
      ),
    })
  },
  
  Ranking,
  RankingDetail,
  Reader,
  BookDetail,
  SearchPage,
  Category,
  CategoryDetail,
  AuthorBooks,

  // H5 Page
  H5Category,
  H5Ranking,
  H5BookList,
  H5CategoryDetail,
  H5BookListDetail,
}, {
  navigationOptions: {
    headerStyle: {
      elevation: 0,
      backgroundColor: config.style.color.appTabBg
    },
    headerTitleStyle: {
      color: '#fff'
    },
    headerBackImage: <Icon  name="md-arrow-back" type="ionicon" color="#fff" containerStyle={{paddingLeft: 15, paddingRight: 15}} />
  }
})


export default App;
