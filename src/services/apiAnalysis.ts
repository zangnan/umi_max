import { request } from 'umi';
import myUtil from '@/components/DDAssist/util';

/** 基础路径 */
const API_URL_BASE = `${myUtil.api.getApiRoot()}/api/analysis`;

/** 概览仪表盘 - 获取总调用次数、日均调用量、平均响应时间、接口数量、用户数、错误率等核心指标 */
export async function getOverview(params?: { startDate?: string; endDate?: string }) {
  return request<API.ResponseBody>(`${API_URL_BASE}/overview`, {
    method: 'POST',
    data: params,
  });
}

/** 趋势分析 - 按小时/天/周统计调用量趋势和响应时间变化 */
export async function getTrend(params?: {
  startDate?: string;
  endDate?: string;
  type?: 'hourly' | 'daily' | 'weekly';
}) {
  return request<API.ResponseBody>(`${API_URL_BASE}/trend`, {
    method: 'POST',
    data: params,
  });
}

/** 按接口统计 - 按接口地址统计调用次数、平均响应时间、错误率等信息 */
export async function getByInterface(params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  return request<API.ResponseBody>(`${API_URL_BASE}/byInterface`, {
    method: 'POST',
    data: params,
  });
}

/** 按用户统计 - 按用户统计调用次数、使用的接口分布、平均响应时间等 */
export async function getByUser(params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  return request<API.ResponseBody>(`${API_URL_BASE}/byUser`, {
    method: 'POST',
    data: params,
  });
}

/** 按响应码统计 - 按 HTTP 响应码统计分布，并提供错误请求的详细列表 */
export async function getByStatusCode(params?: { startDate?: string; endDate?: string }) {
  return request<API.ResponseBody>(`${API_URL_BASE}/byStatusCode`, {
    method: 'POST',
    data: params,
  });
}

/** 按 IP 地址统计 - 按 IP 地址统计调用次数、涉及的用户数和接口数 */
export async function getByIp(params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  return request<API.ResponseBody>(`${API_URL_BASE}/byIp`, {
    method: 'POST',
    data: params,
  });
}

/** 性能分析 - 分析接口性能，包括慢接口排行和响应时间分布 */
export async function getPerformance(params?: {
  startDate?: string;
  endDate?: string;
  limit?: number;
}) {
  return request<API.ResponseBody>(`${API_URL_BASE}/performance`, {
    method: 'POST',
    data: params,
  });
}

/** 时段分析 - 分析每小时调用量分布，识别高峰时段 */
export async function getHourly(params?: { startDate?: string; endDate?: string }) {
  return request<API.ResponseBody>(`${API_URL_BASE}/hourly`, {
    method: 'POST',
    data: params,
  });
}
