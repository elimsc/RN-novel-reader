/**
 * 书籍分类相关
 */

 // 获取所有顶级分类
export async function fetchTopCategory() {
  return fetch('https://api.zhuishushenqi.com/cats/lv2/statistics');
}

//  获取所有分类
export async function fetchAllCategory() {
  return fetch('https://api.zhuishushenqi.com/cats/lv2');
}

/**
 * 
 * @param {*} gender 男生:male 女生:female 出版:press
 * @param {*} type   热门:hot 新书:new 好评:reputation 完结: over VIP: monthly
 * @param {*} major  大类别
 * @param {*} minor  小类别
 * @param {*} start  
 * @param {*} limit 
 */
export async function fetchBooksByCategory({gender, type, major, minor='', start, limit=20}) {
  return fetch(`https://api.zhuishushenqi.com/book/by-categories?gender=${gender}&type=${type}&major=${major}&minor=${minor}&start=${start}&limit=${limit}`);
}
