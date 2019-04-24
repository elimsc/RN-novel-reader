import React, { Component } from 'react';

import {
  Text, 
  View, 
  ScrollView, 
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
  StatusBar
} from 'react-native';
import {Header, Icon, Button, Divider} from 'react-native-elements';
import Modal from "react-native-modal";
import * as Animatable from 'react-native-animatable';

import config from '../utils/config';
import {now, fromNow} from '../utils/time';
import {fetchBookCatelog, fetchChapter, fetchSources} from '../services/books';
import CatelogItem from '../components/CatelogItem';
import {getShelf, saveToRecord, getBookRecord} from '../services/persistence';

const {height, width} = Dimensions.get('window');

// 这三个是用户可以设置的
const textSize = 19;
const textLineHeight = 38;
const letterSpacing = 2;

const lineCount = Math.floor((height - 50) / textLineHeight);
const fontCountPerLine = Math.floor((width - 30) / (textSize + letterSpacing));

// 数据分页
splitContent = (content) => {
  const pages = [];
  const paragraphs = content.split('\n');
  let currentPage = ""; // 记录当前页的内容
  let currentLineCount = 0; // 记录当前页内容已有的行数，翻页清零
  let lastPageContent = ""; // 最后一页的数据
  paragraphs.forEach((para) => {
    let curParaLineCount = Math.ceil(para.length / fontCountPerLine);
    
    if (currentLineCount + curParaLineCount <= lineCount) { 
      currentPage += (para + "\n"); // 将该段的内容加入到当前页
      currentLineCount += curParaLineCount;
    } else {
      const lineCountInCurPage = lineCount - currentLineCount;
      const contentInCurPage = para.substr(0, lineCountInCurPage * fontCountPerLine);
      const contentInNextPage = para.substr(lineCountInCurPage * fontCountPerLine);
      currentPage += contentInCurPage;
      pages.push(currentPage); // 当前页完成

      currentPage = ""; // 下一页
      currentLineCount = 0;
      // 如果该段的内容多于一个页面所能容纳，该怎么办？？
      currentPage += (contentInNextPage + "\n");
      currentLineCount += (curParaLineCount - lineCountInCurPage); 
    }
    lastPageContent = currentPage;
  });
  pages.push(lastPageContent);
  return pages;
}

// 获取章节内容并插入段头空白
fetchChapterContent = async (chapterUrl) => {
    const response = await fetchChapter(chapterUrl);
    const json = await response.json();
    if (json.ok === true) {
      // 获取章节内容，并插入段头空白
      const formatContent = '\u3000\u3000' + json.chapter.body
          .replace(/ /g, '')
          .replace(/\n/g, '\n\u3000\u3000');
          
      return formatContent;      
    }
}



// 阅读界面
class Reader extends Component {

  static navigationOptions = {
    header: null,
  }

  constructor(props) {
    super(props);

    this.state= {
      loading: true,
      // chapters: {}, // 章节信息 {index: {title, length, pages, content}}
      content: '', // 当前章节的内容 
      pages: [], // 当前章节内容的分页结果
      catelog: [], // 全书目录 
      currentPageIndex: 0, // 当前所在页index索引
      currentChapterIndex:  0, // 当前章节在目录中的索引
      bookId: null, // 当前书籍id

      sources: [], // 小说源 
      currentSourceId: null, //当前源

      showSettingBar: false, // 是否显示设置界面
      showCatelog: false, // 是否显示目录
      showSourceModal: false, //是否显示换源Modal
    };
    this.readerRef = null;
    this.catelogRef = null;
  }

  async componentDidMount() {
    const {navigation} = this.props;
    const bookId = navigation.getParam('bookId', null);
    if (bookId === null) {
      return;
    }

    // 得到小说源
    const sourceResponse = await fetchSources(bookId);
    const sources = await sourceResponse.json();
    // 阅读记录 
    let currentSourceId = sources[0]['_id'];
    let defaultPageIndex = 0;
    let defaultChapterIndex = 0;
    const data = await getBookRecord(bookId);
    if (data) {
      defaultChapterIndex = data.currentChapterIndex;
      defaultPageIndex = data.currentPageIndex;
      if (data.currentSourceId) {
        currentSourceId = data.currentSourceId;
      }
    }
    const currentSource = sources.filter(item => item._id === currentSourceId)[0];
    // 得到书籍目录
    const catelog = await fetchBookCatelog(currentSource, bookId);
    // 获取某章节内容
    const content = await fetchChapterContent(catelog[defaultChapterIndex].link);
    
    // 将内容分页
    const pages = splitContent(content);

    this.setState({
      sources,
      currentSourceId,
      pages, 
      content, 
      catelog, 
      loading: false,
      bookId,
      currentChapterIndex: defaultChapterIndex,
      currentPageIndex: defaultPageIndex,
    });
  }

  async componentWillUnmount() { 
    // 退出页面的时候保存阅读记录
    const {bookId, currentChapterIndex, currentPageIndex, currentSourceId} = this.state;
    await saveToRecord({bookId, currentChapterIndex, currentPageIndex, currentSourceId});
  }

  // 跳转到某章 
  goChapter = async (chapterIndex, toLast=false) => {
    const {catelog} = this.state;
    if (chapterIndex >= catelog.length || chapterIndex < 0) {
      return; 
    }

    this.setState({loading: true, showCatelog: false, showSettingBar: false});
    const content = await fetchChapterContent(catelog[chapterIndex].link);
    // 将内容分页
    const pages = splitContent(content);

    let defaultIndex = 0;
    if (toLast) { // 是否跳转至最后一页 
      defaultIndex = pages.length - 1
    }
    this.setState({
      pages, 
      content, 
      currentPageIndex: defaultIndex,
      currentChapterIndex: chapterIndex, 
      loading: false,
    });
  }

  // 点击目录图标
  handleCatelogPress = () => {
    this.setState({showCatelog: true});
  }

  handlePress = (e) => {
    const {currentPageIndex, currentChapterIndex, pages, showSettingBar, showCatelog} = this.state;
    const currentChapterLength = pages.length;

    // 点击左边
    if (e.locationX < width / 3 || (e.locationX < width / 2 && e.pageY / height < 1/4)) {
      if(showCatelog) { // 当前书籍目录是显示的
        this.setState({showCatelog: false});
        return;
      }
      if (showSettingBar) { // 当前的设置界面是显示的
        this.setState({showSettingBar: false});
        return;
      }

      if (currentPageIndex <= 0) { // 第一页
        if (currentChapterIndex <= 0) { // 第一章
          return;
        }
        this.goChapter(currentChapterIndex - 1, true);
        return;
      }
      this.setState({currentPageIndex: currentPageIndex - 1});
    // 点击右边
    } else if (e.locationX > width / 3 * 2 || (e.locationX > width / 2 && e.pageY / height > 3/4)) {
      if(showCatelog) { // 当前书籍目录是显示的
        this.setState({showCatelog: false});
        return;
      }
      if (showSettingBar) { // 当前的设置界面是显示的
        this.setState({showSettingBar: false});
        return;
      }

      if (currentPageIndex + 1 === currentChapterLength) {
        this.goChapter(currentChapterIndex + 1);
        return;
      }
      this.setState({currentPageIndex: currentPageIndex + 1});
      

    // 点击中间
    } else {
      this.setState({showSettingBar: !showSettingBar});
    }
  }

  // 换源
  handleSourceChange = async (sourceId) => {
    const {sources, bookId, currentChapterIndex} = this.state;
    const targetSource = sources.filter(item => item._id === sourceId)[0];
    this.setState({loading: true});
    const catelog = await fetchBookCatelog(targetSource, bookId);
    let content = ''
    if (catelog[currentChapterIndex]) {
      content = await fetchChapterContent(catelog[currentChapterIndex].link);
    }
    // 将内容分页
    const pages = splitContent(content);
    this.setState({
      showSourceModal: false,
      currentSourceId: sourceId, 
      catelog,
      // showCatelog: true,
      loading: false,
      pages,
      content,
    });
  }

  renderPage = () => {
    const {currentChapterIndex, currentPageIndex, pages, catelog} = this.state;
    let chapterTitle = '';
    if (catelog[currentChapterIndex]) {
      chapterTitle = catelog[currentChapterIndex].title
    }
    let paragraphs = [];
    if (pages[currentPageIndex]) {
      paragraphs = pages[currentPageIndex].split("\n");// 每段的内容
    }
    const lines = []; // 每行的内容
    for (const para of paragraphs) {
      if (para.length < fontCountPerLine) {
        lines.push(para);
      } else {
        let i = 0;
        while (i < para.length) {
          lines.push(para.substr(i, fontCountPerLine));
          i += fontCountPerLine;
        }
      }
    }

    return (
      <TouchableOpacity
        onPress={({nativeEvent: e}) => this.handlePress(e)}
        activeOpacity={1}
      >
        <View style={styles.pageStyle}>
          
          <View style={{paddingLeft: 15}}>
            <Text style={styles.descTextStyle} numberOfLines={1}>{chapterTitle}</Text>
          </View>
          <View style={{alignSelf: 'center', height: height - 50}}>
          {
            lines.map((line, i) => (
              <Text key={i} style={styles.textStyle}>
                {line}
              </Text>
            ))
          }
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', paddingLeft: 15, paddingRight: 15}}>
            <Text style={styles.descTextStyle} numberOfLines={1}>{now()}</Text>
            <Text style={styles.descTextStyle} numberOfLines={1}>{currentChapterIndex + 1}/{catelog.length}章</Text>
            <Text style={styles.descTextStyle} numberOfLines={1}>本章第{currentPageIndex + 1}/{pages.length}</Text>
          </View>
        </View>
    </TouchableOpacity>
    );
  }

  render() {
    const {navigation} = this.props;
    const {sources, pages, loading, currentPageIndex, showSettingBar, catelog, showCatelog, currentChapterIndex, bookId} = this.state;
    const topBarHeight = showSettingBar ? StatusBar.currentHeight + 40 : 0;
    const bottomBarHeight = showSettingBar ? 50 : 0;
    const catelogWidth = showCatelog ? width * 5 / 6 : 0;
    
    // 防止当前章节索引大于目录长度
    const mCurrentChapterIndex = currentChapterIndex > (catelog.length - 1) ? (catelog.length - 1) : currentChapterIndex;

    return (
      <View>
        <StatusBar  
          hidden={!showSettingBar}  //是否隐藏状态栏。  
        />
        {/* 返回、书籍详情 */}
        <Animatable.View transition="height" duration={100} activeOpacity={1} style={{
          backgroundColor: '#191919', 
          width: width, height: topBarHeight, 
          position: 'absolute', 
          top: 0, 
          zIndex: 10, 
        }}>
          <View style={{marginTop: StatusBar.currentHeight + 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <Icon underlayColor='#191919' onPress={() => navigation.goBack()} size={20} name="md-arrow-back" type="ionicon" color="#fff" containerStyle={{paddingLeft: 15, paddingRight: 15}} />
            <View style={{flexDirection: 'row'}}>
              <Text onPress={() => this.setState({showSourceModal: true})} style={{color: '#fff', paddingLeft: 15, paddingRight: 15, fontSize: 14}}>换源</Text>
              <Icon underlayColor='#191919' onPress={() => navigation.navigate('BookDetail', {bookId})} size={20} name="md-list-box" type="ionicon" color="#fff" containerStyle={{paddingRight: 20, paddingLeft: 15}} />
            </View>
          </View>
        </Animatable.View>
        {/* end */}

        <Modal 
          onBackdropPress={() => this.setState({showSourceModal: false})} 
          onBackButtonPress={() => this.setState({showSourceModal: false})} 
          isVisible={this.state.showSourceModal}>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center'}}>
            <View style={{backgroundColor: '#fff', height: 2 / 3 * height, width: 4 / 5 * width}}>
              <Text style={{textAlign: 'center', fontSize: 15, color: '#333', lineHeight: 50}}>换源</Text>
              <Divider />
              <ScrollView>
                {sources.map((item, i) => (
                  <TouchableOpacity onPress={() => this.handleSourceChange(item._id)} activeOpacity={1} key={i} style={{padding: 10, borderColor: config.style.color.divider, borderBottomWidth: 1}}>
                    <Text numberOfLines={1} style={{fontSize: 15, color: config.style.color.black2, lineHeight: 30}}>{item.lastChapter}</Text>
                    <Text numberOfLines={1} style={{fontSize: 12, color: config.style.color.black3, lineHeight: 20}}>{fromNow(item.updated)}</Text>
                    <Text numberOfLines={1} 
                      style={{fontSize: 12, color: config.style.color.black4, lineHeight: 20}}>
                      来源<Text style={{color: config.style.color.appTabBg}}>
                          {this.state.currentSourceId === item._id ? '（当前使用）': ''}
                          </Text>：{item.host} </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        </Modal>

        {/* 阅读界面 */}
        {
          loading ? 
          <View>
            <StatusBar  
              hidden={true}  //是否隐藏状态栏
            />
            <View style={{height: height, width: width, backgroundColor: '#e8dcb0',}}>
              <ActivityIndicator style={{flex: 1}} animating />
            </View>
        </View> :
        <View style={styles.readerContainer}>
          {this.renderPage()}
        </View>
        }
        {/* end */}

        {/*  目录、夜间、设置、缓存 */}
        <Animatable.View transition="height" duration={100} activeOpacity={1} style={{
          backgroundColor: '#191919', 
          width: width, 
          height: bottomBarHeight, 
          position: 'absolute', 
          bottom: 0, 
          zIndex: 10,
          flexDirection: 'row', 
          alignItems: 'center',
          justifyContent: 'space-around',
        }}>
          {/* 目录 */}
          <TouchableOpacity onPress={() => this.handleCatelogPress()} activeOpacity={1} style={{flex: 1}}>
            <Icon size={20} name="ios-list" type="ionicon" color="#fff" />
            <Text style={{color: '#ccc', fontSize: 12, lineHeight: 20, textAlign: 'center'}}>目录</Text>
          </TouchableOpacity>
          {/* 夜间 */}
          <TouchableOpacity activeOpacity={1} style={{flex: 1}}>
            <Icon size={20} name="ios-contrast" type="ionicon" color="#fff" />
            <Text style={{color: '#ccc', fontSize: 12, lineHeight: 20, textAlign: 'center'}}>夜间</Text>
          </TouchableOpacity>
          {/* 设置  */}
          <TouchableOpacity activeOpacity={1} style={{flex: 1}}>
            <Icon size={20} name="ios-settings" type="ionicon" color="#fff" />
            <Text style={{color: '#ccc', fontSize: 12, lineHeight: 20, textAlign: 'center'}}>设置</Text>
          </TouchableOpacity>
          {/* 缓存 */}
          <TouchableOpacity activeOpacity={1} style={{flex: 1}}>
            <Icon size={20} name="ios-download" type="ionicon" color="#fff" />
            <Text style={{color: '#ccc', fontSize: 12, lineHeight: 20, textAlign: 'center'}}>缓存</Text>
          </TouchableOpacity>
        </Animatable.View>
        {/*  end */}

        {/*  小说目录 */}
        <Animatable.View 
          transition="width" 
          duration={150}
          easing="ease-in"
          style={{
            backgroundColor: '#fafafa', 
            width: catelogWidth, 
            height: height, 
            position: 'absolute', 
            bottom: 0, 
            zIndex: 30,
            flexDirection: 'column', 
            paddingBottom: 20
        }}>
          <Text style={{
            marginTop: StatusBar.currentHeight,
            marginLeft: 15,
            fontSize: 18, 
            lineHeight: 50, 
            color: config.style.color.black2,
          }}>目录</Text>
          <Divider />
          {showCatelog ? 
            <FlatList 
              initialScrollIndex={mCurrentChapterIndex}
              ref={ref => this.catelogRef = ref}
              getItemLayout={(data, index) => (
                {length: 41, offset: 41 * index, index}
              )}
              initialNumToRender={50}
              data={catelog}
              renderItem={({item, index}) => {
                return <CatelogItem item={item} currentChapterIndex={currentChapterIndex} index={index} onPress={this.goChapter} />;
              }}
              ItemSeparatorComponent={() => <Divider style={{backgroundColor: '#eee'}} />}
              keyExtractor={(item, index) => String(index)}
            /> :
            null
          }
        </Animatable.View> 
        {/*  end */}
      </View>
    );
  }
}

export default Reader;

const styles = {
  readerContainer: {
    backgroundColor: '#e8dcb0',
  },
  pageStyle: {
    height: height,
    width: width,
  },
  textStyle: {
    letterSpacing: letterSpacing,
    textAlignVertical: 'center',
    includeFontPadding: false,
    fontSize: textSize,
    lineHeight: textLineHeight,
    color: config.style.color.black2,
  },
  descTextStyle: {
    fontSize: 12,
    color: config.style.color.black3,
    lineHeight: 25,
  }
};