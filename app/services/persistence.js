import {AsyncStorage} from 'react-native';
import store from 'react-native-simple-store';


const SHELF_KEY = "SHELF"; //书架 ["bookid1", "bookid2", ...]
const RECORD_KEY = "RECORD"; //阅读记录

// 返回书架书籍列表
export async function getShelf() {
  return await store.get(SHELF_KEY);
}

// 添加到书架
export async function saveToShelf(bookId) {
  const bookIds = await store.get(SHELF_KEY);
  let data = [];
  if (bookIds) {
    data = bookIds.filter(id => id !== bookId);
  }
  data.unshift(bookId);
  await store.save(SHELF_KEY, data);
}

// 从书架中移除
export async function removeFromShelf(bookId) {
  const bookIds = await store.get(SHELF_KEY);
  if (bookIds) {
    const data = bookIds.filter(id => id !== bookId);
    await store.save(SHELF_KEY, data);
  }
}

// 判断书籍是否在书架中
export async function isInShelf(bookId) {
  const bookIds = await store.get(SHELF_KEY);
  if (bookIds) {
    return bookIds.includes(String(bookId));
  }
  return false;
}


// 返回单个书籍阅读记录 
export async function getBookRecord(bookId) {
  const books = await store.get(RECORD_KEY);
  if (books) {
    const data = books.filter(item => item.bookId === bookId)[0];
    return data;
  }
}

// 将书籍保存到书架: 新增 or 更新
// book: {bookId, currentPageIndex, currentChapterIndex, currentSourceId} 
export async function saveToRecord(book) {
  // 如果书籍在书架中
  const inShelf = await isInShelf(book.bookId);
  if (inShelf) {
    const books = await store.get(RECORD_KEY);
    let data;
    if (!books) { // 没有记录
      data = []
    } else { // 移除重复项
      data = books.filter(item => item.bookId !== book.bookId);
    }
    data.unshift(book);
    await store.save(RECORD_KEY, data);
    await saveToShelf(book.bookId); // 更新书架信息 
  }
}
