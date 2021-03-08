import request from '@/utils/request'

//点名班级列表
export function getClassList(params) {
  return request.get('/api/TcOrgClass/TeacherByClassList', params)
}
//班级学生
export function getStudentList(params) {
  return request.get('/api/MakeUpTeacher/GetStudentByName', params)
}

 
//补课班级列表
export function getMakeUpClassList(params) {
  return request.get('/api/MakeUpTeacher/MakeUpListByNotRollCall', params)
}
//补课学生
export function getMakeUpStudentList(params) {
  return request.get('/api/MakeUpTeacher/GetStudentByMakeUp', params)
}

//点名
export function rollCall(data) {
  return request.postJSON('/api/MakeUpTeacher/RollCall', data)
}

//点名记录
export function rollCallRecord(params) {
  return request.get('/api/TcOrgClass/TeacherByTollCallDetail', params)
}
//出勤详情
export function rollCallRecordList(params) {
  return request.get('/api/TcOrgClass/GetRollCallByStudent', params)
}

//补课记录
export function makeUpRecord(params) {
  return request.get('/api/MakeUpTeacher/MakeUpRecord', params)
}
//补课记录出勤详情
export function makeUpRecordList(params) {
  return request.get('/api/MakeUpTeacher/GetMakeUpByStudent', params)
}
