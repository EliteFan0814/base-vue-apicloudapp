import request from '@/utils/request'

//获取班级列表
export function classList(params) {
  return request.get('/api/TcOrgClass/TeacherByClassList', params)
}