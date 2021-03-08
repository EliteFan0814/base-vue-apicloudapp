import request from '@/utils/request'

//任职班级数量
export function classNum(params) {
  return request.get('/api/BaseData/GetHeaderStatistics', params)
}

//班级列表
export function classList(params) {
  return request.get('/api/BaseData/GetClassStatistics', params)
}