// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

/** 删除(单条或批量)  根据uuids删除数据 <br>表名称取值顺序: 1、body体config_table_name字段；2、后端配置table_name；3、moduleKey <br>
表主键取值顺序（多主键时使用）: 1、body体config_table_p_key_field字段；2、后端配置p_key_field; 3、默认主键default_p_key_field <br>
示例 <br>
1. moduleKey=eg_mts_tsjh，body={"uuids": ["20","21"]} <br>
2. moduleKey=1，body={"uuids": [{"code_type":"api_type","code":"db1"},{"code_type":"api_type","code":"export1"}],"config_table_p_key_field":["code_type","code"],"config_table_name":"sys_codetable"} <br>
3. moduleKey=1，body={"uuids": [{"user_id":"testuser"}],"config_table_p_key_field":"user_id","config_table_name":"sys_user"} <br>
4. 获取后端配置中的表名称及表主键，moduleKey=m_sys_codetable，body={"uuids": [{"code_type":"api_type","code":"db1"},{"code_type":"api_type","code":"export1"}]} <br>  POST /ns/base/delete/${param0} */
export async function controllerCommonCommonBaseDelete(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.controllerCommonCommonBaseDeleteParams,
  body: API.baseDeleteRequest,
  options?: { [key: string]: any },
) {
  const { moduleKey: param0, ...queryParams } = params;
  return request<API.baseResponse>(`${API_URL_BASE}/ns/base/delete/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 编辑表单数据  根据主键更新表单数据 <br>表名称取值顺序: 1、body体config_table_name字段；2、后端配置table_name；3、moduleKey <br>
表主键取值顺序: 1、body体config_table_p_key_field字段；2、后端配置p_key_field; 3、默认主键default_p_key_field <br>
示例 <br>
1. moduleKey=eg_mts_tsjh，body={"uuid":"00ed13555c214d09804b905dfcf22cd0","sbpc":"999","ssq":"202512","formType":"edit"} <br>
2. moduleKey=1，body={"uuid":"00ed13555c214d09804b905dfcf22cd0","sbpc":"999","ssq":"202512","formType":"edit","config_table_name":"eg_mts_tsjh"} <br>
3. moduleKey=1，body={"code_type":"api_type","code":"login","name":"哈哈哈","name_full":"飞飞飞","config_table_p_key_field":["code_type","code"],"config_table_name":"sys_codetable"} <br>  POST /ns/base/edit/${param0} */
export async function controllerCommonCommonBaseEdit(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.controllerCommonCommonBaseEditParams,
  body: API.baseEditRequest,
  options?: { [key: string]: any },
) {
  const { moduleKey: param0, ...queryParams } = params;
  return request<API.baseResponse>(`${API_URL_BASE}/ns/base/edit/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 通用分页列表  分页查询数据列表（含自定义SQL）<br>表名称取值顺序: 1、body体config_table_name；2、后端配置table_name；3、moduleKey <br>
Sql取值顺序: 1、后端配置sql(自定义sql，无需表名字段) 2、根据表明全量查询select * from ... <br>
初始排序字段取值顺序：1、body体config_table_default_order字段；2、后端配置default_order <br>
searchModel.op取值范围: alike、eq、neq、dydy、xydy <br>
orderModel.order取值范围: asc、desc <br>
示例 <br>
1. moduleKey=eg_mts_tsjh，body={"page":1,"pageSize":10,"config_table_default_order":"ssq asc,sbpc desc"} <br>
2. moduleKey=1，body={"page":1,"pageSize":10, "config_table_name":"sys_codetable","config_table_default_order":"code_type asc,code desc"} <br>
3. moduleKey=1，body={"page":1,"pageSize":10,"config_table_name":"sys_codetable","searchModel":[{"property":"code_type","value":"api_type","op":"alike"}],"orderModel":[{"field":"code_type","order":"desc"}]} <br>
4. 自定义SQL，配置m_sys_user中的sql字段，moduleKey=m_sys_user，body={"page":1,"pageSize":10} <br>  POST /ns/base/list/${param0} */
export async function controllerCommonCommonBaseList(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.controllerCommonCommonBaseListParams,
  body: API.baseList2Request,
  options?: { [key: string]: any },
) {
  const { moduleKey: param0, ...queryParams } = params;
  return request<API.baseResponse>(`${API_URL_BASE}/ns/base/list/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}

/** 获取表单数据  根据主键获取表单数据 <br>表名称取值顺序: 1、body体config_table_name字段；2、后端配置table_name；3、moduleKey <br>
表主键取值顺序: 1、body体config_table_p_key_field字段；2、后端配置p_key_field; 3、默认主键default_p_key_field <br>
示例 <br>
1. moduleKey=eg_mts_tsjh，body={"uuid": "00ed13555c214d09804b905dfcf22cd0"} <br>
2. moduleKey=1，body={"code_type":"api_type","code":"db","config_table_p_key_field":["code_type","code"],"config_table_name":"sys_codetable"} <br>
3. moduleKey=1，body={"user_id":"admin","config_table_p_key_field":"user_id","config_table_name":"sys_user"} <br>
4. 获取后端配置中的表名称及表主键，moduleKey=m_sys_user，body={"user_id": "admin"}  POST /ns/base/show/${param0} */
export async function controllerCommonCommonBaseShow(
  // 叠加生成的Param类型 (非body参数swagger默认没有生成对象)
  params: API.controllerCommonCommonBaseShowParams,
  body: API.baseShowRequest,
  options?: { [key: string]: any },
) {
  const { moduleKey: param0, ...queryParams } = params;
  return request<API.baseResponse>(`${API_URL_BASE}/ns/base/show/${param0}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    params: { ...queryParams },
    data: body,
    ...(options || {}),
  });
}
