import numeral from 'numeral';
import dayjs from "dayjs";
import getStaticTableCode from '../staticTableCode';
import hts_message from '../locales/hts_message';
import CONSTANTS from '../constants';
import { Tooltip, theme, Button, Space, Modal, message, Image, notification, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { segmenter } from '@/services/hts/api';
import { initDbData, createTables, queryListNs, dropDbTablesNs } from '@/services/hts/apiNs';
import { InfoCircleOutlined, CloseCircleOutlined, CheckCircleFilled, ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import nodata from '@/assets/css/img/nodata.png';
import { cloneDeep, merge } from 'lodash';
import DDIT_TOOL_CONSTANTS from '../../DDBunit/excelConfig.v2.constants';
import assembleConfigUtil from '../../DDBunit/assemble_config_util';
// import { DEFAULT_CONFIG } from '../../DDBunit/excelConfig.v2.constants';
import { VideoOne, Music, Word, ExcelOne, FileEditingOne, Ppt, Zip, PictureAlbum, PlayOne, PreviewOpen } from '@icon-park/react';
import { Link } from 'umi';
import { itemType } from '../../DDForm/data';
import VanillaJSONEditor from '../../DDBunit/VanillaJSONEditor';
import { queryList, getCode as apiGetCode, getUrlCode, automaticPageDef, saveOrUpdate, queryForm } from '@/services/hts/api';
import { Line, Column, Pie, DualAxes, Area } from '@ant-design/plots';
import ProCard from '@ant-design/pro-card';
import SparkMD5 from 'spark-md5';
import { getTreeCode as apiGetTreeCode } from '@/services/hts/api';
import { Packer, Paragraph, TextRun, Table, TableRow, TableCell, VerticalAlign, AlignmentType, convertInchesToTwip, WidthType, Header, Footer, PageNumber, ShadingType, LineRuleType } from "docx";
import { HeadingLevel, TableOfContents } from 'docx';
import theme_config_common, { theme_config } from '../constants/theme_config/theme_config_common';
import markdownit from 'markdown-it';

const CONFIG_KEY = DDIT_TOOL_CONSTANTS.CONFIG_KEY;

const myUtil: any = {};
const STORAGE_KEY = 'ddit';
const weekStart = 1; // 1表示周一是一周的开始，0表示周日是一周的开始

// #region text 文字处理
/**
 * ## 文字处理
 */
myUtil.text = {
  /**
   * @method formatNum
   * @desc 基于Numeral.js 处理数字
   * @param value 要格式化的数字值
   * @param format 格式
   * @returns 格式化后数值
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
   * @returns 数值类型数值
   */
  getNumVal: function(value: any) {
    return numeral(value).value() === null ? '' : numeral(value).value();
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
   * @param value 需要转换的字符串
   * @returns 转换后大写字符串
   */
  toUpper(value: any) {
    return value?.toUpperCase() || value;
  },
  /**
   * @method toLower
   * @desc 字符转小写
   * @param value 需要转换的字符串
   * @returns 转换后小写字符串
   */
  toLower(value: any) {
    return value?.toLowerCase() || value;
  },
  /**
   * @method arrayToStr
   * @desc 数组转字符串
   * @param val 需要转换的字符串
   * @param Separator 分隔符，默认逗号
   * @returns 转换后字符串
   */
  arrayToStr(value: any = [], Separator: any) {
    let reVal = '';
    value.forEach((item: any, index: any) => {
      let tmp = value.length - 1 !== index ? Separator || ',' : '';
      reVal += item + tmp;
    });
    return reVal;
  },
  /**
   * @method uuid
   * @desc 生成uuid
   * @param len 生成uuid长度
   * @param radix 选取基数的位数，基数：0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz
   * @returns uuid
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
   * @method formatRepalce
   * @desc 字符窜占位符替换
   * @param str 元字符串
   * @param val 替换的文本对象
   * @returns 替换后字符串
   */
  formatRepalce(str: any, val: any) {
    let tmp = str;
    for (let key in val) {
      if (val[key]) {
        tmp = tmp.replace(new RegExp("\\{\\{" + key + "\\}\\}", "g"), val[key]);
      }
    }
    return tmp;
  },
  /**
   * @method formatNumRound
   * @desc 将数值四舍五入并保留给定位数的小数
   * @param num 要格式化的数字值
   * @param s 四舍五入保留的位数
   * @returns 转换后数值
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
  /**
   * @method lowerFirstLetter
   * @desc 首字母变小写
   * @param val 需要转换的字符串
   * @returns 转换后字符串
   */
  lowerFirstLetter(value: any) {
    if (value.length === 0) {
      return value; // 如果字符串为空，则返回原字符串
    }
    return value.toString().charAt(0).toLowerCase() + value.toString().slice(1); // 将第一个字符转换为小写，并拼接剩余字符
  },
  /**
   * @method camelToUnderscore
   * @desc 字符串驼峰转下划线
   * @param str 需要转换的字符串
   * @returns 转换后字符串
   */
  camelToUnderscore(str: any) {
    if (str) {
      return str.replace(/([A-Z])/g, "_$1").toLowerCase();
    }
    return str;
  },
  /**
   * @method camelToUnderscoreObj
   * @desc 对象key驼峰转下划线
   * @param param 需要转换的对象
   * @returns 转换后对象
   */
  camelToUnderscoreObj(param: any) {
    let newObj: any = {};
    Object.keys(param).forEach(key => {
      newObj[myUtil.text.camelToUnderscore(key)] = param[key];
    });
    return newObj;
  },
  /**
   * @method camelToUnderscoreArray
   * @desc 数组中对象驼峰转下划线
   * @param param 需要转换的数组
   * @returns 转换后数组
   */
  camelToUnderscoreArray(param: any = []) {
    let newArr: any = [];
    param.forEach((rowData: any) => {
      newArr.push(myUtil.text.camelToUnderscoreObj(rowData));
    });
    return newArr;
  },
  /**
   * @method underscoreToCamel
   * @desc 字符串下划线转驼峰
   * @param param 需要转换的数组
   * @returns 转换后字符串
   */
  underscoreToCamel(str: any) {
    if (str) {
      let arr = str.split('_');
      for (let i = 1; i < arr.length; i++) {
        arr[i] = arr[i].charAt(0).toUpperCase() + arr[i].substring(1);
      }
      return arr.join('');
    }
    return str;
  },
  /**
   * @method underscoreToCamelObjValue
   * @desc 对象中目标key的属性值下划线转驼峰
   * @param param 需要转换的对象
   * @param tagretKey 目标可以
   * @returns 转换后对象
   */
  underscoreToCamelObjValue(param: any, tagretKey: any) {
    let newObj: any = {};
    Object.keys(param).forEach(key => {
      if (tagretKey.indexOf(key) > -1) {
        newObj[key] = myUtil.text.underscoreToCamel(param[key]);
      } else {
        newObj[key] = param[key];
      }
    });
    return newObj;
  },
  /**
   * @method underscoreToCamelObjKey
   * @desc 对象中目标key下划线转驼峰
   * @param param 需要转换的对象
   * @param tagretKey 目标可以
   * @returns 转换后对象
   */
  underscoreToCamelObjKey(param: any, tagretKey: any) {
    let newObj: any = {};
    Object.keys(param).forEach(key => {
      if (tagretKey.indexOf(key) > -1) {
        newObj[myUtil.text.underscoreToCamel(key)] = param[key];
      } else {
        newObj[key] = param[key];
      }
    });
    return newObj;
  },
  /**
   * @method underscoreToCamelArrayValue
   * @desc 数组对象中目标key的属性值下划线转驼峰
   * @param param 需要转换的数组
   * @param tagretKey 目标可以
   * @returns 转换后数组
   */
  underscoreToCamelArrayValue(param: any = [], tagretKey: any) {
    let newArr: any = [];
    param.forEach((rowData: any) => {
      newArr.push(myUtil.text.underscoreToCamelObjValue(rowData, tagretKey));
    });
    return newArr;
  },
  /**
   * @method underscoreToCamelArrayKey
   * @desc 数组对象中目标key下划线转驼峰
   * @param param 需要转换的数组
   * @param tagretKey 目标可以
   * @returns 转换后数组
   */
  underscoreToCamelArrayKey(param: any = [], tagretKey: any) {
    let newArr: any = [];
    param.forEach((rowData: any) => {
      newArr.push(myUtil.text.underscoreToCamelObjKey(rowData, tagretKey));
    });
    return newArr;
  },
  /**
   * @method parseBraces
   * @desc 匹配字符串中{}内的内容，将其中值转数组
   * @param str 需要转换的字符串
   * @returns 转换后数组
   */
  parseBraces(str: any) {
    const regex: any = /{([^}]+)}/g;
    let match: any;
    const results: any = [];
    while ((match = regex.exec(str))) {
      results.push(match[1]); // 捕获组1包含了大括号内部的内容
    }
    return results;
  },
  /**
   * @method generateRandomNumber
   * @desc 生成长度为指定数值的随机数
   * @param length 需要转换的字符串
   * @returns 随机数
   */
  generateRandomNumber(length: any) {
    const min = 10 ** (length - 1); // 最小值（如长度为3时，min=100）
    const max = 10 ** length - 1;   // 最大值（如长度为3时，max=999）
    return Math.floor(min + Math.random() * (max - min + 1));
  },
  /**
   * @method cleanNulObject
   * @desc 过滤空值
   * @param obj - 要处理的对象
   * @returns Object 清理后的对象
   */
  cleanNulObject(obj: any) {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }
    return Object.entries(obj).reduce((acc: any, [key, value]) => {
      // 递归处理嵌套对象
      const cleanedValue = myUtil.text.cleanNulObject(value);
      // 过滤掉undefined/null/空字符串/空数组/空对象
      if (cleanedValue !== undefined &&
          cleanedValue !== null &&
          !(typeof cleanedValue === 'string' && cleanedValue === '') &&
          !(Array.isArray(cleanedValue) && cleanedValue.length === 0) &&
          !(typeof cleanedValue === 'object' && Object.keys(cleanedValue).length === 0)) {
        acc[key] = cleanedValue;
      }
      return acc;
    }, {});
  }
};
// #endregion ******************************************************************************************

// #region date 日期处理
/**
 * ## 日期处理
 */
myUtil.date = {
  /**
   * @method formatDate
   * @desc 将日期格式化成指定格式的字符串
   * @param date 要格式化的日期
   * @param format 格式
   * @returns 格式化后日期
   */
  formatDate(date: any, format: any) {
    if (date) {
      if (date?.constructor === String) {
        return dayjs(new Date(Number(date))).format(format);
      } else {
        return dayjs(new Date(date)).format(format);
      }
    }
    return '';
  },
  /**
   * @method getLastWeek
   * @desc 获取上周的起始日期和结束日期
   * @returns 上周的起始日期和结束日期
   */
  getLastWeek() {
    const startOfWeek = dayjs().subtract(1, 'week').day(weekStart).format('YYYY-MM-DD') + ' 00:00:00';
    const endOfWeek = dayjs().subtract(1, 'week').day(weekStart + 6).format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfWeek,
      endOfWeek,
      dayjsFormat: [
        dayjs(startOfWeek, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfWeek, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getCurrentWeek
   * @desc 获取本周的起始日期和结束日期
   * @returns 本周的起始日期和结束日期
   */
  getCurrentWeek() {
    const startOfWeek = dayjs().day(weekStart).format('YYYY-MM-DD') + ' 00:00:00';
    const endOfWeek = dayjs().day(weekStart + 6).format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfWeek,
      endOfWeek,
      dayjsFormat: [
        dayjs(startOfWeek, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfWeek, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getNextWeek
   * @desc 获取下周的起始日期和结束日期
   * @returns 下周的起始日期和结束日期
   */
  getNextWeek() {
    const startOfWeek = dayjs().add(1, 'week').day(weekStart).format('YYYY-MM-DD') + ' 00:00:00';
    const endOfWeek = dayjs().add(1, 'week').day(weekStart + 6).format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfWeek,
      endOfWeek,
      dayjsFormat: [
        dayjs(startOfWeek, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfWeek, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getLastMonth
   * @desc 获取上个月的起始日期和结束日期
   * @returns 上个月的起始日期和结束日期
   */
  getLastMonth() {
    const startOfMonth = dayjs().subtract(1, 'month').startOf('month').format('YYYY-MM-DD') + ' 00:00:00';
    const endOfMonth = dayjs().subtract(1, 'month').endOf('month').format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfMonth,
      endOfMonth,
      dayjsFormat: [
        dayjs(startOfMonth, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfMonth, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getCurrentMonth
   * @desc 获取本月的起始日期和结束日期
   * @returns 本月的起始日期和结束日期
   */
  getCurrentMonth() {
    const startOfMonth = dayjs().startOf('month').format('YYYY-MM-DD') + ' 00:00:00';
    const endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfMonth,
      endOfMonth,
      dayjsFormat: [
        dayjs(startOfMonth, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfMonth, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getNextMonth
   * @desc 获取下个月的起始日期和结束日期
   * @returns 下个月的起始日期和结束日期
   */
  getNextMonth() {
    const startOfMonth = dayjs().add(1, 'month').startOf('month').format('YYYY-MM-DD') + ' 00:00:00';
    const endOfMonth = dayjs().add(1, 'month').endOf('month').format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfMonth,
      endOfMonth,
      dayjsFormat: [
        dayjs(startOfMonth, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfMonth, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getLastYear
   * @desc 获取去年的起始日期和结束日期
   * @returns 去年的起始日期和结束日期
   */
  getLastYear() {
    const startOfYear = dayjs().subtract(1, 'year').startOf('year').format('YYYY-MM-DD') + ' 00:00:00';
    const endOfYear = dayjs().subtract(1, 'year').endOf('year').format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfYear,
      endOfYear,
      dayjsFormat: [
        dayjs(startOfYear, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfYear, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getCurrentYear
   * @desc 获取本年的起始日期和结束日期
   * @returns 本年的起始日期和结束日期
   */
  getCurrentYear() {
    const startOfYear = dayjs().startOf('year').format('YYYY-MM-DD') + ' 00:00:00';
    const endOfYear = dayjs().endOf('year').format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfYear,
      endOfYear,
      dayjsFormat: [
        dayjs(startOfYear, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfYear, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getNextYear
   * @desc 获取来年的起始日期和结束日期
   * @returns 来年的起始日期和结束日期
   */
  getNextYear() {
    const startOfYear = dayjs().add(1, 'year').startOf('year').format('YYYY-MM-DD') + ' 00:00:00';
    const endOfYear = dayjs().add(1, 'year').endOf('year').format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfYear,
      endOfYear,
      dayjsFormat: [
        dayjs(startOfYear, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfYear, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getLastQuarter
   * @desc 获取上季度的起始日期和结束日期
   * @returns 上季度的起始日期和结束日期
   */
  getLastQuarter() {
    const startOfQuarter = dayjs().startOf('quarter').subtract(3, 'month').format('YYYY-MM-DD') + ' 00:00:00';
    const endOfQuarter = dayjs().startOf('quarter').subtract(1, 'day').format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfQuarter,
      endOfQuarter,
      dayjsFormat: [
        dayjs(startOfQuarter, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfQuarter, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getCurrentQuarter
   * @desc 获取本季度的起始日期和结束日期
   * @returns 本季度的起始日期和结束日期
   */
  getCurrentQuarter() {
    const startOfQuarter = dayjs().startOf('quarter').format('YYYY-MM-DD') + ' 00:00:00';
    const endOfQuarter = dayjs().endOf('quarter').format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfQuarter,
      endOfQuarter,
      dayjsFormat: [
        dayjs(startOfQuarter, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfQuarter, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getNextQuarter
   * @desc 获取下季度的起始日期和结束日期
   * @returns 下季度的起始日期和结束日期
   */
  getNextQuarter() {
    const startOfQuarter = dayjs().add(1, 'quarter').startOf('quarter').format('YYYY-MM-DD') + ' 00:00:00';
    const endOfQuarter = dayjs().add(1, 'quarter').endOf('quarter').format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfQuarter,
      endOfQuarter,
      dayjsFormat: [
        dayjs(startOfQuarter, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfQuarter, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getNextQuarter2
   * @desc 获取最近n天的起始日期和结束日期
   * @param param 最近天数
   * @returns 最近n天的起始日期和结束日期
   */
  getRecentNDay(param: any) {
    const startOfDay = dayjs().add(-param, 'd').format('YYYY-MM-DD') + ' 00:00:00';
    const endOfDay = dayjs().format('YYYY-MM-DD') + ' 23:59:59';
    return {
      startOfDay,
      endOfDay,
      dayjsFormat: [
        dayjs(startOfDay, 'YYYY-MM-DD 00:00:00'),
        dayjs(endOfDay, 'YYYY-MM-DD 23:59:59'),
      ]
    };
  },
  /**
   * @method getQZDateBeforeCurr
   * @desc 获取当前时间N年前的第一天和最后一天
   * @param param n年
   * @returns 当前时间N年前的第一天和最后一天
   */
  getQZDateBeforeCurr(n: any) {
    const sj = new Date();
    const year = sj.getFullYear() - n;
    const date = {
      firstDay: year + '-01-01',
      lastDay: year + '-12-31'
    };
    return date;
  },
  /**
   * @method generateRandomBirthday
   * @desc 生成随机日期
   * @returns 随机日期
   */
  generateRandomBirthday() {
    // 生成随机年份（2020 到当前年份）
    const currentYear = new Date().getFullYear();
    const year = Math.floor(Math.random() * (currentYear - 2020 + 1)) + 2020;
    // 生成随机月份（1-12）
    const month = Math.floor(Math.random() * 12) + 1;
    // 计算该月最大天数（自动处理闰年）
    const daysInMonth = new Date(year, month, 0).getDate();
    // 生成随机日期（1-最大天数）
    const day = Math.floor(Math.random() * daysInMonth) + 1;
    // 格式化为 yyyy-MM-dd（补零）
    return `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  },
  /**
   * @method getRandomTimestamp
   * @desc 生成随机时间戳
   * @returns 随机时间戳
   */
  getRandomTimestamp() {
    let aa = myUtil.date.generateRandomBirthday();
    let randomTimestamp = dayjs(aa).valueOf();
    return randomTimestamp;
  },
  /**
   * @method compareTime
   * @desc 判断日期是否在几个月得范围内 (YYYY-MM-DD | YYYY-MM-DD Hi:mm:ss | 时间戳)
   * @param mons 比较的月数
   * @param rqQ 开始日期
   * @param rqZ 结束日期
   * @returns true or false
   */
  compareTime(mons: any, stTime: any, endTime: any) {
    const st  = new Date(stTime);
    const et = new Date(endTime);
    let stNmon = new Date(st);
    stNmon.setMonth(stNmon.getMonth() + mons);
    if(et.getTime() <= stNmon.getTime()) {
      return true;
    }
    return false;
  },
  /**
   * @method accurateDate
   * @desc 日期补全到秒
   * @param date 需要转换的日期
   * @param bz 精确标志（1：00:00:00；2： 23:59:59）
   * @returns 转换后日期
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
   * @method formatMillisecondsToHMS
   * @desc 格式化毫秒数为 hh:mm:ss
   * @param milliseconds 需要格式化的毫秒数
   * @returns 格式化后时间
  */
  formatMillisecondsToHMS(milliseconds: any = 0) {
    if (Number.isNaN(milliseconds)) {
      milliseconds = 0;
    }
    const hours = Math.floor(milliseconds / 3600000);
    milliseconds = milliseconds % 3600000;
    const minutes = Math.floor(milliseconds / 60000);
    milliseconds = milliseconds % 60000;
    const seconds = Math.floor(milliseconds / 1000);
    return [
      hours < 10 ? '0' + hours : hours,
      minutes < 10 ? '0' + minutes : minutes,
      seconds < 10 ? '0' + seconds : seconds
    ].join(':');
  },
  /**
   * @method formatList
   * @desc 兼容的日期格式化格式
   * @param format 日期格式化格式
   * @returns 兼容的日期格式化格式
  */
  formatList(format: any) {
    let formatList: any = [];
    if (format) {
      formatList.push(format);
    }
    formatList = formatList.concat('YYYY-MM-DD', 'YYYY-MMDD', 'YYYYMM-DD', 'YYYY/MM/DD', 'YYYY/MMDD', 'YYYYMM/DD', 'YYYYMMDD');
    return formatList;
  },
  /**
   * @method convertMinutes
   * @desc 分钟转为小时分格式
   * @param format 日期格式化格式
   * @returns 小时分格式数据
  */
  convertMinutes(minutes: any) {
    if (!minutes) {
      return '';
    }
    const hours = Math.floor(minutes / 60);
    const mins = myUtil.text.formatNum(minutes % 60, '0');
    return `${hours}:${mins}`;
  }
};
// #endregion ******************************************************************************************

// #region localStore
/**
 * ## localStore
 */
myUtil.localStore = {
  /**
   * @method setItem
   * @desc 设置键值key的localStore数据
   * @param key 键
   * @param value 值
   */
  setItem(key: any, value: any) {
    const val = this.getStorage();
    val[key] = value;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  },
  /**
   * @method getItem
   * @desc 根据键值key从localStore里获取数据
   * @param key 键
   * @returns 键值
   */
  getItem(key: any) {
    return this.getStorage()[key];
  },
  /**
   * @method getStorage
   * @desc 从localStore里获取全部数据
   * @returns localStore所有键值
   */
  getStorage() {
    const item = window.localStorage.getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
    return {};
  },
  /**
   * @method clear
   * @desc 根据键值key删除localStore里的数据
   * @param key 键
   */
  clear(key: any) {
    const val = this.getStorage();
    delete val[key];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  }
};
// #endregion ******************************************************************************************

// #region sessionStore
/**
 * ## sessionStore
 */
myUtil.sessionStore = {
  /**
   * @method setItem
   * @desc 设置键值key的sessionStore数据
   * @param key 键
   * @param value 值
   */
  setItem(key: any, value: any) {
    const val = this.getStorage();
    val[key] = value;
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  },
  /**
   * @method getItem
   * @desc 根据键值key从sessionStore里获取数据
   * @param key 键
   * @returns 键值
   */
  getItem(key: any) {
    return this.getStorage()[key];
  },
  /**
   * @method getStorage
   * @desc 从sessionStore里获取全部数据
   * @returns sessionStore所有键值
   */
  getStorage() {
    const item = window.sessionStorage.getItem(STORAGE_KEY);
    if (item) {
      return JSON.parse(item);
    }
    return {};
  },
  /**
   * @method clear
   * @desc 根据键值key删除sessionStore里的数据
   * @param key 键
   */
  clear(key: any) {
    const val = this.getStorage();
    delete val[key];
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(val));
  },
  /**
   * @method clearAll
   * @desc 删除sessionStore里的所有数据
   */
  clearAll() {
    window.sessionStorage.removeItem(STORAGE_KEY);
  }
};
// #endregion ******************************************************************************************

// #region modal
// 提示信息及弹窗
myUtil.modal = {
  /**
   * @method getIcon
   * @desc 根据类别获取图标
   * @param infoType 可选值：info/error/success/warning/question
   * @param modalType 可选值：confirm
   * @returns 格式化后日期
   */
  getIcon(infoType: any, modalType?: any) {
    let icon: any;
    if (modalType === 'confirm') {
      icon = <InfoCircleOutlined />
    }
    if (infoType === 'info') {
      icon = <InfoCircleOutlined />;
    } else if (infoType === 'error') {
      icon = <CloseCircleOutlined />;
    } else if (infoType === 'success') {
      icon = <CheckCircleFilled />;
    } else if (infoType === 'warning') {
      icon = <ExclamationCircleOutlined />;
    } else if (infoType === 'question') {
      icon = <QuestionCircleOutlined />;
    }
    return icon;
  },
  /**
   * @method info
   * @desc info类型提示
   * @param param: {title, content, okText, onOK, cancelText, footer, icon...}
   * @returns info弹窗
   */
  info(param?: any) {
    const config: any = this.init(param, 'info');
    const modal = Modal.info(config);
    return modal;
  },
  /**
   * @method success
   * @desc success类型提示
   * @param param: {title, content, okText, onOK, cancelText, footer, icon...}
   * @returns success弹窗
   */
  success(param?: any) {
    const config: any = this.init(param, 'success');
    const modal = Modal.success(config);
    return modal;
  },
  /**
   * @method error
   * @desc error类型提示
   * @param param: {title, content, okText, onOK, cancelText, footer, icon...}
   * @returns error弹窗
   */
  error(param?: any) {
    const config: any = this.init(param, 'error');
    const modal = Modal.error(config);
    return modal;
  },
  /**
   * @method warning
   * @desc warning类型提示
   * @param param: {title, content, okText, onOK, cancelText, footer, icon...}
   * @returns warning弹窗
   */
  warning(param?: any) {
    const config: any = this.init(param, 'warning');
    const modal = Modal.warning(config);
    return modal;
  },
  /**
   * @method confirm
   * @desc confirm类型提示
   * @param param: {title, content, okText, onOK, cancelText, footer, icon...}
   * @returns confirm弹窗
   */
  confirm(param?: any) {
    const config: any = this.init(param, 'confirm');
    const modal = Modal.confirm(config);
    return modal;
  },
  /**
   * @method viewJson
   * @desc 展示json数据类型弹窗
   * @param param: {data, onChange...}
   * @returns 弹窗
   */
  viewJson(param?: any) {
    let newJsonData: any = param?.data;
    let dataOnChange: any =  param?.onChange;
    if (typeof newJsonData === 'string') {
      try {
        newJsonData = JSON.parse(newJsonData);
      } catch (err) {
        newJsonData = { err: 'JSON.parse error'};
        console.warn('JSON.parse err');
      }
    }
    const editJson = { text: undefined, json: newJsonData };
    Modal.info({
      title: 'JSON数据查看',
      wrapClassName: 'standard-modal-fn',
      width: CONSTANTS.C_MODAL_WIDTH_X3,
      footer: null,
      icon: null,
      closable: true,
      content: (
        <div>
          <VanillaJSONEditor
            sizeClasssName="x"
            content={editJson}
            mainMenuBar={true}
            onChange={dataOnChange}
            mode="text"
          />
        </div>
      ),
      onOk() {},
    });
    return;
  },
  /**
   * @method viewRichText
   * @desc 展示RichText数据类型弹窗
   * @param param: {data, onChange...}
   * @returns 弹窗
   */
  viewRichText(param?: any) {
    let htmlData: any = param?.data;
    Modal.info({
      title: '数据查看',
      wrapClassName: 'standard-modal-fn',
      width: CONSTANTS.C_MODAL_WIDTH_X3,
      footer: null,
      icon: null,
      closable: true,
      content: (
        <div dangerouslySetInnerHTML={{ __html: htmlData }} />
      ),
      onOk() {},
    });
    return;
  },
  /**
   * @method viewMarkdown
   * @desc 展示Markdown数据类型弹窗
   * @param param: {data}
   * @returns 弹窗
   */
  viewMarkdown(param?: any) {
    const md = markdownit({ html: true, breaks: true });
    let data: any = param?.data;
    Modal.info({
      title: '数据查看',
      wrapClassName: 'standard-modal-fn',
      width: CONSTANTS.C_MODAL_WIDTH_X3,
      footer: null,
      icon: null,
      closable: true,
      content: (
        <div dangerouslySetInnerHTML={{ __html: md.render(data) }} />
      ),
      onOk() {},
    });
    return;
  },
  /**
   * @method init
   * @desc 根据弹窗类型获取弹窗配置文件
   * @param param: {title, content, okText, onOK, cancelText, footer, icon...}
   * @param modalType: 弹窗类型
   * @returns 弹窗配置
   */
  init(param?: any, modalType?: any) {
    const config: any = {
      ...param,
      okText: param.okText || '确定',
      width: param.width || CONSTANTS.C_MODAL_WIDTH_X1,
      content: this.getContent(param.content), // string|array|Dom
    };
    if (param.footer) {
      config.footer = this.getFooter(param.footer);
    }
    const icon = this.getIcon(param.icon, modalType);
    if (icon) {
      config.icon = icon;
    }
    return config;
  },
  /**
   * @method getContent
   * @desc 绘制弹窗内容
   * @param content 弹窗内容
   * @returns 弹窗内容
   */
  getContent(content: any) {
    if (Array.isArray(content)) {
      const cc: any = [];
      content?.forEach((item: any, index: any) => {
        cc.push(<p className="item" key={index}>{item}</p>);
      });
      return cc;
    } else {
      return content;
    }
  },
  /**
   * @method getFooter
   * @desc 绘制弹窗页脚按钮
   * @param button 按钮
   * @returns 弹窗页脚按钮
   */
  getFooter(button: any) {
    const footerElement: any = [];
    if (button && button.length > 0) {
      button.forEach((item: any) => {
        if (item.$$typeof) {
          footerElement.push(item);
        } else {
          const { name, type, key, loading } = item;
          footerElement.push(<Button onClick={() => {
            if (item.func) {
              item.func();
            }
          }} type={type} key={key} loading={loading}>{name}</Button>);
        }
      });
    }
    return <div style={{textAlign: "right"}}>
      <Space>{footerElement}</Space>
    </div>;
  },
  /**
   * @method update
   * @desc 更新弹窗配置
   * @param target 弹窗实例
   * @param param 弹窗配置
   * @returns 新弹窗
   */
  update(target: any, param: any) {
    target.update({
      ...param,
      footer: this.getFooter(param.footer),
    });
  },
  /**
   * @method responseInfo
   * @desc 展示接口响应信息弹窗
   * @param param {code, msg}
   * @returns 接口响应信息弹窗
   */
  responseInfo({code, msg, body}: any) {
    let description: any = typeof msg === 'string' ? msg : JSON.stringify(msg);
    if (body) {
      let { sdp_msg_error, sdp_msg_info, sdp_msg_success, sdp_msg_warn } = body;
      let getMsgList = (msgParam: any, type: any) => {
        let typeInfo: any;
        if (type === 'error') {
          typeInfo = '异常信息';
        } else if (type === 'info') {
          typeInfo = '提示信息';
        } else if (type === 'success') {
          typeInfo = '成功信息';
        } else if (type === '') {
          typeInfo = '警告信息';
        }
        if (!msgParam || msgParam.length <= 0) {
          return null;
        }
        let bbb = [];
        for (let m = 0; m < msgParam.length; m ++) {
          bbb.push(<div style={{margin: '6px 0 6px 0'}}>{msgParam[m]}</div>)
        }
        return <>
          <div style={{color: '#0a6ed1', margin: '12px 0 12px 0', fontSize: '14px'}}>{typeInfo}</div>
          {bbb}
        </>;
      }
      let msgListError: any = getMsgList(sdp_msg_error, 'error');
      let msgListInfo: any = getMsgList(sdp_msg_info, 'info');
      let msgListSuccess: any = getMsgList(sdp_msg_success, 'success');
      let msgListWarn: any = getMsgList(sdp_msg_warn, 'warn');
      description = <>
        <div>{description}</div>
        {msgListError && msgListError}
        {msgListInfo && msgListInfo}
        {msgListSuccess && msgListSuccess}
        {msgListWarn && msgListWarn}
      </>
    }
    let notificationObj: any = {
      // message: '失败',
      description,
      placement: 'top',
      duration: null,
    };
    if (code === '200') {
      if (body) {
        notification.info({...notificationObj, duration: 2});
      } else {
        message.info(description);
      }
    } else {
      notification.error(notificationObj);
    }
  }
}
// #endregion ******************************************************************************************

// #region tree
/**
 * ## tree
 */
myUtil.tree = {
  /**
   * @method deleteNode
   * @desc 根据节点id值删除节点
   * @param {tree = {}, targetId: 需要删除的节点id值, parent, idText: id名称}
   * 格式最外层为 Object: { id: '-1', children: [ ... ] }
   */
  deleteNode({tree = {}, targetId, parent, idText}: any) {
    if (tree[idText] === targetId) {
      // 如果找到了目标节点，则删除它
      if (parent?.children) {
        // 从父节点的children数组中移除节点
        parent.children = parent.children?.filter((child: any) => child[idText] !== targetId);
      }
      return true;
    }
    if (tree.children) {
      // 递归遍历子节点
      for (let i = 0; i < tree.children.length; i++) {
        if (myUtil.tree.deleteNode({tree:tree.children[i], targetId, parent: tree, idText})) {
          // 如果在子节点中找到并删除了节点，则返回true
          return true;
        }
      }
    }
    // 如果没有找到节点，返回false
    return false;
  },
  /**
   * @method findNodeInTree
   * @desc 查找目标节点
   * @param {tree = [], targetId: 需要删除的节点id值, idText: id名称}
   */
  findNodeInTree({tree, targetId, idText}: any) {
    // 递归函数用于查找目标节点
    const recursiveFind = (nodes: any, targetId: any) => {
      for (let i = 0; i < nodes.length; i++) {
        let nodeTmp = nodes[i] || {};
        if (nodeTmp[idText] === targetId) {
          return nodeTmp; // 找到目标节点，返回
        }
        // 如果节点有children，则递归查找
        if (nodeTmp?.children?.length > 0) {
          const foundNode: any = recursiveFind(nodeTmp?.children, targetId);
          if (foundNode) {
            return foundNode; // 找到目标节点，返回
          }
        }
      }
      return null; // 未找到目标节点，返回null
    }
    // 从树的根节点开始查找
    return recursiveFind(tree, targetId);
  },
  /**
   * @method deleteTargetKey
   * @desc 根据节点可以删除目标节点
   * @param {tree = [], targetKey = []: 需要删除的节点key数组}
   * 可用于格式化\删减多余数据
   */
  deleteTargetKey({tree, targetKey}: any) {
    // 递归函数用于查找目标节点
    const recursiveFind = (nodes: any, targetKey: any) => {
      for (let i = 0; i < nodes?.length; i++) {
        let nodeTmp = nodes[i] || {};
        if (Array.isArray(targetKey)) {
          for (let m = 0; m < targetKey?.length; m++) {
            delete nodeTmp[targetKey[m]];
          }
        } else {
          delete nodeTmp[targetKey];
        }
        // 如果节点有children，则递归查找
        if (nodeTmp?.children?.length > 0) {
          recursiveFind(nodeTmp?.children, targetKey);
        }
      }
    }
    // 从树的根节点开始查找
    return recursiveFind(tree, targetKey);
  },
  /**
   * @method transformArrToTree
   * @desc 数组转树形结构
   * @param {tree = [], targetKey = []: 需要删除的节点key数组}
   * 可用于格式化\删减多余数据
   */
  transformArrToTree(list: any, rootId: any, { idName = 'id', parentIdName = 'parentId', childrenName = 'children' } = {}) {
    if(!Array.isArray(list)){
      new Error('only Array');
      return list;
    }
    const objMap: any = {}; // 暂存数组以id为key映射关系
    const result: any = [];
    for(const item of list) {
      const id=item[idName];
      const parentId=item[parentIdName] || '';
      // 该元素有可能放入map中(找不到该项的parent时会先放入map)
      objMap[id]=!objMap[id] ? item:{...item,...objMap[id]}
      //找到对应映射关系
      const treeItem=objMap[id];
      if (parentId===rootId) {
        result.push(treeItem)
      } else {
        if(!objMap[parentId]) {
          objMap[parentId] = {}
        }
        if(!objMap[parentId][childrenName]) {
          objMap[parentId][childrenName] = [];
        }
        objMap[parentId][childrenName].push(treeItem);
      }
    }
    return result;
  },
  /**
   * @method setTreeLevels
   * @desc 设置树形结构数据层级属性
   * @param nodes 树形结构数据
   * @param level 树层级
   */
  setTreeLevels(nodes: any, level = 0) {
    nodes.forEach((node: any) => {
      node.level = level; // 设置当前层级
      if (node.children && node.children.length > 0) {
        myUtil.tree.setTreeLevels(node.children, level + 1); // 递归设置子节点的层级
      }
    });
  },
  /**
   * @method setTreeProps
   * @desc 设置树形结构数据节点属性
   * @param node 树节点
   * @param callback 回调函数
   */
  setTreeProps(node: any, callback: any) {
    if (!node) return;
    // 递归遍历树结构
    let nodeTmp = {
      children: node,
    }
    const traverse = (node2: any) => {
      if (node2.children && node2.children.length) {
        // 如果有子节点，则遍历它们
        node2.children.forEach((child: any) => traverse(child));
      } else {
        // 如果是叶子节点，执行回调函数
        callback(node2);
      }
    }
    traverse(nodeTmp);
    return nodeTmp;
  },
  /**
   * @method findAllAncestorIds
   * @desc 获取所有上级节点
   * @param treeData 树数据
   * @param targetId 起始节点
   * @param idName id节点名称
   * @param childName 子节点名称
   */
  findAllAncestorIds(treeData: any, targetId: any, idName = 'id', childName = 'children') {
    const stock: any[] = [];
    let going = true;
    function recursion(arr: any, id: any, findProps: any, childProps: any) {
        arr.forEach((item: any) => {
            if (!going) return;
            stock.push(item[findProps]);
            if (item[findProps] === id) {
                going = false;
            } else if (item[childProps]) {
                recursion(item[childProps], id, findProps, childProps);
            } else {
                stock.pop();
            }
        });
        if (going) stock.pop();
    }
    recursion(treeData, targetId, idName, childName);
    return stock;
  },
  /**
   * @method findAllDescendantIds
   * @desc 获取所有下级节点
   * @param treeData 树数据
   * @param targetId 起始节点
   * @param idName id节点名称
   * @param childName 子节点名称
   */
  findAllDescendantIds(treeData: any, targetId: any, idName = 'id', childName = 'children') {
    let childNodesDeep: any;
    childNodesDeep = (nodes: any, arr: any) => {
      if (nodes)
        nodes.forEach((ele: any) => {
          arr.push(ele[idName]);
          if (ele[childName]) {
            childNodesDeep(ele[childName], arr);
          }
        });
    }
    let getChild: any;
    getChild = (nodes: any, item: any, arr: any) => {
      for (let el of nodes) {
        if (el[idName] === item) {
          arr.push(el[idName]);
          if (el[childName]) {
            childNodesDeep(el[childName], arr);
          }
        } else if (el[childName]) {
          getChild(el[childName], item, arr);
        }
      }
      return arr;
    }
    return getChild(treeData, targetId, []);
  },
  /**
   * @method sortTree
   * @desc 排序树节点
   * @param tree 树数据
   * @param sortKey 排序节点
   * @param sortOrder 排序方式 asc/desc
   */
  sortTree(tree: any, sortKey: any, sortOrder = 'asc') {
    // 递归排序函数
    const recurse: any = (nodes: any) => {
      // 对当前层级的节点按照 sortKey 进行排序
      nodes.sort((a: any, b: any) => sortOrder === 'asc' ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey]);
      // 递归处理子节点
      nodes.forEach((node: any) => {
        if (node.children && node.children.length > 0) {
          recurse(node.children);
        }
      });
    }
    recurse(tree);
    return tree;
  }
}
// #endregion ******************************************************************************************

// #region 主题布局
/**
 * ## 主题布局
 */
myUtil.theme = {
  /**
   * @method getColor
   * @desc 获取颜色
   */
  getColor({type, antdToken}: any) {
    // type: error primary success
    // type: textTertiary textSecondary
    let themeToken = myUtil.theme.getThemeToken().token;
    if (type === 'error') {
      return themeToken?.colorError;
    } else if (type === 'warning') {
      return themeToken?.colorWarning;
    } else if (type === 'primary') {
      return themeToken?.colorPrimary;
    } else if (type === 'success') {
      return themeToken?.colorSuccess;
    } else if (type === 'textTertiary') {
      return antdToken?.colorTextTertiary;
    } else if (type === 'textSecondary') {
      return antdToken?.colorTextSecondary;
    }
    // colorTextPlaceholder  rgba(0,0,0,0.25)"
    // colorTextQuaternary  rgba(0,0,0,0.25)"
  },
  /**
   * @method getDefaultSkin
   * @desc 获取皮肤（默认）
   */
  getDefaultSkin() {
    let skinArr: any = [
      { value: 'skin01', label: '亮色（默认）'},
      { value: 'skin02', label: '暗色'},
      { value: 'skin03', label: '护眼'},
      { value: 'skin04', label: 'Github'},
    ];
    return skinArr;
  },
  /**
   * @method getSkin
   * @desc 获取皮肤（默认 + 自定义）
   */
  getAllSkin() {
    // 获取用户配置：皮肤
    let planTmp: any = myUtil.sys.getCustomerConfigByKey({customer_config_key: 'skin_plan'}) || {};
    planTmp = planTmp?.all || [];
    let skinArr: any = [...(myUtil?.theme?.getDefaultSkin() || [])];
    // debugger
    planTmp?.forEach((item: any) => {
      skinArr.push({
        value: `customer_config_skin_${item.tagId}`,
        label: item.tagName,
        skin: {...item},
      });
    })
    return skinArr;
  },
  /**
   * @method init
   * @desc 主题初始化
   */
  getDefaultTheme() {
    return {
      radius: CONSTANTS.DEFAULT_THEME_RADIUS,
      skin: CONSTANTS.DEFAULT_THEME_SKIN,
      gridBorder: CONSTANTS.DEFAULT_THEME_GRID_BORDER,
      gridSize: CONSTANTS.DEFAULT_THEME_GRID_SIZE,
      gridPaginationPagesize: CONSTANTS.DEFAULT_THEME_GRID_PAGINATION_PAGESIZE,
      formItemLayout: CONSTANTS.DEFAULT_THEME_FORM_ITEM_LAYOUT,
      formItemLabelShow: CONSTANTS.DEFAULT_THEME_FORM_ITEM_LABEL_SHOW,
      layout: CONSTANTS.DEFAULT_THEME_LAYOUT,
      fixedHeader: CONSTANTS.DEFAULT_THEME_FIXED_HEADER,
      compact: CONSTANTS.DEFAULT_THEME_COMPACT,
      fontSize: CONSTANTS.DEFAULT_THEME_FONT_SIZE,
    }
  },
  /**
   * @method init
   * @desc 主题初始化，body中注入主题class
   */
  init() {
    const defaultTheme: any = myUtil.theme.getDefaultTheme();
    const currentTheme = myUtil.localStore.getItem('theme') || defaultTheme;
    const divRoot: any = document.querySelector("body");
    const allSkin = myUtil.theme.getAllSkin();
    allSkin.forEach((item: any) => {
      divRoot.classList.remove(item.value);
    });
    Object.keys(currentTheme).forEach((key) => {
      divRoot.classList.add(currentTheme[key]);
    });
  },
  /**
   * @method getThemeToken
   * @desc 获取主题 token
   */
  getThemeToken() {
    const compact = JSON.parse(myUtil.theme.getThemeItem('compact').replace('theme_compact_', ''));
    let themeToken: any = theme_config_common({compact});
    let themeSkin: any = myUtil.theme.getThemeItem('skin') || CONSTANTS.DEFAULT_THEME_SKIN;       // eg skin01 skin02 ...
    if (themeSkin.indexOf('customer_config_skin_') > -1) {
      let customerSkin = (myUtil.theme.getAllSkin()).find((tmp: any) => { return tmp.value === themeSkin });
      themeToken = merge(customerSkin?.skin, themeToken);                                            // 合并token
    } else {
      let themeSkinIndex: any = themeSkin.replace('skin', '');                                      // eg 01 02 ...
      themeToken = merge(theme_config[`theme_config_${themeSkinIndex}`], themeToken);               // 合并token
    }
    return themeToken;
  },
  /**
   * @method getRuntimeTheme
   * @desc 获取Runtime Theme
   * @param defaultTheme 默认主题，应用于app.tsx中antd设置
   */
  getRuntimeTheme(defaultTheme: any) {
    const borderRadius = Number(myUtil.theme.getThemeItem('radius').replace('theme_radius_', '').replace('px', ''));
    const fontSize = Number(myUtil.theme.getThemeItem('fontSize').replace('theme_font_size_', '').replace('px', ''));
    const compact = JSON.parse(myUtil.theme.getThemeItem('compact').replace('theme_compact_', ''));
    // 通用主题
    const commonTheme = theme_config_common({compact, borderRadius, fontSize});
    // 主题设置
    let myTheme = { ...defaultTheme, ...commonTheme };
    let themeSkin: any = myUtil.theme.getThemeItem('skin') || CONSTANTS.DEFAULT_THEME_SKIN;     // eg skin01 skin02 ...
    let ttmp: any;
    if (themeSkin.indexOf('customer_config_skin_') > -1) {
      let customerSkin = (myUtil.theme.getAllSkin()).find((tmp: any) => { return tmp.value === themeSkin });
      ttmp = customerSkin?.skin || {};                               // 合并layout token
    } else {
      let themeSkinIndex: any = themeSkin.replace('skin', '');    // eg 01 02 ...
      ttmp = theme_config[`theme_config_${themeSkinIndex}`];
    }
    if (ttmp?.darkAlgorithm) {
      ttmp.algorithm = theme.darkAlgorithm;
    }
    myTheme = merge(myTheme, ttmp);                              // 合并theme
    return myTheme;
  },
  /**
   * @method getThemeItem
   * @desc 根据主题类别获取配置
   * @param type 主题类别
   */
  getThemeItem(type: any) {
    let themeItem: any;
    if(type === 'layout') {
      themeItem = myUtil.localStore.getItem('theme')?.layout || CONSTANTS.DEFAULT_THEME_LAYOUT;
    } else if (type === 'fixedHeader') {
      themeItem = myUtil.localStore.getItem('theme')?.fixedHeader !== undefined ? myUtil.localStore.getItem('theme')?.fixedHeader : CONSTANTS.DEFAULT_THEME_FIXED_HEADER;
    } else if (type === 'gridBorder') {
      themeItem = myUtil.localStore.getItem('theme')?.gridBorder !== undefined ? myUtil.localStore.getItem('theme')?.gridBorder : CONSTANTS.DEFAULT_THEME_GRID_BORDER;
    } else if (type === 'gridSize') {
      themeItem = myUtil.localStore.getItem('theme')?.gridSize !== undefined ? myUtil.localStore.getItem('theme')?.gridSize : CONSTANTS.DEFAULT_THEME_GRID_SIZE;
    } else if (type === 'formItemLayout') {
      themeItem = myUtil.localStore.getItem('theme')?.formItemLayout || CONSTANTS.DEFAULT_THEME_FORM_ITEM_LAYOUT;
    }  else if (type === 'formItemLabelShow') {
      themeItem = myUtil.localStore.getItem('theme')?.formItemLabelShow !== undefined ? myUtil.localStore.getItem('theme')?.formItemLabelShow : CONSTANTS.DEFAULT_THEME_FORM_ITEM_LABEL_SHOW;
    }else if (type === 'skin') {
      themeItem = myUtil.localStore.getItem('theme')?.skin || CONSTANTS.DEFAULT_THEME_SKIN;
    } else if (type === 'radius') {
      themeItem = myUtil.localStore.getItem('theme')?.radius || CONSTANTS.DEFAULT_THEME_RADIUS;
    } else if (type === 'compact') {
      themeItem = myUtil.localStore.getItem('theme')?.compact !== undefined ? myUtil.localStore.getItem('theme')?.compact : CONSTANTS.DEFAULT_THEME_COMPACT;
    } else if (type === 'fontSize') {
      themeItem = myUtil.localStore.getItem('theme')?.fontSize !== undefined ? myUtil.localStore.getItem('theme')?.fontSize : CONSTANTS.DEFAULT_THEME_FONT_SIZE;
    } else if (type === 'gridPaginationPagesize') {
      themeItem = myUtil.localStore.getItem('theme')?.fontSize !== undefined ? myUtil.localStore.getItem('theme')?.gridPaginationPagesize : CONSTANTS.DEFAULT_THEME_GRID_PAGINATION_PAGESIZE;
    }
    return themeItem;
  },
  /**
   * @method getNoDataImageUrl
   * @desc 获取无数据时加载图片
   */
  getNoDataImageUrl() {
    const theme = myUtil.localStore.getItem('theme') || {};
    if (theme.skin === 'theme04') {
      return nodata;
    } else {
      return nodata;
    }
  },
  /**
   * @method getJsonViewTheme
   * @desc 根据当前主题获取ReactJson皮肤样式
   */
  getJsonViewTheme() {
    const theme = myUtil.localStore.getItem('theme') || {};
    if (theme.skin === 'skin02' || theme.skin === 'skin04') {
      return 'monokai';
    }
    return 'rjv-default';
  },
  /**
   * @method getChartStyle
   * @desc 根据当前主题获取ant-design/charts主题
   */
  getChartStyle()  {
    const theme = myUtil.localStore.getItem('theme') || {};
    if (theme.skin === 'skin02') {
      return {"background":"rgba(43, 46, 58, 1)","subColor":"rgba(255,255,255,0.05)","semanticRed":"#F4664A","semanticGreen":"#30BF78","padding":"auto","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","columnWidthRatio":0.5,"maxColumnWidth":null,"minColumnWidth":null,"roseWidthRatio":0.9999999,"multiplePieWidthRatio":0.7692307692307692,"sequenceColors":["#B8E1FF","#9AC5FF","#7DAAFF","#5B8FF9","#3D76DD","#085EC0","#0047A5","#00318A","#001D70"],"shapes":{"point":["hollow-circle","hollow-square","hollow-bowtie","hollow-diamond","hollow-hexagon","hollow-triangle","hollow-triangle-down","circle","square","bowtie","diamond","hexagon","triangle","triangle-down","cross","tick","plus","hyphen","line"],"line":["line","dash","dot","smooth"],"area":["area","smooth","line","smooth-line"],"interval":["rect","hollow-rect","line","tick"]},"sizes":[1,10],"components":{"axis":{"common":{"title":{"autoRotate":true,"position":"center","spacing":12,"style":{"fill":"#A6A6A6","fontSize":12,"lineHeight":12,"textBaseline":"middle","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"label":{"autoRotate":false,"autoEllipsis":false,"autoHide":{"type":"equidistance","cfg":{"minGap":6}},"offset":8,"style":{"fill":"#737373","fontSize":12,"lineHeight":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"line":{"style":{"lineWidth":1,"stroke":"#404040"}},"grid":{"line":{"type":"line","style":{"stroke":"#262626","lineWidth":1,"lineDash":null}},"alignTick":true,"animate":true},"tickLine":{"style":{"lineWidth":1,"stroke":"#404040"},"alignTick":true,"length":4},"subTickLine":null,"animate":true},"top":{"position":"top","grid":null,"title":null,"verticalLimitLength":0.5},"bottom":{"position":"bottom","grid":null,"title":null,"verticalLimitLength":0.5},"left":{"position":"left","title":null,"line":null,"tickLine":null,"verticalLimitLength":0.3333333333333333},"right":{"position":"right","title":null,"line":null,"tickLine":null,"verticalLimitLength":0.3333333333333333},"circle":{"title":null,"grid":{"line":{"type":"line","style":{"stroke":"#262626","lineWidth":1,"lineDash":null}},"alignTick":true,"animate":true}},"radius":{"title":null,"grid":{"line":{"type":"circle","style":{"stroke":"#262626","lineWidth":1,"lineDash":null}},"alignTick":true,"animate":true}}},"legend":{"common":{"title":null,"marker":{"symbol":"circle","spacing":8,"style":{"r":4,"fill":"#5B8FF9"}},"itemName":{"spacing":5,"style":{"fill":"#A6A6A6","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","fontSize":12,"lineHeight":12,"fontWeight":"normal","textAlign":"start","textBaseline":"middle"}},"itemStates":{"active":{"nameStyle":{"opacity":0.8}},"unchecked":{"nameStyle":{"fill":"#D8D8D8"},"markerStyle":{"fill":"#D8D8D8","stroke":"#D8D8D8"}},"inactive":{"nameStyle":{"fill":"#D8D8D8"},"markerStyle":{"opacity":0.2}}},"flipPage":true,"pageNavigator":{"marker":{"style":{"size":12,"inactiveFill":"#737373","inactiveOpacity":0.45,"fill":"#737373","opacity":1}},"text":{"style":{"fill":"#A6A6A6","fontSize":12}}},"animate":false,"maxItemWidth":200,"itemSpacing":24,"itemMarginBottom":12,"padding":[8,8,8,8]},"right":{"layout":"vertical","padding":[0,8,0,8]},"left":{"layout":"vertical","padding":[0,8,0,8]},"top":{"layout":"horizontal","padding":[8,0,8,0]},"bottom":{"layout":"horizontal","padding":[8,0,8,0]},"continuous":{"title":null,"background":null,"track":{},"rail":{"type":"color","size":12,"defaultLength":100,"style":{"fill":"#262626","stroke":null,"lineWidth":0}},"label":{"align":"rail","spacing":4,"formatter":null,"style":{"fill":"#737373","fontSize":12,"lineHeight":12,"textBaseline":"middle","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"handler":{"size":10,"style":{"fill":"#F0F0F0","stroke":"#BFBFBF"}},"slidable":true,"padding":[8,8,8,8]}},"tooltip":{"showContent":true,"follow":true,"showCrosshairs":false,"showMarkers":true,"shared":false,"enterable":false,"position":"auto","marker":{"symbol":"circle","stroke":"#fff","shadowBlur":10,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"rgba(0,0,0,0.09)","lineWidth":2,"r":4},"crosshairs":{"line":{"style":{"stroke":"#404040","lineWidth":1}},"text":null,"textBackground":{"padding":2,"style":{"fill":"rgba(0, 0, 0, 0.25)","lineWidth":0,"stroke":null}},"follow":false},"domStyles":{"g2-tooltip":{"position":"absolute","visibility":"hidden","zIndex":8,"transition":"left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s","backgroundColor":"#1f1f1f","opacity":0.95,"boxShadow":"0px 2px 4px rgba(0,0,0,.5)","borderRadius":"3px","color":"#A6A6A6","fontSize":"12px","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","lineHeight":"12px","padding":"0 12px 0 12px"},"g2-tooltip-title":{"marginBottom":"12px","marginTop":"12px"},"g2-tooltip-list":{"margin":0,"listStyleType":"none","padding":0},"g2-tooltip-list-item":{"listStyleType":"none","padding":0,"marginBottom":"12px","marginTop":"12px","marginLeft":0,"marginRight":0},"g2-tooltip-marker":{"width":"8px","height":"8px","borderRadius":"50%","display":"inline-block","marginRight":"8px"},"g2-tooltip-value":{"display":"inline-block","float":"right","marginLeft":"30px"}}},"annotation":{"arc":{"style":{"stroke":"#262626","lineWidth":1},"animate":true},"line":{"style":{"stroke":"#404040","lineDash":null,"lineWidth":1},"text":{"position":"start","autoRotate":true,"style":{"fill":"#A6A6A6","stroke":null,"lineWidth":0,"fontSize":12,"textAlign":"start","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","textBaseline":"bottom"}},"animate":true},"text":{"style":{"fill":"#A6A6A6","stroke":null,"lineWidth":0,"fontSize":12,"textBaseline":"middle","textAlign":"start","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""},"animate":true},"region":{"top":false,"style":{"lineWidth":0,"stroke":null,"fill":"#FFFFFF","fillOpacity":0.06},"animate":true},"image":{"top":false,"animate":true},"dataMarker":{"top":true,"point":{"style":{"r":3,"stroke":"#5B8FF9","lineWidth":2}},"line":{"style":{"stroke":"#404040","lineWidth":1},"length":16},"text":{"style":{"textAlign":"start","fill":"#A6A6A6","stroke":null,"lineWidth":0,"fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"direction":"upward","autoAdjust":true,"animate":true},"dataRegion":{"style":{"region":{"fill":"#FFFFFF","fillOpacity":0.06},"text":{"textAlign":"center","textBaseline":"bottom","fill":"#A6A6A6","stroke":null,"lineWidth":0,"fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"animate":true}},"slider":{"common":{"padding":[8,8,8,8],"backgroundStyle":{"fill":"#416180","opacity":0.05},"foregroundStyle":{"fill":"#5B8FF9","opacity":0.15},"handlerStyle":{"width":10,"height":24,"fill":"#F7F7F7","opacity":1,"stroke":"#BFBFBF","lineWidth":1,"radius":2,"highLightFill":"#FFF"},"textStyle":{"fill":"#fff","opacity":0.45,"fontSize":12,"lineHeight":12,"fontWeight":"normal","stroke":null,"lineWidth":0}}},"scrollbar":{"common":{"padding":[8,8,8,8]},"default":{"style":{"trackColor":"rgba(255,255,255,0.65)","thumbColor":"rgba(0,0,0,0.35)"}},"hover":{"style":{"thumbColor":"rgba(0,0,0,0.45)"}}}},"labels":{"offset":12,"style":{"fill":"#A6A6A6","fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","stroke":null,"lineWidth":0},"fillColorDark":"#2c3542","fillColorLight":"#ffffff","autoRotate":true},"innerLabels":{"style":{"fill":"#000","fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","stroke":null,"lineWidth":0},"autoRotate":true},"overflowLabels":{"style":{"fill":"#A6A6A6","fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","stroke":"#000","lineWidth":1}},"pieLabels":{"labelHeight":14,"offset":10,"labelLine":{"style":{"lineWidth":1}},"autoRotate":true},"styleSheet":{"brandColor":"#5B8FF9","paletteQualitative10":["#5B8FF9","#5AD8A6","#5D7092","#F6BD16","#6F5EF9","#6DC8EC","#945FB9","#FF9845","#1E9493","#FF99C3"],"paletteQualitative20":["#5B8FF9","#CDDDFD","#5AD8A6","#CDF3E4","#5D7092","#CED4DE","#F6BD16","#FCEBB9","#6F5EF9","#D3CEFD","#6DC8EC","#D3EEF9","#945FB9","#DECFEA","#FF9845","#FFE0C7","#1E9493","#BBDEDE","#FF99C3","#FFE0ED"]}};
      // return {
      //   fill: '#ffffff',
      // };
    }
    return 'default';
  },
  /**
   * @method getLayoutToken
   * @desc 获取layout token，应用于app.tsx中layout设置
   */
  getLayoutToken() {
    const compact = JSON.parse(myUtil.theme.getThemeItem('compact').replace('theme_compact_', ''));
    let layoutToken: any = theme_config_common({compact}).layoutToken;                              // 通用layout token
    let themeSkin: any = myUtil.theme.getThemeItem('skin') || CONSTANTS.DEFAULT_THEME_SKIN;         // eg skin01 skin02 ...
    if (themeSkin.indexOf('customer_config_skin_') > -1) {
      let customerSkin = (myUtil.theme.getAllSkin()).find((tmp: any) => { return tmp.value === themeSkin });
      layoutToken = merge(customerSkin?.skin?.layoutToken, layoutToken);                               // 合并layout token
    } else {
      let themeSkinIndex: any = themeSkin.replace('skin', '');                                        // eg 01 02 ...
      layoutToken = merge(theme_config[`theme_config_${themeSkinIndex}`]?.layoutToken, layoutToken);  // 合并layout token
    }
    // console.log("🚀 ~ getLayoutToken ~ layoutToken:", layoutToken);
    // 样式补丁
    const styleElement = document.createElement('style');
    let style = layoutToken?.header?.colorBgHeader;
    if (style) {
      styleElement.textContent = `
        .ant-menu-light.ant-menu-submenu-popup>.ant-menu, .ant-menu-light>.ant-menu.ant-menu-submenu-popup>.ant-menu {
          background-color: ${style} !important;
        }
      `;
      document.head.appendChild(styleElement);
    }
    return layoutToken;
  },
  /**
   * @method getChartStyle
   * @desc 变更指定class样式类、属性的属性值
   */
  changeStyle({className, styleName, style, styleType}: any) {
    if (styleType === 'body') {
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        ${className} {
          ${styleName}: ${style} !important;
        }
      `;
      document.head.appendChild(styleElement);
    } else {
      document.querySelectorAll(`${className}`).forEach((el: any) => {
        if (style) {
          el.style[styleName] = style; // el.style.setProperty('background-color', style, 'important');
        }
        if (className === '.ant-menu-light.ant-menu-submenu-popup>.ant-menu' || className === '.ant-menu-light>.ant-menu.ant-menu-submenu-popup>.ant-menu') {
          const styleElement = document.createElement('style');
          styleElement.textContent = `
            .ant-menu-light.ant-menu-submenu-popup>.ant-menu, .ant-menu-light>.ant-menu.ant-menu-submenu-popup>.ant-menu {
              background-color: ${style} !important;
            }
          `;
          document.head.appendChild(styleElement);
        }
      });
    }
  },
  /**
   * @method fixedStyle
   * @desc 即时刷新外层框架fix
   */
  fixedStyle(param: any)  {
    let fixedStyleArr: any = [
{className: '.ant-pro-top-nav-header-logo >*:first-child>h1', styleName: 'color', style: param?.layoutToken?.header?.colorHeaderTitle},
{className: '.ant-pro-top-nav-header .ant-pro-top-nav-header-logo .anticon', styleName: 'color', style: param?.layoutToken?.header?.colorHeaderTitle},
{className: '.ant-pro-top-nav-header .ant-menu .anticon', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenu},
{className: '.ant-pro-layout .ant-pro-layout-bg-list', styleName: 'backgroundColor', style: param?.token.cusBgLayout},
{className: '.ant-pro-layout .ant-layout-header.ant-pro-layout-header', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgHeader},
{className: '.ant-menu-light .ant-menu-item', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenu},
{className: '.ant-menu-light>.ant-menu .ant-menu-item', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenu},
{className: '.ant-menu-light .ant-menu-submenu-title', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenu},
{className: '.ant-menu-light>.ant-menu .ant-menu-submenu-title', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenu},
{className: '.ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenuActive},
{className: '.ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenuActive},
{className: '.ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenuActive},
{className: '.ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenuActive},
{className: '.ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light .ant-menu-item-selected', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light>.ant-menu .ant-menu-item-selected', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light.ant-menu-horizontal >.ant-menu-item-selected', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgMenuItemSelected},
{className: '.ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-selected', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgMenuItemSelected},
{className: '.ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-selected', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgMenuItemSelected},
{className: '.ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-selected', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgMenuItemSelected},
{className: '.ant-menu-light.ant-menu-submenu-popup>.ant-menu', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgHeader},
{className: '.ant-menu-light>.ant-menu.ant-menu-submenu-popup>.ant-menu', styleName: 'backgroundColor', style: param?.layoutToken?.header?.colorBgHeader},
{className: '.ant-pro-layout .ant-pro-sider-actions', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenu},
{className: '.ant-pro-layout .ant-pro-sider-logo >a >h1', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenuTitle},
{className: '.ant-pro-layout .ant-pro-sider-logo >a >span', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenuTitle},
{className: '.ant-pro-layout .ant-pro-sider-logo', styleName: 'borderBlockEndColor', style: param?.layoutToken?.sider?.colorMenuItemDivider},
{className: '.ant-pro-layout .ant-layout-sider.ant-pro-sider', styleName: 'backgroundColor', style: param?.layoutToken?.sider?.colorMenuBackground},
{className: '.ant-menu-light.ant-menu-inline .ant-menu-sub.ant-menu-inline', styleName: 'backgroundColor', style: param?.layoutToken?.sider?.colorMenuBackground},
{className: '.ant-menu-light>.ant-menu.ant-menu-inline .ant-menu-sub.ant-menu-inline', styleName: 'backgroundColor', style: param?.layoutToken?.sider?.colorMenuBackground},
{className: '.ant-menu-light .ant-menu-item', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenu},
{className: '.ant-menu-light>.ant-menu .ant-menu-item', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenu},
{className: '.ant-menu-light .ant-menu-submenu-title', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenu},
{className: '.ant-menu-light>.ant-menu .ant-menu-submenu-title', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenu},
{className: '.ant-menu-light .ant-menu-item-selected', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenuSelected},
{className: '.ant-menu-light>.ant-menu .ant-menu-item-selected', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenuSelected},
{className: '.ant-menu-light .ant-menu-item-selected', styleName: 'backgroundColor', style: param?.layoutToken?.sider?.colorBgMenuItemSelected},
{className: '.ant-menu-light>.ant-menu .ant-menu-item-selected', styleName: 'backgroundColor', style: param?.layoutToken?.sider?.colorBgMenuItemSelected},
{className: '.ant-menu-light .ant-menu-submenu-selected>.ant-menu-submenu-title', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenuActive},
{className: '.ant-menu-light>.ant-menu .ant-menu-submenu-selected>.ant-menu-submenu-title', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenuActive},
{className: '.ant-pro-layout .ant-pro-sider-logo', styleName: 'borderBlockEndColor', style: param?.layoutToken?.sider?.colorMenuItemDivider},
{className: '.ant-pro-sider-collapsed-button', styleName: 'color', style: param?.layoutToken?.sider?.colorTextCollapsedButton},
{className: '.ant-pro-sider-collapsed-button', styleName: 'backgroundColor', style: param?.layoutToken?.sider?.colorBgCollapsedButton},
{className: '.ant-pro-sider-collapsed-button:hover', styleName: 'color', style: param?.layoutToken?.sider?.colorTextCollapsedButtonHover},
{className: '.ant-menu-light.ant-menu-horizontal >.ant-menu-item:hover', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item:hover', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light.ant-menu-horizontal >.ant-menu-submenu:hover', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu:hover', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light.ant-menu-horizontal >.ant-menu-item-active', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-active', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-active', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-active', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light.ant-menu-horizontal >.ant-menu-item-open', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-item-open', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light.ant-menu-horizontal >.ant-menu-submenu-open', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light>.ant-menu.ant-menu-horizontal >.ant-menu-submenu-open', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.header?.colorBgMenuItemHover},
{className: '.ant-menu-light .ant-menu-submenu-selected>.ant-menu-submenu-title', styleType: 'body', styleName: 'color', style: param?.components?.Menu?.subMenuItemSelectedColor},
{className: '.ant-menu-light>.ant-menu .ant-menu-submenu-selected>.ant-menu-submenu-title', styleType: 'body', styleName: 'color', style: param?.components?.Menu?.subMenuItemSelectedColor},
{className: '.ant-menu-light .ant-menu-item:not(.ant-menu-item-selected):not(.ant-menu-submenu-selected):hover', styleType: 'body', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenuActive},
{className: '.ant-menu-light>.ant-menu .ant-menu-item:not(.ant-menu-item-selected):not(.ant-menu-submenu-selected):hover', styleType: 'body', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenuActive},
{className: '.ant-menu-light .ant-menu-item:not(.ant-menu-item-selected):not(.ant-menu-submenu-selected) >.ant-menu-submenu-title:hover', styleType: 'body', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenuActive},
{className: '.ant-menu-light>.ant-menu .ant-menu-item:not(.ant-menu-item-selected):not(.ant-menu-submenu-selected) >.ant-menu-submenu-title:hover', styleType: 'body', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenuActive},
{className: '.ant-menu-light .ant-menu-item-selected', styleType: 'body', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenuSelected},
{className: '.ant-menu-light>.ant-menu .ant-menu-item-selected', styleType: 'body', styleName: 'color', style: param?.layoutToken?.header?.colorTextMenuSelected},
{className: '.ant-pro-sider-collapsed-button:hover', styleType: 'body', styleName: 'color', style: param?.layoutToken?.sider?.colorTextCollapsedButtonHover},

// {className: '.ant-menu-light .ant-menu-item a', styleType: 'body', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenuItemHover},
// {className: '.ant-menu-light>.ant-menu .ant-menu-item a', styleType: 'body', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenuItemHover},
{className: '.ant-menu-light .ant-menu-item a:hover', styleType: 'body', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenuItemHover},
{className: '.ant-menu-light>.ant-menu .ant-menu-item a:hover', styleType: 'body', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenuItemHover},

{className: '.ant-menu-light:not(.ant-menu-horizontal) .ant-menu-item:not(.ant-menu-item-selected):active', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.sider?.colorBgMenuItemActive},
{className: '.ant-menu-light>.ant-menu:not(.ant-menu-horizontal) .ant-menu-item:not(.ant-menu-item-selected):active', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.sider?.colorBgMenuItemActive},
//

{className: '.ant-menu-light:not(.ant-menu-horizontal) .ant-menu-item:not(.ant-menu-item-selected):hover', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.sider?.colorBgMenuItemHover},
{className: '.ant-menu-light>.ant-menu:not(.ant-menu-horizontal) .ant-menu-item:not(.ant-menu-item-selected):hover', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.sider?.colorBgMenuItemHover},

//
//
{className: '.ant-menu-light:not(.ant-menu-horizontal) .ant-menu-submenu-title:hover', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.sider?.colorBgMenuItemHover},
{className: '.ant-menu-light>.ant-menu:not(.ant-menu-horizontal) .ant-menu-submenu-title:hover', styleType: 'body', styleName: 'background-color', style: param?.layoutToken?.sider?.colorBgMenuItemHover},


// 冲突
{className: '.ant-menu-light .ant-menu-item-selected', styleType: 'body', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenuSelected},
{className: '.ant-menu-light>.ant-menu .ant-menu-item-selected', styleType: 'body', styleName: 'color', style: param?.layoutToken?.sider?.colorTextMenuSelected},

{className: '.ant-pro-layout .ant-layout-sider.ant-pro-sider', styleType: 'body', styleName: 'background', style: param?.layoutToken?.sider?.colorMenuBackground},
{className: '.ant-pro-layout .ant-pro-layout-bg-list', styleType: 'body', styleName: 'background', style: param?.layoutToken?.bgLayout},
{className: 'ant-menu-light.ant-menu-inline .ant-menu-sub.ant-menu-inline', styleType: 'body', styleName: 'background', style: param?.layoutToken?.bgLayout},
{className: 'ant-menu-light>.ant-menu.ant-menu-inline .ant-menu-sub.ant-menu-inline', styleType: 'body', styleName: 'background', style: `${param?.layoutToken?.sider.colorMenuBackground} !important`},

{className: '.dd_toolbar_wrap .dd-toolbar', styleType: 'body', styleName: 'background', style: 'transparent'},

    ];

    fixedStyleArr.forEach((item: any) => {
      myUtil.theme.changeStyle(item);
    });
  }
}
// #endregion ******************************************************************************************

// #region 图表 Ant Design Charts
myUtil.chartsAntD = {
  /**
   * @method defaultConfigPie
   * @desc 默认配置参数：饼图
   */
  defaultConfigPie(param: any = {}) {
    const { valueFormat = '0,0', angleField = 'value', colorField = 'type', valueUnit = '' } = param;
    const { showLabel = true, colorFieldName, angleFieldName } = param;
    let defaultConfig: any = {
      angleField,
      colorField,
      radius: 0.8,
      innerRadius: 0.6,
      legend: {
        color: {
          title: true,
          position: 'right',
          rowPadding: 5,
        },
      },
      // tooltip 通过items定义
      // tooltip: {
      //   items: [
      //     (item: any) => {
      //       let nameTmp = item[colorField];
      //       let valueTmp = myUtil.text.formatNum(item[angleField], valueFormat);
      //       let percentTmp = myUtil.text.formatNum((item[angleField] / param.sum) * 100, '0,0.00');
      //       return ({
      //         name: nameTmp,
      //         value: `${valueTmp} ${valueUnit}（${percentTmp}%）`,
      //       })
      //     }
      //   ]
      // }
      // tooltip 自定义渲染
      tooltip: (param2: any) => {
        return { ...param, ...param2 };// Extra fields
      },
      interaction: {
        tooltip: {
          render: (e: any, { items }: any) => {
            return (
              <>
                {items.map((item: any) => {
                  const { type } = item;
                  let nameTmp = item[colorField];
                  let valueTmp = `${myUtil.text.formatNum(item[angleField], valueFormat)} ${valueUnit}`;
                  let percentTmp = `${myUtil.text.formatNum((item[angleField] / param.sum) * 100, '0,0.00')} %`;
                  return (
                    <div key={type} style={{ margin: 0 }}>
                      <div>{nameTmp}</div>
                      <div>{valueTmp}</div>
                      <div>{percentTmp}</div>
                    </div>
                  );
                })}
              </>
            );
          },
        },
      },
    };
    if (showLabel) {
      defaultConfig.label = {
        text: (d: any) => {
          let nameTmp = d[colorField];
          let valueTmp = myUtil.text.formatNum(d[angleField], valueFormat);
          let percentTmp = myUtil.text.formatNum((d[angleField] / param.sum) * 100, '0,0.00');
          let showLabelText = (angleFieldName ? angleFieldName + ' ' : '') + nameTmp;
          showLabelText += '   ' + (colorFieldName ? colorFieldName + ' ' : '') + valueTmp + ` (${percentTmp}%)`;
          return showLabelText;
        },
        // 如果采用innerHTML，则text不生效
        // innerHTML: (p: any) => {
        //   return `<div style="background-color:#ffffff; font-size: 12px; font-weight: normal;">
        //     <div><span>${angleFieldName}：</span>${p[colorField]}</div>
        //     <div><span>${colorFieldName}：</span>${p[angleField]}</div>
        //   </div>`
        // },
        position: 'spider', // outside spider
        style: { fontWeight: 'bold' },
      };
    }
    return defaultConfig;
  },
  /**
   * @method configPie
   * @desc 配置参数获取：饼图
   * @param param 自定义参数：饼图
   * @return 配置参数
   */
  configPie(param: any = {}) {
    const { data = [], showTotal, totalText = '合计', valueFormat = '0,0', angleField = 'value' } = param;
    const sum: any = data.reduce((a: any, b: any) => a + b[angleField], 0);
    param.sum = sum;
    let c: any = {
      ...myUtil.chartsAntD.defaultConfigPie(param),
      ...param,
    };
    if (showTotal) {
      c.annotations = [
        {
          type: 'text',
          style: {
            text: `${totalText}\n${myUtil.text.formatNum(sum, valueFormat)}`,
            x: '50%',
            y: '50%',
            textAlign: 'center',
            fontSize: 30,
            fontStyle: 'bold',
          },
        },
      ];
    }
    return c;
  },
  /**
   * @method defaultConfigArea
   * @desc 默认配置参数：面积图
   */
  defaultConfigArea(param: any = {}) {
    const { valueFormat = '0,0', valueUnit = '', axisXTitle, axisYTitle, xField = 'xValue', yField = 'yValue' } = param;
    let defaultConfig: any = {
      xField,
      yField,
      paddingLeft: 130,
      paddingRight: 60,
      paddingTop: 40,
      paddingBottom: 60,
      axis: {
        x: {title: axisXTitle},
        y: {
          title: axisYTitle,
      //     labelFormatter: function formatter(v: any) {
      //       return myUtil.text.formatNum(v, valueFormat) + valueUnit;
      //     },
        },
      },
    };
    return defaultConfig;
  },
  /**
   * @method configArea
   * @desc 配置参数获取：面积图
   * @param param 自定义参数：面积图
   * @return 配置参数
   */
  configArea(param: any = {}) {
    let c: any = {
      ...myUtil.chartsAntD.defaultConfigArea(param),
      ...param,
    };
    return c;
  },
  /**
   * @method defaultConfigColumn
   * @desc 默认配置参数：柱状图
   */
  defaultConfigColumn(param: any = {}) {
    const { valueFormat = '0,0', valueUnit = '', axisXTitle, axisYTitle, xField = 'xValue', yField = 'yValue' } = param;
    let defaultConfig: any = {
      xField,
      yField,
      paddingLeft: 130,
      paddingRight: 60,
      paddingTop: 40,
      paddingBottom: 60,
      axis: {
        x: {title: axisXTitle},
        y: {
          title: axisYTitle,
          labelFormatter: function formatter(v: any) {
            return myUtil.text.formatNum(v, valueFormat) + valueUnit;
          },
        },
      },
      // https://ant-design-charts.antgroup.com/options/plots/component/tooltip
      // https://ant-design-charts-next.antgroup.com/options/plots/component/tooltip
      // https://www.yuque.com/antv/charts/yzp26a6px89iamau#o8sxb
      // tooltip: {
      //   title: (d: any) => d[xField],
      //   items: [
      //     (d: any) => {
      //       return {
      //         name: axisYTitle,
      //         value: `${myUtil.text.formatNum(d[yField], valueFormat)} ${valueUnit}`,
      //       };
      //     }
      //   ]
      // },
      // tooltip 自定义渲染
      tooltip: (param2: any) => {
        return {...param, ...param2}; // Extra fields
      },
      interaction: {
        tooltip: {
          render: (e: any, tooltipParam: any) => {
            let typeTitle = tooltipParam.items[0].type;
            return (
              <div>
                {typeTitle && <h4>{tooltipParam.title}</h4>}
                {tooltipParam.items.map((item: any, index: any) => {
                  const { name, yValue, series } = item;
                  let bStyle: any = { marginLeft: 24 };
                  return <div key={index}>
                    <div style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                      <div>{name} {series && <>- {series}</>}</div>
                      <b style={bStyle}>{yValue}</b>
                    </div>
                  </div>
                })}
              </div>
            );
          },
        },
      },
      style: {
        maxWidth: 50,
      },
    };
    return defaultConfig;
  },
  /**
   * @method configColumn
   * @desc 配置参数获取：柱状图
   * @param param 自定义参数：柱状图
   * @return 配置参数
   */
  configColumn(param: any = {}) {
    const { showLabel, valueFormat = '0,0' } = param;
    let c: any = {
      ...myUtil.chartsAntD.defaultConfigColumn(param),
      ...param,
    };
    if (showLabel) {
      // https://ant-design-charts-next.antgroup.com/options/plots/label/overview
      c.label = {
        formatter: (text: any) => {
          return myUtil.text.formatNum(text, valueFormat);
        },
        textBaseline: 'bottom', // top middle bottom
      };
    }
    return c;
  },
  /**
   * @method defaultConfigLine
   * @desc 默认配置参数：线图
   */
  defaultConfigLine(param: any = {}) {
    const { valueFormat = '0,0', valueUnit = '', axisXTitle, axisYTitle, xField = 'xValue', yField = 'yValue' } = param;
    let defaultConfig: any = {
      xField,
      yField,
      paddingLeft: 130,
      paddingRight: 60,
      paddingTop: 40,
      paddingBottom: 60,
      shapeField: 'smooth',
      axis: {
        x: {title: axisXTitle},
        y: {
          title: axisYTitle,
          // labelFormatter: function formatter(v: any) {
          //   return `${myUtil.text.formatNum(v, valueFormat)} ${valueUnit}`;
          // },
        },
      },
      style: {
        lineWidth: 2,
        // lineDash: (datum: any, bb: any, cc, dd) => {
        //   for (let i=0; i<datum.length; i++) {
        //     if (datum[i].group === '同比增长') {
        //       return [4, 5];
        //     } else {
        //       return [0, 0];
        //     }
        //   }
        // }
      },
      // tooltip 自定义渲染
      tooltip: (param2: any) => {
        return {...param, ...param2}; // Extra fields
      },
      interaction: {
        tooltip: {
          render: (e: any, tooltipParam: any) => {
            let typeTitle = tooltipParam.items[0].type;
            return (
              <div>
                {typeTitle && <h4>{tooltipParam.title}</h4>}
                {tooltipParam.items.map((item: any, index: any) => {
                  const { name, yValue, series } = item;
                  let bStyle: any = { marginLeft: 24 };
                  return <div key={index}>
                    <div style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                      <div>{name} {series && <>- {series}</>}</div>
                      <b style={bStyle}>{yValue}</b>
                    </div>
                  </div>
                })}
              </div>
            );
          },
        },
      },
    };
    return defaultConfig;
  },
  /**
   * @method configLine
   * @desc 配置参数获取：线图
   * @param param 自定义参数：线图
   * @return 配置参数
   */
  configLine(param: any = {}) {
    let c: any = {
      ...myUtil.chartsAntD.defaultConfigLine(param),
      ...param,
    };
    return c;
  },
  /**
   * @method defaultConfigDualAxes
   * @desc 默认配置参数：双轴图
   */
  defaultConfigDualAxes(param: any = {}) {
    const { axisXTitle, xField = 'xValue' } = param;
    let defaultConfig: any = {
      paddingLeft: 130,
      paddingRight: 180,
      paddingTop: 40,
      paddingBottom: 60,
      legend: true,
      xField,
      axis: { x: {title: axisXTitle} },
      // tooltip 自定义渲染
      tooltip: (param2: any) => {
        return {...param, ...param2}; // Extra fields
      },
      interaction: {
        tooltip: {
          render: (e: any, tooltipParam: any) => {
            let typeTitle = tooltipParam.items[0].type;
            return (
              <div>
                {typeTitle && <h4>{tooltipParam.title}</h4>}
                {tooltipParam.items.map((item: any, index: any) => {
                  const { name, yValue, series } = item;
                  let bStyle: any = { marginLeft: 24 };
                  return <div key={index}>
                    <div style={{ margin: 0, display: 'flex', justifyContent: 'space-between' }}>
                      <div>{name} {series && <>- {series}</>}</div>
                      <b style={bStyle}>{yValue}</b>
                    </div>
                  </div>
                })}
              </div>
            );
          },
        },
      },
    };
    return defaultConfig;
  },
  /**
   * @method configLine
   * @desc 配置参数获取：双轴图
   * @param param 自定义参数：双轴图
   * @return 配置参数
   */
  configDualAxes(param: any = {}) {
    let c: any = {
      ...myUtil.chartsAntD.defaultConfigDualAxes(param),
      ...param,
    };
    const { children = [] } = param;
    let colorField: any = ['#EE6666', '#5470C6', '#91CC75'];
    let childrenTmp: any = [];
    children.forEach((item: any, index: any) => {
      let chartTmp: any =  {};
      if (item.type === 'line') {
        chartTmp = {
          ...item,
          colorField: item.colorField || colorField[index],
          // scale: { y: { domainMax: 1500 } },
          axis: {
            y: {
              position: item?.axisYPosition || 'left',
              title: item?.axisYTitle,
              style: { titleFill: colorField[index] },
              labelFormatter: function formatter(v: any) {
                return myUtil.text.formatNum(v, item.valueFormat || '0,0') + (item?.valueUnit || '');
              },
            },
          },
          // interaction: {
          //   tooltip: {
          //     crosshairs: false,
          //     marker: false,
          //   },
          // },
          style: { lineWidth: 2 },
          // style: { lineDash: [3, 1] },
          scale: { series: {independent: true} },
        }
      } else if (item.type === 'interval') {
        chartTmp = {
          ...item,
          colorField: item.colorField || colorField[index],
          // scale: { y: { domainMax: 1500 } },
          // style: { fillOpacity: 0.8 },
          style: { maxWidth: 50 },
          interaction: { elementHighlight: { background: true } },
          axis: {
            y: {
              position: item?.axisYPosition || 'left',
              title: item?.axisYTitle,
              style: { titleFill: colorField[index] },
              labelFormatter: function formatter(v: any) {
                return myUtil.text.formatNum(v, item.valueFormat || '0,0') + (item?.valueUnit || '');
              },
            },
          },
        }
      } else if (item.type === 'area') {
        chartTmp = {
          ...item,
          colorField: item.colorField || colorField[index],
          axis: {
            y: {
              position: item?.axisYPosition || 'left',
              title: item?.axisYTitle,
              style: { titleFill: colorField[index] },
              labelFormatter: function formatter(v: any) {
                return myUtil.text.formatNum(v, item.valueFormat || '0,0') + (item?.valueUnit || '');
              },
            },
          },
        }
      }
      childrenTmp.push(chartTmp);
    });
    c.children = childrenTmp;
    return c;
  },
  /**
   * @method chartsContent
   * @desc 根据配置展现图表
   * @param chartsConfig 图表参数
   * @return 图表
   */
  chartsContent({chartsConfig}: any) {
    let aaa: any = [];
    let proCardStyle = {height: '400px'};
    chartsConfig.forEach((ccc: any) => {
      let proCardConfig: any = { title: ccc?.title || '图表 - ' + ccc.type, style: proCardStyle};
      if (ccc.type === 'pie') {
        aaa.push(<ProCard {...proCardConfig}><Pie {...ccc.config}/></ProCard>);
      } else if (ccc.type === 'column') {
        aaa.push(<ProCard {...proCardConfig}><Column {...ccc.config}/></ProCard>);
      } else if (ccc.type === 'line') {
        aaa.push(<ProCard {...proCardConfig}><Line {...ccc.config}/></ProCard>);
      } else if (ccc.type === 'dualAxes') {
        aaa.push(<ProCard {...proCardConfig}><DualAxes {...ccc.config}/></ProCard>);
      } else if (ccc.type === 'area') {
        aaa.push(<ProCard {...proCardConfig}><Area {...ccc.config}/></ProCard>);
      }
    });
    return aaa;
  },
  /**
   * @method modalChart
   * @desc 展现图表弹窗
   * @param chartsConfig 图表参数
   */
  modalChart(chartsConfigArr: any) {
    Modal.info({
      title: '图表统计',
      wrapClassName: 'standard-modal-fn',
      width: CONSTANTS.C_MODAL_WIDTH_X4,
      footer: null,
      icon: null,
      closable: true,
      content: myUtil.chartsAntD.chartsContent({chartsConfig: chartsConfigArr }),
    });
  }
};
// #endregion ******************************************************************************************

// #region 码表
/**
 * ## 码表
 */
myUtil.code = {
  /**
   * @method getHeaderFilterOption
   * @desc 码表内容格式为页头筛选
   * @param key 码表key
   * @param showCode 下拉选项中是否显示code
   * @returns 页头筛选数组数据
   */
  getHeaderFilterOption(key: any, showCode?: boolean) {
    const valueKey = 'code';
    let nameKey = 'name';
    const code = this.getCode(key);
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
  },
  /**
   * @method getSelectOption
   * @desc 码表内容格式为下拉选项
   */
  getSelectOption(key: any) {
    let valueKey = 'code';
    let nameKey = 'name';
    const code = this.getCode(key);
    const option: any[] = [];
    if (code && code.length > 0) {
      code.forEach((item: any) => {
        option.push({
          value: item[valueKey],
          name: item[nameKey],
          label: item[nameKey],
        });
      })
    }
    return option;
  },
  /**
   * @method getUrlCodeParams
   * @desc 码表内容,单独使用url请求,参数初始化
   */
  getUrlCodeParams(key: any) {
    let url: string = '';
    let params: any;
    if (key === 'url_gy_hbhl') {
      url = '/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx';
      params = { page: 1, pageSize: 999999, searchModel: [{ property: "hbzmDm", value: "", op: "al" }]};
    }
    return { url, params };
  },

  async getCode2(key: any) {
    const localCodeTable: any = myUtil.sessionStore.getItem('codeTable');
    if (localCodeTable && localCodeTable[key]) {
      return localCodeTable[key];
    }
    let result: any;
    // 本地文件获取码表
    result = getStaticTableCode(key);
    // 服务器端获取码表
    if (!result || result.length <= 0) {
      let tmpParam: any = {
        dictCodeId: key,
      }
      result = await apiGetCode(tmpParam);
    }
    const { code, body } = result;
    if (code === '200') {
      this.saveCodeToLocalTable(key, body);
    }
    return body;
  },
  /**
   * @method getCodeFromServerT1
   * @desc 获取指定码表，服务器端
   */
  async getCodeFromServerT1(key: any, path?: any) {
    const localCodeTable: any = myUtil.sessionStore.getItem('codeTable');
    if (localCodeTable && localCodeTable[key]) {
      return localCodeTable[key];
    }
    let result;
    // 本地文件获取码表
    result = getStaticTableCode(key);
    // 服务器端获取码表
    if (!result || result.length <= 0) {
      if (key.indexOf('url') === 0) {
        const { url, params } = this.getUrlCodeParams(key);
        result = await getUrlCode(url, params)
        const { code, body } = result;
        if (code === '200' && body.rows.length > 0) {
          this.saveCodeToLocalTable(key, body.rows);
        }
        return body.rows;
      } else {
        let tmpParam: any = {
          dictCodeId: key,
        }
        if (path) {
          tmpParam.path = path;
        }
        result = await apiGetCode(tmpParam)
      }
    }
    const { code, body } = result;
    if (code === '200') {
      this.saveCodeToLocalTable(key, body);
    }
    return body;
  },
  /**
   * @method saveCodeToLocalTable
   * @desc 保存码表值本地存贮
   */
  saveCodeToLocalTable(key: any, codeTableByKey: any) {
    const localCodeTable: any = myUtil.sessionStore.getItem('codeTable') || {};
    if (codeTableByKey.length > 0) {
      localCodeTable[key] = codeTableByKey;
      myUtil.sessionStore.setItem('codeTable', localCodeTable);
    }
  },
  /**
   * @method deleteCodeToLocalTable
   * @desc 删除码表值本地存贮
   */
  deleteCodeToLocalTable(key: any) {
    const localCodeTable: any = myUtil.sessionStore.getItem('codeTable') || {};
    delete localCodeTable[key];
    myUtil.sessionStore.setItem('codeTable', localCodeTable);
  },
  /**
   * @method saveCodeToLocalTable
   * @desc 保存码表值本地存贮
   */
  saveCodeToLocalIndexedDB(key: any, codeTableByKey: any) {
    // const localCodeTable: any = myUtil.sessionStore.getItem('codeTable') || {};
    // localCodeTable[key] = codeTableByKey;
    // myUtil.sessionStore.setItem('codeTable', localCodeTable);
    codeTableByKey.forEach((item: any, index: any) => {
      myUtil.indexedDB.setItem(key, item, index);
    });
  },
  /**
   * @method getCode
   * @desc 获取指定码表
   */
  getCode(key: any) {
    const localCodeTable = myUtil.sessionStore.getItem('codeTable') || {};
    return localCodeTable[key] || [];
  },
  /**
   * @method getCodeValByKey
   * @desc 根据key获取指定码表的指定值，如果码表中无标准 code、name， 则采用match进行匹配
   */
  getCodeValByKey(targetCode: any, key: any, match: any = {}) {
    const codeTable = this.getCode(key);
    if (!codeTable || codeTable.length === 0) {
      return '';
    }
    return this.getCodeValByKey2(targetCode, codeTable, match );
  },
  /**
   * @method getCodeValByKey2
   * @desc 根据key及获取指定码表的指定值
   */
  getCodeValByKey2(targetCode: any, codeTable: any, {matchKey = 'code', matchValKey = 'name'}: any) {
    const valByKey: any[] = [];
    if (targetCode) {
      let targetCodeArr: any = targetCode;
      if (!Array.isArray(targetCode)) {
        targetCodeArr = (targetCode + '').split(',');
      }
      for (let a = 0; a <= targetCodeArr.length; a += 1) {
        codeTable.forEach((item: any) => {
          if (item[matchKey] === targetCodeArr[a]) {
            valByKey.push(item[matchValKey]);
          }
        });
      }
    }
    return valByKey.join('，');
  },
  /**
   * @method getCodeTableParam
   * @desc 根据key及获取指定码表的指定值
   */
  getCodeTableParam(arr: any, tmpObj: any) {
    arr.forEach((item: any) => {
      if (item.hasOwnProperty("children")) {
        this.getCodeTableParam(item.children, tmpObj);
      } else {
        const { codeTable, filter } = item;
        // 列表列、普通筛选、表单
        if (codeTable) {
          tmpObj[codeTable] = {
            key: codeTable,
          }
        }
        // 列头筛选
        if (filter?.codeTable) {
          tmpObj[filter?.codeTable] = {
            key: filter?.codeTable,
          }
        }
      }
    });
  },
  /**
   * @method getCodeTableParamFromJson
   * @desc 获取表单参数
   */
  getCodeTableParamFromJson(param: any) {
    const { items = [], path } = param;
    const codeParam: any[] = [];
    // 列表中需要的码表、查询条件中需要的码表、查询条件中需要的码表
    const tmpObj: any = {};
    myUtil.code.getCodeTableParam(items, tmpObj);
    for (let key in tmpObj) {
      if (tmpObj[key]) {
        codeParam.push(tmpObj[key]);
      }
    }
    return codeParam;
  },
  /**
   * @method getCodeTablePromise
   * @desc 获取表单promise
   */
  getCodeTablePromise(apiParam: any) {
    const promise = [];
    for (let i = 0; i < apiParam.length; i += 1) {
      const { key, path } = apiParam[i];
      const tmpCodeTable = myUtil.code.getCodeFromServerT1(key, path);
      promise.push(tmpCodeTable);
    }
    return promise;
  },
  /**
   * @method updateCodeTableByKeys
   * @desc 更新指定码表
   */
  updateCodeTableByKeys(codes: any) {
    // 获取码表接口promise
    let param: any = [];
    codes?.forEach((item: any) => {
      param.push({key: item});
      myUtil.code.deleteCodeToLocalTable(item);
    });
    const promiseArr = myUtil.code.getCodeTablePromise(param);
    if (promiseArr?.length > 0) {
      Promise.all(promiseArr)
        .then(() => {})
        .catch(() => { message.error('获取码表失败'); })
        .finally(() => {
        });
    }
  },
  /**
   * @method updateCodeTableAll
   * @desc 更新本地sessionStore所有码表
   */
  updateCodeTableAll() {
    const localCodeTable = myUtil.sessionStore.getItem('codeTable') || {};
    const codes: any = [];
    Object.keys(localCodeTable).forEach(key => {
      codes.push(key);
    });
    myUtil.code.updateCodeTableByKeys(codes);
  },
};
// #endregion ******************************************************************************************

// #region word word文档处理
/**
 * ## word文档处理
 */
myUtil.word = {
  /**
   * word通用配置
   */
  config(docxConfig: any) {
    let { fontFamily = '微软雅黑', fontSize = 18, fontLine = 276, fontSizeTitle1 = 32, fontSizeTitle2 = 26, fontSizeTitle3 = 22 } = docxConfig;
    let cc: any = {
      tableStyle: {
        verticalAlign: VerticalAlign.CENTER,
        margins: {
          left: convertInchesToTwip(0.05),
          right:convertInchesToTwip(0.05),
        }
      },
      styles: {
        default: {
          document: {
            run: { font: fontFamily, size: fontSize, color: "000000" },
            paragraph: {
              spacing: { line: fontLine }, // 正文行距 276/1.15倍  360/1.5倍
            }
          }
        },
        paragraphStyles: [
          { id: "Normal", name: "Normal", run: {}, paragraph: {} },
          { id: "Heading1", name: "Heading 1", run: { size: fontSizeTitle1, color: "000000" } },
          { id: "Heading2", name: "Heading 2", run: { size: fontSizeTitle2, color: "000000" } },
          { id: "Heading3", name: "Heading 3", run: { size: fontSizeTitle3, color: "000000" } },
          { id: "Heading4", name: "Heading 4", run: { size: fontSizeTitle3, color: "000000" } },
          { id: "Heading5", name: "Heading 5", run: { size: fontSizeTitle3, color: "000000" } },
          { id: "customTitle", name: "Custom Title", run: { size: 40, color: "000000", font: "等线" },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: { line: 240 }
            }
          },
          { id: "customContent", name: "Custom Content", run: { size: 36, color: "0000FF", font: "等线" },
            paragraph: {
              alignment: AlignmentType.LEFT,
              spacing: { line: 200 },
              indent: { left: convertInchesToTwip(0.2) }  // 内边距5mm≈0.2英寸
            }
          }
        ],
      },
    };
    return cc;
  },
  /**
   * @method saveDocx
   * @desc 输出word文件
   * @param doc word实例
   * @param name 输出的文件名
   */
  saveDocx({doc, name}: any) {
    Packer.toBlob(doc).then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = name;
      link.click();
    });
  },
  /**
   * @method createLevelTitle
   * @desc 生成word标题
   * @param text 标题名
   * @param level 标题级别
   * @returns 标题配置
   */
  createLevelTitle({text, level = 1, pageBreakBefore = false}: any) {
    let hLevel: any = `HEADING_${level}`;
    let hSpacing: any = { before: 200, after: 100 };
    if (level === 1) {
      hSpacing = { before: 400, after: 200 };
    } else if (level === 2) {
      hSpacing = { before: 300, after: 150 }
    }
    let tmpTitle: any = new Paragraph({
      text,
      heading: HeadingLevel[hLevel],
      outlineLevel: level,              // 设置大纲级别
      spacing: hSpacing,
      pageBreakBefore,
    });
    return tmpTitle;
  },
  /**
   * @method createToc
   * @desc 生成目录（自动生成）
   * @returns 目录配置
   */
  createToc({children = []}: any) {
    children.push(new Paragraph({
      children: [ new TextRun({ children: ['目录'], size: 30 })],
      alignment: AlignmentType.CENTER,
    }));
    children.push(new TableOfContents("Table of Contents", {
      headingStyleRange: "1-4", // 包含1-3级标题
      hyperlink: true,          // 启用目录跳转
    }));
  },
  /**
   * @method createHeader
   * @desc 生成页头
   */
  createHeader({docxTitle, docxConfig}: any) {
    return {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                children: [docxTitle],
                size: 16,
                color: '666666'
              }),
            ],
            alignment: AlignmentType.LEFT
          })
        ]
      })
    }
  },
  /**
   * @method createFooter
   * @desc 生成页脚
   */
  createFooter({docxConfig}: any) {
    return {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                children: ["第 ", PageNumber.CURRENT, ' 页 / 共 ', PageNumber.TOTAL_PAGES, ' 页'],
                size: 16,
                color: '666666'
              }),
            ],
            alignment: AlignmentType.RIGHT
          })
        ]
      })
    }
  },
  /**
   * @method createTable
   * @desc 生成列表
   * @returns 列表配置
   */
  createTable({cols = [], gridData = [], showLineNumber = false, docxConfig = {}}: any) {
    let { fontSize = 18 } = docxConfig;
    let headerTmp: any = [];
    if (showLineNumber) {
      headerTmp.push(new TableCell({
        children: [new Paragraph({
          alignment: AlignmentType.LEFT,
          children: [ new TextRun({ text: '序号', size: fontSize, bold: true }) ],
        })],
        ...myUtil.word.config({}).tableStyle,
        shading: { fill: "DDDDDD", type: "clear" },
      }));
    }
    cols.forEach((col: any) => {
      headerTmp.push(new TableCell({
        // children: [new Paragraph(col)],
        children: [new Paragraph({
          // text: col,
          alignment: AlignmentType.LEFT,
          // heading: HeadingLevel.HEADING_3,
          children: [ new TextRun({ text: col.title, size: fontSize, bold: true }) ],
        })],
        ...myUtil.word.config({}).tableStyle,
        shading: { fill: "DDDDDD", type: "clear" },
      }));
    });
    let headerRow = new TableRow({ children: headerTmp });
    let rows: any = [headerRow];
    gridData.forEach((rowData: any = {}, index: any) => {
      let tmpChildren: any = [];
      if (showLineNumber) {
        tmpChildren.push(new TableCell({
          children: [new Paragraph((index + 1) + '')],
          ...myUtil.word.config({}).tableStyle,
        }));
      }
      cols.forEach((col: any) => {
        let mmm = rowData[col.dataIndex] || '';
        if (col.format) {
          mmm = col.format(mmm);
        }
        tmpChildren.push(new TableCell({
          children: [new Paragraph(mmm)],
          ...myUtil.word.config({}).tableStyle,
        }));
      })
      rows.push(new TableRow({children: tmpChildren}));
    });
    return new Table({
      width: {
        size: 100,
        type: WidthType.PERCENTAGE // 设置为百分比宽度
      } ,
      rows,
      // style: "customTitle"
    });
  },
  /**
   * @method createParagraph
   * @desc 生成段落
   * @returns 段落配置
   */
  createParagraph({textParam, bullet, indent, shading, spacing}: any) {
    let tmp: any = {
      children: [new TextRun(textParam)],
    };
    if (spacing) {
      tmp = {
        ...tmp,
        spacing,
        // : {
        //   before: 60,  // 段前 6pt
        //   after:  60,  // 段后 6pt
          // line: 240,      // 行间距240缇
          // lineRule: LineRuleType.AUTO
        // },
      }
    }
    if (shading) {
      tmp = {
        ...tmp,
        shading,
        // {
        //   fill: "F2F2F2",      // 可改为 #RRGGBB 的十六进制字符串）
        //   type: ShadingType.CLEAR, // ShadingType.SOLID,
        //   // color: "auto" // 一般保持 auto 即可
        // },
      }
    }
    if (bullet) {
      tmp = {
        ...tmp,
        bullet: { level: 0 },
        indent: {
          left: 0,  // 段落左缩进
          hanging: 200  // 符号与文字间距
        },
      }
    }
    if (indent) {
      tmp = {
        ...tmp,
        indent: {
          firstLine: indent || 360
        },
      }
    }
    let tmpParagraph: any = new Paragraph(tmp);
    return tmpParagraph;
  },
}
// #endregion ******************************************************************************************


// #region other

myUtil.sys = {
  getConfig() {
    let theme: any = myUtil.localStore.getItem('theme') || {};
    let themeSkin: any = theme.skin || CONSTANTS.DEFAULT_THEME_SKIN;
    let layoutToken: any;
    if (themeSkin.indexOf('customer_config_skin_') > -1) {
      let customerSkin = (myUtil.theme.getAllSkin()).find((tmp: any) => { return tmp.value === themeSkin });
      layoutToken = customerSkin?.skin?.layoutToken;
    } else {
      let themeSkinIndex: any = themeSkin.replace('skin', '');
      layoutToken = theme_config[`theme_config_${themeSkinIndex}`]?.layoutToken;
    }
    let colorHeaderTitle = layoutToken?.header?.colorHeaderTitle;
    let colorTextMenuTitle = layoutToken?.sider?.colorTextMenuTitle || colorHeaderTitle;
    let colorTitle = myUtil.theme.getThemeItem('layout') === 'side' ? colorTextMenuTitle: colorHeaderTitle;
    return {
      title: CONSTANTS?.SYS_TITLE,
      copyRight:  CONSTANTS?.SYS_COPYRIGHT,
      logo: <span style={{color: colorTitle}}>{CONSTANTS?.SYS_LOGO_FONT}</span>,
      logo_login: CONSTANTS?.SYS_LOGO,
    }
  },
  // 保存用户配置 & 更新sessionStore
  async saveCustomerConfig({customer_config_key, customer_config_value, showResponseInfo}: any) {
    let currentUser: any = myUtil.sessionStore.getItem('currentUser') || {};
    let userId = currentUser?.userId;
    let customerConfig: any = await myUtil.sys.getCustomerConfig({userId});
    customerConfig[customer_config_key] = customer_config_value;
    let formParam: any = {
      key: 'm_sys_user',
    }
    if (ENV_TYPE === 'node') {
      formParam.user_id = userId;
      formParam.customer_config = JSON.stringify(customerConfig);
      formParam.formType = 'edit';
    } else {
      formParam.userId = userId;
      formParam.customerConfig = JSON.stringify(customerConfig);
    }
    saveOrUpdate(formParam).then((res: any) => {
      if (res.code === '200') {
        myUtil.sessionStore.setItem('customerConfig', customerConfig);
      }
      if (showResponseInfo) {
        myUtil.modal.responseInfo(res);
      }
    })
  },
  async getCustomerConfig({userId}: any) {
    let apiParam: any = {
      key : 'm_sys_user',
    }
    if (ENV_TYPE === 'node') {
      apiParam.user_id = userId;
    } else {
      apiParam.userId = userId;
    }
    const resForm: any = await queryForm(apiParam);
    let customerConfigStr: any;
    if (ENV_TYPE === 'node') {
      customerConfigStr = resForm?.body?.customer_config || '{}';
    } else {
      customerConfigStr = resForm?.body?.customerConfig || '{}';
    }
    let customerConfig: any;
    try {
      customerConfig = JSON.parse(customerConfigStr);
    } catch(e) {
      console.warn('JSON.parse err sdpUtil.app');
    }
    return customerConfig;
  },
  // eg: customerConfigKey: adf_plan
  getCustomerConfigByKey({customer_config_key, unitKey}: any) {
    let cc: any = myUtil.sessionStore.getItem('customerConfig') || {};
    // let ccByKey: any = cc[customer_config_key] || {};
    let ccByKey: any = cc[customer_config_key];
    let ccByKeyAndUnit: any;
    if (ccByKey) {
      ccByKeyAndUnit = ccByKey[unitKey] || [];
    }
    return { all: ccByKey, current: ccByKeyAndUnit };
  },
  saveCustomerConfigByKey({customer_config_key, customer_config_value}: any) {
    let cc: any = myUtil.sessionStore.getItem('customerConfig') || {};
    let adf_plan = customer_config_value;
    cc[customer_config_key] = adf_plan;
    myUtil.sessionStore.setItem('customerConfig', cc);
  },
}

myUtil.module = {
  async getLeafConfig(tmpAppTableDict: any, tagTxt: any = 'leaf:') {
    let leafArr = [];
    for (let m = 0; m < tmpAppTableDict.length; m++) {
      let gridRenderTxt =  ENV_TYPE === 'node' ? 'grid_render' : 'gridRender';
      if (tmpAppTableDict[m][gridRenderTxt]?.indexOf(tagTxt) > -1) {
        let formatStrArr = tmpAppTableDict[m][gridRenderTxt]?.split(tagTxt) || [];
        if (formatStrArr.length > 1) {
          let tmpArr = formatStrArr[1]?.split('&') || [];
          let leafModuleKey = tmpArr[0];
          let response1: any = await automaticPageDef(leafModuleKey);
          let tmpConfig = assembleConfigUtil.module.assembleAll({
            moduleInfo: response1.body.moduleInfo,
            appTableDict: response1.body.appTableDict,
          });
          let leafObj: any = {
            config: tmpConfig,
            field: tmpAppTableDict[m],
          }
          // 关联关系位于第三张表情况处理  rel2:eg_m_tag&tag_name&eg_m_staff_tag_ref
          if (tmpArr.length > 2) {
            let leafModuleKey2 = tmpArr[2];
            let response2: any = await automaticPageDef(leafModuleKey2);
            let tmpConfig2 = assembleConfigUtil.module.assembleAll({
              moduleInfo: response2.body.moduleInfo,
              appTableDict: response2.body.appTableDict,
            });
            leafObj.config2 = tmpConfig2;
          }
          leafArr.push(leafObj);
        }
      }
    }
    return leafArr;
  },
  // 根据modelkey调用接口，返回并设置config
  initAutomaticPageDef({ module_key, setMyConfig, module_type, extendConfig, beforeSetConfig }: any) {
    automaticPageDef(module_key).then(async (response1: any) => {
      if (response1.code === '200') {
        let leafArr: any = await myUtil.module.getLeafConfig(response1.body.appTableDict || []);
        let paramConfig: any = {
          moduleInfo: response1.body.moduleInfo,
          appTableDict: response1.body.appTableDict,
          leaf: leafArr,
        }
        let tmpConfig: any;
        if (module_type === 'tree') {
          tmpConfig = assembleConfigUtil.moduleTree.assembleAll(paramConfig)
        } else {
          tmpConfig = assembleConfigUtil.module.assembleAll(paramConfig)
        }
        if (extendConfig) {
          tmpConfig = {
            ...tmpConfig,
            ...extendConfig,
          }
        }
        if (beforeSetConfig) {
          beforeSetConfig(tmpConfig);
        }
        setMyConfig(tmpConfig);
      }
    });
  },
  // 匹配组件用数据格式 根据表单formItme匹配表单值，并设置
  setFormConfigValue({ formValue, form, formItems }: any) {
    for (let uuu = 0; uuu < formItems.length; uuu++) {
      let dictFieldAlias = formItems[uuu].name;
      let tmpVal  = dictFieldAlias ? formValue[dictFieldAlias] : '';
      if (tmpVal) {
        let formItemType = formItems[uuu].type;
        let codeTable = formItems[uuu].codeTable;
        let mode = formItems[uuu].mode;
        let formItemExtend = formItems[uuu].formItemExtend;
        if (formItemType === itemType.DatePicker) { // 日期格式化
          tmpVal = dayjs(new Date(tmpVal));
        } else if (mode === 'multiple' && formItemType === itemType.Select) { // 多选格式化
          tmpVal = tmpVal.split(',');
        } else if (codeTable) { // 码表格式化
          // tmpVal = myUtil.code.getCodeValByKey(tmpVal, codeTable);
        } else if (formItemType === itemType.InputNumber) { // 数值格式化
          // tmpVal = myUtil.text.formatNum(tmpVal, formItemExtend || '0,0');
        }
        formValue[dictFieldAlias] = tmpVal;
      }
    };
    form.setFieldsValue(formValue);
  },
  // myUtil.module.formatFormValue({ formItems, values });
  // 匹配接口用数据格式
  formatFormValue({ formItems, formValues }: any) {
    // 表单特殊类型处理
    formItems.forEach((item: any) => {
      if (item.type === itemType.DatePicker && formValues[item.name]) {  // 日期类型
        let dataFormatStr = item.format || 'YYYY-MM-DD';
        formValues[item.name] = new Date(dayjs(formValues[item.name]).format(dataFormatStr)).getTime();
      }
      if (item.type === itemType.Select && item.mode === 'multiple') {
        if (formValues[item.name]) {
          if (item.apiValueType === 'array') {
            formValues[item.name] = formValues[item.name];
          } else {
            formValues[item.name] = formValues[item.name].join(',');
          }
        }
      }
      if (item.type === itemType.ColorPicker && formValues[item.name]) {  // 颜色选择器类型
        formValues[item.name] = formValues[item.name];
      }
      if (item.type === itemType.RichTextEditor) {
        if (formValues[item.name]) {
          formValues[item.name] = formValues[item.name].toHTML();
        }
      }
      if (item.type === itemType.MarkdownEditor) {
        if (formValues[item.name]?.mdContent) {
          formValues[item.name] = formValues[item.name]?.mdContent;
        }
      }
      if (typeof formValues[item.name] === 'string') {
        formValues[item.name] = formValues[item.name]?.trim() || '';
      }
      // 媒体弹窗中选择的媒体文件处理
      if (item.type === itemType.MediaLibrary) {
        formValues[item.name] = formValues[item.name]?.mediaId || '';
      }
      if (item.type === itemType.Cascader) {
        if (formValues[item.name]) {
          if (item.apiValueType === 'array') { // 数组格式
            formValues[item.name] = formValues[item.name];
          } else { // 字符格式
            formValues[item.name] = formValues[item.name].join(',');
          }
        }
      }
      // 表单提交前调用
      // Func.formBeforeSubmit = (param: any) => {
      //   let media01: any = param?.form?.getFieldValue('media01');
      //   let media01cover: any = param?.form?.getFieldValue('media01cover');
      //   let media02: any = param?.form?.getFieldValue('media02');
      //   param.param.media01 = media01?.mediaId || '';
      //   param.param.media01cover = media01cover?.mediaId || '';
      //   param.param.media02 = media02?.mediaId || '';
      //   return true;
      // };
    })
  },
}

myUtil.mysql = {
  // 数据库 初始化数据
  initTableData(tables: any) {
    let tmpData: any = [];
    tables.forEach((table: any) => {
      let { tableName, data, needDelDataKey } = table;
      tmpData.push({
        table_name_eng: tableName,
        exportData: data,
        needDelDataKey: needDelDataKey, // 删除needDelDataKey值重复内容，即前次导入内容, 为空则全表删除后写如数据
      });
    });
    let param = {
      data: tmpData,
    };
    return initDbData(param);
  },
  // 数据库 创建表 表数据归类
  formatCreateTableData(createTableData: any) {
    let tablesArrOriginal: any = [];
    let tablesTmp: any;
    createTableData.forEach((item: any) => {
      let isTableNamRow = false;
      let tableNameHasVauleNum = 0;
      Object.keys(item).forEach(key => {
        if (item[key]) {
          tableNameHasVauleNum++;
        }
      });
      // 如果只有一列有数据，则当前行时表名所在行
      if (tableNameHasVauleNum === 1) {
        isTableNamRow = true;
      }
      let keysLength = Object.keys(item).length;
      // if (keysLength === 1) {
      if (isTableNamRow) {
        if (tablesTmp) {
          tablesArrOriginal.push(tablesTmp);
        }
        tablesTmp = {};
        tablesTmp.tableName = item;
        tablesTmp.cols = [];
      } else {
        tablesTmp?.cols?.push(item);
      }
    });
    // 录入最后一张表
    if (tablesTmp) {
      tablesArrOriginal.push(tablesTmp);
    }
    // 组装建表数据
    // table_name_eng: 'user11', table_name_chi: '用户11', table_cols: [
    //   { f_name: 'uuid', f_type: 'varchar(40)', f_default_value: '', f_comment: 'UUID', f_not_null: 'Y', f_key: 'primary'},
    //   { f_name: 'name', f_type: 'varchar(40)', f_default_value: '', f_comment: '姓名'},
    //   { f_name: 'create_time', f_type: 'date', f_default_value: '', f_comment: '录入事件'}
    // ]
    let tablesArr: any = [];
    tablesArrOriginal.forEach((item: any) => {
      let table_name_eng = (item.tableName['字段'] || '').split(' ')[1];
      let table_name_chi = (item.tableName['字段'] || '').split(' ')[0];
      let table_cols_tmp: any = item.cols;
      let table_cols: any = [];
      table_cols_tmp.forEach((item: any) => {
        table_cols.push({
          f_name: item['字段'],
          f_type: item['数据类型'],
          f_default_value: item['默认值'],
          f_comment: item['字段中文名'],
          f_not_null: item['非空'],
          f_key: item['键'],
        });
      });
      tablesArr.push({
        table_name_eng,
        table_name_chi,
        table_cols,
      });
    });
    return tablesArr;
  },
  // 数据库 创建表
  createTable(tablesArr: any) {
    let aaa = this.formatCreateTableData([...tablesArr]);
    return createTables({tables: aaa});
  },
  // 补充数据库字段
  addDbFields(searchModelObj: any = {}, objValue: any = {}) {
    searchModelObj[CONFIG_KEY.DICT_NAME] = objValue[CONFIG_KEY.DICT_NAME]; // 数据字典名
    searchModelObj[CONFIG_KEY.DICT_FIELD_ID] = objValue[CONFIG_KEY.DICT_FIELD_ID]; // 字段主键
    searchModelObj[CONFIG_KEY.DICT_FIELD_NAME] = objValue[CONFIG_KEY.DICT_FIELD_NAME]; // 字段名称
    searchModelObj[CONFIG_KEY.DICT_FIELD_DESC] = objValue[CONFIG_KEY.DICT_FIELD_DESC]; // 字段含义
    searchModelObj[CONFIG_KEY.DICT_FIELD_TYPE] = objValue[CONFIG_KEY.DICT_FIELD_TYPE];// 数据类型
    // java
    searchModelObj[CONFIG_KEY.DICT_FIELD_REL_TABLE] = objValue[CONFIG_KEY.DICT_FIELD_REL_TABLE]; // 关联数据表 (字段所处表)
    searchModelObj[CONFIG_KEY.DICT_FIELD_FLAG] = objValue[CONFIG_KEY.DICT_FIELD_FLAG]; // 与原库间的关系 (主表 or 关联表)
    searchModelObj[CONFIG_KEY.DICT_FIELD_ALIAS] = objValue[CONFIG_KEY.DICT_FIELD_ALIAS]; // 其它名称（别名）
    return searchModelObj;
  },
  // 删除所有表
  async dropAllTables() {
    try {
      let dictRes: any = await queryListNs({page: 1, pageSize: 999999, searchModel: []}, 'dict');
      if (dictRes.code !== '200' || dictRes.body.rowCount <= 0) {
        return [];
      }
      let tableArr: any = [];
      dictRes.body.rows.forEach((item: any) => {
        tableArr.push({table_name_eng: item.dict_name});
      })
      await dropDbTablesNs({tables: tableArr});
    } catch(e) {
      console.info(e)
    }
  }
}

/**
 * ## indexedDB
 */
myUtil.indexedDB = {
  /**
   * @method initDB
   * @desc 初始化indexedDB
   */
  initDB(keyArr: any) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(STORAGE_KEY);
      request.onerror = (event: any) => {
        console.log('Database error: ', event.target.errorCode);
        reject(event.target.errorCode);
      };
      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve(this.db);
      };
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (keyArr && keyArr.length > 0) {
          keyArr.forEach((key: any) => {
            if (!db.objectStoreNames.contains(key)) {
              db.createObjectStore(key, { autoIncrement: true });
            }
          });
        }
      };
    });
  },
  /**
   * @method deleteDB
   * @desc 删除指定indexedDB
   */
  deleteDB() {
    window.indexedDB.deleteDatabase(STORAGE_KEY);
  },
  /**
   * @method openDB
   * @desc 打开indexedDB的初始化函数
   */
  openDB(key: any, version: any) {
    return new Promise((resolve, reject) => {
      const request = window.indexedDB.open(STORAGE_KEY);
      request.onerror = (event: any) => {
        console.log('Database error: ', event.target.errorCode);
        reject(event.target.errorCode);
      };
      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve(this.db);
      };
      request.onupgradeneeded = (event: any) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains(key)) {
          db.createObjectStore(key, { autoIncrement: true });
        }
      };
    });
  },
  /**
   * @method updateData
   * @desc 修改键值key的indexedDB数据
   */
  setItem(key: any, value: any, index: any) {
    return this.openDB(STORAGE_KEY).then(() => {
      const transaction = this.db.transaction(key, 'readwrite');
      const store = transaction.objectStore(key);
      const result = store.get(index);
      result.onsuccess = function (event: any) {
        if (event.target.result) {
          // 更新对象
          store.put(value, index);
        } else {
          store.add(value, index);

        }
      };
    });
  },
  /**
   * @method getItem
   * @desc 根据键值key从indexedDB里获取数据
   */
  getItem(key: any, func: any) {
    return this.openDB(STORAGE_KEY).then(() => {
      const transaction = this.db.transaction(key, 'readonly');
      const store = transaction.objectStore(key);
      const result = store.getAll();
      result.onsuccess = function (event: any) {
        if (event.target.result) {
          func(event.target.result);
        } else {
          console.log('未获得数据记录');
        }
      };
    });
  },
  /**
   * @method clearItem
   * @desc 删除indexedDB里的指定数据
   */
  clearItem(key: any, index: any) {
    return this.openDB(STORAGE_KEY).then(() => {
      const transaction = this.db.transaction(key, 'readwrite');
      const store = transaction.objectStore(key);
      store.delete(index);
    });
  },
  /**
   * @method clearAll
   * @desc 删除当前对象仓库的所有记录
   */
  clearAll(key: any, index: any) {
    return this.openDB(key).then(() => {
      const transaction = this.db.transaction(key, 'readwrite');
      const store = transaction.objectStore(key);
      store.clear();
    });
  },
};

// 权限
myUtil.authority = {
  // 清空用户信息
  clearUserInfo() {
    window.localStorage.removeItem(CONSTANTS.LOGIN.ACCESS_TOKEN_KEY);
    myUtil.sessionStore.clear('userInfo');
    myUtil.sessionStore.clear('usermenu');
    myUtil.sessionStore.clear('menuArr');
    myUtil.sessionStore.clear('codeTable');
  },
  // isWhiteListUrl
  isWhiteListUrl() {
    let whiteList = CONSTANTS.WHITE_LIST || [];
    let inWhiteList = false;
    for (let i = 0; i < whiteList.length; i++) {
      if (window.location.href.indexOf(whiteList[i]) > -1) {
        inWhiteList = true;
        break;
      }
    }
    return inWhiteList;
  },
  // isWhiteListRouterUrl
  isWhiteListRouterUrl() {
    let whiteList = CONSTANTS.WHITE_LIST_ROUTER || [];
    let inWhiteList = false;
    for (let i = 0; i < whiteList.length; i++) {
      if (window.location.href.indexOf(whiteList[i]) > -1) {
        inWhiteList = true;
        break;
      }
    }
    return inWhiteList;
  },
  // 是否含有当前资源id权限
  hasAuthorityResource({ resourceCode, currentUser }: any ) {
    // 是否开启资源权限判断
    if (!CONSTANTS.OPEN_RESOURCE_AUTHORITY) {
      return true;
    };
    // 获取需要判断权限的按钮
    let menuBtn: any = myUtil.sessionStore.getItem('menuBtn') || [];
    if (menuBtn?.length === 0) {
      return true;
    }
    // 判断页面目标按钮ID(resourceCode)是否在所有按钮ID中
    let targetBtn: any;
    if (ENV_TYPE === 'node') {
      targetBtn = menuBtn?.find((item: any) => { return item.web_resource_code === resourceCode });
    } else {
      targetBtn = menuBtn?.find((item: any) => { return item.menuId === resourceCode });
    }
    if (!targetBtn) {
      return true;
    }
    // 获取当前登录人拥有的按钮资源
    let webComponent: any = [];
    if ( currentUser?.body?.webComponent?.length >= 0) {
      webComponent = currentUser?.body?.webComponent;
    } else {
      if (ENV_TYPE === 'node') {
        webComponent  = myUtil.sessionStore.getItem('currentUser')?.menuInfo || [];
      } else {
        webComponent  = myUtil.sessionStore.getItem('currentUser')?.webComponent || [];
      }
    }
    let curentResourceList: any = [];
    webComponent.forEach((item: any) => {
      if (ENV_TYPE === 'node') {
        if (item.web_resource_code) {
          curentResourceList.push(item.web_resource_code)
        }
      } else {
        curentResourceList.push(item.menuId)
      }
    });
    if (curentResourceList?.includes(resourceCode)) {
      return true;
    }
    return false;
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
        if (menuTreeParam[i].id === id) {
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

/**
 * ## 列表组件
 */
myUtil.grid = {
  /**
   * @method formatDate
   * @desc 格式化日期格式
   */
  formatDate(date: any, format: any) {
    if (date) {
      if (date?.constructor === String) {
        if (date.length !== 13) {
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
  /**
   * @method formatNum
   * @desc 格式化数值格式
   */
  formatNum(value: any, format: any) {
    const val = myUtil.text.formatNum(value, format);
    return val;
  },
  /**
   * @method formatBankNo
   * @desc 格式化银行卡号格式
   */
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
    return <a onClick={(event: any) => { event.stopPropagation(); }}>
      <Tooltip title={text} trigger='click'>{str}<EyeOutlined /></Tooltip>
    </a>;
  },
  /**
   * @method formatBankNo
   * @desc 格式化*符号
   */
  formatStar(param: any) {
    let { text } = param;
    return <a onClick={(event: any) => { event.stopPropagation(); }}>
      <Tooltip title={text} trigger='click'>******** <EyeOutlined /></Tooltip>
    </a>;
  },
  /**
   * @method formatColToPlain
   * @desc 讲列表列子项平展开
   */
  formatColToPlain(targetCol: any) {
    const changeColumesRoF = (newData: any[], col: any) => {
      col.forEach((data: any) => {
        if (data.children && data.children.length > 0) {
          changeColumesRoF(newData, data.children)
        } else {
          newData.push(data);
        }
      });
    }
    // const changeColumesRoF1 = (col: any) => {
    let newData: any = [];
    changeColumesRoF(newData, targetCol);
    return newData;
    // }
  },
  // 根据config格式化数据
  formatGridData(data: any, cols: any) {
    let tmpGridData = cloneDeep(data);
    for (let m = 0; m < tmpGridData.length; m++) {
      let tmpRow = tmpGridData[m];
      for (let n = 0; n < cols.length; n++) {
        let tmpDataIndex = cols[n].dataIndex
        if (cols[n].codeTable) {
          // tmpRow[tmpDataIndex] = myUtil.code.getCodeValByKey(tmpRow[tmpDataIndex], cols[n].codeTable);
          // 如果当前列需要转换为码表，则当前列索引增加后缀标识 作为新的码表转化值，不改变元数据
          tmpRow[`${tmpDataIndex}___code_table_val`] = myUtil.code.getCodeValByKey(tmpRow[tmpDataIndex], cols[n].codeTable);
        } else if (cols[n]?.renderOriginal?.type === 'date') {
          tmpRow[tmpDataIndex] = cols[n].render(tmpRow[tmpDataIndex]);
        } else if (cols[n]?.renderOriginal?.type === 'number') {
          if (!tmpRow[tmpDataIndex]) {
            tmpRow[tmpDataIndex] = '';
          }
        } else if (cols[n]?.renderOriginal?.timeEasyRead) {
          let showText: any = tmpRow[tmpDataIndex];
          let costTime = tmpRow[tmpDataIndex];
          if (costTime === 0) {
            showText = '-';
          } else if (costTime < 1000) {
            showText = `${myUtil.text.formatNum(costTime, '0,0')  } 毫秒`;
          } else if ((costTime / 1000) <= 60) {
            showText = `${myUtil.text.formatNum(costTime / 1000, '0,0')  } 秒`;
          } else if ((costTime / 1000  / 60) <= 60) {
            showText = `${myUtil.text.formatNum(costTime / 1000 / 60, '0,0')  } 分`;
          }
          tmpRow[tmpDataIndex] = showText;
        } else if (cols[n]?.renderOriginal?.map) {
          let showText: any = tmpRow[tmpDataIndex];
          let tmpMap = cols[n]?.renderOriginal?.map;
          if (tmpMap && tmpMap.length > 0) {
            let targetEle = tmpMap?.find((item: any) => { return item.value === tmpRow[tmpDataIndex] });
            if (!targetEle) {
              targetEle = tmpMap?.find((item: any) => { return item.value === '' });
            }
            showText = targetEle?.text;
          }
          tmpRow[tmpDataIndex] = showText;
        } else if (tmpRow[tmpDataIndex] === null) {
          tmpRow[tmpDataIndex] = '';
        }
      }
    }
    return tmpGridData;
  }
}

// treeSelect 码表
myUtil.treeCode = {
  // 从服务器获取指定码表
  async getTreeCodeFormServer(key: any) {
    const localCodeTable: any = myUtil.sessionStore.getItem('treeTable');
    if (localCodeTable && localCodeTable[key]) {
      return localCodeTable[key];
    }
    let result;
    // 本地文件获取码表
    result = getStaticTableCode(key);
    // 服务器端获取码表
    if (!result || result.length <= 0) {
      // result = await apiGetTreeCode({
      result = await apiGetCode({
        dictCodeId: key,
      })
    }
    const { code, body } = result;
    if (code === '200') {
      myUtil.code.saveCodeToLocalTable(key, body); // 保存一份同名扁平化码表数据， 列表渲染用...
      let body2 = cloneDeep(body);
      body2.forEach((body2Item: any) => {
        body2Item.title = body2Item.name;
        body2Item.value = body2Item.code;
      });
      let aaa: any = myUtil.tree.transformArrToTree(body2, '', {
        idName: 'code',
        parentIdName: 'pid',
        childrenName: 'children',
      });
      this.saveTreeCodeToLocalTable(key, aaa);
    }
    return body;
  },
  // 保存码表值本地存贮
  saveTreeCodeToLocalTable(key: any, codeTableByKey: any) {
    const localCodeTable: any = myUtil.sessionStore.getItem('treeTable') || {};
    localCodeTable[key] = codeTableByKey;
    myUtil.sessionStore.setItem('treeTable', localCodeTable);
  },
  // 获取执行码表
  getTreeCode(key: any) {
    const localCodeTable = myUtil.sessionStore.getItem('treeTable') || {};
    return localCodeTable[key];
  },
  // 获取treeData
  getTreeCodeData(key: any) {
    const treeData = this.getTreeCode(key);
    return treeData;
  },
  /**
    * @method getCodeTableParam
    * @desc 根据key及获取指定码表的指定值
    */
  getCodeTableParam(arr: any, tmpObj: any) {
    arr.forEach((item: any) => {
      if (item.hasOwnProperty("children")) {
        this.getCodeTableParam(item.children, tmpObj);
      } else {
        const { treeTable, filter } = item;
        // 列表列、普通筛选、表单
        if (treeTable) {
          tmpObj[treeTable] = {
            key: treeTable,
          }
        }
        // 列头筛选
        // if (filter?.treeTable) {
        //   tmpObj[filter?.treeTable] = {
        //     key: filter?.treeTable,
        //   }
        // }
      }
    });
  },
  /**
   * @method getTreeCodeTableParamFromJson
   * @desc 获取表单参数
   */
  getTreeCodeTableParamFromJson(param: any) {
    const { items = [] } = param;
    const codeParam: any[] = [];
    // 列表中需要的码表、查询条件中需要的码表、查询条件中需要的码表
    const tmpObj: any = {};
    myUtil.treeCode.getCodeTableParam(items, tmpObj);
    for (let key in tmpObj) {
      if (tmpObj[key]) {
        codeParam.push(tmpObj[key]);
      }
    }
    return codeParam;
  },
  // 获取表单参数
  // getTreeCodeTableParamFromJson(param: any) {
  //   const { items = [] } = param;
  //   const treeCodeParam: any[] = [];
  //   // 列表中需要的码表、查询条件中需要的码表、查询条件中需要的码表
  //   items.forEach((item: any) => {
  //     const { treeTable } = item;
  //     if (treeTable) {
  //       treeCodeParam.push({
  //         key: treeTable,
  //       });
  //     }
  //   });
  //   debugger
  //   return treeCodeParam;
  // },
  // 获取表单promise
  getTreeCodeTablePromise(apiParam: any) {
    const promise = [];
    for (let i = 0; i < apiParam.length; i += 1) {
      const { key } = apiParam[i];
      const tmpCodeTable = myUtil.treeCode.getTreeCodeFormServer(key);
      promise.push(tmpCodeTable);
    }
    return promise;
  },
  /**
   * @method deleteCodeToLocalTable
   * @desc 删除码表值本地存贮
   */
  deleteCodeToLocalTable(key: any) {
    const localCodeTable: any = myUtil.sessionStore.getItem('treeTable') || {};
    delete localCodeTable[key];
    myUtil.sessionStore.setItem('treeTable', localCodeTable);
  },
  /**
   * @method updateCodeTableByKeys
   * @desc 更新指定码表
   */
  updateCodeTableByKeys(codes: any) {
    // 获取码表接口promise
    let param: any = [];
    codes?.forEach((item: any) => {
      param.push({key: item});
      myUtil.treeCode.deleteCodeToLocalTable(item);
    });
    const promiseArr = myUtil.treeCode.getTreeCodeTablePromise(param);
    if (promiseArr?.length > 0) {
      Promise.all(promiseArr)
        .then(() => {})
        .catch(() => { message.error('获取码表失败'); })
        .finally(() => {
        });
    }
  },
}

/**
 * ## 文件
 */
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
  downloadFile(content: Blob, filename: any) {
    let eleLink = document.createElement('a');
    eleLink.download = filename;
    eleLink.style.display = 'none';
    // 字符内容转变成blob地址
    // let blob = new Blob([content]);
    let blob = content;
    eleLink.href = URL.createObjectURL(blob);
    document.body.appendChild(eleLink);
    eleLink.click();
    document.body.removeChild(eleLink);
  },
  // 读取blob文件
  readBlobData(blob: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = function(event: any) {
        const text = event.target.result;
        resolve(text);
      };
      reader.onerror = function(event: any) {
        reject(event.target.error);
      };
      reader.readAsText(blob);
    });
  },
  // 读取文件
  readFileSync(file: any) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event: any) => {
        resolve(event.target.result);
      };
      reader.onerror = function(error) {
        reject(error);
      };
      reader.readAsArrayBuffer(file);
    });
  },
  // ArrayBuffer转BinaryString
  arrayBufferToBinaryString(buffer: any) {
    let binary = '';
    let bytes = new Uint8Array(buffer);
    let len = bytes.byteLength;
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return binary;
  },
  getFileMD5(file: any) {
    return new Promise((resolve, reject) => {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        const arrayBuffer = fileReader.result;
        const md5Hash = SparkMD5.ArrayBuffer.hash(arrayBuffer);
        resolve(md5Hash);
      };
      fileReader.onerror = error => reject(error);
      fileReader.readAsArrayBuffer(file);
    });
  }
};

// 数组
myUtil.array = {
  /**
   * @method cleanObject
   * @desc 使用Map和filter根据对象属性去重
   * @param obj - 要处理的对象
   * @returns Object 清理后的对象
   */
  dedupeByProperty(arr: any, prop: any) {
    const seen = new Map();
    return arr.filter((item: any) => {
      const key = item[prop];
      return !seen.has(key) && seen.set(key, true);
    });
  },
  groupByFields(array: any, ...fields: any) {
    return array.reduce((result: any, item: any) => {
      const groupKey = fields.map((field: any) => item[field]).join('|');
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {});
  },
  traverseTreeLeaf(arr: any) {
    arr?.forEach((item: any) => {
      if (item.hasOwnProperty("children")) {
        item.disabled = true;
        this.traverseTreeLeaf(item.children);
      }
    })
  },
  setKey(arr: any = []) {
    arr.map((tmp: any) => {
      if (!tmp.key) {
        tmp.key = myUtil.text.uuid();
      }
    })
    return arr;
  }
};

// 页面高度计算
myUtil.heightCalc = {
  header: CONSTANTS.LAYOUT_HEADER_HEIGHT + 'px',         // 系统页头
  headerTab: '40px',      // 主页最上层Tab
  cardMargin: '40px',     // 主页margin
  footerBtn: '51px',      // 弹窗页脚
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
    return ss;
  }
}

// 页面高度计算
myUtil.layout = {
  formX1: {
    layout: {
      labelcol: { span: 7 },
      wrappercol: { span: 17 },
    },
    tailLayout: {
      wrappercol: { offset: 7, span: 17 },
    },
  },
  formX2: {
    layout: {
      labelcol: { span: 7 },
      wrappercol: { span: 17 },
    },
    tailLayout: {
      wrappercol: { offset: 7, span: 17 },
    },
  },
  formX2_1: {
    layout: {
      labelcol: { span: 6 },
      wrappercol: { span: 18 },
    },
    tailLayout: {
      wrappercol: { offset: 6, span: 18 },
    },
  },
}

// fileName
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

// api
myUtil.api = {
  getApiRoot() {
    let apiPrefix = API_URL_BASE;
    if (window.location.href.indexOf('/other/create_word') > -1 ||
      window.location.href.indexOf('/ai/theme') > -1) {
    } else if(window.location.href.indexOf('/example/') > -1) {
      apiPrefix = API_URL_EXAMPLE;
    }
    return apiPrefix;
  },
}

// 媒体
myUtil.media = {
  // 获取媒体图标
  getMediaIcon(mediaType: any, text: any) {
    const themeToken: any = myUtil.theme.getThemeToken();
    const colorError = themeToken?.token?.colorError;
    const colorWarning = themeToken?.token?.colorWarning;
    const colorSuccess = themeToken?.token?.colorSuccess;
    const colorInfo = themeToken?.token?.colorInfo;
    let iconConfig = {
      size: '14',
      fill: '#333',
    };
    let iconTmp;
    if (CONSTANTS.MEDIA.TYPE_PICTURED.indexOf(mediaType) > -1) {
      iconTmp =<PictureAlbum theme="outline" {...iconConfig} fill={colorSuccess} />;
    } else if (CONSTANTS.MEDIA.TYPE_VIDEO.indexOf(mediaType) > -1) {
      iconTmp =<VideoOne theme="outline" {...iconConfig} fill={colorError} />;
    } else if (CONSTANTS.MEDIA.TYPE_MUSIC.indexOf(mediaType) > -1) {
      iconTmp =<Music theme="outline" {...iconConfig} fill={colorInfo} />;
    } else if (CONSTANTS.MEDIA.TYPE_EXCEL.indexOf(mediaType) > -1) {
      iconTmp = <ExcelOne theme="outline" {...iconConfig} fill={colorInfo}/>
    } else if (CONSTANTS.MEDIA.TYPE_WORD.indexOf(mediaType) > -1) {
      iconTmp = <Word theme="outline" {...iconConfig} fill={colorInfo}/>
    } else if (CONSTANTS.MEDIA.TYPE_PPT.indexOf(mediaType) > -1) {
      iconTmp = <Ppt theme="outline" {...iconConfig} fill={colorInfo}/>
    } else if (CONSTANTS.MEDIA.TYPE_ZIP.indexOf(mediaType) > -1) {
      iconTmp = <Zip theme="outline" {...iconConfig} fill={colorWarning}/>
    } else {
      iconTmp = <FileEditingOne theme="outline" {...iconConfig} fill={colorError}/>
    }
    return <>
      {iconTmp} {text}
    </>;
  },
  // 获取媒体图标2
  getMediaIcon2(mediaType: any) {
    const themeToken: any = myUtil.theme.getThemeToken();
    const colorError = themeToken?.token?.colorError;
    const colorWarning = themeToken?.token?.colorWarning;
    const colorSuccess = themeToken?.token?.colorSuccess;
    const colorInfo = themeToken?.token?.colorInfo;
    let iconConfig = {
      size: '18',
      fill: '#333',
    };
    let iconTmp;
    if (CONSTANTS.MEDIA.TYPE_PICTURED.indexOf(mediaType) > -1) {
      iconTmp =<PreviewOpen theme="outline"  {...iconConfig} fill={colorSuccess} />;
    } else if (CONSTANTS.MEDIA.TYPE_VIDEO.indexOf(mediaType) > -1) {
      iconTmp = <PlayOne theme="outline" {...iconConfig} fill={colorInfo}/>
    } else if (CONSTANTS.MEDIA.TYPE_MUSIC.indexOf(mediaType) > -1) {
      iconTmp = <PlayOne theme="outline" {...iconConfig} fill={colorInfo}/>
    } else if (CONSTANTS.MEDIA.TYPE_EXCEL.indexOf(mediaType) > -1) {
      iconTmp = <ExcelOne theme="outline" {...iconConfig} fill={colorInfo}/>
    } else if (CONSTANTS.MEDIA.TYPE_WORD.indexOf(mediaType) > -1) {
      iconTmp = <Word theme="outline" {...iconConfig} fill={colorInfo}/>
    } else if (CONSTANTS.MEDIA.TYPE_PPT.indexOf(mediaType) > -1) {
      iconTmp = <Ppt theme="outline" {...iconConfig} fill={colorInfo}/>
    } else if (CONSTANTS.MEDIA.TYPE_ZIP.indexOf(mediaType) > -1) {
      iconTmp = <Zip theme="outline" {...iconConfig} fill={colorWarning}/>
    } else {
      iconTmp = <FileEditingOne theme="outline" {...iconConfig} fill={colorError}/>
    }
    return <>
      {iconTmp}
    </>;
  },
  // 卡片渲染
  getCardContent(item: any) {
    const themeToken: any = myUtil.theme.getThemeToken();
    const colorError = themeToken?.token?.colorError;
    const colorWarning = themeToken?.token?.colorWarning;
    const colorSuccess = themeToken?.token?.colorSuccess;
    const colorInfo = themeToken?.token?.colorInfo;
    let coverTmp;
    let iconConfig = {
      size: '64',
      fill: '#333',
    };
    let mediaPathPic: any;
    let mediaPathVideo: any;
    let mediaType: any = ENV_TYPE === 'node' ? item.media_type : item.mediaType;
    let fileMD5Pic = item.media_file_md5;
    let fileMD5Video = item.media_file_md5;
    if (ENV_TYPE === 'node') {
      if (item.mediaPathPic) {
        fileMD5Pic = item.mediaPathPic;
      }
      if (item.mediaPathVideo) {
        fileMD5Video = item.mediaPathVideo;
      }
      mediaPathPic = `${API_URL_BASE}/static/${fileMD5Pic}.${item.mediaTypePic || mediaType}`;
      mediaPathVideo = `${API_URL_BASE}/static/${fileMD5Video}.${item.mediaTypeVideo || mediaType}`;
    } else {
      if (item?.mediaPathPic?.indexOf('http://') > -1 || item?.mediaPathPic?.indexOf('https://') > -1) {
        mediaPathPic = item?.mediaPathPic;
      } else {
        mediaPathPic = `${API_URL_BASE}/dict/${item?.mediaPathPic}`;
      }
      mediaPathVideo = item?.mediaPathVideo ? `${item?.mediaPathVideo}` : '';
      if (mediaPathVideo.indexOf('http://') > -1 || mediaPathVideo.indexOf('https://') > -1) {
      } else {
        mediaPathVideo = `${API_URL_BASE}/dict/${mediaPathVideo}`;
      }
    }
    if (CONSTANTS.MEDIA.TYPE_PICTURED.indexOf(mediaType) > -1) {
      coverTmp =<Image
        src={mediaPathPic}
        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
      />;
    } else if (CONSTANTS.MEDIA.TYPE_VIDEO.indexOf(mediaType) > -1) {
      let previewVideo;
      previewVideo = {
        preview:{
          // destroyOnClose: true,
          imageRender: () => (
            <video
              muted
              width="100%"
              height="100%"
              controls
              src={`${mediaPathVideo}`}
            />
          ),
          actionsRender: () => null,
        }
      }
      if (item?.mediaPathPic) {
        coverTmp =<Image
        {...previewVideo}
        src={mediaPathPic}
        fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3PTWBSGcbGzM6GCKqlIBRV0dHRJFarQ0eUT8LH4BnRU0NHR0UEFVdIlFRV7TzRksomPY8uykTk/zewQfKw/9znv4yvJynLv4uLiV2dBoDiBf4qP3/ARuCRABEFAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghggQAQZQKAnYEaQBAQaASKIAQJEkAEEegJmBElAoBEgghgg0Aj8i0JO4OzsrPv69Wv+hi2qPHr0qNvf39+iI97soRIh4f3z58/u7du3SXX7Xt7Z2enevHmzfQe+oSN2apSAPj09TSrb+XKI/f379+08+A0cNRE2ANkupk+ACNPvkSPcAAEibACyXUyfABGm3yNHuAECRNgAZLuYPgEirKlHu7u7XdyytGwHAd8jjNyng4OD7vnz51dbPT8/7z58+NB9+/bt6jU/TI+AGWHEnrx48eJ/EsSmHzx40L18+fLyzxF3ZVMjEyDCiEDjMYZZS5wiPXnyZFbJaxMhQIQRGzHvWR7XCyOCXsOmiDAi1HmPMMQjDpbpEiDCiL358eNHurW/5SnWdIBbXiDCiA38/Pnzrce2YyZ4//59F3ePLNMl4PbpiL2J0L979+7yDtHDhw8vtzzvdGnEXdvUigSIsCLAWavHp/+qM0BcXMd/q25n1vF57TYBp0a3mUzilePj4+7k5KSLb6gt6ydAhPUzXnoPR0dHl79WGTNCfBnn1uvSCJdegQhLI1vvCk+fPu2ePXt2tZOYEV6/fn31dz+shwAR1sP1cqvLntbEN9MxA9xcYjsxS1jWR4AIa2Ibzx0tc44fYX/16lV6NDFLXH+YL32jwiACRBiEbf5KcXoTIsQSpzXx4N28Ja4BQoK7rgXiydbHjx/P25TaQAJEGAguWy0+2Q8PD6/Ki4R8EVl+bzBOnZY95fq9rj9zAkTI2SxdidBHqG9+skdw43borCXO/ZcJdraPWdv22uIEiLA4q7nvvCug8WTqzQveOH26fodo7g6uFe/a17W3+nFBAkRYENRdb1vkkz1CH9cPsVy/jrhr27PqMYvENYNlHAIesRiBYwRy0V+8iXP8+/fvX11Mr7L7ECueb/r48eMqm7FuI2BGWDEG8cm+7G3NEOfmdcTQw4h9/55lhm7DekRYKQPZF2ArbXTAyu4kDYB2YxUzwg0gi/41ztHnfQG26HbGel/crVrm7tNY+/1btkOEAZ2M05r4FB7r9GbAIdxaZYrHdOsgJ/wCEQY0J74TmOKnbxxT9n3FgGGWWsVdowHtjt9Nnvf7yQM2aZU/TIAIAxrw6dOnAWtZZcoEnBpNuTuObWMEiLAx1HY0ZQJEmHJ3HNvGCBBhY6jtaMoEiJB0Z29vL6ls58vxPcO8/zfrdo5qvKO+d3Fx8Wu8zf1dW4p/cPzLly/dtv9Ts/EbcvGAHhHyfBIhZ6NSiIBTo0LNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiECRCjUbEPNCRAhZ6NSiAARCjXbUHMCRMjZqBQiQIRCzTbUnAARcjYqhQgQoVCzDTUnQIScjUohAkQo1GxDzQkQIWejUogAEQo121BzAkTI2agUIkCEQs021JwAEXI2KoUIEKFQsw01J0CEnI1KIQJEKNRsQ80JECFno1KIABEKNdtQcwJEyNmoFCJAhELNNtScABFyNiqFCBChULMNNSdAhJyNSiEC/wGgKKC4YMA4TAAAAABJRU5ErkJggg=="
      />;
      } else {
        coverTmp = <Link to={`/player?mediaPath=${mediaPathVideo}`} target='_blank' style={{display: 'block', textAlign: 'center', padding: '12px 0 0 0 '}}>
            <VideoOne theme="outline" {...iconConfig} fill={colorError}
          />
        </Link>
      }
    } else if (CONSTANTS.MEDIA.TYPE_MUSIC.indexOf(mediaType) > -1) {
      coverTmp = <Link to={`/player?mediaPath=${mediaPathVideo}`} target='_blank' style={{display: 'block', textAlign: 'center', padding: '12px 0 0 0 '}}>
          <Music theme="outline" {...iconConfig} fill={colorSuccess}
        />
      </Link>
    } else if (CONSTANTS.MEDIA.TYPE_EXCEL.indexOf(mediaType) > -1) {
      coverTmp = <ExcelOne theme="outline" {...iconConfig} fill={colorInfo}/>
    } else if (CONSTANTS.MEDIA.TYPE_WORD.indexOf(mediaType) > -1) {
      coverTmp = <Word theme="outline" {...iconConfig} fill={colorInfo}/>
    } else if (CONSTANTS.MEDIA.TYPE_PPT.indexOf(mediaType) > -1) {
      coverTmp = <Ppt theme="outline" {...iconConfig} fill={colorInfo}/>
    } else if (CONSTANTS.MEDIA.TYPE_ZIP.indexOf(mediaType) > -1) {
      coverTmp = <Zip theme="outline" {...iconConfig} fill={colorWarning}/>
    } else {
      coverTmp = <FileEditingOne theme="outline" {...iconConfig} fill={colorInfo}/>
    }
    return coverTmp;
  },
}

// 分词
myUtil.segmentation = {
  setSegmentation(param: any) {
    const { form, item } = param;
    let referField = item.fc02;
    let dictType = item.fc01;
    let targetField = item.name;
    let word = form.getFieldValue(referField) || '';
    let apiPara: any = {
      word,
      dictType,
    };
    segmenter(apiPara).then((response: any) => {
      const { code, body } = response;
      if (code === '200') {
        let reVal: any = {};
        reVal[targetField] = body.join(',');
        form.setFieldsValue(reVal);
      }
    })
  },
}

myUtil.sdp = {
  async init({currentUser}: any) {
    // 用户配置初始化
    let userId: any = currentUser.userId;
    let customerConfig: any = await myUtil.sys.getCustomerConfig({userId});
    myUtil.sessionStore.setItem('customerConfig', customerConfig);
    // 更新指定码表
    myUtil.code.updateCodeTableByKeys(['code_dm_def_module', ENV_TYPE === 'node' ? 'code_dm_def_module_field' : 'code_dm_def_dict', 'code_dm_def_user']);
    // 菜单码表配置初始化
    let dataMenu: any = await queryList({page: 1, pageSize: 999999, searchModel: []}, 'm_sys_menu');
    if (dataMenu?.code === '200' && dataMenu?.body?.rows?.length > 0) {
      let rowsMenu: any = dataMenu.body.rows;
      rowsMenu.forEach((item: any) => {
        item.title = ENV_TYPE === 'node' ? item.menu_name : item.menuName;
        item.value = ENV_TYPE === 'node' ? item.menu_id : item.menuId;
        item.code = ENV_TYPE === 'node' ? item.menu_id : item.menuId;
        item.name = ENV_TYPE === 'node' ? item.menu_name : item.menuName;
      });
      myUtil.code.saveCodeToLocalTable('code_dm_menu', rowsMenu);
      let menuCodeTree: any = myUtil.tree.transformArrToTree(rowsMenu, '', {
        idName: ENV_TYPE === 'node' ? 'menu_id' : 'menuId',
        parentIdName: ENV_TYPE === 'node' ? 'menu_parent_id' : 'menuParentId',
        childrenName: 'children',
      });
      myUtil.treeCode.saveTreeCodeToLocalTable('code_dm_menu', menuCodeTree);
    }
  },
}

myUtil.pageNode = {
  // 高级筛选 用于显示的高级筛选方案
  getTagsShow({ planName, planKey, setTags, tags, afterOnclick, selectedTags, setSelectedTags, }: any) {
    const handleChange = (tag: string, checked: boolean) => {
      const nextSelectedTags = checked
        ? [...selectedTags, tag]
        : selectedTags.filter((t) => t !== tag);
      console.log('You are interested in: ', nextSelectedTags);
      setSelectedTags(nextSelectedTags);
    };
    const tagReactNode: any = [];
    let unitKey: any = planKey;
    let tagsTmp: any = tags || [];
    const deleteTag = (item: any) => {
      let tmpPlanArr = cloneDeep(tagsTmp);
      tmpPlanArr = tmpPlanArr.filter((item2: any) => {
        return item.tagId !== item2.tagId;
      });
      if (setTags) {
        setTags([...tmpPlanArr]);
      }
      if (unitKey) {
        // 获取 1、所有配置 2、当前业务单元配置
        let planTmp = myUtil.sys.getCustomerConfigByKey({customer_config_key: planName, unitKey});
        let adf_plan =  planTmp.all;
        let existPlanTmp = planTmp.current;
        existPlanTmp = existPlanTmp.filter((item2: any) => {
          return item.tagId !== item2.tagId;
        });
        adf_plan[unitKey] = existPlanTmp;
        // 保存至 用户表
        myUtil.sys.saveCustomerConfig({ customer_config_key: planName, customer_config_value: adf_plan, showResponseInfo: true });
      }
      // afterSavePlan();
    };

    tagsTmp?.forEach((item: any) => {
      let { tagName, onEdit } = item;
      let commonTagProp: any = {
        color: onEdit ? '#ff4d4f' : '#0a6ed1',
        style: { cursor: 'pointer', marginInlineEnd: '4px' },
        closeIcon: true,
        onClick: () => {
          let tmpPlanArr = cloneDeep(tagsTmp);
          tmpPlanArr.forEach((item2: any) => {
            if (item2.tagId === item.tagId) {
              item2.onEdit = !item2.onEdit;
            }
          });
          if (setTags) {
            setTags([...tmpPlanArr]);
          }
          if (afterOnclick) {
            afterOnclick(item);
          }
        },
        onClose: (e: any) => {
          e.preventDefault();
          deleteTag(item);
        },
        // key: item.tagId,
        checked: selectedTags.includes(item.tagId),
        onChange: (checked: any) => handleChange(item.tagId, checked),
      }
      // 判断每个方式是否已保存
      if (unitKey) {
        let planTmp = myUtil.sys.getCustomerConfigByKey({customer_config_key: planName, unitKey});
        let currentPlan = planTmp?.current || [];
        let tmpPlanInLocalStore = currentPlan.find((item2: any) => {
          return item.tagId === item2.tagId;
        });
        if (!tmpPlanInLocalStore) {
          tagName += '（未保存）';
        }
      }
      tagReactNode.push(
        <Tag { ...commonTagProp } key={item.tagId}>{tagName}</Tag>
        // <Tag.CheckableTag { ...commonTagProp }>{tagName}</Tag.CheckableTag>
        // <Button onClick={() => { deleteTag(item); }} key={tagId} >删除</Button>
      );
    });
    return tagReactNode;
  }
}

export const intl = {
  formatMessage: (param?: any) => {
    return hts_message[param.id];
  }
}

export default myUtil;

// #endregion ******************************************************************************************