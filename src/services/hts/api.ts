import { request } from 'umi';
import myUtil from '@/components/DDAssist/util';

// 【通用】分页列表
export async function queryList(param: any, key?: any, baseurl?: any) {
  let url = baseurl ? API_URL_BASE : myUtil.api.getApiRoot();
  return request(`${url}/dict/automatic/exp/bs/queryPager/${key}`, { method: 'POST', data: param });
}

// 【通用】表单保存
export async function saveOrUpdate(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/bs/saveOrUpdate/${param.key}`, { method: 'POST', data: param });
}

// 【通用】表单查询
export async function queryForm(param: any) {
  return request(`${API_URL_BASE}/dict/automatic/exp/bs/queryForm/${param.key}`, { method: 'POST', data: param });
}

// 【通用】删除
export async function batchDelete(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/bs/delete/${param.key}`, { method: 'POST', data: param });
}

// 【通用】删除 安筛选条件删除
export async function batchDeleteByModel(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/bs/batchDelete/${param.key}`, { method: 'POST', data: param });
}

// 测试接口 *****************************************************************************************************************

// 测试接口，返回200
export async function testReturnCode200(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/test/returnCode200`, { method: 'POST', data: param });
}

// 测试接口，返回500
export async function testReturnCode500(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/test/returnCode500`, { method: 'POST', data: param });
}
// 测试接口，报表数据
export async function getReportGridData(url: string, param: any) {
  return request(url, { method: 'POST', data: param });
}

//【共用】敏捷快速构建系统 根据configKey加载config 编辑用
export async function retrieveAppModuleDetail(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/app/mgr/retrieveAppModuleDetail`, { method: 'POST', data: param });
}

//【共用】敏捷快速构建系统 根据configKey加载config 生产用
export async function automaticPageDef(pageKey: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/pageDef/${pageKey}`, { method: 'POST', data: {} });
}

//【共用】敏捷快速构建系统 物理表 获取物理表字段
export async function getDbField(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/mgmt/field/retrieveFieldByObject`, { method: 'POST', data: param });
}

//【共用】敏捷快速构建系统 应用模块 保存模块
export async function createAppModule(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/app/mgr/createAppModule`, { method: 'POST', data: param });
}

//【共用】敏捷快速构建系统 获取物理表
export async function retrieveObjectByDomain(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/mgmt/table/retrieveObjectByDomain`, { method: 'POST', data: param });
}

// 敏捷快速构建系统 通过Excel创建应用及模块
export async function createAppModuleByExcelData(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/app/mgr/createAppModuleByExcelData`, {
    method: 'POST',
    data: param,
    getResponse: true,
  });
}

// 通用 *****************************************************************************************************************

// 获取指定码表 适配后端 坑~~~~
export async function getCode(param: any) {
  // 原参数: { codeStoreKey: 'code_dm_ckts_hgcjfs_mc'  codeViewKey: '01' }
  // 新参数: { dictCodeId: 'code_dm_ckts_hgcjfs_mc' }
  // return request(`${myUtil.api.getApiRoot()}/dict/automatic/getCodeList`, { method: 'POST', data: param });
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/bs/getCodeList`, { method: 'POST', data: param });
}

// 通用获取下拉树数据
export async function getTreeCode(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/hx/ty/crud/getComboTree`, { method: 'POST', data: param });
}

// 指定url获取码表
export async function getUrlCode(url: any, param: any) {
  return request(`${myUtil.api.getApiRoot()}${url}`, { method: 'POST', data: param });
}

// [共通] 获取一次性token
export async function getOneTimeToken(param: any) {
  return request(`${myUtil.api.getApiRoot()}/hx/qx/token/getOneTimeToken`, { method: 'POST', data: param });
}
// 权限 *********************************************************************************************************************

// 用户管理 设置用户角色
export async function setUserRole(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/auth/setUserRole`, { method: 'POST', data: param });
}

// 通用crud *****************************************************************************************************************

// 分页查询
export async function getGridData(url: string, param: any) {
  return request(url, { method: 'POST', data: param });
}

// getS2GridData
export async function getS2GridData(url: string, param: any) {
  return request(url, { method: 'POST', data: param });
}

// 模板下载(传参)
export async function downloadTemplate(param: any) {
  return request(`${myUtil.api.getApiRoot()}/hx/ty/crud/downloadTemplate`, { method: 'POST', data: param });
}

// [共通] Get方式下载
export async function downloadGet(param: any, url: any, oneTimeToken: any) {
  return request(`${myUtil.api.getApiRoot()}${url}${oneTimeToken}`, { method: 'GET', responseType: 'blob', getResponse: true, params: param });
}

// 导出
export async function automaticExport(url: any, pageKey: any, param: any, responseType?: any) {
  // const { data, url } = param;
  // const serviceUrl = url;
  // return request(serviceUrl, { method: 'POST', data: data });
  const par: any = {
    method: 'POST',
    data: param,
  }
  if (responseType) {
    par.responseType = responseType;
    par.getResponse = true;
  }
  return request(url, par);
}

// 导入
export async function importExecl(url: any, param: any) {
  if(!url) {
    console.info(param.get('unitKey'), param.get('unitKey'));
    url =`${myUtil.api.getApiRoot()}/dict/automatic/import/${param.get('unitKey')}`;
  }
  return request(url, { method: 'POST', data: param });
}

// 导入问题导出
export async function commonDrwtdc(param: any) {
  return request(`${myUtil.api.getApiRoot()}/ty/hx/dc/drwtdc`, { method: 'POST', data: param });
}

// 数据驱动 下载模板
export async function automaticTemplate(url: any, param: any) {
  return request(url, { method: 'POST', data: param });
  // return request(`${myUtil.api.getApiRoot()}/dict/automatic/template/${pageKey}`, { method: 'POST', data: param });
}

// 删除
export async function baseDelete(param: any) {
  return request(param.url, { method: 'POST', data: param.data });
}

// 编辑(新建、更新)
export async function baseEdit(param: any) {
  const { data, url } = param;
  const serviceUrl = url;
  return request(serviceUrl, { method: 'POST', data: data });
}

// baseEditFormData
export async function baseEditFormData(param: any) {
  const { data, url } = param;
  return request(url, { method: 'POST', data: data, headers: { 'Content-Type': 'multipart/form-data' } });
}

// 获取表单
export async function baseShow(param: any) {
  const { data, url } = param;
  return request(url, { method: 'POST', data });
}

// [表单采集] 通用检查业务数据后台接口
export async function callServiceCheck(param: any) {
  const { data, url } = param;
  const serviceUrl = url ? url : `${myUtil.api.getApiRoot()}/hx/ty/check/callServiceCheck`;
  return request(serviceUrl, { method: 'POST', data });
}

// 敏捷开发初始化 v0.2 *****************************************************************************************************************

// 通过excel初始化创建数据库-mysql
export async function initDbByExcel(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/init/initDbByExcel`, { method: 'POST', data: param, headers: { 'Content-Type': 'multipart/form-data' } });
}

// 通过excel初始化系统基本信息.
export async function initBaseDataByExcel(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/init/initBaseDataByExcel`, { method: 'POST', data: param, headers: { 'Content-Type': 'multipart/form-data' } });
}

// 通过excel构建应用
export async function initDictByExcel(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/init/initDictByExcel`, { method: 'POST', data: param });
}

// 构建全量菜单
export async function initMenuByExcel(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/init/initMenuByExcel`, { method: 'POST', data: param });
}

// 敏捷开发初始化 v0.2 *****************************************************************************************************************

// 分页列表 模块
export async function retrieveModulePager(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/retrieveModulePager`, { method: 'POST', data: param });
}

// 分页列表 数据字典
export async function retrieveDictPager(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/retrieveDictPager`, { method: 'POST', data: param });
}

// 分页列表 表
export async function retrieveTablePager(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/retrieveTablePager`, { method: 'POST', data: param });
}

// 初始化数据表
export async function initTableDefault(url?: any) {
  return request(url || `${APP_BASE ? '/' + APP_BASE : ''}/import_template/v0.2/init_table.xlsx`, { method: 'GET', responseType: 'blob' });
}

// 初始化数据表数据
export async function initDataDefault(url?: any) {
  return request(url || `${APP_BASE ? '/' + APP_BASE : ''}/import_template/v0.2/init_data.xlsx`, { method: 'GET', responseType: 'blob' });
}

// 初始化系统管理模块数据字典
export async function initModuleDefault(url?: any) {
  return request(url || `${APP_BASE ? '/' + APP_BASE : ''}/import_template/v0.2/init_module_system.xlsx`, { method: 'GET', responseType: 'blob' });
}

// 菜单管理 新增修改菜单树节点
export async function editMenu(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/bs/saveOrUpdate/m_sys_menu`, { method: 'POST', data: param });
}

// 菜单管理 删除菜单树节点
export async function deleteMenu(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/bs/delete/m_sys_menu`, { method: 'POST', data: param });
}

// 角色管理 保存角色菜单树
export async function saveRoleMenu(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/auth/setRoleMenu`, { method: 'POST', data: param });
}

// 菜单管理 分页列表 -> 菜单树列表
export async function getMenuByRole(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/auth/getMenuByRole`, { method: 'POST', data: param });
}

// 用户管理 设置用户角色
export async function getRoleByUser(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/auth/getRoleByUser`, { method: 'POST', data: param });
}

// 分词
export async function segmenter(param?: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/jieba/segmenter/0/${param.dictType}`, { method: 'POST', data: param });
}

// 敏捷快速构建系统 产品线 列表查询
export async function retrieveDomain(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/mgmt/domain/retrieveDomain`, { method: 'POST', data: param });
}

// 敏捷快速构建系统 数据元 列表查询
export async function retrieveFieldPager(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/mgmt/field/retrieveFieldPager`, { method: 'POST', data: param });
}

// 敏捷快速构建系统 物理表 列表查询
export async function retrieveObjectDetailByDomain(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/mgmt/table/retrieveObjectDetailByDomain`, { method: 'POST', data: param });
}

// 敏捷快速构建系统 应用码表配置 列表查询
export async function codeQueryPager(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/mgmt/code/queryPager`, { method: 'POST', data: param });
}

// 敏捷快速构建系统 应用 列表查询
export async function retrieveApp(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/app/mgr/retrieveApp`, { method: 'POST', data: param });
}

// 敏捷快速构建系统 应用模块 应用根据configKey加载config
export async function retrieveAppModule(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/app/mgr/retrieveAppModule`, { method: 'POST', data: param });
}

// updateDictByWeb
export async function updateDictByWeb(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/updateDictByWeb`, { method: 'POST', data: param });
}

// 导出PDF
export async function exportPdf(pageKey: any, data: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/bs/exportPdf/blob/${pageKey}`, { method: 'POST', data, responseType: 'blob', getResponse: true, });
}

// #region审批流程管理 *************************************************
// 保存审批流程
export async function editFlow(param?: any) {
  return request(`${API_URL_BASE}/dict/procdef/save`, { method: 'POST', data: param });
}
// 流程开启
export async function startProc(param?: any) {
  return request(`${API_URL_BASE}/dict/procexe/startProc`, { method: 'POST', data: param });
}
// 流程查询
export async function queryPagerProc(param: any) {
  return request(`${API_URL_BASE}/dict/procexe/queryPagerProc`, { method: 'POST', data: param });
}
// 流程进程查询
export async function queryPagerProcTaskRun(param: any) {
  return request(`${API_URL_BASE}/dict/procexe/queryPagerProcTaskRun/0`, { method: 'POST', data: param });
}
// 流程进程更新
export async function procexeUpdate(param: any) {
  return request(`${API_URL_BASE}/dict/procexe/update`, { method: 'POST', data: param });
}
// 查询流程详细
export async function queryProcBsAndTasks(param: any) {
  return request(`${API_URL_BASE}/dict/procexe/queryProcBsAndTasks`, { method: 'POST', data: param });
}
// 中止流程
export async function interruptProc(param: any) {
  return request(`${API_URL_BASE}/dict/procexe/interruptProc`, { method: 'POST', data: param });
}
// #endregion ******************************************************************************************

// #region 内部管理系统 *************************************************
// 员工管理 导入人员信息
export async function initUserResumeByExcel(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/init/nbgl/initUserResumeByExcel`, { method: 'POST', data: param, headers: { 'Content-Type': 'multipart/form-data' } });
}
// 员工管理 导入员工历史数据
export async function initUserInfoByExcel(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/init/nbgl/initUserInfoByExcel`, { method: 'POST', data: param, headers: { 'Content-Type': 'multipart/form-data' } });
}
// 员工管理 批量初始化简历信息
export async function initUserResumeListByExcel(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/init/nbgl/initUserResumeListByExcel`, { method: 'POST', data: param, headers: { 'Content-Type': 'multipart/form-data' } });
}
// 考勤管理 导入钉钉考勤
export async function importByFileAndPathDdDk(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/bs/importByFileAndPath/nbgl_kqgl_dd_dk/4`, { method: 'POST', data: param, headers: { 'Content-Type': 'multipart/form-data' } });
}
// 考勤管理 导入钉钉餐补车补
export async function importByFileAndPathDdCbcb(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/automatic/exp/bs/importByFileAndPath/nbgl_kqgl_dd_cbcb/2`, { method: 'POST', data: param, headers: { 'Content-Type': 'multipart/form-data' } });
}
// 考勤管理 钉钉 -> 每日统计
export async function dd2mrtj(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/kqgl/dd2mrtj`, { method: 'POST', data: param });
}
// 考勤管理 考勤汇总 生成
export async function createkq(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/kqgl/createkq/1`, { method: 'POST', data: param });
}
// 考勤管理 加班汇总 生成
export async function createJb(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/kqgl/createJb/1`, { method: 'POST', data: param });
}
// 考勤管理 考勤汇总 导出
export async function exportkq(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/kqgl/exportkq/1`, { method: 'POST', data: param , responseType: 'blob', getResponse: true, });
}
// 薪资管理 生成计薪人员信息
export async function scjxry(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/gzgl/scjxry`, { method: 'POST', data: param });
}
// 薪资管理 生成工资数据
export async function scgzxx(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/gzgl/scgzxx`, { method: 'POST', data: param });
}
// 薪资管理 导入 提成汇总表:1  社保基数表:3  专项扣除表:4
export async function importGzgl(param: any, importType: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/gzgl/import/${importType}`, { method: 'POST', data: param, headers: { 'Content-Type': 'multipart/form-data' } });
}
// 薪资管理 导出工资数据
export async function exportGz1(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/gzgl/exportGz/1`, { method: 'POST', data: param , responseType: 'blob', getResponse: true, });
}
// 薪资管理 导入 历史工资信息:1 导入历史社保信息:2
export async function importLsxx(param: any, importType: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/gzgl/importLsxx/${importType}`, { method: 'POST', data: param, headers: { 'Content-Type': 'multipart/form-data' } });
}
// 薪资管理 导出社保数据
export async function exportSb(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/gzgl/exportSb/1`, { method: 'POST', data: param , responseType: 'blob', getResponse: true, });
}
// 薪资管理 生成社保数据
export async function scgjj(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/gzgl/scgjj`, { method: 'POST', data: param });
}
// 项目管理 项目确认
export async function saveXmbgqe(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/xmgl/saveXmbgqe`, { method: 'POST', data: param });
}
// 项目管理 项目变更保存
export async function saveXmbgxx(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/xmgl/saveXmbgxx`, { method: 'POST', data: param });
}
// 项目管理 里程碑变更保存
export async function saveXmlcbbgxx(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/xmgl/saveXmlcbbgxx`, { method: 'POST', data: param });
}
// 项目管理 项目完结
export async function saveXmjsxx(param: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/xmgl/saveXmjsxx`, { method: 'POST', data: param });
}
// 项目管理 导入 项目基本信息 2  项目人月统计 1
export async function importXmgl(param: any, importType: any) {
  return request(`${myUtil.api.getApiRoot()}/dict/xmgl/import/${importType}`, { method: 'POST', data: param, headers: { 'Content-Type': 'multipart/form-data' } });
}
// #endregion ******************************************************************************************