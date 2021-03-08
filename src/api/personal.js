import request from '@/utils/request'

//获取个人信息
export function teacherInfo(params) {
  return request.get('/api/OrgTeacher/GetOne', params)
}

//获取机构信息
export function articleInfo(params) {
  return request.get('/api/Article/GetOne', params)
}

//机构公告
export function noticeList(params) {
  return request.get('/api/Article/NoticeList', params)
}

//公告详情
export function noticeInfo(params) {
  return request.get('/api/Article/GetOne', params)
}

//修改密码
export function changePwd(params) {
  return request.get('/api/OrgTeacher/UpdatePwd', params)
}

//修改头像
export function changeInfo(data) {
  return request.post('/api/OrgTeacher/TeacherModify', data)
}

//机构二维码
export function getQrImg() {
  return request.get('/api/POrgBase/TeacherQrInfo')
}
