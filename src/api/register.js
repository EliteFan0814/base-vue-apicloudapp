import request from '@/utils/request'

//注册
export function register(data) {
  return request.post('/api/PlatformTrainee/Register', data)
}

//发送验证码
export function sendCode(data) {
  return request.post('/api/PlatformTrainee/SendRegSmsCode', data)
}