// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 删除(单条或批量)  根据uuids删除数据  POST /dict/automatic/exp/bs/delete/${param0} */
export async function controllerSdpBaseDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.controllerSdpBaseDeleteParams,
  body: API.baseDeleteRequest,
  options?: { [key: string]: any },
) {
  const { moduleKey: param0, ...queryParams } = params;
  return request<API.baseResponse>(
    `${API_URL_BASE}/dict/automatic/exp/bs/delete/${param0}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}

/** 获取码表  根据主键获取表单详细信息  POST /dict/automatic/exp/bs/getCodeList */
export async function controllerSdpGetCodeList(
  body: API.getCodeListRequest,
  options?: { [key: string]: any },
) {
  return request<API.getCodeListResponse>(
    `${API_URL_BASE}/dict/automatic/exp/bs/getCodeList`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: body,
      ...(options || {}),
    },
  );
}

/** 获取表单详情  根据主键获取表单详细信息  POST /dict/automatic/exp/bs/queryForm/${param0} */
export async function controllerSdpBaseShow(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.controllerSdpBaseShowParams,
  body: API.baseShowRequest,
  options?: { [key: string]: any },
) {
  const { moduleKey: param0, ...queryParams } = params;
  return request<API.baseResponse>(
    `${API_URL_BASE}/dict/automatic/exp/bs/queryForm/${param0}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}

/** 分页列表  分页查询数据列表  POST /dict/automatic/exp/bs/queryPager/${param0} */
export async function controllerSdpBaseList2(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.controllerSdpBaseList2Params,
  body: API.baseList2Request,
  options?: { [key: string]: any },
) {
  const { moduleKey: param0, ...queryParams } = params;
  return request<API.baseResponse>(
    `${API_URL_BASE}/dict/automatic/exp/bs/queryPager/${param0}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}

/** 分页列表（自定义Sql）  分页查询数据列表-自定义SQL  POST /dict/automatic/exp/bs/queryPagerCustomer/${param0} */
export async function controllerSdpBaseList2C(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.controllerSdpBaseList2cParams,
  body: API.baseList2Request,
  options?: { [key: string]: any },
) {
  const { moduleKey____sqlKey: param0, ...queryParams } = params;
  return request<API.baseResponse>(
    `${API_URL_BASE}/dict/automatic/exp/bs/queryPagerCustomer/${param0}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}

/** 编辑表单信息  根据主键更新表单信息  POST /dict/automatic/exp/bs/saveOrUpdate/${param0} */
export async function controllerSdpBaseEdit(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.controllerSdpBaseEditParams,
  body: API.baseEditRequest,
  options?: { [key: string]: any },
) {
  const { moduleKey: param0, ...queryParams } = params;
  return request<API.baseResponse>(
    `${API_URL_BASE}/dict/automatic/exp/bs/saveOrUpdate/${param0}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}

/** 前端模块config组装数据  根据主键获取表单详细信息  POST /dict/automatic/exp/pageDef/${param0} */
export async function controllerSdpPageDef(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.controllerSdpPageDefParams,
  body: API.pageDefRequest,
  options?: { [key: string]: any },
) {
  const { moduleKey: param0, ...queryParams } = params;
  return request<API.baseResponse>(
    `${API_URL_BASE}/dict/automatic/exp/pageDef/${param0}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      params: { ...queryParams },
      data: body,
      ...(options || {}),
    },
  );
}
