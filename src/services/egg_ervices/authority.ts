// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 获取登录用户信息  获取登录用户信息  POST /dict/login/getLoginUserInfo */
export async function controllerAuthorityGetUser(options?: {
  [key: string]: any;
}) {
  return request<API.baseResponse>(
    `${API_URL_BASE}/dict/login/getLoginUserInfo`,
    {
      method: 'POST',
      ...(options || {}),
    },
  );
}

/** 获取登录用户token  获取登录用户token  POST /dict/security/login */
export async function controllerAuthorityGetToken(
  body: API.getTokenRequest,
  options?: { [key: string]: any },
) {
  return request<API.baseResponse>(`${API_URL_BASE}/dict/security/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
    ...(options || {}),
  });
}

/** 用户角色设置  用户角色设置  POST /ns/base/authority/setUserRole */
export async function controllerAuthoritySetUserRole(
  body: API.setUserRoleRequest,
  options?: { [key: string]: any },
) {
  return request<API.baseResponse>(
    `${API_URL_BASE}/ns/base/authority/setUserRole`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 角色菜单设置  角色菜单设置  POST /ns/base/role/saveRoleMenu */
export async function controllerAuthoritySaveRoleMenu(
  body: API.saveRoleMenuRequest,
  options?: { [key: string]: any },
) {
  return request<API.baseResponse>(
    `${API_URL_BASE}/ns/base/role/saveRoleMenu`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}
