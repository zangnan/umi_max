import { request } from 'umi';
import { message, notification } from 'antd';
import type { ResponseError } from 'umi-request';
import { saveKakPassword } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';

/** 异常处理程序
 * @see https://beta-pro.ant.design/docs/request-cn
 */
const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  405: '请求方法不被允许。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};
const errorHandler = (error: ResponseError) => {
  const { response } = error;
  if (response && response.status) {
    const errorText = codeMessage[response.status] || response.statusText;
    const { status, url } = response;

    notification.error({
      message: `请求错误 ${status}: ${url}`,
      description: errorText,
    });
  }
  throw error;
};

const khdgjUtil: any = {};
const bgdsjly = myUtil.sys.bgdsjlyType();

const url = 'http://127.0.0.1:10110/';

// 客户端工具检查
khdgjUtil.khdgjJc = async (params: any) => {
  let msg = '环境检测失败';
  let code = '900';
  let body: any = [];
  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const hgqyDm = userInfo?.qxQys[0]?.hgqyDm;
  params['hgqydm'] = hgqyDm;
  await request(url + `khdgjservices/bgd/gdhjjc`, { method: 'POST', data: params, errorHandler }).then((response) => {
    if (response.code === '200') {
      code = '200'
      msg = '环境检测通过！';
      body = response.body;
    } else if (response.code === '51574' || response.code === '50040' || response.code === '991') {
      code = response.code;
      msg = response.msg;
      body = response.body;
    } else {
      code = '300'
      msg = response.msg;
    }
  }).catch((err) => {
    msg = '连接客户端工具失败！';
    code = '900'
  });
  let rt = { "msg": msg, 'code': code, 'body': body };
  return rt;
}

// 2.1.5 查询定时下载任务
khdgjUtil.cxDsxzRw = async (params: any) => {
  let msg = '环境检测失败';
  let code = '900';
  let body: any = [];
  await request(url + `khdgjservices/gt/cxDsxzRw`, { method: 'POST', data: params, errorHandler }).then((response) => {
    if (response.code === '200') {
      code = '200'
      msg = '环境检测通过！';
      body = response.body;
    } else {
      code = '300'
      msg = response.msg;
    }
  }).catch((err) => {
    msg = '连接客户端工具失败！';
    code = '900'
  });
  let rt = { "msg": msg, 'code': code, 'body': body };
  return rt;
}


// 设置定时任务
khdgjUtil.szDsxzRw = async (params: any) => {
  let msg = '环境检测失败';
  let code = '900';
  let body: any = [];
  await request(url + `khdgjservices/gt/szDsxzRw`, { method: 'POST', data: params, errorHandler }).then((response) => {
    if (response.code === '200') {
      code = '200'
      msg = '环境检测通过！';
      body = response.body;
    } else {
      code = '300'
      msg = response.msg;
    }
  }).catch((err) => {
    msg = '连接客户端工具失败！';
    code = '900'
  });
  let rt = { "msg": msg, 'code': code, 'body': body };
  return rt;
}


khdgjUtil.wlhjjc = async (params: any) => {
  let msg = '环境检测失败';
  let code = '900';
  let body: any = [];
  await request(url + `khdgjservices/gt/wlhjjc`, { method: 'POST', data: params, errorHandler }).then((response) => {
    if (response.code === '200') {
      code = '200'
      msg = '环境检测通过！';
      body = response.body;
    } else {
      code = '300'
      msg = response.msg;
    }
  }).catch((err) => {
    msg = '连接客户端工具失败！';
    code = '900'
  });
  let rt = { "msg": msg, 'code': code, 'body': body };
  return rt;
}

// 是否存在下载中任务 报关单用
khdgjUtil.checkIsExistTaskBgd = async (params: any) => {
  let resbody = '';
  await saveKakPassword({ uuid: params }).then(async (res) => {
    const { body, code } = res;
    if (code == '200') {
      const userInfo = myUtil.sessionStore.getItem('userInfo');
      body.host =userInfo?.xtCs.host ;
      body.port =userInfo?.xtCs.port ;
      body.prefix =userInfo?.xtCs.prefix ;
      body.enableSsl =userInfo?.xtCs.enableSsl ;
      await request(url + `khdgjservices/gt/khdgjxx`, { method: 'POST', data: body, errorHandler }).then(async (response) => {
        if (response.code === '200') {
          if (bgdsjly === '4' || bgdsjly === '3') { // 此方法 只有进出口报关单下载调用，3工具RPA也不用校验是否有执行中的进程了（不予手动单证等任务冲突）
            resbody = 'N';
          } else {
            await request(url + `khdgjservices/bgd/checkIsExistTask`, { method: 'POST', data: body, errorHandler }).then((response2) => {
              if (response2.code == '200') {
                resbody = response2.body;
              } else {
                resbody = 'E';
              }
            });
          }
        } else {
          resbody = 'E';
        }
      }).catch((err) => {
        resbody = 'E';
      });
    } else {
      resbody = 'E';
    }
  });
  return resbody;
}



khdgjUtil.checkIsExistTask = async (params: any) => {
  let resbody = '';
  await saveKakPassword({ uuid: params }).then(async (res) => {
    const { body, code } = res;
    if (code == '200') {
      const userInfo = myUtil.sessionStore.getItem('userInfo');
      body.host =userInfo?.xtCs.host ;
      body.port =userInfo?.xtCs.port ;
      body.prefix =userInfo?.xtCs.prefix ;
      body.enableSsl =userInfo?.xtCs.enableSsl ;
      await request(url + `khdgjservices/gt/khdgjxx`, { method: 'POST', data: body, errorHandler }).then(async (response) => {
        if (response.code === '200') {
          await request(url + `khdgjservices/bgd/checkIsExistTask`, { method: 'POST', data: body, errorHandler }).then((response2) => {
            if (response2.code == '200') {
              resbody = response2.body;
            } else {
              resbody = 'E';
            }
          });
        } else {
          resbody = 'E';
        }
      }).catch((err) => {
        resbody = 'E';
      });
    } else {
      resbody = 'E';
    }
  });
  return resbody;
}

khdgjUtil.checkIsExistTaskGy = async (params: any, bgdsjlyDm:any) => {
  if (bgdsjlyDm === '3' || bgdsjlyDm === '4' || bgdsjlyDm === '6') {
    return khdgjUtil.checkIsExistTaskBgd(params);
  } else {
    return khdgjUtil.checkIsExistTask(params);
  }
}

// check 客户端工具
khdgjUtil.checkkhdgj = async (params: any) => {
  let resbody = '';
  await request(url + `khdgjservices/gt/khdgjxx`, { method: 'POST', data: params, errorHandler }).then(async (response) => {
    if (response.code === '200') {
      resbody = response.body;
    } else {
      resbody = 'E';
    }
  }).catch((err) => {
    resbody = 'E';
  });
  return resbody;
}



// 是否存在下载中任务
// khdgjUtil.checkIsExistTask = async (params: any) => {
//   let resbody = '';
//   await saveKakPassword({ uuid: params }).then(async (res) => {
//     const { body, code } = res;
//     if (code == '200') {
//       await request(url + `khdgjservices/bgd/checkIsExistTask`, { method: 'POST', data: body, errorHandler }).then((response) => {
//         if (response.code === '200') {
//           resbody = response.body;
//         } else {
//           resbody ='N';
//         }
//       }).catch((err) => {
//         resbody ='E';
//       });
//     }else{
//       resbody = 'N';
//     }
//   });
//   return resbody;
// }


// 客户端工具关单下载
khdgjUtil.khdgjGdxz = async (params: any) => {
  const res = { msg: '', code: '300', body:{}};
  await request(url + `khdgjservices/bgd/gdxz`, { method: 'POST', data: params, errorHandler }).then((response) => {
    if (response.code === '200') {
      res.code = '200'
      res.body = response.body;
    } else {
      res.msg = response.msg;
      res.code = response.code;
    }
  }).catch((err) => {
    res.msg = '连接客户端工具失败！';
  });
  return res;
}

// 客户端工具关单传递
khdgjUtil.khdgjGdcd = async (params: any) => {
  const res = { msg: '', code: '300' };
  await request(url + `khdgjservices/bgd/gdxxcd`, { method: 'POST', data: params, errorHandler }).then((response) => {
    if (response.code === '200') {
      res.code = '200'
    } else {
      res.msg = response.msg;
      res.code = response.code;
    }
  }).catch((err) => {
    res.msg = '连接客户端工具失败！';
  });
  return res;
}

// 自动开票（调用上传相关路径、发票下载接口）
khdgjUtil.khdgjFpXgljSet = async (params: any) => {
  request(url + `khdgjservices/ckfp/ljsz`, { method: 'POST', data: { yhjq: params.yhjq, dclj: params.dclj, htlj: params.htlj, bflj: params.bflj }, errorHandler }).then((response) => {
    if (response.code === '200') {
      return request(url + `khdgjservices/ckfp/wjdc`, { method: 'POST', data: { yhjq: params.yhjq, uuids: params.uuids }, errorHandler });
    } else {
      return message.error(response.msg)
    }
  }).then((response1) => {
    if (response1.code === '200') {
      message.success("自动开票成功！");
    } else {
      message.error(response1.msg)
    }
  }).catch(() => {
    message.error('连接客户端工具失败！');
  }).finally(() => {
    params.unitRef.current?.setMasker(false);
    // params.unitRef.current!.reload2();
  });
}

// 暂停执行
khdgjUtil.khdZtzx = async (params: any) => {
  const res = { msg: '', code: '300' };
  await request(url + `khdgjservices/bgd/shutDownTask`, { method: 'POST', data: params }).then((response) => {
    if (response.code === '200') {
      res.code = '200'
    } else {
      res.msg = response.msg;
      res.code = response.code;
    }
  }).catch((err) => {
    res.msg = '连接客户端工具失败！';
  });
  return res;
}

// 取消执行
khdgjUtil.khdQxzx = async (params: any) => {
  const res = { msg: '', code: '300', body: {} };
  await request(url + `khdgjservices/gpt/selecteddownloadcancel`, { method: 'POST', data: params }).then((response) => {
    if (response.code === '200') {
      res.code = '200';
      res.body = response.body;
    } else {
      res.msg = response.msg;
      res.code = response.code;
    }
  }).catch((err) => {
    res.msg = '连接客户端工具失败！';
  });
  return res;
}

// 关单下载环境检测接口
khdgjUtil.gdhjjc = async (params: any) => {
  const res = { msg: '', code: '400', body: {} };
  const userInfo = myUtil.sessionStore.getItem('userInfo');
  const hgqyDm = userInfo?.qxQys[0]?.hgqyDm;
  params['hgqydm'] = hgqyDm;
  await request(url + `khdgjservices/bgd/gdhjjc`, { method: 'POST', data: params }).then((response) => {
    if (response.code === '200') {
      res.code = '200';
      res.body = response.body;
    } else {
      res.msg = response.msg;
      res.code = response.code;
    }
  }).catch((err) => {
    res.msg = '连接客户端工具失败！';
  });
  return res;
}

// 调用关票通下载关单接口
khdgjUtil.gptDownload = async (params: any) => {
  const res = { msg: '', code: '300', body: {} };
  await request(url + `khdgjservices/gpt/download`, { method: 'POST', data: params }).then((response) => {
    if (response.code === '200') {
      res.code = '200';
      res.body = response.body;
    } else {
      res.msg = response.msg;
      res.code = response.code;
    }
  }).catch((err) => {
    res.msg = '连接客户端工具失败！';
  });
  return res;
}



// 2.1.8 查询客户端工具版本号（客户端提供）
khdgjUtil.khdgjxx = async (params: any) => {
  const res = { msg: '', code: '300', body: {} };
  await request(url + `khdgjservices/gt/khdgjxx`, { method: 'POST', data: params }).then((response) => {
    if (response.code === '200') {
      res.code = '200';
      res.body = response.body;
    } else {
      res.msg = response.msg;
      res.code = response.code;
    }
  }).catch((err) => {
    res.msg = '连接客户端工具失败！';
  });
  return res;
}


//  2.1.7 网络环境检测接口
khdgjUtil.gtwlhjjc = async (params: any) => {
  const res = { msg: '', code: '300', body: {} };
  await request(url + `khdgjservices/gt/wlhjjc`, { method: 'POST', data: params }).then((response) => {
    if (response.code === '200') {
      res.code = '200';
      res.body = response.body;
    } else {
      res.msg = response.msg;
      res.code = response.code;
    }
  }).catch((err) => {
    res.msg = '连接客户端工具失败！';
  });
  return res;
}

// YBT 卡登录
khdgjUtil.ybtLogin = async (params: any) => {
  let msg = '登录成功失败';
  let code = '900';
  let body: any = [];
  await request(url + `khdgjservices/ybt/login`, { method: 'POST', data: params, errorHandler }).then((response) => {
    if (response.code === '200') {
      code = '200'
      msg = '登录成功！';
    } else {
      code = '300'
      msg = response.msg;
    }
  }).catch((err) => {
    msg = '连接客户端工具失败！';
    code = '900'
  });
  let rt = { "msg": msg, 'code': code, 'body': body };
  return rt;
}

// 客户端工具关单XML下载
khdgjUtil.khdgjGdxzxml = async (params: any) => {
  const res = { msg: '', code: '300' };
  await request(url + `khdgjservices/bgd/gdxzxml`, { method: 'POST', data: params, errorHandler }).then((response) => {
    if (response.code === '200') {
      res.code = '200'
    } else {
      res.msg = response.msg;
      res.code = response.code;
    }
  }).catch((err) => {
    res.msg = '连接客户端工具失败！';
  });
  return res;
}

// 客户端工具关单XML下载 取消执行
khdgjUtil.gdhdrwqxzx = async (params: any) => {
  const res = { msg: '', code: '300' };
  await request(url + `khdgjservices/bgd/shutDownXmlTask`, { method: 'POST', data: params, errorHandler }).then((response) => {
    if (response.code === '200') {
      res.code = '200'
    } else {
      res.msg = response.msg;
      res.code = response.code;
    }
  }).catch((err) => {
    res.msg = '连接客户端工具失败！';
  });
  return res;
}

export default khdgjUtil;
