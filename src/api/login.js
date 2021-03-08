import request from '@/utils/request'

//老师登录
export function teacherLogin(data) {
  return request.post('/api/Login/TeacherLogin', data)
}

//学生登录
export function studentLogin(data) {
  return request.post('/api/PlatformTrainee/Authenticate', data)
}
