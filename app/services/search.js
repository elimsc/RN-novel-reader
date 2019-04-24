
/**
 * 书籍搜索相关
 */

// 模糊查询
export async function search(keyWord){
  return fetch(`http://api.zhuishushenqi.com/book/fuzzy-search?query=${keyWord}`)
}

// 自动补全
export async function autoComplete(keyWord) {
  return fetch(`http://api01pbmp.zhuishushenqi.com/book/auto-suggest?query=${keyWord}`)
}

// 通过作者获取
export async function searchByAuthor(author) {
  return fetch(`http://api01pbmp.zhuishushenqi.com/book/accurate-search?author=${author}`)
}

// export async function searchBy