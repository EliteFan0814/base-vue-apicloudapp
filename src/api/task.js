import request from '@/utils/request'

//获取作业列表
export function taskList(params) {
  return request.get('/api/SchoolAssignment/ClassList', params)
}

//发布作业
export function createTask(data) {
  return request.post('/api/SchoolAssignment/Homework', data)
}

//作业记录
export function taskRecordList(params) {
  return request.get('/api/SchoolAssignment/AssignmentRecordList', params)
}

//表扬
export function setPraise(data) {
  return request.post('/api/SchoolAssignment/SetPraise', data)
}

//点评
export function comment(data) {
  return request.post('/api/SchoolAssignment/CommentAssignment', data)
}

//点评列表
export function commentList(params) {
  return request.get('/api/SchoolAssignment/MyCommentList', params)
}
//点评列表
export function getTaskDetail(schooolAssignmentId) {
  return request.get('api/SchoolAssignment/GetOne', {schooolAssignmentId})
}

