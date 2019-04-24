import {saveToShelf} from './persistence';

// 书籍详情
export async function fetchBookDetail(bookId) {
  return fetch(`http://api.zhuishushenqi.com/book/${bookId}`);
}

// 书籍目录
export async function fetchBookCatelog(source, bookId) {
  if (source.source === 'zhuishuvip') {
    const response = await fetch(`http://api.zhuishushenqi.com/mix-atoc/${bookId}?view=chapters`)
    const json = await response.json()
    return json.mixToc.chapters;
  }
  const response = await fetch(`http://api.zhuishushenqi.com/atoc/${source._id}?view=chapters`)
  const json = await response.json();
  return json.chapters;
}

// 获取章节内容
export async function fetchChapter(chapterUrl) {
  const link = chapterUrl.replace(/\//g, "%2F").replace("?","%3F");
  return fetch(`http://chapter2.zhuishushenqi.com/chapter/${link}`);
}

// 获取小说源
export async function fetchSources(bookId) {
  return fetch(`http://api.zhuishushenqi.com/atoc?view=summary&book=${bookId}`)
}
