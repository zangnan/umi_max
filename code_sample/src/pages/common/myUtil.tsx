import numeral from 'numeral';
import moment from 'moment';
import {Tooltip, Button, message} from 'antd';
import {
  getCode as apiGetCode,
  getZdyCode,
  getTreeCode as apiGetTreeCode,
  getUrlCode,
  sfczdlzfp,
  simulationLoginStateQueryDzswjxt,
  hqJ4RpaToken,
  queryDjdlzh,
  zzsfptzsx
} from '@/services/hts/api';
import getStaticTableCode from '@/pages/common/staticTableCode';
import { EyeOutlined } from '@ant-design/icons';
import hts_message from '@/locales/ddit/hts_message';
import type { RequestOptionsInit } from 'umi-request';
import { history, Link } from 'umi';
import pro from '@/pages/common/proConfig';
import tableStyle from "@/pages/hts/commonModule/ckhwbgd/style.less";
import DDAlert from "@/components/DDAlert";
import React from "react";

const myUtil: any = {};
const STORAGE_KEY = 'ddit';

myUtil.authority = {
  // 清空用户信息
  clearUserInfo() {
    myUtil.sessionStore.clear('userInfo');
    myUtil.sessionStore.clear('usermenu');
    myUtil.sessionStore.clear('menuArr');
    myUtil.sessionStore.clear('codeTable');
    window.localStorage.removeItem('sqyxqSytsFlag');
    window.localStorage.removeItem('sqyxqSqztDm');
    window.localStorage.removeItem('accessToken');
    window.localStorage.removeItem('accessTokenUsername');
  },
}

myUtil.shfkdr2 = {
  getshfkdr2CdDm(options: RequestOptionsInit, url: string) {
    if (url.indexOf('/yw/bszx/ggfw/ycsb/yzqfk/shfkdr2') > -1 || url.indexOf('/yw/bszx/ggfw/ycsb/yzqfk/shfkdr2Check') > -1) {
      const loarr = history.location.pathname;
      const arr = history.location.pathname.split('/'); // 将字符串 a 分割成数组
      const path = ['050101', '050102', '0503', '0504', '0505', '0506', '0507', '0508', '0802', '0803', '0405', '0303', '2606', '2506', '2706'];
      if (loarr.indexOf('/sbsjcx/JLJG_MDTHX') > -1) {
        options.data.append('cdDm', '1106');
        return options;
      }
      for (let i = 0; i < path.length; i++) {
        for (let j = 0; j < arr.length; j++) {
          if (arr[j] == path[i]) {
            options.data.append('cdDm', path[i]);
          }
        }
      }
    }
    return options;
  },
  dzswjdlzt(url: string) {
    if (
      url.indexOf('/ycsb/sjzj/ycsbSjzjSq') > -1 ||
      url.indexOf('/ycsb/sjzj/ycsbSjzjztCx') > -1 ||
      url.indexOf('/ycsb/sjzj/ycsbSjzjfkXz') > -1 ||
      url.indexOf('/ycsb/zssb/ycsbZssb') > -1 ||
      url.indexOf('/ycsb/zssb/ycsbZssbztCx') > -1 ||
      // url.indexOf('/khdgj/bgd/sqxz') > -1 ||
      // url.indexOf('/khdgj/bgd/sjxzCxxz') > -1 ||
      url.indexOf('/ycsb/yzqfk/ycsbYzfFkxzSq') > -1 ||
      url.indexOf('/ycsb/yzqfk/ycsbYzfFkxzsqztCx') > -1 ||
      url.indexOf('/ycsb/yzqfk/ycsbYzfFksjjs') > -1 ||
      url.indexOf('/ycsb/yzqfk/ycsbRzfpFkxzSq') > -1 ||
      url.indexOf('/ycsb/yzqfk/ycsbRzfpFksjjs') > -1 ||
      url.indexOf('/ycsb/yzqfk/ycsbRzfpjgCx') > -1 ||
      url.indexOf('/yw/saas/gzt/gztTsjdCxMx') > -1 ||
      url.indexOf('/yw/bszx/wbsj/bgd/updateBgdCzbz') > -1 ||
      url.indexOf('/yw/saas/yzfpt/yzfPtFpxxCx') > -1 ||
      url.indexOf('/yw/saas/yzfpt/yzfPtDlzmSq') > -1 ||
      url.indexOf('/yw/saas/yzfpt/ycsbsjxz') > -1 ||
      url.indexOf('/yw/saas/yzfpt/rwjdsx') > -1 ||
      url.indexOf('/yw/saas/yzfpt/yzfPtDlzmCx') > -1 ||
      url.indexOf('/yw/saas/yzfpt/yzfPtDzfpSq') > -1 ||
      url.indexOf('/yw/saas/yzfpt/yzfPtDzfpCx') > -1 ||
      url.indexOf('/yw/bszx/mdt/hwlw/tssb/queryWsxzSj') > -1 ||
      url.indexOf('/mdt/hwlw/tssb/wsxz') > -1 ||
      url.indexOf('/flzlgl/queryBzmxbInfo') > -1 ||
      url.indexOf('flzlgl/queryFlzlJcInfo') > -1 ||
      url.indexOf('flzlgl/queryFlzlInfo') > -1 ||
      url.indexOf('ggfw/flzlgl/uploadFlzl') > -1 ||
      url.indexOf('/ggfw/flzlgl/deleteFlzl') > -1 ||
      url.indexOf('/flzlgl/downLoadFlzl') > -1 ||
      url.indexOf('/yw/bszx/wbsj/bgd/gxBgdCzbzSx') > -1 ||
      url.indexOf('/yw/bszx/wbsj/bgd/gxBgdCzbzCxzx') > -1 ||
      url.indexOf('/ggfw/flzlgl/flzlQr') > -1 ||
      url.indexOf('/yw/saas/sjgl/shsjzr/startDownload') > -1 ||
      url.indexOf('/yw/saas/sjgl/shsjzr/reDownload') > -1 ||
      url.indexOf('/yw/saas/sjgl/shsjzr/startDownload7MainInfoFp') > -1 ||
      // 退税审核进度查询
      url.indexOf('/yw/bszx/ggfw/shjgcx/getJ4TsshjdInfo') > -1 ||
      url.indexOf('/ggfw/flzlgl/flzlQr') > -1
    ) {
      return true;
    } else {
      return false;
    }
  },
  async getdzswjdlzt(url: string) {
    const result2 = await queryDjdlzh({});
    const prame = {};
    if (result2.code == '200') {
      prame.yhm = result2.body?.yhm;
    }
    const result1 = await hqJ4RpaToken(prame);
    const result = await simulationLoginStateQueryDzswjxt({}, result1?.body?.token);
    if (result?.code != '200') {
      return false;
    } else {
      return result?.body?.active;
    }
  },
  async getJ4RpaToken() {
    const result2 = await queryDjdlzh({});
    const prame = {};
    if (result2.code == '200') {
      prame.yhm = result2.body?.yhm;
    }
    return await hqJ4RpaToken(prame);
  },
  async getdzswjdlztNew(token: string) {
    return await simulationLoginStateQueryDzswjxt({}, token);
  },

}
myUtil.fileName = {
  // 获取文件名
  getFileName(flieName: any) {
    return flieName.substring(0, flieName.lastIndexOf("."))
  },
  // 获取 .后缀名
  getExtension(flieName: any) {
    return flieName.substring(flieName.lastIndexOf("."))
  }
}

// 系统及权限
myUtil.sys = {
  // 从用户全量信息中获取用户企业类型
  // SC 生产  WM 外贸  QT 其他
  enterpriseType: function () {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    let type = userInfo?.qxQys[0]?.cktsqylxDm;
    return type;
  },
  // 关票通、单一窗口
  bgdsjlyType: function () {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    let type = userInfo?.qxQys[0]?.bgdsjlyDm;
    return type;
  }
}

// 菜单
myUtil.menu = {
  // 根据名称取当前节点菜单
  getMenuObjByName: (id: any) => {
    if (!id) {
      return;
    }
    let targetMenuObj;
    const usermenu = myUtil.sessionStore.getItem('usermenu') || [];
    const foreachData = (menuTreeParam: any) => {
      if (!menuTreeParam || menuTreeParam.lenght === 0) {
        return;
      }
      for (let i = 0; i < menuTreeParam.length; i++) {
        if (menuTreeParam[i].id == id) {
          targetMenuObj = menuTreeParam[i];
          break;
        } else {
          if (menuTreeParam[i].routes && menuTreeParam[i].routes.length > 0) {
            foreachData(menuTreeParam[i].routes);
          }
        }
      }
    }
    foreachData(usermenu);
    return targetMenuObj;
  },
  // 根据路径取当前节点菜单
  getMenuObjByPath: (path: any) => {
    if (!path) {
      return;
    }
    let targetMenuObj;
    const usermenu = myUtil.sessionStore.getItem('usermenu') || [];
    const foreachData = (menuTreeParam: any) => {
      if (!menuTreeParam || menuTreeParam.lenght === 0) {
        return;
      }
      for (let i = 0; i < menuTreeParam.length; i++) {
        if (menuTreeParam[i].path == path) {
          targetMenuObj = menuTreeParam[i];
          break;
        } else {
          if (menuTreeParam[i].routes && menuTreeParam[i].routes.length > 0) {
            foreachData(menuTreeParam[i].routes);
          }
        }
      }
    }
    foreachData(usermenu);
    return targetMenuObj;
  },
  // 根据id当前节点菜单
  getMenuObjById: (id: any) => {
    if (!id) {
      return;
    }
    let targetMenuObj;
    const usermenu = myUtil.sessionStore.getItem('usermenu') || [];
    const foreachData = (menuTreeParam: any) => {
      if (!menuTreeParam || menuTreeParam.lenght === 0) {
        return;
      }
      for (let i = 0; i < menuTreeParam.length; i++) {
        if (menuTreeParam[i].id == id) {
          targetMenuObj = menuTreeParam[i];
          break;
        } else {
          if (menuTreeParam[i].routes && menuTreeParam[i].routes.length > 0) {
            foreachData(menuTreeParam[i].routes);
          }
        }
      }
    }
    foreachData(usermenu);
    return targetMenuObj;
  },
  // 获取菜单信息
  getMenuArr: function () {
    let menuArr: any = myUtil.sessionStore.getItem('menuArr');
    if (!menuArr) {
      menuArr = [];
      const setMenu = function (arr: any) {
        for (let i = 0; i < arr.length; i++) {
          menuArr.push({
            ...arr[i],
          });
          if (arr[i].routes && arr[i].routes.length > 0) {
            setMenu(arr[i].routes);
          }
        }
      };
      const menutree = myUtil.sessionStore.getItem('usermenu') || [];
      setMenu(menutree);
      myUtil.sessionStore.setItem('menuArr', menuArr);
    }
    return menuArr;
  },
  // 根据企业类型过滤菜单
  filterMenu: function (menuTree: any, type: any) {
    if (!type) {
      return null;
    }
    const setMenu = function (arr: any[]) {
      for (let i = arr.length - 1; i >= 0; i--) {
        if (arr[i].busiType && arr[i].busiType.toLowerCase().indexOf(type.toLowerCase()) < 0) {
          arr.splice(i, 1);
          continue;
        }
        if (arr[i].routes && arr[i].routes.length > 0) {
          setMenu(arr[i].routes);
        }
      }
    };
    setMenu(menuTree);
    return menuTree;
  },
}

// 列表组件
myUtil.grid = {
  formatDate(date: any, format: any) {
    if (date) {
      if (date?.constructor === String) {
        if (date.length != 13) {
          return date;
        } else {
          return myUtil.date.formatDate(Number(date), format);
        }
      } else {
        return myUtil.date.formatDate(date, format);
      }
    }
    return '';
  },
  formatNum(value: any, format: any) {
    const val = myUtil.text.formatNum(value, format);
    return val;
  },
  // renderExampleYhzh
  formatBankNo(param: any) {
    let { text } = param;
    if (!text || text.length < 16) {
      return '****';
    }
    text = text + '';
    // 1.处理银行卡位数，截取16位和19位银行的后16位数字
    let bankNum = text.substring(text.length - 16, text.length);
    // 2.实现前12位* 后四位为正常数字
    let tmp = new Array(13).join('*') + bankNum.slice(12);
    // 3.实现每四位加空格
    let str = tmp.replace(/\s/g, '').replace(/(.{4})/g, "$1 ");
    return <Button type="link" onClick={(event: any) => { event.stopPropagation(); }}>
      <Tooltip title={text} trigger='click'>{str}<EyeOutlined /></Tooltip>
    </Button>;
  },
  // renderExampleYhzh
  formatStar(param: any) {
    let { text } = param;
    return <Button type="link" onClick={(event: any) => { event.stopPropagation(); }}>
      <Tooltip title={text} trigger='click'>******** <EyeOutlined /></Tooltip>
    </Button>;
  }
}

// 文本处理
myUtil.text = {
  /**
   * @method formatNum
   * @desc 基于Numeral.js 处理数字
   * @param value 要格式化的数字值
   * @param format 格式
   */
  formatNum(value: any, format: any) {
    if (format) {
      const number = numeral(value);
      let string;
      let numberVal = numeral(number).value();
      if (numberVal < 0) {
        // 负数
        numberVal *= -1;
        string = `-${numeral(numberVal).format(format)}`;
      } else {
        // 正数
        string = number.format(format);
      }
      return string;
    }
    return value;
  },

  /**
   * @method getNumVal
   * @desc 基于Numeral.js 获取数值
   * @param value 要处理的数值
   *
   */
  getNumVal: function (value: any) {
    return numeral(value).value() == null ? '' : numeral(value).value();
  },

  formatUp(value: any) {
    const cnNums = new Array("零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"); //汉字的数字
    const cnIntRadice = new Array("", "拾", "佰", "仟"); //基本单位
    const cnIntUnits = new Array("", "万", "亿", "兆"); //对应整数部分扩展单位
    const cnDecUnits = new Array("角", "分", "毫", "厘"); //对应小数部分单位
    const cnInteger = "整"; //整数金额时后面跟的字符
    const cnIntLast = "元"; //整型完以后的单位
    const maxNum = 999999999999999.9999; //最大处理的数字
    let IntegerNum; //金额整数部分
    let DecimalNum; //金额小数部分
    let ChineseStr = ""; //输出的中文金额字符串
    let parts; //分离金额后用的数组，预定义
    let Symbol = "";//正负值标记
    if (value == "") {
      return "";
    }
    let value2: any = parseFloat(value);
    if (value2 >= maxNum) {
      alert('超出最大处理数字');
      return "";
    }
    if (value2 == 0) {
      ChineseStr = cnNums[0] + cnIntLast + cnInteger;
      return ChineseStr;
    }
    if (value2 < 0) {
      value2 = -value2;
      Symbol = "负 ";
    }
    value2 = value2.toString(); //转换为字符串
    if (value2.indexOf(".") == -1) {
      IntegerNum = value2;
      DecimalNum = '';
    } else {
      parts = value2.split(".");
      IntegerNum = parts[0];
      DecimalNum = parts[1].substr(0, 4);
    }
    if (parseInt(IntegerNum, 10) > 0) { //获取整型部分转换
      let zeroCount = 0;
      const IntLen = IntegerNum.length;
      for (let i = 0; i < IntLen; i++) {
        const n = IntegerNum.substr(i, 1);
        const p = IntLen - i - 1;
        const q = p / 4;
        const m = p % 4;
        if (n == "0") {
          zeroCount++;
        } else {
          if (zeroCount > 0) {
            ChineseStr += cnNums[0];
          }
          zeroCount = 0; //归零
          ChineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
        }
        if (m == 0 && zeroCount < 4) {
          ChineseStr += cnIntUnits[q];
        }
      }
      ChineseStr += cnIntLast;
      //整型部分处理完毕
    }
    if (DecimalNum != '') { //小数部分
      const decLen = DecimalNum.length;
      for (let i = 0; i < decLen; i++) {
        const n = DecimalNum.substr(i, 1);
        if (n != '0') {
          ChineseStr += cnNums[Number(n)] + cnDecUnits[i];
        }
      }
    }
    if (ChineseStr == '') {
      ChineseStr += cnNums[0] + cnIntLast + cnInteger;
    } else if (DecimalNum == '') {
      ChineseStr += cnInteger;
    }
    ChineseStr = Symbol + ChineseStr;
    return ChineseStr;
  },

  /**
   * @method toChinese
   * @desc 基于Numeral.js 处理数字变汉字
   * @param value 要格式化的数字值
   * @param format 格式
   */

  toChinese(num: any) {
    // 将接收到的num转换为字符串
    var strNum = String(num)
    // 定义单位
    // var unit = ['拾', '佰', '仟', '万', '拾', '佰', '仟', '亿', '拾', '佰', '仟']
    var unit = ['十', '百', '千', '万', '十', '百', '千', '亿', '十', '百', '千']
    // 结果中放一个符号，用来解决最后的零去不掉的问题
    var result = ['@']
    // 单位下标
    var unitNo = 0
    // 从后往前遍历接收到的数据，省略结束条件
    for (let i = strNum.length - 1; ; i--) {
      // 调用转大写函数，将每一个数字转换成中文大写，一次放入一个到结果数组中
      result.unshift(numToChinese(strNum[i]))
      // 如果不大于0
      if (i <= 0) {
        // 结束循环
        break
      }
      // 放入一个数字，放入一个单位
      result.unshift(unit[unitNo])
      // 单位下标加1
      unitNo++
    }
    // 将结果数组转换成字符串，并使用正则替换一些关键位置，让结果符合语法
    // return result.join('').replace(/(零[仟佰拾]){1,3}/g, '零').replace(/零{2,}/g, '零').replace(/零([万亿])/g, '$1').replace(/亿万/g, '亿').replace(/零*@/g, '')
    const resNumber = result.join('').replace(/(零[千百十]){1,3}/g, '零').replace(/零{2,}/g, '零').replace(/零([万亿])/g, '$1').replace(/亿万/g, '亿').replace(/零*@/g, '');
    if (resNumber.length == 2 && resNumber.substring(0, 1) === '一' || resNumber.length == 3 && resNumber.substring(0, 1) === '一') {
      return resNumber.substring(1, resNumber.length);
    } else {
      return resNumber;
    }

    function numToChinese(n: any) {
      // var chineseBigNum = '零壹贰叁肆伍陆柒捌玖'
      var chineseBigNum = '零一二三四五六七八九'
      return chineseBigNum[n]
    }
  },


  /**
   * @method leadingZeroize
   * @desc 补0并截取字符
   * @param val 需要转换的字符串
   * @param digit 补0并截取的长度
   * @returns 转换后字符串
   */
  leadingZeroize(value: any, digit: any) {
    return (Array(digit).join('0') + value).slice(-digit);
  },

  /**
 * @method toUpper
 * @desc 字符转大写
 * @param val 需要转换的字符串
 * @returns 转换后字符串
 */
  toUpper(value: any) {
    return value.toUpperCase();
  },

  /**
   * @method toUpper
   * @desc 字符转小写
   * @param val 需要转换的字符串
   * @returns 转换后字符串
   */
  toLower(value: any) {
    return value.toLowerCase();
  },

  /**
   * @method arrayToStr
   * @desc 数组转字符串
   * @param val 需要转换的字符串
   * @returns 转换后字符串
   */
  arrayToStr(value: any = []) {
    let reVal = '';
    value.forEach((item: any) => {
      reVal += item + ';';
    });
    return reVal;
  },

  /**
   * @method uuid
   * @desc 生产uuid
   */
  uuid(len: any, radix: any) {
    let i: any, r: any;
    const chars: any = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
    const uuid: any = [];
    i = void 0;
    const radixTmp: any = radix || chars.length;
    if (len) {
      i = 0;
      while (i < len) {
        uuid[i] = chars[0 | Math.random() * radixTmp];
        i++;
      }
    } else {
      r = void 0;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      i = 0;
      while (i < 36) {
        if (!uuid[i]) {
          r = 0 | Math.random() * 16;
          uuid[i] = chars[i === 19 ? r & 0x3 | 0x8 : r];
        }
        i++;
      }
    }
    return uuid.join('');
  },
  /**
   * @method replace
   * @desc 字符窜占位符替换
   */
  formatRepalce(ss: any, obj: any) {
    let tmp = ss;
    for (let key in obj) {
      tmp = tmp.replace(new RegExp("\\{\\{" + key + "\\}\\}", "g"), obj[key]);
    }
    return tmp;
  },
  /**
   * @method formatNumRound
   * @desc 四舍五入
   * @param num 要格式化的数字值
   * @param s 四舍五入保留的位数
   */
  formatNumRound(num: any, s: any = 0) {
    let roundNum;
    if (num) {
      const m = Math.pow(10, s);
      if (num < 0) {
        roundNum = Math.round((num - Number.EPSILON) * m) / m;
      } else {
        roundNum = Math.round((num + Number.EPSILON) * m) / m;
      }
    }
    return roundNum;
  },
};

// 时间
myUtil.date = {
  // 将日期格式化成指定格式的字符串
  formatDate(date: any, format: any) {
    if (date) {
      if (date?.constructor === String) {
        return moment(new Date(Number(date))).format(format);
      } else {
        return moment(new Date(date)).format(format);
      }
    }
    return '';
  },
  // 将日期格式化成指定格式的字符串
  formatDateForString(date: any, format: any) {
    if (null == date || '' == date) {
      return '--';
    }
    return date.replaceAll('-', '/');
  },
  // 获取当前时间N年前的第一天和最后一天
  getQZDateBeforeCurr(n: any) {
    const sj = new Date();
    const year = sj.getFullYear() - n;
    const date = {
      firstDay: year + '-01-01',
      lastDay: year + '-12-31'
    };
    return date;
  },
  // 获取当前时间N月前的第一天和最后一天
  getQZDateYfBeforeCurr(n: any) {
    const sj = new Date();
    const nowMonth = sj.getMonth() + 1;
    let month = nowMonth;
    const textDay = sj.getDate() < 10 ? '0' + sj.getDate() : sj.getDate();
    const numCy = n % 12;
    const numBs = Math.floor(Number(n / 12));
    let year = sj.getFullYear() - numBs;
    if (nowMonth === n) {
      month = 12;
      year--;
    } else if (nowMonth < n) {
      month = 12 - (n - nowMonth);
      year--;
    } else {
      month = nowMonth - numCy;
    }
    const textMonth = month < 10 ? '0' + month : month;
    const newDay = myUtil.date.getMonthLastDay(year + '-' + textMonth);
    const date = {
      firstDay: year + '-' + textMonth + '-01',
      beforeDay: myUtil.date.formatData(newDay),
      nowDay: sj.getFullYear() + '-' + textMonth + '-' + textDay // 当天
    };
    return date;
  },
   getCurrentYearMonth() {
    const now = new Date();
    const year = now.getFullYear(); // 获取当前年份
    const month = String(now.getMonth() + 1).padStart(2, '0'); // 获取当前月份，注意 getMonth() 返回的是 0-11，所以需要加 1，并且确保月份是两位数
    return `${year}${month}`;
  },
  /**
   * 根据天数调整日期并返回yyyy-mm-dd格式
   * @param days 要调整的天数
   *   - 负数：往前推指定天数
   *   - 正数：往后推指定天数
   *   - 0：返回当前日期
   * @returns 返回格式化为yyyy-mm-dd的日期字符串
   * @throws 如果参数不是整数，会抛出错误
   */
  getFormattedAdjustedDate(days: number): string {
  // 参数验证
  if (!Number.isInteger(days)) {
    throw new Error('参数必须是一个整数');
  }
  // 获取调整后的日期
  const date = new Date();
  date.setDate(date.getDate() + days);
  // 格式化为yyyy-mm-dd
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
},
  // 获取当前时间前N年
  getYearBeforeCurr(n: any) {
    const sj = new Date();
    const year = sj.getFullYear() - n;
    return year;
  },
  // 获取当前时间前N年（返回日期）
  getDateBeforeCurr(n: any) {
    const sj = new Date();
    const year = sj.getFullYear() - n;
    const month = sj.getMonth() + 1;
    const date = year + '-' + month + '-01';
    return date;
  },
  // 获取当前时间前N年（返回年月日）
  getDateNYRBeforeCurr(n: any, time?: any) {
    const sj = time ? new Date(time) : new Date();
    const year = sj.getFullYear() - n;
    const month = (sj.getMonth() + 1) < 10 ? '0' + (sj.getMonth() + 1) : sj.getMonth() + 1;
    const day = sj.getDate() < 10 ? '0' + sj.getDate() : sj.getDate();
    const date = year + '-' + month + '-' + day;
    return date;
  },
  // 获取当前时间或指定时间前N年（返回年月）
  getDateNYBeforeCurr(n: any, time?: any) {
    const sj = time ? new Date(time) : new Date();
    const year = sj.getFullYear() - n;
    const month = (sj.getMonth() + 1) < 10 ? '0' + (sj.getMonth() + 1) : sj.getMonth() + 1;
    const date = year + '-' + month;
    return date;
  },
  // 获取当前时间或指定时间前N年（返回年月）格式202208
  getDateNYBeforeCurrFormat(n: any, time?: any) {
    const sj = time ? new Date(time) : new Date();
    const year = sj.getFullYear() - n;
    const month = (sj.getMonth() + 1) < 10 ? '0' + (sj.getMonth() + 1) : sj.getMonth() + 1;
    const date = String(year) + month;
    return date;
  },
  //   // 获取当前时间或指定时间前N年（返回年月）格式202208
  // getDateNYBeforeCurrFormat(n: any, time?: any) {
  //   const sj = time ? new Date(time) : new Date();
  //   const year = sj.getFullYear() - n;
  //   const month = (sj.getMonth() + 1) < 10 ? '0' + (sj.getMonth() + 1) : sj.getMonth() + 1;
  //   const date = String(year) + month;
  //   return date;
  // },
  // 获取N年前到现在月份（返回开始年月与结束年月）
  getDateYearAgoToNow(n: any) {
    // 获取当前日期前一年的日期
    const sj = new Date();
    const year = sj.getFullYear() - n;
    const month = (sj.getMonth() + 1) < 10 ? '0' + (sj.getMonth() + 1) : sj.getMonth() + 1;
    const d = new Date(year + '-' + month);
    d.setMonth(d.getMonth() + 1);
    // 转化为yyyy-MM格式（前一年）
    const time = new Date(d);
    const lastYear = time.getFullYear();
    const lastMonth = (time.getMonth() + 1) < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1;
    const lastYearMonth = lastYear + '-' + lastMonth;
    // 转化为yyyy-MM格式（当前日期）
    const nowYear = sj.getFullYear();
    const nowMonth = (sj.getMonth() + 1) < 10 ? '0' + (sj.getMonth() + 1) : sj.getMonth() + 1;
    const nowYearMonth = nowYear + '-' + nowMonth;

    return [lastYearMonth, nowYearMonth];
  },
  // 日期格式化数组
  formatList(format: any) {
    let formatList: any = [];
    if (format) {
      formatList.push(format);
    }
    formatList = formatList.concat('YYYY-MM-DD', 'YYYY-MMDD', 'YYYYMM-DD', 'YYYY/MM/DD', 'YYYY/MMDD', 'YYYYMM/DD', 'YYYYMMDD');
    return formatList;
  },
  /**
   * 获取当前月的第一天 （精确到秒）
   * 入参： 毫秒数
   * 出参：毫秒数
   * */
  getMonthFirstDay(mon: any) {
    const time = new Date(mon);
    const nowMonth = time.getMonth();
    const nowYear = time.getFullYear();
    const monthStartDate = new Date(nowYear, nowMonth, 1);
    return this.accurateDate(monthStartDate.getTime(), '1');
  },
  /**
   * 获取当前月的最后一天 （精确到秒23:59:59）
   * 入参： 毫秒数
   * 出参：毫秒数
   * */
  getMonthLastDay(mon: any) {
    const time = new Date(mon);
    const nowMonth = time.getMonth();
    const nowYear = time.getFullYear();
    const monthEndDate = new Date(nowYear, nowMonth + 1, 0);
    return this.accurateDate(monthEndDate.getTime(), '2');
  },
  /**
   * 毫秒数精确到秒
   * 当前时间（毫秒数）
   * 精确标志（1：00:00:00；2： 23:59:59）
   */
  accurateDate(date: any, bz: any) {
    const time = new Date(date);
    if (bz === '1') {
      time.setHours(0);
      time.setMinutes(0);
      time.setSeconds(0);
    } else {
      time.setHours(23);
      time.setMinutes(59);
      time.setSeconds(59);
    }
    return time.getTime();
  },
  /**
   * 判断日期是否在几个月得范围内 (format的日期串 YYYY-MM-DD 或YYYY-MM-DD Hi:mm:ss)
   * 入参： mons:比较的月数；rqQ: 开始日期；rqZ: 结束日期。
   * 返回true or false
   */
  compareTime(mons: any, stTime: any, endTime: any) {
    const st = new Date(stTime);
    const et = new Date(endTime);
    let stNmon = new Date(st);
    stNmon.setMonth(stNmon.getMonth() + mons);
    if (et.getTime() <= stNmon.getTime()) {
      return true;
    }
    return false;
  },
  // 根据时间戳获取YYYY-MM-DD型字符窜
  formatData(time: any) {
    const sj = new Date(time);
    const year = sj.getFullYear();
    const mon = sj.getMonth() + 1 < 10 ? '0' + (sj.getMonth() + 1) : (sj.getMonth() + 1);
    const day = sj.getDate() < 10 ? '0' + sj.getDate() : sj.getDate();
    return year + '-' + mon + '-' + day;
  },
  // 获取上个月第一，和最后一天
  getPreviousMonthDates() {
    // 获取当前日期
    const now = new Date();
    // 计算上个月的年份和月份
    let year = now.getFullYear();
    let month = now.getMonth();
    if (month === 0) { // 如果是1月，则上个月是去年12月
      year -= 1;
      month = 11; // 12月
    } else {
      month -= 1;
    }
    // 创建上个月1号的日期对象
    const firstDayOfPrevMonth = new Date(year, month, 1);
    // 计算上个月的最后一天
    // 下个月1号减去一天即为上个月最后一天
    const lastDayOfPrevMonth = new Date(year, month + 1, 0);

    // 格式化日期
    function formatDate(date: Date) {
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0'); // 月份从0开始，所以需要+1
      const year = date.getFullYear();
      return `${year}-${month}-${day}`;
    }

    // 返回格式化的日期字符串
    const formattedFirstDay = formatDate(firstDayOfPrevMonth);
    const formattedLastDay = formatDate(lastDayOfPrevMonth);

    return {
      firstDay: formattedFirstDay,
      lastDay: formattedLastDay
    };
  },
  // 获取dateNum月前的日期
  getDateNumByMouth(dateNum: any) {
    const now = new Date();
    now.setMonth(now.getMonth() - dateNum);
    return now;
  }
};

// 码表
myUtil.code = {
  // 码表内容格式为页头筛选
  getHeaderFilterOption(key: any, codeViewKey: any = '01', showCode?: boolean) {
    const valueKey = 'code';
    let nameKey = 'name';
    if (key === 'CODE_DM_CKTS_HGJGFS') { // 海关监管方式代码
      // "code":"0245","jgfsqc":"来料加工料件转内销"
      // nameKey = 'jgfsqc';
    } else if (key === 'code_dm_gy_hb') {
      nameKey = 'code';
    }
    const code = this.getCode(key, codeViewKey);
    const option: any[] = [];
    if (code && code.length > 0) {
      code.forEach((item: any) => {
        option.push({
          value: item[valueKey],
          text: showCode ? `[${item[valueKey]}]   ${item[nameKey]}` : item[nameKey],
        });
      })
    }
    return option;
  },// 码表内容格式为页头筛选(自定义)
  getZdyHeaderFilterOption(key: any, showCode?: boolean) {
    const valueKey = 'code';
    let nameKey = 'name';
    const option: any[] = [];
    getZdyCode({codeStoreKey: key}).then((response: any) => {
      const {code, msg, body} = response;
      if (code === '200') {
        if (body && body.length > 0) {
          body.forEach((item: any) => {
            option.push({
              value: item[valueKey],
              text: showCode ? `[${item[valueKey]}]   ${item[nameKey]}` : item[nameKey],
            });
          })
        }
      } else {
        message.error(msg);
      }
    }).catch(() => {
      message.error('获取码表失败[' + key + ']。');
    })
    return option;
  },
  // 码表内容格式为下拉选项
  getSelectOption(key: any, codeViewKey: any = '01', showType?: any) {
    // code_dm_ckts_tlyslx 20201104 中国国家铁路集团有限公司国际货物运输明细表 -> 筛选条件使用
    // code_dm_ckts_cktmsywlx01 外贸综合服务企业代办退税申报表
    let valueKey = 'code';
    let nameKey = 'name';
    if (key === 'code_dm_ckts_dkgbjg'
      || (key + codeViewKey === 'code_dm_ckts_tlyslx02')) {
      valueKey = 'name';
    }
    if (key === 'CODE_DM_CKTS_HGJGFS') { // 海关监管方式代码
      // "code":"0245","jgfsqc":"来料加工料件转内销"
      // nameKey = 'jgfsqc';
    } else if (key === 'code_dm_gy_hb') {
      nameKey = 'code';
      if (showType && showType === '3') {
        nameKey = 'name';
      }
    }
    if (key.indexOf('url') === 0 || key === 'code_dm_ckts_ysfwdm') {
      if (key === 'url_gy_hbhl') {
        valueKey = 'hbzmDm';
        nameKey = 'hbmc';
      } else if (key === 'url_gy_qywtf') {
        valueKey = 'stfnsrsbh';
        nameKey = 'stfnsrsbh';
      } else if (key === 'url_ckts_ysfwdm' || key === 'code_dm_ckts_ysfwdm') {
        valueKey = 'ckspDm';
        nameKey = 'ckspmc';
      }
    }
    const code = this.getCode(key, codeViewKey);
    const option: any[] = [];
    if (code && code.length > 0) {
      code.forEach((item: any) => {
        option.push({
          value: item[valueKey],
          name: item[nameKey],
        });
      })
    }
    return option;
  },
  // 码表内容格式为下拉选项: 调整后商品码
  getSelectOptionDzhspm(key: any, codeViewKey: any = '01') {
    return [];
  },
  // 码表内容,单独使用url请求,参数初始化
  getUrlCodeParams(key: any, codeViewKey: any = '01', unit_key: any) {
    const qylx = myUtil.sys.enterpriseType();
    let url: String = '';
    let params: any;
    if (key === 'url_gy_hbhl') {
      url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx';
      params = {
        page: 1,
        pageSize: 999999,
        searchModel: [
          { property: "hbzmDm", value: "", op: "al" },
        ],
      };
    } else if (key === 'url_gy_qywtf') {
      url = '/yw/bszx/ggfw/qywtf/queryQywtf';
      params = {
        page: 1,
        pageSize: 999999,
        searchModel: [{ property: "stfnsrsbh", value: "", op: "al" }],
      };
    } else if (key === 'url_ckts_ysfwdm' || key === 'code_dm_ckts_ysfwdm') {
      if ('WM' == qylx || unit_key === 'MDT_ZXSB_SB_MDT_YFSJ_G' || unit_key === 'MDT_ZXSB_SB_MDT_YFSJ_F' || unit_key === 'MDT_ZXSB_SB_MDT_YFSJ_J') {
        url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryYsfwSpxxsj';
      } else {
        url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryYsfwSpxx';
      }
      params = {
        page: 1,
        pageSize: 999999,
        searchModel: [{ property: "ckspDm", value: "", op: "al" }],
      };
    } else if (key === 'url_code_zxsb_jmfxzt') {
      url = '/yw/jljg/znfx/getCodeFxzt';
      params = {};
    } else if (key === 'url_badz_qtdz_dzlx') {
      url = '/yw/badze/qtdz/queryQtdzDzlxList';
      params = {
        page: 1,
        pageSize: 999999,
        searchModel: [{ property: "ckspDm", value: "", op: "al" }]
      };
    }
    return { url, params };
  },
  // 获取指定码表，服务器端
  async getCodeFromServerT1(key: any, codeViewKey: any = '01', unit_key?: any) {
    const localCodeTable: any = myUtil.sessionStore.getItem('codeTable');
    if (localCodeTable && localCodeTable[`${key}_${codeViewKey}`]) {
      return localCodeTable[`${key}_${codeViewKey}`];
    }
    let result;
    // 本地文件获取码表
    result = getStaticTableCode(key, codeViewKey);
    // 服务器端获取码表
    if (!result || result.length <= 0) {
      if (key.indexOf('url') === 0 || key === 'code_dm_ckts_ysfwdm') {
        const { url, params } = this.getUrlCodeParams(key, codeViewKey, unit_key);
        result = await getUrlCode(url, params)
        const { code, body } = result;
        if (code === '200') {
          this.saveCodeToLocalTable(key, body.rows, codeViewKey);
        }
        return body.rows;
      } else {
        result = await apiGetCode({
          codeStoreKey: key,
          codeViewKey,
        })
      }
    }
    const { code, body } = result;
    if (code === '200') {
      this.saveCodeToLocalTable(key, body, codeViewKey);
    }
    return body;
  },
  // 实时获取码表
  async getCodeFromServerT2(key: any, codeViewKey: any = '01', unit_key?: any) {
    let result;
    // 本地文件获取码表
    result = getStaticTableCode(key, codeViewKey);
    // 服务器端获取码表
    if (!result || result.length <= 0) {
      if (key.indexOf('url') === 0 || key === 'code_dm_ckts_ysfwdm') {
        const { url, params } = this.getUrlCodeParams(key, codeViewKey, unit_key);
        result = await getUrlCode(url, params)
        const { code, body } = result;
        if (code === '200') {
          this.saveCodeToLocalTable(key, body.rows, codeViewKey);
        }
        return body.rows;
      } else {
        result = await apiGetCode({
          codeStoreKey: key,
          codeViewKey,
        })
      }
    }
    const { code, body } = result;
    if (code === '200') {
      this.saveCodeToLocalTable(key, body, codeViewKey);
    }
    return body;
  },
  // 保存码表值本地存贮
  saveCodeToLocalTable(key: any, codeTableByKey: any, codeViewKey: any = '01') {
    const localCodeTable: any = myUtil.sessionStore.getItem('codeTable') || {};
    localCodeTable[`${key}_${codeViewKey}`] = codeTableByKey;
    myUtil.sessionStore.setItem('codeTable', localCodeTable);
  },

  // 删除码表值本地存贮
  delCodeToLocalTable(key: any, codeViewKey: any = '01') {
    const localCodeTable: any = myUtil.sessionStore.getItem('codeTable') || {};
    delete localCodeTable[`${key}_${codeViewKey}`];
    myUtil.sessionStore.setItem('codeTable', localCodeTable);
  },

  // 获取指定码表
  getCode(key: any, codeViewKey: any = '01') {
    const localCodeTable = myUtil.sessionStore.getItem('codeTable') || {};
    return localCodeTable[`${key}_${codeViewKey}`] || [];
  },
  // 根据key获取指定码表的指定值
  getCodeValByKey(targetCode: any, key: any, codeViewKey: any) {
    const codeTable = this.getCode(key, codeViewKey);
    if (!codeTable || codeTable.length === 0) {
      return '';
    }
    return this.getCodeValByKey2(targetCode, codeTable);
  },

  // 根据key及获取指定码表的指定值
  getCodeValByKey2(targetCode: any, codeTable: any) {
    const valByKey: any[] = [];
    if (targetCode) {
      let targetCodeArr: any = targetCode;
      if (!Array.isArray(targetCode)) {
        targetCodeArr = targetCode.split(',');
      }
      for (let a = 0; a <= targetCodeArr.length; a += 1) {
        codeTable.forEach((item: any) => {
          if (item.code === targetCodeArr[a]) {
            valByKey.push(item.name);
          }
        });
      }
    }
    return valByKey.join('，');
  },
  // 获取codeTable初始化参数
  getCodeTableParam(arr: any, tmpObj: any) {
    arr.forEach((item: any) => {
      if (item.hasOwnProperty("children")) {
        this.getCodeTableParam(item.children, tmpObj);
      } else {
        const { codeTable, filter } = item;
        // 列表列、普通筛选、表单
        if (codeTable) {
          tmpObj[codeTable[0] + codeTable[1]] = {
            key: codeTable[0],
            codeViewKey: codeTable[1]
          }
        }
        // 列头筛选
        if (filter?.codeTable) {
          tmpObj[filter?.codeTable[0] + filter?.codeTable[1]] = {
            key: filter?.codeTable[0],
            codeViewKey: filter?.codeTable[1]
          }
        }
      }
    });
  },
  async getTsbz() {
    const result = await sfczdlzfp({});
    return result;
  },
};

// treeSelect 码表
myUtil.treeCode = {
  // 从服务器获取指定码表
  async getTreeCodeFormServer(key: any, codeViewKey: any = '01') {
    const localCodeTable: any = myUtil.sessionStore.getItem('treeTable');
    if (localCodeTable && localCodeTable[`${key}_${codeViewKey}`]) {
      return localCodeTable[`${key}_${codeViewKey}`];
    }
    let result;
    // 本地文件获取码表
    result = getStaticTableCode(key, codeViewKey);
    // 服务器端获取码表
    if (!result || result.length <= 0) {
      result = await apiGetTreeCode({
        codeStoreKey: key,
        codeViewKey,
      })
    }
    const { code, body } = result;
    if (code === '200') {
      this.saveTreeCodeToLocalTable(key, body, codeViewKey);
    }
    return body;
  },
  // 保存码表值本地存贮
  saveTreeCodeToLocalTable(key: any, codeTableByKey: any, codeViewKey: any = '01') {
    const localCodeTable: any = myUtil.sessionStore.getItem('treeTable') || {};
    localCodeTable[`${key}_${codeViewKey}`] = codeTableByKey;
    myUtil.sessionStore.setItem('treeTable', localCodeTable);
  },
  // 获取执行码表
  getTreeCode(key: any, codeViewKey: any = '01') {
    const localCodeTable = myUtil.sessionStore.getItem('treeTable') || {};
    return localCodeTable[`${key}_${codeViewKey}`];
  },
  // 获取treeData
  getTreeCodeData(key: any, codeViewKey: any = '01') {
    const treeData = this.getTreeCode(key, codeViewKey);
    return treeData;
  }
}

// Storage封装
myUtil.localStore = {
  setItem(key: any, value: any) {
    const val = this.getStorage();
    val[key] = value;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  },
  getItem(key: any) {
    return this.getStorage()[key];
  },
  getStorage() {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
    return {};
  },
  clear(key: any) {
    const val = this.getStorage();
    delete val[key];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  }
};

// Storage封装
myUtil.sessionStore = {
  setItem(key: any, value: any) {
    const val = this.getStorage();
    val[key] = value;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  },
  getItem(key: any) {
    return this.getStorage()[key];
  },
  getStorage() {
    const item = window.sessionStorage.getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
    return {};
  },
  clear(key: any) {
    const val = this.getStorage();
    delete val[key];
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  }
};

// 主题
myUtil.theme = {
  init(theme?: string) {
    const currentTheme = myUtil.localStore.getItem('theme');
    const divRoot: any = document.querySelector("body");
    divRoot.classList.remove('theme_radius_4px', 'theme_radius_3px', 'theme_radius_0px');
    divRoot.classList.remove('theme_font_size_16px', 'theme_font_size_14px', 'theme_font_size_12px');
    divRoot.classList.remove('theme01', 'theme02', 'theme03', 'theme04', 'theme05', 'theme06', 'theme07', 'theme11', 'theme12');

    // 根据集成方式设置主题
    // const jcfs = history?.location?.query?.jcfs;
    // if (jcfs === '??') {
    //   divRoot.classList.add('theme05');
    //   return;
    // }

    if (currentTheme) {
      Object.keys(currentTheme).forEach((key) => {
        divRoot.classList.add(currentTheme[key]);
      });
    } else {
      let defaultTheme = pro.default_theme; // 默认
      if (theme || THEME_TYPE) {
        defaultTheme = theme || THEME_TYPE; // 打包或手动更换主题
      }
      divRoot.classList.add(defaultTheme, 'theme_font_size_14px', 'theme_radius_4px');
    }
  }
}

// 文件
myUtil.file = {
  // 下载文件
  downloadCommon(blob: any, fileName: any, type: any) {
    const bstr = atob(blob);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    const aLink = document.createElement('a');
    document.body.appendChild(aLink);
    aLink.style.display = 'none';
    const objectUrl = window.URL.createObjectURL(new Blob([u8arr], { type: type }));
    aLink.href = objectUrl;
    aLink.download = fileName;
    aLink.click();
    document.body.removeChild(aLink);
  },
  // 下载execl 文件
  downloadExcel(blob: any, fileName: any) {
    myUtil.file.downloadCommon(blob, fileName, 'application/vnd.ms-excel');
  },
  downloadXml(blob: any, fileName: any) {
    myUtil.file.downloadCommon(blob, fileName, 'application/xml');
  },
  downloadZip(blob: any, fileName: any) {
    myUtil.file.downloadCommon(blob, fileName, 'application/zip');
  },
  downloadPdf(blob: any, fileName: any) {
    myUtil.file.downloadCommon(blob, fileName, 'application/pdf');
  },
  // 文件下载
  downloadFile(content: any, filename: any) {
    // 创建隐藏的可下载链接
    var eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    var blob = new Blob([content]);
    eleLink.href = URL.createObjectURL(blob);
    // 触发点击
    document.body.appendChild(eleLink);
    eleLink.click();
    // 然后移除
    document.body.removeChild(eleLink);
  },
  // 文件下载，入参文件绝对路径，文件名
  downloadFileByPath(wjlj: any, wjm: any) {
    const a = document.createElement('a'); // 创建一个<a></a>标签
    a.href = wjlj; // 'http://192.168.0.175:1111/cktsgl/tszl/sjdc/1.zip';
    a.download = wjm;         // 设置下载文件文件名
    a.style.display = 'none';           // 隐藏a标签
    document.body.appendChild(a);       // 将a标签追加到文档对象中
    a.click();                          // 模拟点击了a标签，会触发a标签的href的读取，浏览器就会自动下载了
    document.body.removeChild(a) ;//释放
  }
};

// 数组
myUtil.array = {
  isContiner(arr: any, str: any) {
    if (arr.indexOf(str) != -1) {
      return true;
    } else {
      return false;
    }
  },
  traverseTreeLeaf(arr: any) {
    arr.forEach((item: any) => {
      if (item.hasOwnProperty("children")) {
        item.disabled = true;
        this.traverseTreeLeaf(item.children);
      }
    })
  }
};


// 页面高度计算
myUtil.heightCalc = {
  header: myUtil.localStore.getItem('theme')?.skin === 'theme06' ? '60px' : '44px',         // 系统页头
  headerTab: '40px',      // 主页最上层Tab
  cardMargin: myUtil.localStore.getItem('theme')?.skin === 'theme06' ? '48px' : '40px',     // 主页margin
  footerBtn: myUtil.localStore.getItem('theme')?.skin === 'theme06' ? '55px' : '51px',      // 弹窗页脚
  getCalc: (param: any) => {
    let ss = '';
    param.forEach((item: any) => {
      if (item === 'gridHeader') {
        myUtil.heightCalc.gridHeader = (document.querySelector('.ant-table-header')?.offsetHeight || '35') + 'px';              // 35
      } else if (item === 'filter') {
        myUtil.heightCalc.filter = (document.querySelector('.dd-filter-wrap')?.parentNode.offsetHeight || '69') + 'px';         // 69
      } else if (item === 'toolbar') {
        myUtil.heightCalc.toolbar = (document.querySelector('.dd_toolbar_wrap')?.offsetHeight || '50') + 'px';                  // 50
      } else if (item === 'pagination') {
        myUtil.heightCalc.pagination = (document.querySelector('.ant-table-pagination')?.offsetHeight || '32') + 'px';          // 32
      }
      const tmp = myUtil.heightCalc[item] ? myUtil.heightCalc[item] : item;
      ss += ` - ${tmp}`;
    });
    ss = `calc(100vh ${ss})`;
    // console.info(ss);
    return ss;
  }
}

// 页面高度计算
myUtil.layout = {
  formX1: {
    layout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    },
    tailLayout: {
      wrapperCol: { offset: 7, span: 17 },
    },
  },
  formX2: {
    layout: {
      labelCol: { span: 7 },
      wrapperCol: { span: 17 },
    },
    tailLayout: {
      wrapperCol: { offset: 7, span: 17 },
    },
  },
  formX2_1: {
    layout: {
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
    },
    tailLayout: {
      wrapperCol: { offset: 6, span: 18 },
    },
  },
}

// 全局配置
myUtil.settings = {
  /**
   * 根据打包指令，获取程序类型
   */
  getProgramType: function () {
    return moduel ? moduel : '';
  },
}

//获取UUID e:数字，代表多少位，默认32
myUtil.getUUID = (e: number) => {
  e = e || 32;
  var t = "ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678",
    a = t.length,
    n = "";
  for (let i = 0; i < e; i++)
    n += t.charAt(Math.floor(Math.random() * a));
  return n
}
/**
  * 树形结构
  * 根据Key 取value
  */
myUtil.getTreeName = (array: any, key: any) => {
  for (let i = 0; i < array.length; i++) {
    let a = array[i]
    if (a.value === key) {
      return a.title
    } else {
      if (a.children && a.children.length > 0) {
        let res = myUtil.getTreeName(a.children, key)
        if (res) {
          return res
        }
      }
    }
  }
}

/**
  * 树形结构 根据value取title
  * @param array 树结构
  * @param key
  */
myUtil.getTreeName = (array: any, key: any) => {
  for (let i = 0; i < array.length; i++) {
    let a = array[i]
    if (a.value === key) {
      return a.title
    } else {
      if (a.children && a.children.length > 0) {
        let res = myUtil.getTreeName(a.children, key)
        if (res) {
          return res
        }
      }
    }
  }
}

/**
 *  获取所有子节点
 * @param nodes 树形结构
 * @param item 节点名称 ''
 * @param arr 返回集合 []
 */
myUtil.getChild = (nodes: any, item: any, arr: any) => {
  for (let el of nodes) {
    if (el.value === item) {
      arr.push(el.value * 1);
      if (el.children) {
        myUtil.childNodesDeep(el.children, arr);
      }
    } else if (el.children) {
      myUtil.getChild(el.children, item, arr);
    }
  }
  return arr;
}
myUtil.childNodesDeep = (nodes: any, arr: any) => {
  if (nodes)
    nodes.forEach((ele: any) => {
      arr.push(ele.value * 1);
      if (ele.children) {
        myUtil.childNodesDeep(ele.children, arr);
      }
    });
}

export const intl = {
  formatMessage: (param?: any) => {
    return hts_message[param.id];
  }
}


myUtil.format = {
  toZdy: (param?: any) => {
    const pa = [...param];
    pa.forEach(element => {
      element.op = 'zdy';
    });
    return pa;
  }
}




myUtil.zxsbPatch = {
  // 讲列表查询参数转换为在线申报系统格式
  formatApiParam(url: string, options: any) {
    // 仅测试用
    if (API_URL_BASE.indexOf('192.168.20.36:6068/dditaxsaasry/v1') === -1
      && API_URL_BASE.indexOf('192.168.0.34:9702/cktssb/v1') === -1) {
      return {
        options,
        url
      }
    }
    // 列表查询参数转换
    if (url?.indexOf('/hx/ty/crud/queryPager') > -1) {
      // url 格式： 'http://.../v1/hx/ty/crud/queryPager/MTS_ZXSB_SB_MTS_TSSB_G/0X';
      let searchHz = '03';
      if (options.data.key === 'MTS_ZXSB_SB_MTS_TSSB_G') {
        searchHz = '04';
      }
      options.url += `/${options.data.key}/${searchHz}`;
      options.data.searchModel?.forEach((item: any) => {
        if (item.type === 5 && item.value) {
          item.value = moment(item.value).format('YYYY-MM-DD');
        }
      });
      options.data = {
        ...options.data,
        searchModel: {},
        adQuery: options.data.searchModel,
      }
      url += `/${options.data.key}/${searchHz}`;
    }
    // 列表查询参数转换
    if (url?.indexOf('/bszx/wbsj/bgd/queryBgd21Page') > -1
      || url?.indexOf('/bszx/wbsj/dzdzfp/queryPdFpPage') > -1
      || url?.indexOf('/bszx/ggfw/ydgl/queryAllYdxxPage') > -1
      || url?.indexOf('/bszx/wbsj/bgd/queryBgd18Page') > -1
      || url?.indexOf('/bszx/wbsj/dzdzfp/queryFpMainPage') > -1
      || url?.indexOf('/yw/dditSaas/qxyh/queryYhPager') > -1 // 权限管理-用户列表
      || url?.indexOf('/yw/dditSaas/qxjs/queryJsPager') > -1 // 权限管理-角色列表
      || url?.indexOf('yw/dditSaas/qxqy/queryQyPager') > -1 // 权限管理-企业列表
      || url?.indexOf('yw/dditSaas/qxjs/queryJsYhList') > -1 // 权限管理-关联用户列表
    ) {
      options.data.searchModel?.forEach((item: any) => {
        if (item.type === 5 && item.value) {
          item.value = moment(item.value).format('YYYY-MM-DD');
        }
      });
      options.data = {
        ...options.data,
        searchModel: {},
        adQuery: options.data.searchModel,
      }
    }
    if (url?.indexOf('/hx/ty/crud/queryForm') > -1) {
      // url 格式： 'http://.../v1/hx/ty/crud/queryForm/MTS_ZXSB_SB_MTS_TSSB_G/01';
      options.url += `/${options.data.key}/01`;
      options.data = {
        ...options.data,
      }
      url += `/${options.data.key}/01`;
    }
    // 删除参数转换
    if (url?.indexOf('/hx/ty/crud/delete') > -1) {
      // url 格式： 'http://.../cktssb/v1/hx/ty/crud/delete';
      if (options.data.key === 'MTS_ZXSB_SB_MTS_TSSB_G') { // 特殊的删除接口
        options.url = options.url.replace('/hx/ty/crud/delete', '/yw/bszx/mts/hwlw/tssb/deleteHwlwTssb');
        url = options.url.replace('/hx/ty/crud/delete', '/yw/bszx/mts/hwlw/tssb/deleteHwlwTssb');
      } else if (options.data.key === 'MDT_ZXSB_SB_MDT_TSSB_G') { // 特殊的删除接口
        options.url = options.url.replace('/hx/ty/crud/delete', '/yw/bszx/mdt/hwlw/tssb/deleteHwlwTssb');
        url = options.url.replace('/hx/ty/crud/delete', '/yw/bszx/mdt/hwlw/tssb/deleteHwlwTssb');
      } else {
        options.url += `/${options.data.key}`;
        url += `/${options.data.key}`;
      }
    }
    // 表单保存参数转换
    if (url?.indexOf('/hx/ty/crud/saveOrUpdate') > -1) {
      // url 格式： 'http://.../cktssb/v1/hx/ty/crud/saveOrUpdate';
      if (options.data.key === 'MTS_ZXSB_SB_MTS_TSSB_G') { // 特殊的保存接口
        options.url = options.url.replace('/hx/ty/crud/saveOrUpdate', '/yw/bszx/mts/hwlw/tssb/updateHwlwTssb');
        url = options.url.replace('/hx/ty/crud/saveOrUpdate', '/yw/bszx/mts/hwlw/tssb/updateHwlwTssb');
      } else if (options.data.key === 'MDT_ZXSB_SB_MDT_TSSB_G') { // 特殊的保存接口
        options.url = options.url.replace('/hx/ty/crud/saveOrUpdate', '/yw/bszx/mdt/hwlw/tssb/updateHwlwTssb');
        url = options.url.replace('/hx/ty/crud/saveOrUpdate', '/yw/bszx/mdt/hwlw/tssb/updateHwlwTssb');
      } else {
        options.url += `/${options.data.key}`;
        url += `/${options.data.key}`;
      }
      options.data = {
        ...options.data.data,
      }
    }
    // 申报结果查询参数转换
    // 申报结果查询-历史申报记录参数转换
    // 退税申报
    if (url?.indexOf('/yw/bszx/ggfw/shjgcx/queryPagerSblbCp') > -1
      || url?.indexOf('/yw/bszx/ggfw/shjgcx/lssbsjcx') > -1
      || url?.indexOf('/yw/bszx/ggfw/scsbsj/sjgl/querySbsjJl') > -1) {
      const searchModel2: any = {};
      options.data.searchModel?.forEach((item: any) => {
        if (item.type === 5 && item.value) {
          item.value = moment(item.value).format('YYYY-MM-DD');
        }
        searchModel2[item.property] = item.value;
      });
      options.data = {
        ...options.data,
        searchModel: searchModel2,
      }
    }
    // 申报结果查询-历史申报记录参数转换
    return {
      options,
      url
    };
  },
}

export default myUtil;

