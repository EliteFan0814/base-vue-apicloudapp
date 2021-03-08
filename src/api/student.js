import request from '@/utils/request'

export default {
  getJobsList,
  getJobsDetail,
  callForJob,
  getNoticeList,
  getNoticeDetail,
  getTrainList,
  getResumeInfo,
  editResumeInfoSingle,
  editResumeInfo,
  getVideoAuth,
  getInfo,
  changeInfo
}
//获取招聘信息列表
export function getJobsList(page, pageSize, seachKey) {
  return request.get('/api/OrgRecruitment/List', { page, pageSize, seachKey })
}
//获取招聘详情
export function getJobsDetail(id) {
  return request.get('/api/OrgRecruitment/GetOne', { id })
}
//联系应聘按钮
export function callForJob() {
  return request.get('/api/SystemSettings/GetOnlineService')
}
//获取公告列表
export function getNoticeList(page, pageSize, orgId) {
  return request.get('/api/Article/NoticeList', { page, pageSize, orgId })
}
//获取公告列表
export function getNoticeDetail(articleId) {
  return request.get('/api/Article/GetOne', { articleId })
}
//获取师资培训列表
export function getTrainList(page, pageSize) {
  return request.get('/api/PlatformTraining/List', { page, pageSize })
}
//获取简历信息
export function getResumeInfo() {
  return request.get('/api/PlatformTrainee/GetOneResume')
}
//编辑修改简历(单个选项修改)
export function editResumeInfoSingle(name, value) {
  return request.post('/api/PlatformTrainee/Edit', { [name]: value })
}
//编辑修改简历(多个选项修改)
export function editResumeInfo(obj) {
  return request.post('/api/PlatformTrainee/Edit', obj)
}
// 上传视频使用，从腾讯获取临时密钥
export function getVideoAuth(data) {
  return request.get('/api/TxCos/GetAuthInfo', data)
}
//获取昵称电话等个人信息
export function getInfo() {
  return request.get('/api/PlatformTrainee/GetOneInfo')
}
//修改个人信息
export function changeInfo(data) {
  return request.post('/api/PlatformTrainee/Modify', data)
}
