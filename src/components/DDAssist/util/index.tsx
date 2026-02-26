import numeral from 'numeral';
import dayjs from "dayjs";
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
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
import { itemType } from '../../DDForm/data.d';
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

// const myUtil: any = {};
// const STORAGE_KEY = 'ddit';
// const weekStart = 1; // 1表示周一是一周的开始，0表示周日是一周的开始

// 扩展 dayjs 支持季度操作
dayjs.extend(quarterOfYear);

// ==================== 全局类型声明 ====================
declare global {
  interface Window {
    getUrlCode?: (
      url: string,
      params: Record<string, any>,
    ) => Promise<{ code: string; body: { rows: any[] } }>;
  }
}

// ==================== 类型定义 ====================
interface StorageOperations {
  setItem(key: string, value: any): void;
  getItem(key: string): any;
  getStorage(): Record<string, any>;
  clear(key: string): void;
}

interface TreeNode {
  [key: string]: any;
  children?: TreeNode[];
}

interface DateRangeResult {
  start: string;
  end: string;
  dayjsFormat: [dayjs.Dayjs, dayjs.Dayjs];
}

// ==================== 常量定义 ====================
const STORAGE_KEY = 'ddit';
const WEEK_START = 1; // 1 表示周一是一周的开始，0 表示周日是一周的开始

// ==================== 工具对象 ====================
const myUtil: any = {};

// ==================== 文字处理模块 ====================
/**
 * 文字处理工具集
 */
myUtil.text = {
  /**
   * 基于 Numeral.js 处理数字格式化
   * @param value 要格式化的数字值
   * @param format 格式字符串
   * @returns 格式化后的字符串
   */
  formatNum(value: number | string, format?: string): string | number {
    if (!format) return value;

    const number = numeral(value);
    const numValue = numeral(number).value() || 0;

    // 处理负数
    if (numValue < 0) {
      return `-${numeral(Math.abs(numValue)).format(format)}`;
    }

    return number.format(format);
  },

  /**
   * 基于 Numeral.js 获取数值
   * @param value 要处理的数值
   * @returns 数值类型的值，转换失败返回空字符串
   */
  getNumVal(value: number | string): number | string {
    // 处理 null 和 undefined
    if (value === null || value === undefined) {
      return '';
    }
    const numValue = numeral(value).value();
    return numValue === null || numValue === undefined ? '' : numValue;
  },

  /**
   * 补零并截取字符到指定长度
   * @param value 需要转换的字符串或数字
   * @param digit 补零并截取的长度
   * @returns 转换后的字符串
   */
  leadingZeroize(value: string | number, digit: number): string {
    return (Array(digit).join('0') + value).slice(-digit);
  },

  /**
   * 字符转大写
   * @param value 需要转换的字符串
   * @returns 转换后的大写字符串
   */
  toUpper(value?: string): string | undefined {
    return value?.toUpperCase() || value;
  },

  /**
   * 字符转小写
   * @param value 需要转换的字符串
   * @returns 转换后的小写字符串
   */
  toLower(value?: string): string | undefined {
    return value?.toLowerCase() || value;
  },

  /**
   * 数组转字符串
   * @param value 需要转换的数组
   * @param separator 分隔符，默认逗号
   * @returns 转换后的字符串
   */
  arrayToStr(value: any[] = [], separator?: string): string {
    return value.join(separator || ',');
  },

  /**
   * 生成唯一标识符
   * @param len 生成 uuid 的长度（可选）
   * @param radix 选取基数的位数（0-62）
   * @returns uuid 字符串
   */
  uuid(len?: number, radix?: number): string {
    const chars =
      '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split(
        '',
      );
    const uuid: string[] = [];
    const radixValue = radix || chars.length;

    if (len) {
      // 生成指定长度的 uuid
      for (let i = 0; i < len; i++) {
        uuid[i] = chars[Math.floor(Math.random() * radixValue)];
      }
    } else {
      // 生成标准格式的 uuid
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';

      for (let i = 0; i < 36; i++) {
        if (!uuid[i]) {
          const r = Math.floor(Math.random() * 16);
          uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r];
        }
      }
    }

    return uuid.join('');
  },

  /**
   * 字符串占位符替换
   * @param str 原字符串
   * @param values 替换的文本对象
   * @returns 替换后的字符串
   */
  formatReplace(str: string, values: Record<string, any>): string {
    let result = str;
    for (const key in values) {
      if (values[key]) {
        result = result.replace(
          new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
          values[key],
        );
      }
    }
    return result;
  },

  /**
   * 将数值四舍五入并保留指定位数的小数
   * @param num 要格式化的数字值
   * @param precision 四舍五入保留的位数
   * @returns 转换后的数值
   */
  formatNumRound(num: number, precision = 0): number | undefined {
    if (num === null || num === undefined) return undefined;

    const multiplier = Math.pow(10, precision);
    const adjustedNum = num < 0 ? num - Number.EPSILON : num + Number.EPSILON;

    return Math.round(adjustedNum * multiplier) / multiplier;
  },

  /**
   * 首字母变小写
   * @param value 需要转换的字符串
   * @returns 转换后的字符串
   */
  lowerFirstLetter(value: string): string {
    if (!value || value.length === 0) return value;
    const str = value.toString();
    return str.charAt(0).toLowerCase() + str.slice(1);
  },

  /**
   * 字符串驼峰转下划线
   * @param str 需要转换的字符串
   * @returns 转换后的字符串
   */
  camelToUnderscore(str: string): string {
    if (!str) return str;
    return str
      .replace(/([A-Z])/g, '_$1')
      .replace(/^_/, '')
      .toLowerCase();
  },

  /**
   * 对象 key 驼峰转下划线
   * @param param 需要转换的对象
   * @returns 转换后的对象
   */
  camelToUnderscoreObj(param: Record<string, any>): Record<string, any> {
    const newObj: Record<string, any> = {};
    for (const key in param) {
      if (Object.prototype.hasOwnProperty.call(param, key)) {
        newObj[this.camelToUnderscore(key)] = param[key];
      }
    }
    return newObj;
  },

  /**
   * 数组中对象驼峰转下划线
   * @param param 需要转换的数组
   * @returns 转换后的数组
   */
  camelToUnderscoreArray(
    param: Record<string, any>[] = [],
  ): Record<string, any>[] {
    return param.map((item) => this.camelToUnderscoreObj(item));
  },

  /**
   * 字符串下划线转驼峰
   * @param str 需要转换的字符串
   * @returns 转换后的字符串
   */
  underscoreToCamel(str: string): string {
    if (!str) return str;

    return str
      .split('_')
      .map((part, index) =>
        index === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1),
      )
      .join('');
  },

  /**
   * 对象中目标 key 的属性值下划线转驼峰
   * @param param 需要转换的对象
   * @param targetKeys 目标 key 数组
   * @returns 转换后的对象
   */
  underscoreToCamelObjValue(
    param: Record<string, any>,
    targetKeys: string[],
  ): Record<string, any> {
    const newObj: Record<string, any> = {};
    for (const key in param) {
      if (Object.prototype.hasOwnProperty.call(param, key)) {
        newObj[key] = targetKeys.includes(key)
          ? this.underscoreToCamel(param[key])
          : param[key];
      }
    }
    return newObj;
  },

  /**
   * 对象中目标 key 下划线转驼峰
   * @param param 需要转换的对象
   * @param targetKeys 目标 key 数组
   * @returns 转换后的对象
   */
  underscoreToCamelObjKey(
    param: Record<string, any>,
    targetKeys: string[],
  ): Record<string, any> {
    const newObj: Record<string, any> = {};
    for (const key in param) {
      if (Object.prototype.hasOwnProperty.call(param, key)) {
        const newKey = targetKeys.includes(key)
          ? this.underscoreToCamel(key)
          : key;
        newObj[newKey] = param[key];
      }
    }
    return newObj;
  },

  /**
   * 数组对象中目标 key 的属性值下划线转驼峰
   * @param param 需要转换的数组
   * @param targetKeys 目标 key 数组
   * @returns 转换后的数组
   */
  underscoreToCamelArrayValue(
    param: Record<string, any>[] = [],
    targetKeys: string[],
  ): Record<string, any>[] {
    return param.map((item) =>
      this.underscoreToCamelObjValue(item, targetKeys),
    );
  },

  /**
   * 数组对象中目标 key 下划线转驼峰
   * @param param 需要转换的数组
   * @param targetKeys 目标 key 数组
   * @returns 转换后的数组
   */
  underscoreToCamelArrayKey(
    param: Record<string, any>[] = [],
    targetKeys: string[],
  ): Record<string, any>[] {
    return param.map((item) => this.underscoreToCamelObjKey(item, targetKeys));
  },

  /**
   * 匹配字符串中 {} 内的内容，将其转为数组
   * @param str 需要转换的字符串
   * @returns 转换后的数组
   */
  parseBraces(str: string): string[] {
    const regex = /{([^}]+)}/g;
    const results: string[] = [];
    let match;
    while ((match = regex.exec(str))) {
      results.push(match[1]);
    }
    return results;
  },

  /**
   * 生成长度为指定数值的随机数
   * @param length 随机数的长度
   * @returns 随机数
   */
  generateRandomNumber(length: number): number {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1;
    return Math.floor(min + Math.random() * (max - min + 1));
  },

  /**
   * 过滤对象中的空值
   * @param obj 要处理的对象
   * @returns 清理后的对象
   */
  cleanNullObject(obj: any): any {
    if (typeof obj !== 'object' || obj === null) {
      return obj;
    }

    return Object.entries(obj).reduce(
      (acc: Record<string, any>, [key, value]) => {
        const cleanedValue = this.cleanNullObject(value);

        // 过滤掉 undefined/null/空字符串/空数组/空对象
        const isEmpty =
          cleanedValue === undefined ||
          cleanedValue === null ||
          (typeof cleanedValue === 'string' && cleanedValue === '') ||
          (Array.isArray(cleanedValue) && cleanedValue.length === 0) ||
          (typeof cleanedValue === 'object' &&
            Object.keys(cleanedValue).length === 0);

        if (!isEmpty) {
          acc[key] = cleanedValue;
        }

        return acc;
      },
      {},
    );
  },
};

// ==================== 日期处理模块 ====================
/**
 * 日期处理工具集
 */
myUtil.date = {
  /**
   * 将日期格式化成指定格式的字符串
   * @param date 要格式化的日期
   * @param format 格式字符串
   * @returns 格式化后的日期字符串
   */
  formatDate(date: string | number | Date, format?: string): string {
    if (!date) return '';

    let dayjsDate: dayjs.Dayjs;
    if (typeof date === 'string' && !isNaN(Number(date))) {
      dayjsDate = dayjs(new Date(Number(date)));
    } else {
      dayjsDate = dayjs(new Date(date));
    }

    return format ? dayjsDate.format(format) : dayjsDate.format();
  },

  /**
   * 获取日期范围的辅助函数
   * @param startDayjs 起始日期的 dayjs 对象
   * @param endDayjs 结束日期的 dayjs 对象
   * @param prefix 返回对象的键前缀
   * @returns 日期范围对象
   */
  getDateRange(
    startDayjs: dayjs.Dayjs,
    endDayjs: dayjs.Dayjs,
    prefix: 'week' | 'month' | 'year' | 'quarter' | 'day',
  ): DateRangeResult {
    const start = startDayjs.format('YYYY-MM-DD') + ' 00:00:00';
    const end = endDayjs.format('YYYY-MM-DD') + ' 23:59:59';

    return {
      [`startOf${
        prefix === 'day'
          ? 'Day'
          : prefix.charAt(0).toUpperCase() + prefix.slice(1)
      }`]: start,
      [`endOf${
        prefix === 'day'
          ? 'Day'
          : prefix.charAt(0).toUpperCase() + prefix.slice(1)
      }`]: end,
      dayjsFormat: [
        dayjs(start, 'YYYY-MM-DD 00:00:00'),
        dayjs(end, 'YYYY-MM-DD 23:59:59'),
      ],
    } as any;
  },

  /**
   * 获取上周的起始日期和结束日期
   * @returns 上周的日期范围
   */
  getLastWeek(): DateRangeResult {
    const start = dayjs().subtract(1, 'week').day(WEEK_START);
    const end = dayjs()
      .subtract(1, 'week')
      .day(WEEK_START + 6);
    return this.getDateRange(start, end, 'week');
  },

  /**
   * 获取本周的起始日期和结束日期
   * @returns 本周的日期范围
   */
  getCurrentWeek(): DateRangeResult {
    const start = dayjs().day(WEEK_START);
    const end = dayjs().day(WEEK_START + 6);
    return this.getDateRange(start, end, 'week');
  },

  /**
   * 获取下周的起始日期和结束日期
   * @returns 下周的日期范围
   */
  getNextWeek(): DateRangeResult {
    const start = dayjs().add(1, 'week').day(WEEK_START);
    const end = dayjs()
      .add(1, 'week')
      .day(WEEK_START + 6);
    return this.getDateRange(start, end, 'week');
  },

  /**
   * 获取上个月的起始日期和结束日期
   * @returns 上个月的日期范围
   */
  getLastMonth(): DateRangeResult {
    const start = dayjs().subtract(1, 'month').startOf('month');
    const end = dayjs().subtract(1, 'month').endOf('month');
    return this.getDateRange(start, end, 'month');
  },

  /**
   * 获取本月的起始日期和结束日期
   * @returns 本月的日期范围
   */
  getCurrentMonth(): DateRangeResult {
    const start = dayjs().startOf('month');
    const end = dayjs().endOf('month');
    return this.getDateRange(start, end, 'month');
  },

  /**
   * 获取下个月的起始日期和结束日期
   * @returns 下个月的日期范围
   */
  getNextMonth(): DateRangeResult {
    const start = dayjs().add(1, 'month').startOf('month');
    const end = dayjs().add(1, 'month').endOf('month');
    return this.getDateRange(start, end, 'month');
  },

  /**
   * 获取去年的起始日期和结束日期
   * @returns 去年的日期范围
   */
  getLastYear(): DateRangeResult {
    const start = dayjs().subtract(1, 'year').startOf('year');
    const end = dayjs().subtract(1, 'year').endOf('year');
    return this.getDateRange(start, end, 'year');
  },

  /**
   * 获取本年的起始日期和结束日期
   * @returns 本年的日期范围
   */
  getCurrentYear(): DateRangeResult {
    const start = dayjs().startOf('year');
    const end = dayjs().endOf('year');
    return this.getDateRange(start, end, 'year');
  },

  /**
   * 获取来年的起始日期和结束日期
   * @returns 来年的日期范围
   */
  getNextYear(): DateRangeResult {
    const start = dayjs().add(1, 'year').startOf('year');
    const end = dayjs().add(1, 'year').endOf('year');
    return this.getDateRange(start, end, 'year');
  },

  /**
   * 获取上季度的起始日期和结束日期
   * @returns 上季度的日期范围
   */
  getLastQuarter(): DateRangeResult {
    const start = dayjs().startOf('quarter').subtract(3, 'month');
    const end = dayjs().startOf('quarter').subtract(1, 'day');
    return this.getDateRange(start, end, 'quarter');
  },

  /**
   * 获取本季度的起始日期和结束日期
   * @returns 本季度的日期范围
   */
  getCurrentQuarter(): DateRangeResult {
    const start = dayjs().startOf('quarter');
    const end = dayjs().endOf('quarter');
    return this.getDateRange(start, end, 'quarter');
  },

  /**
   * 获取下季度的起始日期和结束日期
   * @returns 下季度的日期范围
   */
  getNextQuarter(): DateRangeResult {
    const start = dayjs().add(1, 'quarter').startOf('quarter');
    const end = dayjs().add(1, 'quarter').endOf('quarter');
    return this.getDateRange(start, end, 'quarter');
  },

  /**
   * 获取最近 N 天的起始日期和结束日期
   * @param days 最近天数
   * @returns 最近 N 天的日期范围
   */
  getRecentNDay(days: number): DateRangeResult {
    const start = dayjs().subtract(days, 'day');
    const end = dayjs();
    return this.getDateRange(start, end, 'day');
  },

  /**
   * 获取当前时间 N 年前的第一天和最后一天
   * @param years N 年
   * @returns N 年前的日期范围
   */
  getQZDateBeforeCurr(years: number): { firstDay: string; lastDay: string } {
    const targetYear = new Date().getFullYear() - years;
    return {
      firstDay: `${targetYear}-01-01`,
      lastDay: `${targetYear}-12-31`,
    };
  },

  /**
   * 生成随机日期（2020 年至今）
   * @returns 随机日期字符串（yyyy-MM-dd）
   */
  generateRandomBirthday(): string {
    const currentYear = new Date().getFullYear();
    const year = Math.floor(Math.random() * (currentYear - 2020 + 1)) + 2020;
    const month = Math.floor(Math.random() * 12) + 1;
    const day =
      Math.floor(Math.random() * new Date(year, month, 0).getDate()) + 1;

    return dayjs(new Date(year, month - 1, day)).format('YYYY-MM-DD');
  },

  /**
   * 生成随机时间戳
   * @returns 随机时间戳
   */
  getRandomTimestamp(): number {
    const randomDate = this.generateRandomBirthday();
    return dayjs(randomDate).valueOf();
  },

  /**
   * 判断日期是否在几个月的范围内
   * @param months 比较的月数
   * @param startTime 开始日期
   * @param endTime 结束日期
   * @returns 是否在范围内
   */
  compareTime(
    months: number,
    startTime: string | number | Date,
    endTime: string | number | Date,
  ): boolean {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const startPlusMonths = new Date(start);
    startPlusMonths.setMonth(startPlusMonths.getMonth() + months);

    return end.getTime() <= startPlusMonths.getTime();
  },

  /**
   * 日期补全到秒
   * @param date 需要转换的日期
   * @param flag 精确标志（1：00:00:00；2：23:59:59）
   * @returns 转换后的时间戳
   */
  accurateDate(date: string | number | Date, flag: '1' | '2'): number {
    const time = new Date(date);

    if (flag === '1') {
      time.setHours(0, 0, 0, 0);
    } else {
      time.setHours(23, 59, 59, 999);
    }

    return time.getTime();
  },

  /**
   * 格式化毫秒数为 hh:mm:ss
   * @param milliseconds 需要格式化的毫秒数
   * @returns 格式化后的时间字符串
   */
  formatMillisecondsToHMS(milliseconds = 0): string {
    const ms = Number.isNaN(milliseconds) ? 0 : milliseconds;

    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    const pad = (num: number) => (num < 10 ? `0${num}` : num);
    return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
  },

  /**
   * 兼容的日期格式化格式列表
   * @param format 自定义格式
   * @returns 兼容的日期格式化格式数组
   */
  formatList(format?: string): string[] {
    const defaultFormats = [
      'YYYY-MM-DD',
      'YYYY-MMDD',
      'YYYYMM-DD',
      'YYYY/MM/DD',
      'YYYY/MMDD',
      'YYYYMM/DD',
      'YYYYMMDD',
    ];

    return format ? [format, ...defaultFormats] : defaultFormats;
  },

  /**
   * 分钟转小时分钟格式
   * @param minutes 分钟数
   * @returns 小时分钟格式数据（如：1:30）
   */
  convertMinutes(minutes: number): string {
    if (!minutes) return '';

    const hours = Math.floor(minutes / 60);
    const mins = myUtil.text.leadingZeroize(minutes % 60, 2);
    return `${hours}:${mins}`;
  },
};

// ==================== 存储模块 ====================
/**
 * 创建存储操作对象
 * @param storage 存储对象（localStorage 或 sessionStorage）
 * @returns 存储操作对象
 */
function createStorageOperations(storage: Storage): StorageOperations {
  return {
    /**
     * 设置键值的存储数据
     * @param key 键
     * @param value 值
     */
    setItem(key: string, value: any): void {
      const data = this.getStorage();
      data[key] = value;
      storage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * 根据键获取存储数据
     * @param key 键
     * @returns 键对应的值
     */
    getItem(key: string): any {
      return this.getStorage()[key];
    },

    /**
     * 获取存储的全部数据
     * @returns 所有键值对象
     */
    getStorage(): Record<string, any> {
      const item = storage.getItem(STORAGE_KEY);
      return item ? JSON.parse(item) : {};
    },

    /**
     * 根据键删除存储数据
     * @param key 键
     */
    clear(key: string): void {
      const data = this.getStorage();
      delete data[key];
      storage.setItem(STORAGE_KEY, JSON.stringify(data));
    },
  };
}

/**
 * localStorage 操作工具
 */
myUtil.localStore = createStorageOperations(window.localStorage);

/**
 * sessionStorage 操作工具
 */
myUtil.sessionStore = {
  ...createStorageOperations(window.sessionStorage),

  /**
   * 删除 sessionStorage 里的所有数据
   */
  clearAll(): void {
    window.sessionStorage.removeItem(STORAGE_KEY);
  },
};


// ==================== 树形结构处理模块 ====================
/**
 * 树形结构处理工具集
 */
myUtil.tree = {
  /**
   * 根据节点 id 值删除节点
   * @param options 配置对象
   * @returns 是否删除成功
   */
  deleteNode({
    tree,
    targetId,
    parent,
    idText = 'id',
  }: {
    tree: TreeNode | TreeNode[];
    targetId: string | number;
    parent?: TreeNode;
    idText?: string;
  }): boolean {
    // 支持数组输入
    const trees = Array.isArray(tree) ? tree : [tree];

    for (const node of trees) {
      if (this.deleteNodeSingle({ tree: node, targetId, parent, idText })) {
        return true;
      }
    }

    return false;
  },

  /**
   * 根据节点 id 值删除节点（内部方法，处理单个节点）
   * @param options 配置对象
   * @returns 是否删除成功
   */
  deleteNodeSingle({
    tree,
    targetId,
    parent,
    idText = 'id',
  }: {
    tree: TreeNode;
    targetId: string | number;
    parent?: TreeNode;
    idText?: string;
  }): boolean {
    if (tree[idText] === targetId) {
      if (parent?.children) {
        parent.children = parent.children.filter(
          (child) => child[idText] !== targetId,
        );
      }
      return true;
    }

    if (tree.children) {
      for (const child of tree.children) {
        if (
          this.deleteNodeSingle({ tree: child, targetId, parent: tree, idText })
        ) {
          return true;
        }
      }
    }

    return false;
  },

  /**
   * 查找目标节点
   * @param options 配置对象
   * @returns 找到的节点或 null
   */
  findNodeInTree({
    tree,
    targetId,
    idText = 'id',
  }: {
    tree: TreeNode[];
    targetId: string | number;
    idText?: string;
  }): TreeNode | null {
    const findRecursive = (
      nodes: TreeNode[],
      id: string | number,
    ): TreeNode | null => {
      for (const node of nodes) {
        if (node[idText] === id) {
          return node;
        }

        if (node.children?.length) {
          const found = findRecursive(node.children, id);
          if (found) return found;
        }
      }
      return null;
    };

    return findRecursive(tree, targetId);
  },

  /**
   * 根据节点 key 删除目标节点
   * @param options 配置对象
   */
  deleteTargetKey({
    tree,
    targetKey,
  }: {
    tree: TreeNode[];
    targetKey: string | string[];
  }): void {
    const keys = Array.isArray(targetKey) ? targetKey : [targetKey];

    const deleteRecursive = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        for (const key of keys) {
          delete node[key];
        }

        if (node.children?.length) {
          deleteRecursive(node.children);
        }
      }
    };

    deleteRecursive(tree);
  },

  /**
   * 数组转树形结构
   * @param list 数组数据
   * @param rootId 根节点 ID
   * @param options 配置选项
   * @returns 树形结构数据
   */
  transformArrToTree(
    list: Record<string, any>[],
    rootId: string | number,
    {
      idName = 'id',
      parentIdName = 'parentId',
      childrenName = 'children' } = {}
  ) {
    if (!Array.isArray(list)) {
      throw new Error('参数必须是数组');
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
   * 设置树形结构数据层级属性
   * @param nodes 树形结构数据
   * @param level 当前层级
   */
  setTreeLevels(nodes: TreeNode[], level = 0): void {
    for (const node of nodes) {
      node.level = level;

      if (node.children?.length) {
        this.setTreeLevels(node.children, level + 1);
      }
    }
  },

  /**
   * 设置树形结构数据节点属性
   * @param nodes 树节点数组
   * @param callback 回调函数
   */
  setTreeProps(nodes: TreeNode[], callback: (node: TreeNode) => void): void {
    const traverse = (node: TreeNode) => {
      if (node.children?.length) {
        node.children.forEach((child) => traverse(child));
      } else {
        callback(node);
      }
    };

    for (const node of nodes) {
      traverse(node);
    }
  },

  /**
   * 获取所有上级节点 ID
   * @param treeData 树数据
   * @param targetId 起始节点 ID
   * @param idName ID 字段名称
   * @param childName 子节点字段名称
   * @returns 上级节点 ID 数组
   */
  findAllAncestorIds(
    treeData: TreeNode[],
    targetId: string | number,
    idName = 'id',
    childName = 'children',
  ): (string | number)[] {
    const path: (string | number)[] = [];
    let found = false;

    const findPath = (nodes: TreeNode[], id: string | number) => {
      for (const node of nodes) {
        if (found) return;

        path.push(node[idName]);

        if (node[idName] === id) {
          found = true;
        } else if (node[childName]?.length) {
          findPath(node[childName], id);
        } else {
          path.pop();
        }
      }

      if (!found) {
        path.pop();
      }
    };

    findPath(treeData, targetId);
    return path;
  },

  /**
   * 获取所有下级节点 ID
   * @param treeData 树数据
   * @param targetId 起始节点 ID
   * @param idName ID 字段名称
   * @param childName 子节点字段名称
   * @returns 下级节点 ID 数组
   */
  findAllDescendantIds(
    treeData: TreeNode[],
    targetId: string | number,
    idName = 'id',
    childName = 'children',
  ): (string | number)[] {
    const result: (string | number)[] = [];

    const collectAllChildren = (nodes: TreeNode[]) => {
      for (const node of nodes) {
        result.push(node[idName]);
        if (node[childName]?.length) {
          collectAllChildren(node[childName]);
        }
      }
    };

    const findAndCollect = (nodes: TreeNode[], id: string | number) => {
      for (const node of nodes) {
        if (node[idName] === id) {
          result.push(node[idName]);
          if (node[childName]?.length) {
            collectAllChildren(node[childName]);
          }
        } else if (node[childName]?.length) {
          findAndCollect(node[childName], id);
        }
      }
    };

    findAndCollect(treeData, targetId);
    return result;
  },

  /**
   * 排序树节点
   * @param tree 树数据
   * @param sortKey 排序字段
   * @param sortOrder 排序方式（asc/desc）
   * @returns 排序后的树
   */
  sortTree(
    tree: TreeNode[],
    sortKey: string,
    sortOrder: 'asc' | 'desc' = 'asc',
  ): TreeNode[] {
    const sortRecursive = (nodes: TreeNode[]) => {
      nodes.sort((a, b) => {
        const aVal = a[sortKey];
        const bVal = b[sortKey];
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      });

      for (const node of nodes) {
        if (node.children?.length) {
          sortRecursive(node.children);
        }
      }
    };

    sortRecursive(tree);
    return tree;
  },
};

// ==================== Word 文档处理模块 ====================
/**
 * Word 文档处理工具集
 * 依赖 docx 库提供 Word 文档生成能力
 */
myUtil.word = {
  /**
   * 配置项类型定义
   */
  DocxConfig: {
    fontFamily: '微软雅黑', // 正文字体
    fontSize: 18, // 正文字号（单位：半字）
    fontLine: 276, // 正文字行距
    fontSizeTitle1: 32, // 一级标题字号
    fontSizeTitle2: 26, // 二级标题字号
    fontSizeTitle3: 22, // 三级标题字号
  },

  /**
   * 创建并缓存文档配置对象
   * @param config - 可选的配置覆盖项
   * @returns 文档样式配置对象
   */
  createDocxConfig(config?: Partial<typeof myUtil.word.DocxConfig>) {
    const cfg = { ...myUtil.word.DocxConfig, ...config };
    return {
      // 表格通用样式
      tableStyle: {
        verticalAlign: VerticalAlign.CENTER,
        margins: {
          left: convertInchesToTwip(0.05),
          right: convertInchesToTwip(0.05),
        },
      },
      // 文档样式配置
      styles: {
        default: {
          document: {
            run: { font: cfg.fontFamily, size: cfg.fontSize, color: '000000' },
            paragraph: { spacing: { line: cfg.fontLine } },
          },
        },
        paragraphStyles: [
          { id: 'Normal', name: 'Normal', run: {}, paragraph: {} },
          {
            id: 'Heading1',
            name: 'Heading 1',
            run: { size: cfg.fontSizeTitle1, color: '000000' },
          },
          {
            id: 'Heading2',
            name: 'Heading 2',
            run: { size: cfg.fontSizeTitle2, color: '000000' },
          },
          {
            id: 'Heading3',
            name: 'Heading 3',
            run: { size: cfg.fontSizeTitle3, color: '000000' },
          },
          {
            id: 'Heading4',
            name: 'Heading 4',
            run: { size: cfg.fontSizeTitle3, color: '000000' },
          },
          {
            id: 'Heading5',
            name: 'Heading 5',
            run: { size: cfg.fontSizeTitle3, color: '000000' },
          },
          {
            id: 'customTitle',
            name: 'Custom Title',
            run: { size: 40, color: '000000', font: '等线' },
            paragraph: {
              alignment: AlignmentType.CENTER,
              spacing: { line: 240 },
            },
          },
          {
            id: 'customContent',
            name: 'Custom Content',
            run: { size: 36, color: '0000FF', font: '等线' },
            paragraph: {
              alignment: AlignmentType.LEFT,
              spacing: { line: 200 },
              indent: { left: convertInchesToTwip(0.2) },
            },
          },
        ],
      },
    };
  },

  /**
   * 保存文档为 Word 文件并触发下载
   * @param doc - Packer 打包后的文档对象
   * @param filename - 下载的文件名（无需扩展名）
   */
  saveDocx(doc: any, filename: string) {
    const fileName = filename.endsWith('.docx') ? filename : `${filename}.docx`;
    Packer.toBlob(doc).then((blob) => {
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.click();
      URL.revokeObjectURL(url);
    });
  },

  /**
   * 创建分级标题
   * @param text - 标题文本
   * @param level - 标题级别（1-5），默认 1 级标题
   * @param pageBreakBefore - 是否在标题前分页，默认 false
   * @returns 段落对象
   */
  createTitle(text: string, level = 1, pageBreakBefore = false) {
    const spacingMap: Record<number, { before: number; after: number }> = {
      1: { before: 400, after: 200 },
      2: { before: 300, after: 150 },
      3: { before: 200, after: 100 },
    };
    const hSpacing = spacingMap[level] || spacingMap[3];
    const hLevel = `HEADING_${level}` as keyof typeof HeadingLevel;

    return new Paragraph({
      text,
      heading: HeadingLevel[hLevel],
      outlineLevel: level,
      spacing: hSpacing,
      pageBreakBefore,
    });
  },

  /**
   * 创建自动目录
   * @param children - 文档子元素数组，目录会被添加到此数组中
   * @param title - 目录标题，默认"目录"
   */
  createTableOfContents(children: any[], title = '目录') {
    children.push(
      new Paragraph({
        children: [new TextRun({ children: [title], size: 30 })],
        alignment: AlignmentType.CENTER,
      }),
      new TableOfContents('Table of Contents', {
        headingStyleRange: '1-4',
        hyperlink: true,
      }),
    );
  },

  /**
   * 创建页眉
   * @param title - 页眉显示的标题文本
   * @returns 页眉配置对象
   */
  createHeader(title: string) {
    return {
      default: new Header({
        children: [
          new Paragraph({
            children: [
              new TextRun({ children: [title], size: 16, color: '666666' }),
            ],
            alignment: AlignmentType.LEFT,
          }),
        ],
      }),
    };
  },

  /**
   * 创建页脚（含页码）
   * @returns 页脚配置对象
   */
  createFooter() {
    return {
      default: new Footer({
        children: [
          new Paragraph({
            children: [
              new TextRun({
                children: [
                  '第 ',
                  PageNumber.CURRENT,
                  ' 页 / 共 ',
                  PageNumber.TOTAL_PAGES,
                  ' 页',
                ],
                size: 16,
                color: '666666',
              }),
            ],
            alignment: AlignmentType.RIGHT,
          }),
        ],
      }),
    };
  },

  /**
   * 创建表格
   * @param options - 表格配置项
   * @returns 表格对象
   */
  createTable(options: {
    columns: Array<{
      title: string;
      dataIndex: string;
      width?: number;
      format?: (value: any) => string;
    }>;
    dataSource: Record<string, any>[];
    showLineNumber?: boolean;
    config?: Partial<typeof myUtil.word.DocxConfig>;
  }) {
    const {
      columns = [],
      dataSource = [],
      showLineNumber = false,
      config,
    } = options;
    const docxConfig = this.createDocxConfig(config);
    const fontSize = config?.fontSize || 18;

    // 构建表头
    const headerCells: any[] = [];
    if (showLineNumber) {
      headerCells.push(
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({ text: '序号', size: fontSize, bold: true }),
              ],
            }),
          ],
          ...docxConfig.tableStyle,
          shading: { fill: 'DDDDDD', type: 'clear' },
        }),
      );
    }
    columns.forEach((col) => {
      headerCells.push(
        new TableCell({
          children: [
            new Paragraph({
              alignment: AlignmentType.LEFT,
              children: [
                new TextRun({ text: col.title, size: fontSize, bold: true }),
              ],
            }),
          ],
          ...docxConfig.tableStyle,
          shading: { fill: 'DDDDDD', type: 'clear' },
        }),
      );
    });

    // 构建数据行
    const rows = [new TableRow({ children: headerCells })];
    dataSource.forEach((rowData, index) => {
      const rowCells: any[] = [];
      if (showLineNumber) {
        rowCells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: String(index + 1) })],
              }),
            ],
            ...docxConfig.tableStyle,
          }),
        );
      }
      columns.forEach((col) => {
        let cellValue = rowData[col.dataIndex] ?? '';
        if (col.format && typeof col.format === 'function') {
          cellValue = col.format(cellValue);
        }
        rowCells.push(
          new TableCell({
            children: [
              new Paragraph({
                children: [new TextRun({ text: String(cellValue) })],
              }),
            ],
            ...docxConfig.tableStyle,
          }),
        );
      });
      rows.push(new TableRow({ children: rowCells }));
    });

    return new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows,
    });
  },

  /**
   * 创建段落
   * @param options - 段落配置项
   * @returns 段落对象
   */
  createParagraph(options: {
    text: string;
    bold?: boolean;
    size?: number;
    color?: string;
    indent?: number; // 首行缩进（单位：缇）
    spacing?: { before?: number; after?: number; line?: number };
    shading?: { fill: string };
    bullet?: boolean; // 是否使用项目符号
  }) {
    const { text, bold, size, color, indent, spacing, shading, bullet } =
      options;

    const paragraphProps: Record<string, any> = {
      children: [new TextRun({ text, bold, size, color: color || '000000' })],
    };

    // 设置缩进
    if (bullet) {
      paragraphProps.indent = { left: 0, hanging: 200 };
      paragraphProps.bullet = { level: 0 };
    } else if (indent) {
      paragraphProps.indent = { firstLine: indent };
    }

    // 设置段间距
    if (spacing) {
      paragraphProps.spacing = spacing;
    }

    // 设置底纹
    if (shading) {
      paragraphProps.shading = shading;
    }

    return new Paragraph(paragraphProps);
  },

  /**
   * 创建空行（用于分隔内容）
   * @param lineHeight - 行高，默认 100
   * @returns 空段落对象
   */
  createEmptyLine(lineHeight = 100) {
    return new Paragraph({
      children: [new TextRun({ text: '' })],
      spacing: { line: lineHeight, lineRule: LineRuleType.EXACT },
    });
  },
};

// #region 图表 Ant Design Charts
/**
 * 图表工具模块
 * 提供 Ant Design Charts 图表的默认配置和便捷配置方法
 */
myUtil.chartsAntD = {
  /**
   * 通用 Tooltip 渲染器工厂函数
   * 创建统一的 Tooltip 自定义渲染逻辑
   * @param valueFormat 数值格式化字符串
   * @param valueUnit 数值单位
   * @param colorField 颜色字段名
   * @param angleField 角度/数值字段名
   * @param sum 总和值（用于百分比计算）
   * @returns Tooltip 渲染配置对象
   */
  createTooltipRender(options: {
    valueFormat: string;
    valueUnit: string;
    colorField: string;
    angleField: string;
    sum?: number;
  }) {
    const { valueFormat, valueUnit, colorField, angleField, sum } = options;
    return {
      render: (_e: any, { items }: any) => {
        return (
          <>
            {items.map((item: any) => {
              const { type } = item;
              const nameTmp = item[colorField];
              const valueTmp = `${myUtil.text.formatNum(
                item[angleField],
                valueFormat,
              )} ${valueUnit}`;
              const percentTmp =
                sum !== undefined
                  ? `${myUtil.text.formatNum(
                      (item[angleField] / sum) * 100,
                      '0,0.00',
                    )} %`
                  : '';
              return (
                <div key={type} style={{ margin: 0 }}>
                  <div>{nameTmp}</div>
                  <div>{valueTmp}</div>
                  {percentTmp && <div>{percentTmp}</div>}
                </div>
              );
            })}
          </>
        );
      },
    };
  },

  /**
   * 通用数据求和函数
   * @param data 数据数组
   * @param angleField 数值字段名
   * @returns 数据总和
   */
  calculateSum(data: any[], angleField: string): number {
    return data.reduce((a: number, b: any) => a + (b[angleField] || 0), 0);
  },

  /**
   * 通用基础配置工厂函数
   * 创建包含通用配置的基础配置对象
   * @param baseConfig 基础配置对象
   * @returns 合并后的配置对象
   */
  createBaseConfig(baseConfig: {
    xField?: string;
    yField?: string;
    valueFormat?: string;
    valueUnit?: string;
    axisXTitle?: string;
    axisYTitle?: string;
    colorField?: string;
    angleField?: string;
    showLabel?: boolean;
    [key: string]: any;
  }) {
    const {
      valueFormat = '0,0',
      valueUnit = '',
      axisXTitle,
      axisYTitle,
      xField = 'xValue',
      yField = 'yValue',
      angleField = 'yValue',
      ...rest
    } = baseConfig;
    const config: any = {
      xField,
      yField,
      paddingLeft: 130,
      paddingRight: 60,
      paddingTop: 40,
      paddingBottom: 60,
      axis: {
        x: { title: axisXTitle },
        y: {
          title: axisYTitle,
          labelFormatter: (v: any) =>
            `${myUtil.text.formatNum(v, valueFormat)} ${valueUnit}`,
        },
      },
      ...rest,
    };

    // Tooltip 自定义渲染
    config.interaction = {
      tooltip: this.createTooltipRender({
        valueFormat,
        valueUnit,
        colorField: baseConfig.colorField || 'type',
        angleField,
      }),
    };

    return config;
  },

  /**
   * 子图表类型配置映射
   */
  chartTypeConfig: {
    line: (item: any, color: string) => ({
      ...item,
      colorField: item.colorField || color,
      axis: {
        y: {
          position: item?.axisYPosition || 'left',
          title: item?.axisYTitle,
          style: { titleFill: color },
          labelFormatter: (v: any) =>
            `${myUtil.text.formatNum(v, item.valueFormat || '0,0')} ${
              item?.valueUnit || ''
            }`,
        },
      },
      style: { lineWidth: 2 },
      scale: { series: { independent: true } },
    }),
    interval: (item: any, color: string) => ({
      ...item,
      colorField: item.colorField || color,
      style: { maxWidth: 50 },
      interaction: { elementHighlight: { background: true } },
      axis: {
        y: {
          position: item?.axisYPosition || 'left',
          title: item?.axisYTitle,
          style: { titleFill: color },
          labelFormatter: (v: any) =>
            `${myUtil.text.formatNum(v, item.valueFormat || '0,0')} ${
              item?.valueUnit || ''
            }`,
        },
      },
    }),
    area: (item: any, color: string) => ({
      ...item,
      colorField: item.colorField || color,
      axis: {
        y: {
          position: item?.axisYPosition || 'left',
          title: item?.axisYTitle,
          style: { titleFill: color },
          labelFormatter: (v: any) =>
            `${myUtil.text.formatNum(v, item.valueFormat || '0,0')} ${
              item?.valueUnit || ''
            }`,
        },
      },
    }),
  },

  /**
   * 默认配置参数：饼图
   * @param param 配置参数对象
   * @returns 饼图默认配置
   */
  defaultConfigPie(param: any = {}) {
    const {
      valueFormat = '0,0',
      valueUnit = '',
      angleField = 'value',
      colorField = 'type',
      showLabel = true,
    } = param;

    return {
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
      interaction: {
        tooltip: this.createTooltipRender({
          valueFormat,
          valueUnit,
          colorField,
          angleField,
        }),
      },
      label: showLabel
        ? {
            text: (d: any) => {
              const nameTmp = d[colorField];
              const valueTmp = myUtil.text.formatNum(
                d[angleField],
                valueFormat,
              );
              const percentTmp = myUtil.text.formatNum(
                (d[angleField] / param.sum) * 100,
                '0,0.00',
              );
              return `${nameTmp}   ${valueTmp} (${percentTmp}%)`;
            },
            position: 'spider',
            style: { fontWeight: 'bold' },
          }
        : undefined,
    };
  },

  /**
   * 配置参数获取：饼图
   * @param param 自定义参数：饼图
   * @returns 完整的饼图配置
   */
  configPie(param: any = {}) {
    const {
      data = [],
      showTotal,
      totalText = '合计',
      valueFormat = '0,0',
      angleField = 'value',
    } = param;

    const sum = this.calculateSum(data, angleField);
    const baseConfig = this.defaultConfigPie({ ...param, sum });

    const config: any = {
      ...baseConfig,
      ...param,
    };

    if (showTotal) {
      config.annotations = [
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

    // 确保 interaction.tooltip 正确合并
    if (baseConfig.interaction?.tooltip) {
      config.interaction = {
        ...config.interaction,
        tooltip: baseConfig.interaction.tooltip,
      };
    }

    return config;
  },

  /**
   * 默认配置参数：面积图
   * @param param 配置参数对象
   * @returns 面积图默认配置
   */
  defaultConfigArea(param: any = {}) {
    const {
      valueFormat = '0,0',
      valueUnit = '',
      axisXTitle,
      axisYTitle,
      xField = 'xValue',
      yField = 'yValue',
    } = param;

    return this.createBaseConfig({
      xField,
      yField,
      valueFormat,
      valueUnit,
      axisXTitle,
      axisYTitle,
      angleField: yField,
    });
  },

  /**
   * 配置参数获取：面积图
   * @param param 自定义参数：面积图
   * @returns 完整的面积图配置
   */
  configArea(param: any = {}) {
    return {
      ...this.defaultConfigArea(param),
      ...param,
    };
  },

  /**
   * 默认配置参数：柱状图
   * @param param 配置参数对象
   * @returns 柱状图默认配置
   */
  defaultConfigColumn(param: any = {}) {
    const {
      valueFormat = '0,0',
      valueUnit = '',
      axisXTitle,
      axisYTitle,
      xField = 'xValue',
      yField = 'yValue',
    } = param;

    const config = this.createBaseConfig({
      xField,
      yField,
      valueFormat,
      valueUnit,
      axisXTitle,
      axisYTitle,
      angleField: yField,
    });

    // 柱状图特有样式
    config.style = {
      maxWidth: 50,
    };

    return config;
  },

  /**
   * 配置参数获取：柱状图
   * @param param 自定义参数：柱状图
   * @returns 完整的柱状图配置
   */
  configColumn(param: any = {}) {
    const { showLabel, valueFormat = '0,0' } = param;

    const config: any = {
      ...this.defaultConfigColumn(param),
      ...param,
    };

    if (showLabel) {
      config.label = {
        formatter: (text: any) => myUtil.text.formatNum(text, valueFormat),
        textBaseline: 'bottom',
      };
    }

    return config;
  },

  /**
   * 默认配置参数：折线图
   * @param param 配置参数对象
   * @returns 折线图默认配置
   */
  defaultConfigLine(param: any = {}) {
    const {
      valueFormat = '0,0',
      valueUnit = '',
      axisXTitle,
      axisYTitle,
      xField = 'xValue',
      yField = 'yValue',
    } = param;

    const config = this.createBaseConfig({
      xField,
      yField,
      valueFormat,
      valueUnit,
      axisXTitle,
      axisYTitle,
      angleField: yField,
    });

    // 折线图特有样式
    config.shapeField = 'smooth';
    config.style = {
      lineWidth: 2,
    };

    return config;
  },

  /**
   * 配置参数获取：折线图
   * @param param 自定义参数：折线图
   * @returns 完整的折线图配置
   */
  configLine(param: any = {}) {
    return {
      ...this.defaultConfigLine(param),
      ...param,
    };
  },

  /**
   * 默认配置参数：双轴图
   * @param param 配置参数对象
   * @returns 双轴图默认配置
   */
  defaultConfigDualAxes(param: any = {}) {
    const { axisXTitle, xField = 'xValue' } = param;

    return {
      paddingLeft: 130,
      paddingRight: 180,
      paddingTop: 40,
      paddingBottom: 60,
      legend: true,
      xField,
      axis: { x: { title: axisXTitle } },
      interaction: {
        tooltip: {
          render: (_e: any, tooltipParam: any) => {
            return (
              <div>
                {tooltipParam.items.map((item: any, index: any) => {
                  const { name, yValue, series } = item;
                  return (
                    <div key={index}>
                      <div
                        style={{
                          margin: 0,
                          display: 'flex',
                          justifyContent: 'space-between',
                        }}
                      >
                        <div>
                          {name} {series && <>- {series}</>}
                        </div>
                        <b style={{ marginLeft: 24 }}>{yValue}</b>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          },
        },
      },
    };
  },

  /**
   * 配置参数获取：双轴图
   * @param param 自定义参数：双轴图
   * @returns 完整的双轴图配置
   */
  configDualAxes(param: any = {}) {
    const { children = [] } = param;

    const colors = ['#EE6666', '#5470C6', '#91CC75'];
    const childrenTmp: any[] = [];

    children.forEach((item: any, index: number) => {
      const chartType = item.type;
      const chartConfig =
        this.chartTypeConfig[chartType as keyof typeof this.chartTypeConfig];
      if (chartConfig) {
        childrenTmp.push(chartConfig(item, colors[index], index));
      }
    });

    return {
      ...this.defaultConfigDualAxes(param),
      ...param,
      children: childrenTmp,
    };
  },

  /**
   * 根据配置展现多个图表
   * @param chartsConfig 图表配置数组
   * @returns 图表组件数组
   */
  chartsContent({ chartsConfig }: { chartsConfig: any[] }) {
    const result: any[] = [];
    const cardStyle = { height: '400px' };
    const chartComponents: Record<string, any> = {
      pie: Pie,
      column: Column,
      line: Line,
      dualAxes: DualAxes,
      area: Area,
    };

    chartsConfig.forEach((config: any) => {
      const chartType = config.type;
      const ChartComponent = chartComponents[chartType];
      if (ChartComponent) {
        result.push(
          <Card
            title={config?.title || `图表 - ${chartType}`}
            style={cardStyle}
          >
            <ChartComponent {...config.config} />
          </Card>,
        );
      }
    });

    return result;
  },
};
// #endregion ******************************************************************************************

// #region modal
// ==================== 弹窗模块类型定义 ====================
/**
 * 弹窗内容类型
 */
type ModalContent =
  | string
  | number
  | React.ReactNode
  | (string | number | React.ReactNode)[];

/**
 * 弹窗按钮配置项
 */
interface ModalButton {
  name: string; // 按钮显示文字
  type?: 'primary' | 'default' | 'dashed' | 'link' | 'text'; // 按钮类型
  key?: string; // 按钮唯一标识
  loading?: boolean; // 是否显示加载状态
  func?: () => void; // 按钮点击回调
}

/**
 * 弹窗配置项
 */
interface ModalConfig {
  title?: React.ReactNode; // 弹窗标题
  content?: ModalContent; // 弹窗内容
  okText?: string; // 确定按钮文字
  cancelText?: string; // 取消按钮文字
  onOK?: () => void; // 确定回调
  onCancel?: () => void; // 取消回调
  footer?: React.ReactNode; // 自定义页脚
  icon?: React.ReactNode; // 自定义图标
  width?: number | string; // 弹窗宽度
  [key: string]: any; // 其他配置
}

/**
 * 弹窗类型枚举
 */
type ModalType = 'info' | 'success' | 'error' | 'warning' | 'confirm';

/**
 * API 响应信息配置
 */
interface ResponseInfoConfig {
  code: string | number; // 响应状态码
  msg: string | Record<string, any>; // 响应消息
  body?: Record<string, any>; // 响应体
}

// ==================== 弹窗模块 ====================
/**
 * 弹窗工具集
 * 提供 Ant Design Modal 的封装，支持多种弹窗类型和自定义内容展示
 */
myUtil.modal = {
  /**
   * 图标映射表 - 根据弹窗类型获取对应图标
   */
  ICON_MAP: {
    info: <InfoCircleOutlined />,
    success: <CheckCircleFilled />,
    error: <CloseCircleOutlined />,
    warning: <ExclamationCircleOutlined />,
    question: <QuestionCircleOutlined />,
    confirm: <InfoCircleOutlined />,
  },

  /**
   * 根据类型获取图标
   * @param infoType 消息类型：info/success/error/warning/question/confirm
   * @returns 图标组件
   */
  getIcon(infoType: ModalType): React.ReactNode {
    return this.ICON_MAP[infoType] || null;
  },

  /**
   * 创建通用 Modal 配置
   * @param config 弹窗配置项
   * @param type 弹窗类型
   * @returns 处理后的配置对象
   */
  createConfig(config: ModalConfig, type: ModalType): ModalConfig {
    return {
      ...config,
      okText: config.okText || '确定',
      width: config.width || CONSTANTS.C_MODAL_WIDTH_X1,
      content: this.getContent(config.content),
      footer: config.footer ? this.getFooter(config.footer) : undefined,
      icon: config.icon ?? this.getIcon(type),
    };
  },

  /**
   * 创建通用内容查看弹窗配置
   * @param title 弹窗标题
   * @param content 弹窗内容
   * @returns 弹窗配置对象
   */
  createViewConfig(title: string, content: React.ReactNode): ModalConfig {
    return {
      title,
      wrapClassName: 'standard-modal-fn',
      width: CONSTANTS.C_MODAL_WIDTH_X3,
      footer: null,
      icon: null,
      closable: true,
      content,
      onOk() {},
    };
  },

  /**
   * 消息提示弹窗 - info 类型
   * @param config 弹窗配置
   * @returns Modal 实例
   */
  info(config?: ModalConfig): ReturnType<typeof Modal.info> {
    return Modal.info(this.createConfig(config || {}, 'info'));
  },

  /**
   * 消息提示弹窗 - success 类型
   * @param config 弹窗配置
   * @returns Modal 实例
   */
  success(config?: ModalConfig): ReturnType<typeof Modal.success> {
    return Modal.success(this.createConfig(config || {}, 'success'));
  },

  /**
   * 消息提示弹窗 - error 类型
   * @param config 弹窗配置
   * @returns Modal 实例
   */
  error(config?: ModalConfig): ReturnType<typeof Modal.error> {
    return Modal.error(this.createConfig(config || {}, 'error'));
  },

  /**
   * 消息提示弹窗 - warning 类型
   * @param config 弹窗配置
   * @returns Modal 实例
   */
  warning(config?: ModalConfig): ReturnType<typeof Modal.warning> {
    return Modal.warning(this.createConfig(config || {}, 'warning'));
  },

  /**
   * 确认对话框
   * @param config 弹窗配置
   * @returns Modal 实例
   */
  confirm(config?: ModalConfig): ReturnType<typeof Modal.confirm> {
    return Modal.confirm(this.createConfig(config || {}, 'confirm'));
  },

  /**
   * 查看 JSON 格式数据弹窗
   * @param config 配置对象（data: 数据源，onChange: 数据变更回调）
   */
  viewJson(config: {
    data: string | object;
    onChange?: (value: any) => void;
  }): void {
    const { data, onChange } = config;
    let parsedData = typeof data === 'string' ? this.parseJsonSafe(data) : data;

    Modal.info(
      this.createViewConfig(
        'JSON 数据查看',
        <VanillaJSONEditor
          sizeClasssName="x"
          content={{ text: undefined, json: parsedData }}
          mainMenuBar={true}
          onChange={onChange}
          mode="text"
        />,
      ),
    );
  },

  /**
   * 查看富文本内容弹窗
   * @param config 配置对象（data: HTML 内容）
   */
  viewRichText(config: { data: string }): void {
    Modal.info(
      this.createViewConfig(
        '数据查看',
        <div dangerouslySetInnerHTML={{ __html: config.data }} />,
      ),
    );
  },

  /**
   * 查看 Markdown 内容弹窗
   * @param config 配置对象（data: Markdown 内容）
   */
  viewMarkdown(config: { data: string }): void {
    const md = markdownit({ html: true, breaks: true });
    Modal.info(
      this.createViewConfig(
        '数据查看',
        <div dangerouslySetInnerHTML={{ __html: md.render(config.data) }} />,
      ),
    );
  },

  /**
   * 安全解析 JSON 字符串
   * @param str JSON 字符串
   * @returns 解析后的对象，失败返回错误对象
   */
  parseJsonSafe(str: string): object {
    try {
      return JSON.parse(str);
    } catch {
      console.warn('JSON.parse 解析失败');
      return { error: 'JSON.parse error' };
    }
  },

  /**
   * 处理弹窗内容 - 支持数组和普通内容
   * @param content 弹窗内容
   * @returns 处理后的内容
   */
  getContent(content: ModalContent): ModalContent {
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <p className="item" key={index}>
          {item}
        </p>
      ));
    }
    return content;
  },

  /**
   * 处理弹窗页脚按钮
   * @param buttons 按钮配置数组
   * @returns 页脚组件
   */
  getFooter(buttons: (ModalButton | React.ReactElement)[]): React.ReactElement {
    const buttonElements = buttons.map((item) => {
      // 如果是 React 元素，直接返回
      if (React.isValidElement(item)) {
        return item;
      }
      // 处理按钮配置对象
      const btn = item as ModalButton;
      return (
        <Button
          key={btn.key}
          type={btn.type}
          loading={btn.loading}
          onClick={() => btn.func?.()}
        >
          {btn.name}
        </Button>
      );
    });

    return (
      <div style={{ textAlign: 'right' }}>
        <Space>{buttonElements}</Space>
      </div>
    );
  },

  /**
   * 更新已打开的弹窗配置
   * @param target 弹窗实例
   * @param config 新的配置
   */
  update(target: any, config: ModalConfig): void {
    target.update({
      ...config,
      footer: config.footer ? this.getFooter(config.footer) : undefined,
    });
  },

  /**
   * 展示 API 接口响应信息
   * 根据响应状态码展示不同的提示方式
   * @param config 响应信息配置
   */
  responseInfo({ code, msg, body }: ResponseInfoConfig): void {
    const description = typeof msg === 'string' ? msg : JSON.stringify(msg);

    // 成功响应
    if (code === '200') {
      if (body) {
        notification.info({ description, placement: 'top', duration: 2 });
      } else {
        message.info(description);
      }
      return;
    }

    // 失败响应 - 显示详细信息
    const detailContent = this.buildResponseDetail(body);
    notification.error({
      description: (
        <>
          <div>{description}</div>
          {detailContent}
        </>
      ),
      placement: 'top',
      duration: undefined,
    });
  },

  /**
   * 构建响应详情内容
   * @param body 响应体对象
   * @returns 详情内容组件
   */
  buildResponseDetail(body: Record<string, any> | undefined): React.ReactNode {
    if (!body) return null;

    const { sdp_msg_error, sdp_msg_info, sdp_msg_success, sdp_msg_warn } = body;

    const renderMsgList = (
      messages: string[],
      _type: string,
      label: string,
    ): React.ReactNode => {
      if (!messages?.length) return null;

      return (
        <>
          <div style={{ color: '#0a6ed1', margin: '12px 0', fontSize: '14px' }}>
            {label}
          </div>
          {messages.map((msg, index) => (
            <div key={index} style={{ margin: '6px 0' }}>
              {msg}
            </div>
          ))}
        </>
      );
    };

    return (
      <>
        {renderMsgList(sdp_msg_error, 'error', '异常信息')}
        {renderMsgList(sdp_msg_info, 'info', '提示信息')}
        {renderMsgList(sdp_msg_success, 'success', '成功信息')}
        {renderMsgList(sdp_msg_warn, 'warn', '警告信息')}
      </>
    );
  },
};
// #endregion ******************************************************************************************

// ==================== 数组处理模块 ====================
/**
 * 数组处理工具集
 * 提供数组去重、分组、树形结构遍历等常用数组操作方法
 */
myUtil.array = {
  /**
   * 根据对象属性去重
   * @param arr - 源数组
   * @param prop - 用于去重的属性名
   * @returns 去重后的新数组
   */
  dedupeByProperty<T>(arr: T[], prop: keyof T): T[] {
    const seen = new Map();
    return arr.filter((item) => {
      const key = item[prop];
      return !seen.has(key) && seen.set(key, true);
    });
  },

  /**
   * 根据多个字段对数组进行分组
   * @param array - 源数组
   * @param fields - 分组字段数组
   * @returns 分组后的对象，键为字段值的组合（用 | 分隔）
   */
  groupByFields<T>(array: T[], ...fields: (keyof T)[]): Record<string, T[]> {
    return array.reduce((result, item) => {
      const groupKey = fields.map((field) => item[field]).join('|');
      if (!result[groupKey]) {
        result[groupKey] = [];
      }
      result[groupKey].push(item);
      return result;
    }, {} as Record<string, T[]>);
  },

  /**
   * 遍历树形数组，将所有叶子节点的 disabled 设为 true
   * @param arr - 树形结构数组
   */
  traverseTreeLeaf(
    arr: Array<{ children?: Array<{ disabled?: boolean }> }>,
  ): void {
    arr?.forEach((item) => {
      if (Array.isArray(item.children) && item.children.length > 0) {
        item.disabled = true;
        this.traverseTreeLeaf(item.children);
      }
    });
  },

  /**
   * 为数组元素设置唯一 key（如果没有 key）
   * @param arr - 源数组
   * @returns 设置 key 后的数组
   */
  setKey<T extends Record<string, any>>(arr: T[] = []): T[] {
    return arr.map((item) => {
      if (!item.key) {
        item.key = myUtil.text.uuid();
      }
      return item;
    });
  },
};

// #region 码表
/**
 * 码表处理工具集
 * 提供码表的获取、缓存、转换等操作，支持本地存储和服务器端获取
 */
myUtil.code = {
  /**
   * 将码表数据转换为页头筛选格式
   * @param key - 码表标识
   * @param showCode - 是否在显示文本中包含 code 值
   * @returns 页头筛选格式的选项数组
   */
  getHeaderFilterOption(
    key: string,
    showCode = false,
  ): { value: string; text: string }[] {
    const codeList = this.getCode(key);
    if (!codeList || codeList.length === 0) {
      return [];
    }

    return codeList.map((item: { code: string; name: string }) => ({
      value: item.code,
      text: showCode ? `[${item.code}]   ${item.name}` : item.name,
    }));
  },

  /**
   * 将码表数据转换为下拉选择格式
   * @param key - 码表标识
   * @returns 下拉选择格式的选项数组
   */
  getSelectOption(
    key: string,
  ): { value: string; name: string; label: string }[] {
    const codeList = this.getCode(key);
    if (!codeList || codeList.length === 0) {
      return [];
    }

    return codeList.map((item: { code: string; name: string }) => ({
      value: item.code,
      name: item.name,
      label: item.name,
    }));
  },

  /**
   * 获取 URL 类型码表的请求参数
   * @param key - 码表标识（以 'url_' 开头）
   * @returns 请求配置对象，包含 url 和 params
   */
  getUrlCodeParams(key: string): { url: string; params: Record<string, any> } {
    const urlConfigMap: Record<
      string,
      { url: string; params: Record<string, any> }
    > = {
      url_gy_hbhl: {
        url: '/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx',
        params: {
          page: 1,
          pageSize: 999999,
          searchModel: [{ property: 'hbzmDm', value: '', op: 'al' }],
        },
      },
    };

    return urlConfigMap[key] || { url: '', params: {} };
  },

  /**
   * 从服务器获取码表数据（带缓存）
   * @param key - 码表标识
   * @returns 码表数据数组
   */
  async getCodeFromServer(key: string): Promise<any[]> {
    // 先从本地缓存获取
    const cachedCode = this.getCode(key);
    if (cachedCode && cachedCode.length > 0) {
      return cachedCode;
    }

    // 从本地静态文件获取
    let result = getStaticTableCode(key);

    // 从服务器获取
    if (!result || result.length <= 0) {
      const { code, body } = await apiGetCode({ dictCodeId: key });
      if (code === '200') {
        this.saveCodeToLocalTable(key, body);
        return body;
      }
      return [];
    }

    return result;
  },

  /**
   * 从服务器获取码表数据（支持 URL 类型和普通类型）
   * @param key - 码表标识
   * @param path - 可选的服务器路径
   * @returns 码表数据数组
   */
  async getCodeFromServerT1(key: string, path?: string): Promise<any[]> {
    // 先从本地缓存获取
    const cachedCode = this.getCode(key);
    if (cachedCode && cachedCode.length > 0) {
      return cachedCode;
    }

    // 从本地静态文件获取
    let result = getStaticTableCode(key);

    // 从服务器获取
    if (!result || result.length <= 0) {
      // URL 类型码表
      if (key.startsWith('url')) {
        const { url, params } = this.getUrlCodeParams(key);
        if (url && window.getUrlCode) {
          const response = await window.getUrlCode(url, params);
          const { code, body } = response;
          if (code === '200' && body.rows?.length > 0) {
            this.saveCodeToLocalTable(key, body.rows);
            return body.rows;
          }
        }
        return [];
      }

      // 普通码表
      const requestParams = path
        ? { dictCodeId: key, path }
        : { dictCodeId: key };
      const { code, body } = await apiGetCode(requestParams);
      if (code === '200') {
        this.saveCodeToLocalTable(key, body);
        return body;
      }
    }

    return result || [];
  },

  /**
   * 将码表数据保存到本地会话存储
   * @param key - 码表标识
   * @param codeTableData - 码表数据
   */
  saveCodeToLocalTable(key: string, codeTableData: any[]): void {
    if (!codeTableData || codeTableData.length === 0) {
      return;
    }

    const localCodeTable = myUtil.sessionStore.getItem('codeTable') || {};
    localCodeTable[key] = codeTableData;
    myUtil.sessionStore.setItem('codeTable', localCodeTable);
  },

  /**
   * 从本地会话存储中删除指定码表
   * @param key - 码表标识
   */
  deleteCodeFromLocalTable(key: string): void {
    const localCodeTable = myUtil.sessionStore.getItem('codeTable') || {};
    delete localCodeTable[key];
    myUtil.sessionStore.setItem('codeTable', localCodeTable);
  },

  /**
   * 获取本地会话存储中的码表数据
   * @param key - 码表标识
   * @returns 码表数据数组
   */
  getCode(key: string): any[] {
    const localCodeTable = myUtil.sessionStore.getItem('codeTable') || {};
    return localCodeTable[key] || [];
  },

  /**
   * 根据 code 值获取码表对应的显示值
   * @param targetCode - 目标 code 值（支持逗号分隔的多个值）
   * @param key - 码表标识
   * @param match - 匹配配置，默认为 { matchKey: 'code', matchValKey: 'name' }
   * @returns 显示值，多个值用中文逗号分隔
   */
  getCodeValByKey(
    targetCode: string | number,
    key: string,
    match: { matchKey?: string; matchValKey?: string } = {},
  ): string {
    const codeTable = this.getCode(key);
    if (!codeTable || codeTable.length === 0) {
      return '';
    }

    const { matchKey = 'code', matchValKey = 'name' } = match;
    const codeList = Array.isArray(targetCode)
      ? targetCode
      : String(targetCode).split(',');

    const values: string[] = [];
    for (const code of codeList) {
      const item = codeTable.find((i: any) => i[matchKey] === code);
      if (item) {
        values.push(item[matchValKey]);
      }
    }

    return values.join('，');
  },

  /**
   * 从配置数组中提取所有码表参数
   * @param configArray - 配置数组
   * @param result - 结果对象，用于收集码表参数
   */
  extractCodeTableParam(
    configArray: any[],
    result: Record<string, { key: string }>,
  ): void {
    for (const item of configArray) {
      if (item.children) {
        // 递归处理子配置
        this.extractCodeTableParam(item.children, result);
      } else {
        // 处理普通配置项
        const { codeTable, filter } = item;

        // 列表列、普通筛选、表单
        if (codeTable) {
          result[codeTable] = { key: codeTable };
        }

        // 列头筛选
        if (filter?.codeTable) {
          result[filter.codeTable] = { key: filter.codeTable };
        }
      }
    }
  },

  /**
   * 从 JSON 配置中获取码表参数列表
   * @param param - 配置参数对象
   * @returns 码表参数数组
   */
  getCodeTableParamFromJson(param: { items?: any[] }): { key: string }[] {
    const { items = [] } = param;
    const result: Record<string, { key: string }> = {};

    this.extractCodeTableParam(items, result);

    return Object.values(result).filter((item) => item.key);
  },

  /**
   * 批量获取码表数据的 Promise 数组
   * @param apiParam - 码表参数数组
   * @returns Promise 数组
   */
  getCodeTablePromise(
    apiParam: { key: string; path?: string }[],
  ): Promise<any>[] {
    return apiParam.map(({ key, path }) => this.getCodeFromServerT1(key, path));
  },

  /**
   * 批量更新指定码表
   * @param codes - 码表标识数组
   */
  updateCodeTableByKeys(codes: string[]): void {
    if (!codes || codes.length === 0) {
      return;
    }

    // 删除旧缓存并构建请求参数
    const params = codes.map((key) => {
      this.deleteCodeFromLocalTable(key);
      return { key };
    });

    // 批量获取码表
    const promiseArr = this.getCodeTablePromise(params);
    Promise.all(promiseArr).catch(() => {
      message.error('获取码表失败');
    });
  },

  /**
   * 更新本地会话存储中的所有码表
   */
  updateCodeTableAll(): void {
    const localCodeTable = myUtil.sessionStore.getItem('codeTable') || {};
    const codes = Object.keys(localCodeTable);
    this.updateCodeTableByKeys(codes);
  },
};
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
    window.localStorage.removeItem(CONSTANTS.LOGIN.ACCESS_TOKEN);
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
      window.location.href.indexOf('/example/vtable/ddvtable') > -1 ||
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
        fallback="data:image/png;base64,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"
      />;
    } else if (CONSTANTS.MEDIA.TYPE_VIDEO.indexOf(mediaType) > -1) {
      let previewVideo;
      previewVideo = {
        preview:{
          destroyOnClose: true,
          imageRender: () => (
            <video
              muted
              width="100%"
              height="100%"
              controls
              src={`${mediaPathVideo}`}
            />
          ),
          toolbarRender: () => null,
        }
      }
      if (item?.mediaPathPic) {
        coverTmp =<Image
        {...previewVideo}
        src={mediaPathPic}
        fallback="data:image/png;base64,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"
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