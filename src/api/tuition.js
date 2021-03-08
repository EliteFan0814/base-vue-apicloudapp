import request from '@/utils/request'

export default {
  search,
  getProdList,
  submit,
  payRecord
}

//搜索
export function search(searchKey, classId) {
  return request.get('/api/OrgProduct/AutoCompleteStudent', { searchKey, classId })
}

// 产品列表
export function getProdList(page, pageSize) {
  return request.get('/api/OrgProduct/ProductList', { page, pageSize })
}
// 提交订单
export function submit(StudentId, ProductId, TotalClassHours, TotalPayMoney) {
  return request.post('/api/OrgProduct/TeacherCreateOrder', { StudentId, ProductId, TotalClassHours, TotalPayMoney })
}
// 缴纳记录
export function payRecord(page, pageSize, auditStatus) {
  return request.get('/api/OrgProduct/ProductOrderList', { page, pageSize, auditStatus })
}
