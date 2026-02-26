import { request } from 'umi';
import myUtil from '@/components/DDAssist/util';

// 登录接口，获取token信息
export async function login(body: any, options?: { [key: string]: any }) {
  let url = `${myUtil.api.getApiRoot()}/dict/security/login`;
  if (myUtil.localStore.getItem('DICT_APP_TYPE') !== 'dictAppDev01') { // mock
    url += `?username=${body.username}&password=${body.password}`;
  }
  return request(url, {
    method: 'POST',
    data: {
      username: body.username,
      password: body.password,
    }
  });
}

// 获取用户信息
export async function queryCurrentUser(options?: { [key: string]: any }) {
  // return request(`${myUtil.api.getApiRoot()}/dict/login/getLoginUserInfo`, {
  return request(`${API_URL_BASE}/dict/login/getLoginUserInfo`, {
    method: 'POST',
    data: {},
    ...(options || {}),
  });
}

// 三方系统登录接口，获取token信息
export async function loginForExt(param?: any) {
  return request(`${API_URL_BASE}/dict/login/loginForExt`, { method: 'POST', data: param });
}

// 全量菜单
export async function queryAll(param: any) {
  // return request(`${myUtil.api.getApiRoot()}/dict/auth/menu/queryAll`, { method: 'POST', data: param });
  return request(`${API_URL_BASE}/dict/auth/menu/queryAll`, { method: 'POST', data: param });
}

// 获取用户头像
export async function getUserAvatarBlob() {
  return request(`${API_URL_BASE_NODE}/ns/base/user/getAvatarBlob`, { method: 'POST', responseType: 'blob' });
}

// NS【通用】分页列表
export async function queryListNs(param?: any, key?: any) {
  return request(`${API_URL_BASE_NODE}/ns/base/list/${key}`, { method: 'POST', data: param });
}

// 【通用】分页列表
export async function queryList(param: any, key?: any, baseurl?: any) {
  let url = baseurl ? API_URL_BASE : myUtil.api.getApiRoot();
  return request(`${url}/dict/automatic/exp/bs/queryPager/${key}`, { method: 'POST', data: param });
}
