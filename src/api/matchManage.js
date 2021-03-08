import request from '@/utils/request'

//获取比赛公告列表
export function articleList(params) {
  return request.get('/api/ContestNotice/TeacherList', params)
}

//获取比赛公告详情
export function articleInfo(params) {
  return request.get('/api/ContestNotice/TeacherGetOne', params)
}

//获取比赛列表
export function matchList(params) {
  return request.get('/api/ContestNotice/ContestList', params)
}

////获取比赛详情
export function matchInfo(params) {
  return request.get('/api/ContestNotice/GetOneContest', params)
}

////获取参赛名单
export function nameList(params) {
  return request.get('/api/ContestNotice/GetJoinContestChild', params)
}
