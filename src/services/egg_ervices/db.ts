// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 初始化数据库表数据  初始化数据库表数据  POST /ns/base/initDbData */
export async function controllerDbInitDbData(
  body: API.initDbDataRequest,
  options?: { [key: string]: any },
) {
  return request<API.baseDBResponse>(`${API_URL_BASE}/ns/base/initDbData`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建单张表  创建单张表  POST /ns/db/createTable */
export async function controllerDbCreateTable(
  body: API.createTableRequest,
  options?: { [key: string]: any },
) {
  return request<API.baseDBResponse>(`${API_URL_BASE}/ns/db/createTable`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 创建多张表  创建多张表  POST /ns/db/createTables */
export async function controllerDbCreateTables(
  body: API.createTablesRequest,
  options?: { [key: string]: any },
) {
  return request<API.baseDBResponse>(`${API_URL_BASE}/ns/db/createTables`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除单张表  删除多张表  POST /ns/db/dropTable */
export async function controllerDbDropTable(
  body: API.dropTableRequest,
  options?: { [key: string]: any },
) {
  return request<API.baseDBResponse>(`${API_URL_BASE}/ns/db/dropTable`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 删除多张表  删除多张表  POST /ns/db/dropTables */
export async function controllerDbDropTables(
  body: API.dropTablesRequest,
  options?: { [key: string]: any },
) {
  return request<API.baseDBResponse>(`${API_URL_BASE}/ns/db/dropTables`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}
