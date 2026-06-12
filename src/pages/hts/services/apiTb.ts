import { request } from 'umi';

/**********************************************跟定制化同步api start****************************************************/
// 数据管理 -- 出口货物报关单 -- 台账筛选（导入）
export async function bgdtzsx(param?: any) {
  return request(`${API_URL_HTS}/yw/bszx/wbsj/bgd/bgdtzsx`, { method: 'POST', data: param });
}
// 数据管理 -- 出口货物报关单 -- 页面初始化（更新台账筛选）
export async function delTzsx(param?: any) {
  return request(`${API_URL_HTS}/yw/bszx/wbsj/bgd/delTzsx`, { method: 'POST', data: param });
}
// 数据管理 -- 出口货物报关单 -- 固德威打印数量
export async function queryCkbgdslForDy(param?: any) {
  return request(`${API_URL_HTS}/yw/bszx/wbsj/bgd/queryCkbgdslForDy`, { method: 'POST', data: param });
}
export async function pldy(param?: any) {
  return request(`${API_URL_HTS}/yw/bszx/wbsj/bgd/pldy`, { method: 'POST', data: param });
}
export async function pldyBgd(param?: any) {
  return request(`${API_URL_HTS}/yw/bszx/wbsj/bgd/pldy`, { method: 'POST', data: param });
}
export async function pldyjy(param?: any) {
  return request(`${API_URL_HTS}/yw/saas/sjgl/jxfpcx/pldyjy`, { method: 'POST', data: param });
}
export async function xfspldyjy(param: any) {
  return request(`${API_URL_HTS}/yw/saas/sjgl/xfsfp/xfspldyjy`, { method: 'POST', data: param });
}
