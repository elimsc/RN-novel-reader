/**
 * 书籍排行榜相关
 */

// 获取所有排行榜
export async function fetchRankingList() {
  return fetch('http://api.zhuishushenqi.com/ranking/gender');
}

// 获取单一排行榜
export async function fetchSingleRanking(rankingId) {
  return fetch(`http://api.zhuishushenqi.com/ranking/${rankingId}`);
}