import { request } from 'umi';
import myUtil from '@/components/DDAssist/util';

/** 基础路径 */
const API_URL_BASE = `${myUtil.api.getApiRoot()}/api/appLog`;

/** 概览仪表盘 - 获取日志总量、ERROR/WARN/INFO 数量、错误率等核心指标 */
export async function getOverview(params?: { startDate?: string; endDate?: string }) {
  return request<API.ResponseBody>(`${API_URL_BASE}/overview`, {
    method: 'POST',
    data: params,
  });
}

/** 日志级别分布 - 获取 INFO/ERROR/WARN 占比，用于饼图展示 */
export async function getLevelDistribution(params?: { startDate?: string; endDate?: string }) {
  return request<API.ResponseBody>(`${API_URL_BASE}/levelDistribution`, {
    method: 'POST',
    data: params,
  });
}

/** 趋势分析 - 按小时/天统计日志量趋势 */
export async function getTrend(params?: {
  startDate?: string;
  endDate?: string;
  type?: 'hourly' | 'daily';
}) {
  return request<API.ResponseBody>(`${API_URL_BASE}/trend`, {
    method: 'POST',
    data: params,
  });
}

/** 错误码统计 - 统计 ERROR 的 error_code 分布，用于柱状图展示 */
export async function getErrorCodes(params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  return request<API.ResponseBody>(`${API_URL_BASE}/errorCodes`, {
    method: 'POST',
    data: params,
  });
}

/** 来源分布 - 按 IP 地址统计日志分布 */
export async function getByIp(params?: {
  startDate?: string;
  endDate?: string;
  level?: string;
  limit?: number;
}) {
  return request<API.ResponseBody>(`${API_URL_BASE}/byIp`, {
    method: 'POST',
    data: params,
  });
}

/** 来源分布 - 按请求 URL 统计日志分布 */
export async function getByUrl(params?: {
  startDate?: string;
  endDate?: string;
  level?: string;
  limit?: number;
}) {
  return request<API.ResponseBody>(`${API_URL_BASE}/byUrl`, {
    method: 'POST',
    data: params,
  });
}

/** 24小时分布 - 分析每小时日志分布 */
export async function getHourlyDistribution(params?: { startDate?: string; endDate?: string }) {
  return request<API.ResponseBody>(`${API_URL_BASE}/hourlyDistribution`, {
    method: 'POST',
    data: params,
  });
}

/** 星期分布 - 按星期统计日志分布 */
export async function getWeeklyDistribution(params?: { startDate?: string; endDate?: string }) {
  return request<API.ResponseBody>(`${API_URL_BASE}/weeklyDistribution`, {
    method: 'POST',
    data: params,
  });
}
