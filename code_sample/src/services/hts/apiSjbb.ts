import { request } from 'umi';

/**********************************************数据报表 start****************************************************/
// 数据报表--数据更新-- 删除
export async function deleteTzData(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/sjfx/sjgx/del`, { method: 'POST', data: param });
}
// 更新台账数据
export async function updateDataTz(param: any) {
  return request(`${API_URL_BASE}/yw/sb/sjfx/sjgx/add`, { method: 'POST', data: param });
}
// 判断是否纯在消费税
export async function checkXfssfwl(param: any) {
  return request(`${API_URL_BASE}/yw/sb/sjfx/wm/checkXfssfwl`, { method: 'POST', data: param });
}
// 数据报表-判断生产企业筛选条件内申报数据条数是否为0
export async function checkSbsjtssfwl(param: any) {
  return request(`${API_URL_BASE}/yw/sb/sjfx/sc/checkSbsjtssfwl`, { method: 'POST', data: param });
}
// 更新台账数据-外贸出口报关单退税情况
export async function addForWmckbgdtsqk(param: any) {
  return request(`${API_URL_BASE}/yw/sb/sjfx/sjgx/addForWmckbgdtsqk`, { method: 'POST', data: param });
}
