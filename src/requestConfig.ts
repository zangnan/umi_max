import type { RequestOptions } from '@@/plugin-request/request';
import type { RequestConfig } from '@umijs/max';
import { message, notification } from 'antd';
import { history } from '@umijs/max';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import cktsUtil from '@/pages/hts/cktsUtil';

// 错误处理方案： 错误类型
enum ErrorShowType {
  SILENT = 0,
  WARN_MESSAGE = 1,
  ERROR_MESSAGE = 2,
  NOTIFICATION = 3,
  REDIRECT = 9,
}
// 与后端约定的响应数据格式
interface ResponseStructure {
  code?: string;
  success: boolean;
  data: any;
  errorCode?: number;
  errorMessage?: string;
  showType?: ErrorShowType;
  headers: any;
}

/**
 * @name 运行时配置
 * @doc https://umijs.org/docs/max/request#配置
 */
export const requestConfig: RequestConfig = {
  // 统一的请求设定
  timeout: 3600000,
  errorConfig: {
    // 错误抛出
    errorThrower: (res) => {
      const { success, data, errorCode, errorMessage, showType } = res as unknown as ResponseStructure;
      if (!success) {
        const error: any = new Error(errorMessage);
        error.name = 'BizError';
        error.info = { errorCode, errorMessage, showType, data };
        throw error; // 抛出自制的错误
      }
    },
    // 错误接收及处理
    errorHandler: (error: any, opts: any) => {
      if (opts?.skipErrorHandler) throw error;
      // 我们的 errorThrower 抛出的错误。
      if (error.name === 'BizError') {
        // const errorInfo: ResponseStructure | undefined = error.info;
        // if (errorInfo) {
        //   const { errorMessage, errorCode } = errorInfo;
        //   switch (errorInfo.showType) {
        //     case ErrorShowType.SILENT:
        //       // do nothing
        //       break;
        //     case ErrorShowType.WARN_MESSAGE:
        //       message.warning(errorMessage);
        //       break;
        //     case ErrorShowType.ERROR_MESSAGE:
        //       message.error(errorMessage);
        //       break;
        //     case ErrorShowType.NOTIFICATION:
        //       notification.open({
        //         description: errorMessage,
        //         message: errorCode,
        //       });
        //       break;
        //     case ErrorShowType.REDIRECT:
        //       // TODO: redirect
        //       break;
        //     default:
        //       message.error(errorMessage);
        //   }
        // }
      } else if (error.response) {
        // Axios 的错误
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        message.error(`Response status:${error.response.status}`);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // \`error.request\` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        message.error('None response! Please retry.');
      } else {
        // 发送请求时出了点问题
        console.info(error);
        console.info(opts);
        debugger
        message.error('Request error, please retry.');
      }
    },
  },

  // 请求拦截器
  requestInterceptors: [
    // 拦截请求配置
    (config: RequestOptions) => {
      // document.cookie = "accessClientId;token=1234002;domain='http://192.168.21.3';path=/;"
      let authHeader: any = {
        accessClientId: ACCESS_CLIENT_ID,
      };
      const accessToken = localStorage.getItem(CONSTANTS.LOGIN.ACCESS_TOKEN);
      if (accessToken && config?.url?.indexOf('/hx/qx/token/oauth') === -1) {
        authHeader.accessToken = accessToken;
      }
      // HTS 业务逻辑封装在 cktsUtil.api.handleHtsRequest 中
      // 必须在 headers 构造**之前**调用，否则 authHeader 的就地修改不会反映到 headers
      const finalConfig = cktsUtil.api.handleHtsRequest(config, authHeader);
      const headers: any = {
        ...finalConfig?.headers,
        ...authHeader,
        // withCredentials: true,
      };
      return { ...finalConfig, headers,
        // withCredentials: true
      };
    },
  ],

  // 响应拦截器
  responseInterceptors: [
    (response) => {
      const { headers, data } = response as unknown as ResponseStructure;
      if (data?.code === '300') {
        // const { location } = history;
        // if (location.pathname.indexOf('/user/login') < 0) {
        // console.info('requestConfig.tsx location.pathname', location.pathname);
        // console.info(CONSTANTS.WHITE_LIST.indexOf(location.pathname));
        // console.info(myUtil.authority.isWhiteListUrl());
        if (myUtil.authority.isWhiteListUrl()) {
          message.info(data?.msg || 'TOKEN ERROR');
          history.push(CONSTANTS.ROUTE.LOGIN);
        }
      }
      const accessToken = headers[CONSTANTS.LOGIN.HEADER_TOKEN_KEY];
      if (accessToken) {
        localStorage.setItem(CONSTANTS.LOGIN.ACCESS_TOKEN, accessToken);
      }
      return response;
    },
  ],
};
