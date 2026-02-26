import { request } from 'umi';

// NS【通用】数据库建表
export async function createTables(param: any) {
  return request(`${API_URL_BASE_NODE}/ns/db/createTables`, { method: 'POST', data: param });
}

// NS【通用】数据库数据初始化
export async function initDbData(param: any) {
  return request(`${API_URL_BASE_NODE}/ns/base/initDbData`, { method: 'POST', data: param });
}

// NS【通用】数据库删除表
export async function dropDbTablesNs(param: any) {
  return request(`${API_URL_BASE_NODE}/ns/db/dropTables`, { method: 'POST', data: param });
}

// NS【通用】分页列表
export async function queryListNs(param?: any, key?: any) {
  return request(`${API_URL_BASE_NODE}/ns/base/list/${key}`, { method: 'POST', data: param });
}

// NS【通用】新增/修改
export async function editNs(param?: any, key?: any) {
  return request(`${API_URL_BASE_NODE}/ns/base/edit/${key}`, { method: 'POST', data: param });
}

// NS【通用】删除
export async function deleteNs(param?: any, key?: any) {
  return request(`${API_URL_BASE_NODE}/ns/base/delete/${key}`, { method: 'POST', data: param });
}

// NS【通用】获取用户头像
// export async function getUserAvatarBlob() {
//   return request(`${API_URL_BASE_NODE}/ns/base/user/getAvatarBlob`, { method: 'POST', responseType: 'blob' });
// }

// NS【共用】导入Excel
export async function baseImportExcel(tableKey: any, param: any) {
  return request(`${API_URL_BASE_NODE}/ns/base/importExcel/${tableKey}`, { method: 'POST', data: param });
}

// NS 用户管理 设置用户角色
export async function setUserRoleNs(param?: any) {
  return request(`${API_URL_BASE_NODE}/ns/base/authority/setUserRole`, { method: 'POST', data: param });
}

// NS 角色管理 保存角色菜单树
export async function saveRoleMenuNs(param?: any) {
  return request(`${API_URL_BASE_NODE}/ns/base/role/saveRoleMenu`, { method: 'POST', data: param });
}