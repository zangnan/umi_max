import { history } from 'umi';

const cjpzUtil: any = {};



//表单采集
cjpzUtil.bdcj = {

  formatExkey(export_key3: any, export_key2: any, export_key1: any, export_key: any, unit_key: any) {
    debugger;
    const routePathname = history?.location?.pathname;
    if (routePathname.indexOf('SBMXCX') > -1 || routePathname.indexOf('/27/2705') > -1
      || routePathname.indexOf('/26/2605') > -1 || routePathname.indexOf('/25/2505') > -1) {
      //申报明细查询
      if (export_key3) {
        return export_key3;
      }
    } else if (routePathname.indexOf('CXTJ_') > -1) {
      //统计
      if (export_key2) {
        return export_key2;
      }
    } else {
      //采集
      if (export_key1) {
        return export_key1;
      }
    }
    return export_key || unit_key + '_EXCEL';
  },



  //切分unit_util
  formatConfig(config: any, key: any) {
    if (config.export_key1 || config.export_key2 || config.export_key3) {
      // 配置项：工具栏
      config.toolbar_default = {
        add: false, // 是否显示增加按钮，默认关闭
        edit: false, // 是否显示修改按钮，默认关闭
        delete: false, // 是否显示删除按钮，默认关闭
        setting: true, // 是否显示设置按钮，默认关闭
        reload: true, // 是否显示刷新按钮，默认关闭
        full: true, // 是否显示全屏按钮，默认关闭
        ckts_download: false, // 是否显示导出按钮，默认关闭
        upload: false,  // 是否显示导入按钮，默认关闭
        ckts_sum: false, // 是否显示小计按钮，默认关闭
        tssb_download: true,
      };
    }
    return {
      config
    }
  },




  // 将原格式改变为新格式
  formatApiParam(url: string, options: any) {
    if (url?.indexOf('v1/hx/ty/crud/queryPager') > -1) {
      if (options?.data.key?.indexOf('MDT_ZXSB_SB_MDT_TSSB') > -1 ||
        options?.data.key?.indexOf('MDT_ZXSB_SB_MDT_TSJH') > -1 ||
        options?.data.key?.indexOf('TSZL_ZXSB_SB_HGSPTZ') > -1 ||
        options?.data.key?.indexOf('TSZL_ZXSB_SB_CKSH') > -1 ||
        options?.data.key?.indexOf('TSZL_ZXSB_SB_MDT_CYSM') > -1 ||
        options?.data.key?.indexOf('MDT_ZXSB_SB_MDT_STZC') > -1 ||
        options?.data.key?.indexOf('MDT_ZXSB_SB_MDT_YFSJ') > -1 ||
        options?.data.key?.indexOf('MDT_ZXSB_SB_MDT_SYYK') > -1 ||
        options?.data.key?.indexOf('MTS_ZXSB_SB_MTS_TSSB') > -1 ||
        options?.data.key?.indexOf('MTS_ZXSB_SB_MTS_TSJH') > -1 ||
        options?.data.key?.indexOf('MTS_ZXSB_SB_MTS_TZSB') > -1 ||
        options?.data.key?.indexOf('DBTS_ZXSB_SB_DB_TSSB') > -1 ||
        options?.data.key?.indexOf('QTYW_ZXSB_SB_CKXXCX') > -1 ||
        options?.data.key?.indexOf('ZMKJ_ZXSB_ZM_TYYBSWTS') > -1 ||
        options?.data.key?.indexOf('ZMKJ_ZXSB_ZM_DLCK') > -1 || 
        options?.data.key?.indexOf('MTS_ZXSB_SB_MTS_YSFWCK') > -1 ||
        options?.data.key?.indexOf('QTYW_ZXSB_TY_KJDSHWC_HSTZ') > -1 ||
        options?.data.key?.indexOf('QTYW_ZXSB_TY_KJDSHWC_HSSB') > -1 ) {
        options.data.key = options?.data.key + '_CX';
      }
    }
    return {
      options,
      url
    }
  },

}
export default cjpzUtil;

