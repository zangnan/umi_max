import { message } from "antd";
import { getOneTimeToken, downloadGet, downloadUrlPost,downloadUrlList } from '@/services/hts/api';
import myUtil from '@/pages/common/myUtil';
import { history } from 'umi';

const cktsUtil: any = {};

/**
 * @desc 判断当前模块属于哪个业务
 * @param key 申报业务Key
 * @param type 校验类型
 *        SJZJ: 判断是否有数据自检功能
 *        SQRQ: 判断是否显示申请日期【若返回true，屏蔽所属期和申报批次】
 *        SBPC: 判断是否显示申报批次
 *        BBDY: 判断是否有报表打印功能
 * @param arr [可选] 模块集合
 * @returns 返回布尔值 true包含，false 不包含
 */
cktsUtil.moduleType = (key: any, type: any) => {
  /** 无数据自检流程的业务key前缀
   * 【所有备案业务；证明内:中标证明、补办证明、作废退（免）税有关证明;//20200713委托出口证明ZMKJ_WTCK增加自检
   * 其他业务中：信息查询、非需提供收汇资料、外贸管理类别评定、生产管理类别评定，管理类别复评，企业撤回申报、进货凭证信息回退
   * 进料加工所有业务（：计划分配率备案、计划分配率变更）JLJG_JHFP（BA/BG） 20210407 计划分配率核销增加数据自检】
   * 待确认业务：企业撤回申报
   * */
  const noSjzjArr = ['ZGBA_', 'ZMKJ_BBCKTSZM', 'QTYW_CKXXCX', 'QTYW_BNSHSB', 'QTYW_WMYLQYPD', 'QTYW_CKXXCX', 'QTYW_FLGLFP', 'JLJG_JHFP', 'QTYW_QYCHSB', 'ZMKJ_CKZMZFQD', 'QTYW_SCYLQYPD', 'QTYW_JHPZXXHT'];
  /**
   * 需将所属期、申报批次替换为申请日期的业务key前缀
   */
  const sqrqArr = ['ZGBA_BA', 'ZGBA_BABG', 'ZGBA_BACH', 'ZGBA_JTGSBA', 'ZGBA_CKTSYWTX', 'ZGBA_WMZHFWDBTS', 'ZGBA_SCQYWTDBTS', 'ZGBA_XTHHSQ', 'ZGBA_FQMSQSM', 'ZGBA_FQLSLSM', 'ZGBA_FQTMSSM', 'ZGBA_HFTMSZC', 'ZGBA_ZXSB'];
  /**
   * 需屏蔽申报批次的业务key前缀
   * 免抵退业务，进料加工业务
   */
  const noSbpcArr = ['MDT', 'JLJG_', 'QTYW_SCYLQYPD', 'QTYW_WMYLQYPD', 'QTYW_FLGLFP', 'ZGBA_BMDLCKBA', 'ZBYW_FZCSB', 'ZBYW_GJSB', 'ZBYW_YSSB', 'ZBYW_HTSB', 'TSZL_ZXSB_SB_HGSPTZ_F', 'TSZL_ZXSB_SB_CKSH_F', 'TSZL_ZXSB_SB_BNSH_F', 'ZBYW_ZXSB_SB_GJ_SBMX_F', 'ZBYW_ZXSB_SB_HT_SBMX_F', 'ZBYW_ZXSB_SB_YS_SBMX_F', 'ZBYW_ZXSB_SB_FZC_SBMX_F', 'QTYW_ZXSB_QT_QYGLLBFPPD_F', 'QTYW_ZXSB_QT_QYNBFKTXJS_F', 'ZMKJ_ZXSB_ZM_CKJYMSHXSB_F'];
  /**
   * 生产企业需屏蔽申报批次的业务key前缀
   * 所有其他业务
   */
  const scqyNoSbpcArr = ['QTYW_'];
  /**
   * 没有报表打印功能的业务key前缀
   * 分类管理复评（暂无表样），备案撤回（暂无表样）
   */
  const noBbdyArr: any[] = [];
  /**
   * 导出ZIP格式的
   */
  const excelZipExportPostArr = ['ZGBA_FQTMSSM', 'QTYW_SCYLQYPD','QTYW_WMYLQYPD', 'JLJG_MDTHX', 'ZGBA_BACH', 'ZBYW_FZCSB', 'ZBYW_YSSB', 'MDT', 'DBTS', 'MTS', 'ZMKJ_ZBZM'];
  // 判断是否有数据自检功能
  if (type === 'SJZJ') {
    // 循环noSjzjArr，检查key中是否包含noSjzjArr[i]值，若包含return false，for循环结束return true
    for (let i = 0; i < noSjzjArr.length; i += 1) {
      if (key.indexOf(noSjzjArr[i]) !== -1) { // 不等于-1 是包含
        return false;
      }
    }
    return true;
  }
  // 判断是否显示申请日期
  if (type === 'SQRQ') {
    // 循环sqrqArr，检查key中是否包含sqrqArr[i]值，若包含return true，for循环结束return false
    for (let j = 0; j < sqrqArr.length; j += 1) {
      if (key?.indexOf(sqrqArr[j]) !== -1) { // 不等于-1 key中包含sqrqArr[j]的值
        return true;
      }
    }
    return false;
  }
  // 判断是否显示申报批次
  if (type === 'SBPC') {
    // 进货凭证信息回退申请，企业撤回申报，业务特殊暂时写死
    // 进料加工核销 增加申报批次
    if (key === 'QTYW_JHPZXXHT' || key === 'QTYW_QYCHSB' || key === 'QTYW_CKXXCX' || key === 'JLJG_MDTHX' || key === 'QTYW_HWCHS') {
      return true;
    }
    // 1、循环noSbpcArr，检查key中是否包含noSbpcArr[i]值，若包含return false
    for (let k = 0; k < noSbpcArr.length; k += 1) {
      if (key.indexOf(noSbpcArr[k]) !== -1) { // ！== -1 包含
        return false;
      }
    }
    // 获取企业类型(WM:外贸，SC:生产，QT:其他)
    const qylx = myUtil.sys.enterpriseType();
    // 2、取企业类型，若不为SC，ruturn ture；否则走下面代码
    if (qylx !== 'SC') {
      return true;
    }
    // 3、循环scqyNoSbpcArr，检查key中是否包含scqyNoSbpcArr[i]值，若包含return false，for循环结束return true
    for (let m = 0; m < scqyNoSbpcArr.length; m += 1) {
      if (key.indexOf(scqyNoSbpcArr[m]) !== -1) { // 包含
        return false;
      }
    }
    return true;
  }
  // 判断是否显示“报表打印”按钮
  if (type === 'BBDY') {
    // 1、循环noBbdyArr，检查key中是否包含noBbdyArr[i]值，若包含return false,否则返回 true；
    for (let n = 0; n < noBbdyArr.length; n += 1) {
      if (key.indexOf(noBbdyArr[n]) !== -1) { // 包含
        return false;
      }
    }
    return true;
  }
  // 判断是否显示显示出zip格式
  if (type === 'ZIP') {
    for (let n = 0; n < excelZipExportPostArr.length; n += 1) {
      // 由包含改为直等关系，否则会出现ZGBA_SCQYWTDBTS和DBTS冲突的情况 by jiangyg 20200603
      if (key === excelZipExportPostArr[n]) { // 包含
        return true;
      }
    }
    return false;
  }
  // 单一窗口 数据自检按钮  证明申报、购进、核销 隐藏
  if (type === 'dyck_sjzj') {
    if(key.indexOf('ZMKJ_') > -1 || key.indexOf('ZBYW_') > -1 ||key.indexOf('JLJG_') > -1) {
      return true;
    }
    return false;
  }
  // 单一窗口 证明申请(正式申报)按钮 证明申报、购进 隐藏证明申请按钮,  其他业务、资格备案隐藏正式申报按钮
  if(type === 'dyck_zmsq') {
    if(key.indexOf('ZMKJ_') > -1 || key.indexOf('ZBYW_') > -1 || key.indexOf('QTYW_') > -1 || key.indexOf('ZGBA_') > -1) {
      return true;
    }
    return false;
  }

  // 单一窗口 刷新按钮  证明申报、其他业务、资格备案、购进、核销 隐藏,
  if(type === 'dyck_sx') {
    if(key.indexOf('ZMKJ_') > -1 || key.indexOf('QTYW_') > -1 || key.indexOf('ZGBA_') > -1 || key.indexOf('ZBYW_') > -1 || key.indexOf('JLJG_') > -1) {
      return true;
    }
    return false;
  }

  // 单一窗口 下载申报文件按钮  证明申报、其他业务、资格备案、购进、核销 显示,
  if(type === 'dyck_xzsbwj') {
    if(key.indexOf('ZMKJ_') > -1 || key.indexOf('QTYW_') > -1 || key.indexOf('ZGBA_') > -1 || key.indexOf('ZBYW_') > -1 || key.indexOf('JLJG_') > -1) {
      return true;
    }
    return false;
  }

  // 单一窗口 反馈读入按钮  证明申报、其他业务、资格备案、购进、核销 显示,
  if(type === 'dyck_fkdr') {
    if(key.indexOf('ZMKJ_') > -1 || key.indexOf('QTYW_') > -1 || key.indexOf('ZGBA_') > -1 || key.indexOf('ZBYW_') > -1 || key.indexOf('JLJG_') > -1) {
      //补办证明、一类企业评定(SBMXCX_0801010301)、分类管理复评(/SBMXCX_0801020201)、企业撤回(SBMXCX_08040201生产、SBMXCX_08050201外贸)、备案变更(SBMXCX_0701010201)、边贸代码，这结果业务没有反馈，反馈读入按钮屏蔽掉
       if(history.location.pathname.indexOf('/SBMXCX_0801010201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_0801020201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_05090201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_08040201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_0701010201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_07050201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_0801010301')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_08050201')>-1 ||
          history.location.pathname.indexOf('/SBMXCX_08060201')>-1
       ){
        return false;
      }
      return true;
    }
    return false;
  }



}

// pdf预览，支持单个或多个PDF
cktsUtil.popupPdfFile = (urlOrList: any, params?: any) => {
  const openSingle = (url: string, ps: any) => {
    getOneTimeToken({}).then((response1) => {
      if (response1.code === '200') {
        return downloadGet(ps, url, response1.body);
      }
      message.error(response1.desc);
      throw new Error(response1.desc);
    }).then((response2) => {
      const blob = new Blob([response2.data], { type: 'application/pdf' });
      const { headers } = response2.response;
      const contentDisposition = headers.get('Content-Disposition');
      let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'downloadFile';
      fileName = decodeURI(fileName);
      const src = cktsUtil.getPdfLj();
      window.open(`${src}?file=${URL.createObjectURL(blob)}&name=${fileName}`);
    })
  };

  const openMulti = (items: any[]) => {
    const key = `pdf_multi_${Date.now()}_${Math.random()}`;
    const list = items.map((it: any) => {
      const u = it?.url || it?.wjlj || it;
      const ps = { ...(it?.params || it?.config || params) };
      const wjlj = it.wjlj;
      ps.wjlj = wjlj
      let fileName = it?.name || it?.wjm || 'downloadFile';
      fileName = decodeURI(fileName);
      return { url: u, params: ps, name: fileName };
    });
    try {
      sessionStorage.setItem(key, JSON.stringify(list));
    } catch (e) {
      message.error('PDF列表数据存储失败');
      return;
    }
    const src = cktsUtil.getStaticLink('/pdfjs/web/multi.html');
    const child = window.open(`${src}?key=${encodeURIComponent(key)}`);
    const handler = (ev: any) => {
      const data = ev?.data || {};
      if (!data || data.type !== 'pdf_multi_request') return;
      if (data.key !== key) return;
      const idx = Number(data.index);
      const it = list[idx];
      if (!it) return;
      getOneTimeToken({}).then((response1) => {
        if (response1.code === '200') {
          return downloadGet(it.params, it.url, response1.body);
        }
        message.error(response1.desc);
        throw new Error(response1.desc);
      }).then((response2) => {
        const blob = new Blob([response2.data], { type: 'application/pdf' });
        const objectUrl = URL.createObjectURL(blob);
        const { headers } = response2.response;
        const contentDisposition = headers.get('Content-Disposition');
        let fileName = it?.name || (contentDisposition ? decodeURI(contentDisposition.split('filename=')[1]) : 'downloadFile');
        const target = ev.source || child;
        if (target) {
          target.postMessage({ type: 'pdf_multi_response', key, index: idx, file: objectUrl, name: fileName }, '*');
        }
      }).catch((err) => {
        const target = ev.source || child;
        if (target) {
          target.postMessage({ type: 'pdf_multi_error', key, index: idx, message: err?.message || '下载失败' }, '*');
        }
      });
    };
    window.addEventListener('message', handler, false);
    const timer = setInterval(() => {
      if (child && child.closed) {
        window.removeEventListener('message', handler, false);
        clearInterval(timer);
      }
    }, 1000);
  };

  if(params?.plyl!='Y'){
    openSingle(urlOrList as string, params);
    return;
  }

  getOneTimeToken({}).then((response1) => {
    if (response1.code === '200') {
        return downloadUrlList(params, urlOrList, response1.body);
      }
      message.error(response1.desc);
      throw new Error(response1.desc);
    }).then((response2) => {
      if(response2.data.code === '200'){
        const item =  response2.data.body || [];
        const wjljs: any = [];
        item.forEach((temp: any) => {
          wjljs.push({ url: `/hx/ty/report/jzPdfToPath/EXCEL_REPORT_${params.ywKey}/`, wjlj: temp })
        })
        if (Array.isArray(wjljs)) {
          if (wjljs.length === 1) {
            const it = wjljs[0];
            const u = it?.url || it?.wjlj || it;
            const ps = it?.params || it?.config || params;
            ps.wjlj = wjljs[0].wjlj;
            openSingle(u, ps);
            return;
          }
          openMulti(wjljs);
          return;
        }
      }
    })

}

// 原在线申报系统模块 导出
cktsUtil.downloadFileCkts = async (url: any, params: any) => {
  // 获取一次性token
  await getOneTimeToken({}).then(async(response1) => {
    myUtil.sessionStore.setItem('ztssDy', false)
    if (response1.code === '200') {
      return await downloadGet(params, url, response1.body);
    }
    message.error(response1.desc);
    throw new Error(response1.desc);
  }).then((response2) => {
    const type = response2?.data?.type;
    myUtil.sessionStore.setItem('ztssDy', true)
    if('application/octet-stream' == type ){
      const aLink = document.createElement('a');
      document.body.appendChild(aLink);
      aLink.style.display='none';
      const objectUrl = window.URL.createObjectURL(response2.data);
      aLink.href = objectUrl;
      const { headers } = response2.response;
      const contentDisposition = headers.get('Content-Disposition');
      let fileName = contentDisposition ? contentDisposition.split('filename=')[1] : 'downloadFile';
      fileName = decodeURI(fileName);
      aLink.download = fileName;
      aLink.click();
      document.body.removeChild(aLink);
    }else{
      var reader = new FileReader();
      reader.readAsText(response2?.data, 'utf8');
      reader.onload = function() {
       const obj =  JSON.parse(this.result);
       message.error(obj?.msg);
      }
    }
  })
}

// post 可选url 导出
cktsUtil.downloadFilePost = async (url: any, params: any) => {
  // 获取一次性token
  await downloadUrlPost(params, url).then(async(response) => {
    const { code, body, desc } = response;
    if (code === '200') {
      const { blob, fileName } = body;
      myUtil.file.downloadExcel(blob, fileName);
    } else {
      message.error(desc);
    }
  });
}

//PDF获得moduel，获取pdfjs路径
cktsUtil.getPdfLj = () => {
  let src = "";
  if(PRO_BASE && PRO_BASE != '') {
    src = `/${PRO_BASE}/pdfjs/web/viewer.html`;
    return src;
  } else {
    src = `/pdfjs/web/viewer.html`;
    return src;
  }
}

//PDF获得moduel，获取本地静态地址
cktsUtil.getStaticLink = (link: any) => {
  let src = "";
  if(PRO_BASE && PRO_BASE != '') {
    src = `/${PRO_BASE}` + link;
    return src;
  } else {
    src = link;
    return src;
  }
}

export default cktsUtil;
