import request from '@/utils/request'

export default {
  getNoticeList,
  getGradeList,
  getGradeDetail,
  getAttendanceStatistics,
  getCourseStatistics,
  getGradeContacts,
  getNameRecord,
  getLeaveRecord,
  checkLeave,
  getTeacherList,
  getTimetable,
  getCourse,
  getJoinDetail,
  getJoinStatus,
  confirmJoin,
  getTodoInfo
  // getNoticeDetail
}
//获取平台公告列表
export function getNoticeList(page, pageSize, orgId) {
  return request.get('/api/Article/NoticeList', { page, pageSize, orgId })
}
//获取班级管理列表
export function getGradeList(page, pageSize) {
  return request.get('/api/TcOrgClass/TeacherByClassList', { page, pageSize })
}
//获取班级通讯录
export function getGradeContacts(orgClassId, className) {
  return request.get('/api/TcOrgClass/TeacherGetAddressBook', { orgClassId, className })
}
//进入班级详情
export function getGradeDetail(orgClassId) {
  return request.get('/api/TcOrgClass/GetTeacherByClass', { orgClassId })
}
//获取班级出勤率统计
export function getAttendanceStatistics(orgClassId, year, month) {
  return request.get('/api/TcOrgClass/AttendanceStatistics', { orgClassId, year, month })
}
//获取班级课时数统计
export function getCourseStatistics(orgClassId, year, month) {
  return request.get('/api/TcOrgClass/AcademicHourStatistics', { orgClassId, year, month })
}
//获取点名记录
export function getNameRecord(page, pageSize, orgClassId) {
  return request.get('/api/TcOrgClass/TeacherByTollCallDetail', { page, pageSize, orgClassId })
}
//获取请假记录
export function getLeaveRecord(page, pageSize, orgClassId, isAudit) {
  return request.get('/api/TcOrgClass/List', { page, pageSize, orgClassId, isAudit })
}
//请假审核
export function checkLeave(studentLeaveId, status, auditReason) {
  return request.post('/api/TcOrgClass/Audit', { studentLeaveId, status, auditReason })
}
//获取师资培训列表
export function getTeacherList(page, pageSize) {
  return request.get('/api/PlatformTraining/List', { page, pageSize })
}
//获取日历课程表
export function getTimetable(year, month) {
  return request.get('/api/CourseSchedule/GetCalendar', { year, month })
}
//获取班级课程
export function getCourse(date) {
  return request.get('/api/CourseSchedule/GetSchedule', { date })
}
//获取培训详情
export function getJoinDetail(trainingId) {
  return request.get('/api/PlatformTraining/GetOne', { trainingId })
}
//获取报名状态
export function getJoinStatus(trainingId) {
  return request.get('/api/PlatformTraining/ApplyStatus', { trainingId })
}
//确认报名
export function confirmJoin(TrainingId, Name, Mobile) {
  return request.post('/api/PlatformTraining/TrainingApply', { TrainingId, Name, Mobile })
}
//获取首页代办
export function getTodoInfo() {
  return request.get('/api/TcOrgClass/GetAgentCount')
}
