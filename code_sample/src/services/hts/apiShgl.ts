import { request } from 'umi';

/**********************************************收汇管理 api start****************************************************/
// 通过付汇人获取付汇方式
export async function hqFhfs(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/hqFhfs`, { method: 'POST', data: param });
}
// 收汇凭证号唯一性校验
export async function checkShpzhWxy(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/checkShpzhWxy`, { method: 'POST', data: param });
}
// 收回管理-收回水单数据导入
export async function shsdsjdr(param?: any) {
  return request(`${API_URL_BASE}//saas/shgl/shsdsj/shsdsjdr`, { method: 'POST', data: param });
}
// 收回管理-收回水单数据 删除
export async function shsdsjDelete(param?: any) {
  return request(`${API_URL_BASE}//saas/shgl/shsdsj/shsdsjDelete`, { method: 'POST', data: param });
}
// 水单数据匹配-初始化已匹配数据
export async function initShsdPpsj(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/initYppBgd`, { method: 'POST', data: param });
}
// 水单数据匹配-查询未匹配数据
export async function queryShglWppBgd(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/queryWppBgdPager`, { method: 'POST', data: param });
}
// 水单数据匹配-查询已匹配数据
export async function queryShglYppBgd(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/queryYppBgdPager`, { method: 'POST', data: param });
}
// 水单数据匹配-已匹配数据修改
export async function updateShglYppBgd(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/updateYppBgd`, { method: 'POST', data: param });
}
// 水单数据匹配-已匹配数据删除
export async function deleteShglYppBgd(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/deleteYppBgd`, { method: 'POST', data: param });
}
// 水单数据匹配-未匹配数据添加至已匹配
export async function addShglWppBgd(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/addWppBgd`, { method: 'POST', data: param });
}
// 水单数据匹配-自动匹配
export async function aotuShglPp(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/autoPp`, { method: 'POST', data: param });
}
// 水单数据匹配-自动匹配-合同付汇-导出
export async function downHtfhJg(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/downHtfhJg`, { method: 'POST', data: param });
}
// 水单数据匹配-匹配-保存
export async function bcShglPpjg(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/bcShglPpjg`, { method: 'POST', data: param });
}
// 出口货物收汇-提取收汇
export async function ckhwshQkTqsh(param: any) {
  return request(`${API_URL_BASE}/yw/tssb/cksh/tqsh`, { method: 'POST', data: param });
}
// 出口货物收汇-提取收汇-导出结果
export async function downTqshJg(param: any) {
  return request(`${API_URL_BASE}/yw/tssb/cksh/downTqshJg`, { method: 'POST', data: param });
}
// 收回管理-报关单收回情况查询 数据更新
export async function bgdshqkSjgx(param: any) {
  return request(`${API_URL_BASE}/saas/shgl/bgdshqk/bgdshqkSjgx`, { method: 'POST', data: param });
}
// 获取汇率
export async function getShhl(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/getShhl`, { method: 'POST', data: param });
}
export async function shglsdppGxPpBz(param?: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/gxPpbz`, { method: 'POST', data: param });
}
// 收回管理-收回水单数据 维护汇率
export async function shglShsdsjWhhl(param?: any) {
  return request(`${API_URL_BASE}//saas/shgl/shsdsj/whhl`, { method: 'POST', data: param });
}
// 收回管理-报关单收回情况查询 人工设置
export async function bgdshqkRgsz(param: any) {
  return request(`${API_URL_BASE}/saas/shgl/bgdshqk/bgdshqkRgsz`, { method: 'POST', data: param });
}
// 收汇管理-匹配页面关闭清空临时表
export async function shglDelSdbgdlsb(param: any) {
  return request(`${API_URL_BASE}/saas/shgl/shsdsj/deleteLsb`, { method: 'POST', data: param });
}
// 收回管理-匹配前校验
export async function shglppqjy(param: any) {
  return request(`${API_URL_BASE}/saas/shgl/rwgl/ppqjy`, { method: 'POST', data: param });
}
export async function shglSdplzdpp(param: any) {
  return request(`${API_URL_BASE}/saas/shgl/rwgl/cjSdplzdppRw`, { method: 'POST', data: param });
}
// 删除收汇水单匹配任务
export async function shglDelSdpprw(param: any) {
  return request(`${API_URL_BASE}/saas/shgl/rwgl/delSdppRw`, { method: 'POST', data: param });
}
// 收汇管理报关单批量设置
export async function shglBgdBatchSetBgd(param: any) {
  return request(`${API_URL_BASE}/saas/shgl/bgdshqk/batchSetBgd`, { method: 'POST', data: param });
}
