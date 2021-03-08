import request from '@/utils/request'

export default {
  logout,
  teacherLogin,
  studentLogin
}

//统一登出
export function logout() {
  return request.post('/api/Login/Logout')
}

// 老师登录
export function teacherLogin(LoginName, Pwd) {
  return request.post('/api/Login/TeacherLogin', { LoginName, Pwd })
}

// 学员注册

// 学员登录
export function studentLogin(mobile, pwd) {
  return request.post('/api/PlatformTrainee/Authenticate', { mobile, pwd })
}
