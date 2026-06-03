// @ts-ignore
/* eslint-disable */
import { Base64 } from 'js-base64';
import { request } from 'umi';

/** 登录接口，获取token信息 */
export async function login(body: any, options?: { [key: string]: any }) {
  const param: any = {
    clientId: '1',
    d1zh: body?.username ? Base64.encode(body?.username) : '',
    d1mm: body?.password ? Base64.encode(body?.password) : '',
  };
  if (body?.captcha) {
    param.captchaValue = Base64.encode(body?.captcha);
  }
  if (body?.captchaId) {
    param.captchaKey = Base64.encode(body?.captchaId);
  }
  if (body?.sbqyuuid) {
    param.sbqyuuid = body.sbqyuuid;
  }
  if (body?.yhuuid1) {
    param.yhuuid1 = body.yhuuid1;
  }
  if (body?.isMhjc) {
    param.isMhjc = body.isMhjc;
  }

  let res =  request<API.LoginResult>(`${API_URL_BASE}/hx/qx/token/oauth`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: param,
    ...(options || {}),
  });
  return res;
}

/** 获取用户信息 */
export async function currentUser(options?: { [key: string]: any }) {
  return request<API.LoginResult>(`${API_URL_BASE}/hx/qx/token/getLoginUserInfo`, {
    method: 'POST',
    data: {},
    ...(options || {}),
  });
}

/** 退出登录接口 POST /api/login/outLogin */
export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>(`${API_URL_BASE}/api/login/outLogin`, {
    method: 'POST',
    ...(options || {}),
  });
}

/** 查询企业信息接口 POST /hx/ty/commonqxkz/qyxx */
export async function getQyxx(options?: { [key: string]: any }) {
  return request<API.LoginResult>(`${API_URL_BASE}/hx/ty/commonqxkz/qyxx`, {
    method: 'POST',
    data: {},
    ...(options || {}),
  });
}

/** 此处后端没有提供注释 GET /api/notices */
export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>(`${API_URL_BASE}/api/notices`, {
    method: 'GET',
    ...(options || {}),
  });
}

/** 查询企业信息接口 POST /hx/ty/commonqxkz/qyxx */
export async function getXtcspz(options?: { [key: string]: any }) {
  return request<API.LoginResult>(`${API_URL_BASE}/xtcspz/getXtcspz`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: {},
    ...(options || {}),
  });
}

/** 获取图片验证码 */
export async function getCaptcha(options?: { [key: string]: any }) {

  return request(`${API_URL_BASE}/captcha/getCaptcha`, {
    method: 'GET',
    responseType: 'blob',
    headers: {
      'Cache-Control': 'no-cache'
    },
    getResponse: true,
    params: {
      timestamp:
      Date.now()
    }
  });

}
