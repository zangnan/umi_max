import { request } from 'umi';
import { debounce } from 'lodash';
import request1 from 'umi-request';
import myUtil from '@/pages/common/myUtil';
export * from './apiFpzs'; // 出口发票
export * from './apiBadz'; // 备案单证
export * from './apiJljg'; // 进料加工核销
export * from './apiSjbb'; // 数据报表
export * from './apiTb'; // 定制化同步
export * from './apiShgl'; // 收汇管理


// **********************************************************************************************************
// 出口发票
// 通用接口
// 测试接口
// 其他接口
// **********************************************************************************************************

// ************************************************ 出口发票 ************************************************

// [出口发票-发票配置-外销商品管理] (3.1.2 税收分类编码信息查询（下拉列表）)
export async function queryCodePager(param?: any) {
  return request(`${API_URL_BASE}/hx/ty/code/queryCodePager`, { method: 'POST', data: param });
}

// [出口发票-通用] （3.1.3 购买方信息查询（下拉列表）[通用参数查询]）
export async function queryParams(param: any) {
  return request(`${API_URL_BASE}/hx/ty/crud/queryParams`, { method: 'POST', data: param });
}

// ************************************************ 通用接口 ************************************************

// 获取指定码表
export async function getCode(param: any) {
  return request(`${API_URL_BASE}/hx/ty/code/getCode`, { method: 'POST', data: param });
}

// 模板下载共通
export async function importTemplate(param: any) {
  return request(`${API_URL_BASE}/hx/ty/crud/importTemplate`, { method: 'POST', data: param });
}

// 模板下载(传参)
export async function downloadTemplate(param: any) {
  return request(`${API_URL_BASE}/hx/ty/crud/downloadTemplate`, { method: 'POST', data: param });
}
export async function dckphczftj(param: any) {
  return request(`${API_URL_BASE}/ckfp2/zxkp/ckfpkj/dckphczftj`, { method: 'POST', data: param });
}

// 导入问题导出
export async function commonDrwtdc(param: any) {
  return request(`${API_URL_BASE}/ty/hx/dc/drwtdc`, { method: 'POST', data: param });
}

// 列表查询（分页）
export async function queryPager(param: any) {
  return request(`${API_URL_BASE}/hx/ty/crud/queryPager`, { method: 'POST', data: param });
}

// 获取指定码表(自定义SQL)
export async function getZdyCode(param: any) {
  return request(`${API_URL_BASE}/hx/ty/code/getZdyCode`, { method: 'POST', data: param });
}

// ************************************************ 测试接口 ************************************************

// 测试接口
export async function testReturnCode(param?: any) {
  return request(`${API_URL_BASE}/test/returnCode`, { method: 'POST', data: param });
}

// 测试接口，返回200
export async function testReturnCode200(param?: any) {
  return request(`${API_URL_BASE}/test/returnCode200`, { method: 'POST', data: param });
}

// 测试接口，返回500
export async function testReturnCode500(param?: any) {
  return request(`${API_URL_BASE}/test/returnCode500`, { method: 'POST', data: param });
}

// ************************************************ 申报接口 ************************************************

// [共通] 获取一次性token
export async function getOneTimeToken(param: any) {
  return request(`${API_URL_BASE}/hx/qx/token/getOneTimeToken`, { method: 'POST', data: param });
}

// [共通] Get方式下载
export async function downloadGet(param: any, url: any, oneTimeToken: any) {
  return request(`${API_URL_BASE}${url}${oneTimeToken}`, { method: 'GET', responseType: 'blob', getResponse: true, params: param });
}
export async function downloadUrlList(param: any, url: any, oneTimeToken: any) {
  return request(`${API_URL_BASE}${url}${oneTimeToken}`, { method: 'GET', getResponse: true,  params: param });
}
//  [共通]Post导出excel报表 可选url
export async function downloadUrlPost(param: any, url: any) {
  return request(`${API_URL_BASE}${url}`, { method: 'POST', data: param });
}
// [共通]Post导出excel报表
export async function downloadPost(param?: any) {
  return request(`${API_URL_BASE}/hx/ty/report/excelExportPost/${param.key}`, { method: 'POST', data: param });
}

// [退税流程-退税申报-初始化页面] 查询是否开启附列资料功能
export async function querySfxgbz(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/flzlgl/querySfxgbz`, { method: 'POST', data: param });
}

// [退税流程-退税申报-数据汇总] 免退税：获取汇总数据（根据申报年月和申报批次获取数据）
export async function queryJgbHzsj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/mtshz/queryJgbHzsj`, { method: 'POST', data: param });
}

// [退税流程-退税申报-生成申报数据/报表打印下载] 数据明细列表获取服务
export async function queryDsbsjLb(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/scsbsj/sjjc/queryDsbsjLb`, { method: 'POST', data: param });
}
// [退税流程-退税申报-数据自检] 数据自检结果
export async function ycsbSjzjztCx(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/sjzj/ycsbSjzjztCx`, { method: 'POST', data: param });
}

// [退税流程-退税申报-生成申报数据] 公共服务-获取生成申报初始化参数
export async function queryScsbCsh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/ywcsxx/queryScsbCsh`, { method: 'POST', data: param });
}

// [退税流程-退税申报-生成申报数据] 申报前置条件检查服务
export async function checkScsbsj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/scsbsj/sjjc/checkScsbsj`, { method: 'POST', data: param });
}

// [退税流程-退税申报-生成申报数据] 免退税全量数据合法性检查
export async function mtsJcSjhfx(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/gljc/mtsJcSjhfx`, { method: 'POST', data: param });
}

// [退税流程-退税申报-生成申报数据] 1 生成申报数据包
export async function scsbsjb(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/scsbsj/sjsb/scsbsjb`, { method: 'POST', data: param });
}

// [退税流程-退税申报-生成申报数据] 2 自动生成附列资料
export async function zdscFlzl(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/flzlgl/zdscFlzl`, { method: 'POST', data: param });
}

// [退税流程-退税申报-生成申报数据] 3 生成单个附列资料zip
export async function excelsingleZipExport(param: any) {
  return request(`${API_URL_BASE}/hx/ty/report/excelsingleZipExport`, { method: 'POST', data: param });
}

// [退税流程-退税申报-生成申报数据] 4 批量保存附列资料
export async function insertFlzlList(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/flzlgl/insertFlzlList`, { method: 'POST', data: param });
}

// [退税流程-退税申报-撤销申报数据] 1 撤销申报数据校验
export async function chsbCheck(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/scsbsj/sjgl/chsbCheck`, { method: 'POST', data: param });
}

// [退税流程-退税申报-撤销申报数据] 2 撤销申报数据
export async function chsb(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/scsbsj/sjgl/chsb`, { method: 'POST', data: param });
}

// [退税流程-退税申报-资料上传] 查询待补正的附列资料信息
export async function queryBzmxbInfo(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/flzlgl/queryBzmxbInfo`, { method: 'POST', data: param });
}

// [退税流程-退税申报-资料上传] 查询附列资料基础信息
export async function queryFlzlJcInfo(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/flzlgl/queryFlzlJcInfo`, { method: 'POST', data: param });
}

// [退税流程-退税申报-资料上传] 查询附列资料基础信息
export async function queryFlzlInfo(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/flzlgl/queryFlzlInfo`, { method: 'POST', data: param });
}

// [退税流程-退税申报-资料上传] 附列资料确认
export async function flzlQr(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/flzlgl/flzlQr`, { method: 'POST', data: param });
}
// [退税流程-申报结果查询-审核数据下载] 依职权反馈数据下载申请
export async function ycsbYzfFkxzSq(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/yzqfk/ycsbYzfFkxzSq`, { method: 'POST', data: param });
}
// [退税流程-申报结果查询-审核数据下载] 依职权数据下载查询
export async function ycsbYzfFkxzsqztCx(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/yzqfk/ycsbYzfFkxzsqztCx`, { method: 'POST', data: param });
}
// [退税流程-申报结果查询-审核数据下载] 依职权数据下载记录删除
export async function ycsbYzfFkxzFksjbSc(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/yzqfk/ycsbYzfFkxzFksjbSc`, { method: 'POST', data: param });
}
// [退税流程-申报结果查询-审核数据下载] 依职权反馈数据接收
export async function ycsbYzfFksjjs(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/yzqfk/ycsbYzfFksjjs`, { method: 'POST', data: param });
}
// [退税流程-申报结果查询-反馈读入]
export async function shfkdr2(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/yzqfk/shfkdr2`, { method: 'POST', data: param });
}
// [退税流程-申报结果查询-刷新] 正式申报数据状态查询
export async function ycsbZssbztCx(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/zssb/ycsbZssbztCx`, { method: 'POST', data: param });
}

// [表单通用业务] 序号重排
export async function xhcp(param: any) {
  return request(`${API_URL_BASE}/hx/ty/commonextbtn/xhcp`, { method: 'POST', data: param });
}

// [表单通用业务] 小计
export async function xj(param: any) {
  return request(`${API_URL_BASE}/hx/ty/commonextbtn/xj`, { method: 'POST', data: param });
}

// [表单采集-发票逐项配单、报关单逐项配单] 获取采集初始化参数
export async function queryCjCsh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/ywcsxx/queryCjCsh`, { method: 'POST', data: param });
}

// [表单采集] 通用检查业务数据后台接口
export async function callServiceCheck(param: any) {
  const { unit_key, data, url } = param;
  const serviceUrl = url ? url : `${API_URL_BASE}/hx/ty/check/callServiceCheck/${unit_key}`;
  return request(serviceUrl, { method: 'POST', data });
}
// [表单采集] 业务类型+商品代码校验
export async function checkYwlxSpdm(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ggjy/bdgljy/checkYwlxSpdm`, { method: 'POST', data: param });
}

// [表单采集-外贸企业出口退税出口明细申报表/外贸企业出口退税进货明细申报-关联号重排]
export async function glhcp(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/glhcp`, { method: 'POST', data: param });
}

// [表单采集-外贸企业出口退税出口明细申报表-报关单生成明细] 免抵退明细数据采集退税申报校验所属期是否申报
export async function checkSsqPcYsb(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ggjy/bdgljy/checkSsqPcYsb`, { method: 'POST', data: param });
}

// [表单采集-外贸企业出口退税出口明细申报表-报关单生成明细、外贸企业出口退税进货明细申报-生成进货明细] 关联号重复采集校验
export async function checkMtsTssbGlh(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/checkMtsTssbGlh`, { method: 'POST', data: param });
}

// [表单采集-外贸企业出口退税进货明细申报表-生成进货明细]
export async function getTsjhByFpxx(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tsjh/getTsjhByFpxx`, { method: 'POST', data: param });
}

// [表单采集-外贸企业出口退税进货明细申报表-生成进货明细] 出口日期改变
export async function querySpdmSl(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/querySpdmSl`, { method: 'POST', data: param });
}

// [表单采集-外贸企业出口退税进货明细申报表-生成进货明细]
export async function fpxxScTsjh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tsjh/fpxxScTsjh`, { method: 'POST', data: param });
}
// [表单采集-生产企业出口货物劳务免抵退税申报明细表-货物冲减] 冲减出口
export async function mdtYsbToCj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/mdtYsbToCj`, { method: 'POST', data: param });
}
// [表单采集-生产企业出口货物劳务免抵退税申报明细表-海外仓冲减
export async function mdtHwccj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/mdtHwccj`, { method: 'POST', data: param });
}
// [表单采集-免退税调整申报-海外仓冲减
export async function mtsTzsbHwccj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/mtsTzsbHwccj`, { method: 'POST', data: param });
}
// // [表单采集-报关单逐项配单] 保存
export async function znpdBgdPd(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/znpd`, { method: 'POST', data: param });
}
// // [表单采集-报关单逐项配单] 保存
export async function dlzmZnpd(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/dlckhwzm/dlzmZnpd`, { method: 'POST', data: param });
}
// [表单采集-报关单逐项配单-代办退税报关单项号配单] 保存
export async function znpdBgdPdDb(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/dbts/znpd/xhpd`, { method: 'POST', data: param });
}

// [表单采集-外贸企业出口退税出口明细申报表-报关单生成明细] 免抵退明细数据采集退税申报校验所属期是否申报
export async function queryQywtf(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/qywtf/queryQywtf`, { method: 'POST', data: param });
}
// [表单采集-先退税后核销申请采集-报关单生成明细] 先退税后核销申请采集
export async function checkXthhzgSqrqYsb(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/xthhzg/checkXthhzgSqrqYsb`, { method: 'POST', data: param });
}

// [表单采集-发票逐项配单] 保存
export async function znpdFpPd(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/fpzxpd`, { method: 'POST', data: param });
}

// [表单采集-海关出口货物报关单] 查询
export async function getBgdInfoHgck(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/getBgdInfo`, { method: 'POST', data: param });
}

// 给根据报关单号查询出口发票号
export async function queryCkxxByCondition(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/queryCkxxByCondition`, { method: 'POST', data: param });
}
// 手册（账册）号
export async function queryJhfpl(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/jljg/qtFksj/queryJhfpl`, { method: 'POST', data: param });
}
// 根据关联号获取出口信息
export async function queryCkxxByGlh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/queryCkxxByGlh`, { method: 'POST', data: param });
}
// 获取关联号数据
export async function queryGlhBySsqAndSbpc(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/queryGlhBySsqAndSbpc`, { method: 'POST', data: param });
}
// 调整前获得商品名称
export async function queryCkspTzqspm(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/ywcsxx/queryCkspTzqspm`, { method: 'POST', data: param });
}
// 调整申报申请
export async function checkYglhYcj(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/checkYglhYcj`, { method: 'POST', data: param });
}
// 同一所属期只能填报一条记录！
export async function checkFlglfpYcj(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/qtyw/flglfp/checkFlglfpYcj`, { method: 'POST', data: param });
}
// 根据代理证明编号获取其他信息
export async function queryDlzmByDlckhwzmhm(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/dlckhwzm/queryDlzmByDlckhwzmhm`, { method: 'POST', data: param });
}
// 边贸代理出口备案 出口报关单
export async function queryBgd201ByBgdNo21(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/queryBgd201ByBgdNo21`, { method: 'POST', data: param });
}
// 校验内部风险控制体系建设情况报告是否已采集
export async function checkFkbgYcj(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/qtyw/ylqypd/checkFkbgYcj`, { method: 'POST', data: param });
}
// 校验生产型出口企业生产能力情况报告是否已采集
export async function checkScnlYcj(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/qtyw/ylqypd/checkScnlYcj`, { method: 'POST', data: param });
}
// 发票管理-查询发票完整信息
export async function queryFpWzxx(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/dzdzfp/queryFpWzxx`, { method: 'POST', data: param });
}
// 委托企业名称一致性校验 进口
export async function checkWtqymcJk(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/dljk/checkWtqymc`, { method: 'POST', data: param });
}
// 委托企业纳税人识别号一致性校验 进口
export async function checkWtqyshJk(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/dljk/checkWtqysh`, { method: 'POST', data: param });
}
// 校验同一编号下，加工企业名称是否一致
export async function checkJgqynsrmc(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/lljghx/checkJgqynsrmc`, { method: 'POST', data: param });
}
// 校验同一编号下，加工企业社会信用代码/纳税号是否一致
export async function checkJgqynsrsbh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/lljghx/checkJgqynsrsbh`, { method: 'POST', data: param });
}
// 来料加工-校验受托方纳税人名称唯一
export async function checkStqymc(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/lljg/checkStqymc`, { method: 'POST', data: param });
}
// 来料加工-校验受托方纳税人识别号唯一
export async function checkStqysh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/lljg/checkStqysh`, { method: 'POST', data: param });
}
// 校验指定“所属期”、“编号”的委托出口货物证明的“受托方纳税人名称”是否一致
export async function checkStfmc(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/wtck/checkStfmc`, { method: 'POST', data: param });
}
// 校验指定“所属期”、“编号”的委托出口货物证明的“受托方统一社会信用代码/纳税人识别号”是否一致
export async function checkStfnsrsbh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/wtck/checkStfnsrsbh`, { method: 'POST', data: param });
}
// 退税数据申报 -- 数据汇总查询 -- 删除
export async function deleteHzsjcxData(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/mdthz/deleteHzsj`, { method: 'POST', data: param });
}
// 退税数据申报 -- 数据汇总查询 -- 保存数据
export async function saveHzsjcxData(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/mdthz/updateHzsj`, { method: 'POST', data: param });
}
// 退税数据申报 -- 数据汇总查询 -- 生产汇总信息
export async function querySchzbCscs(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/mdthz/querySchzbCscs`, { method: 'POST', data: param });
}
// 免抵退：生成免抵退汇总
export async function mdtSchzb(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/mdthz/mdtSchzb`, { method: 'POST', data: param });
}
// 退税数据申报 -- 数据汇总查询 -- 获得汇总数据
export async function querySjhzcxData(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/mdthz/queryHzsj`, { method: 'POST', data: param });
}
// 退税数据申报 -- 数据汇总查询 -- 所属期列表
export async function querySjhzSsqList(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/mdthz/queryHzbSysj`, { method: 'POST', data: param });
}
// 出口退（免）税备案变更申请表 校验
export async function checkTbrq(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/babg/checkTbrq`, { method: 'POST', data: param });
}
// 出口退（免）税备案变更申请表 保存
export async function saveBabgsj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/babg/saveBabgsj`, { method: 'POST', data: param });
}
// 出口退（免）税备案变更申请表 保存校验
export async function checkzxsbbababg(param: any) {
  return request(`${API_URL_BASE}/hx/ty/check/callServiceCheck/ZGBA_ZXSB_BA_BABG_G_CHECK`, { method: 'POST', data: param });
}
// 出口退（免）税备案变更申请表
export async function querybgsjCsh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/babg/querybgsjCsh`, { method: 'POST', data: param });
}
// 零税率应税服务明细根据合同号带出数据
export async function querySjByHth(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/ysfw/yfsj/querySjByHth`, { method: 'POST', data: param });
}
// 委托企业纳税人识别号一致性校验 出口
export async function checkWtqyshCk(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/dlck/checkWtqysh`, { method: 'POST', data: param });
}
// 委托企业名称一致性校验 出口
export async function checkWtqymcCk(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/dlck/checkWtqymc`, { method: 'POST', data: param });
}
// 根据出口报关单获取其他信息
export async function queryBgdByBgdNo21(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/queryBgdByBgdNo21`, { method: 'POST', data: param });
}
// 退税申报-试算进项税额转出额-校验
export async function btssjSsxx(param: any) {
  return request(`${API_URL_BASE}/tssb/wbsjgl/btssjSsxx`, { method: 'POST', data: param });
}
// 校验项号
export async function checkZmkjJyXh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ggjy/sjyjy/checkZmkjJyXh`, { method: 'POST', data: param });
}
// 校验所属期是否申报
export async function checkSsqYsbCj(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ggjy/sjyjy/checkSsqYsb`, { method: 'POST', data: param });
}

// 校验当前采集的编号字段是否对应表单中已申报
export async function checkZmkjJyBhYsb(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ggjy/sjyjy/checkZmkjJyBhYsb`, { method: 'POST', data: param });
}
// 获取关联号
export async function queryCjGlh(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/queryCjGlh`, { method: 'POST', data: param });
}
// 获取证明申报编号
export async function queryCjBh(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ggjy/sjyjy/queryCjBh`, { method: 'POST', data: param });
}

// 生成出口明细-wm
export async function mtsDlzmToTssb(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/dlckhwzm/mtsDlzmToTssb`, { method: 'POST', data: param });
}
// 生成出口明细-sc
export async function mdtDlzmToTssb(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/dlckhwzm/mdtDlzmToTssb`, { method: 'POST', data: param });
}
// 集团成员公司qydm验证
export async function checkJtgszbQydm(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/jtgsba/checkJtgszbQydm`, { method: 'POST', data: param });
}
// 调整后获得商品名称
export async function querySpdmXxCj(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/ywcsxx/querySpdmXx`, { method: 'POST', data: param });
}
// 调整后获得商品计量单位
export async function queryJldwXxBySpdm(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/ywcsxx/queryJldwXxBySpdm`, { method: 'POST', data: param });
}
// mtsBgdToTssb
export async function mtsBgdToTssb(param?: any, url?: any) {
  return request(url, { method: 'POST', data: param });
}
// 调整后获得商品名称
export async function saveFp2Ckznx(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/ckhwznx/saveFp2Ckznx`, { method: 'POST', data: param });
}
// 判断免抵退出口明细过程表中是否存在某些业务字段值
export async function checkSjcz(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/checkSjcz`, { method: 'POST', data: param });
}
// 根据报关单号、出口合同号、所属期，（业务类型中包含XTHH）检索免抵退出口明细过程表，获取美元离岸加和免抵退税额
export async function queryXthhJe(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/queryXthhJe`, { method: 'POST', data: param });
}




// 附列资料上传
export async function uploadFlzl(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/flzlgl/uploadFlzl`, { method: 'POST', data: param, headers: { 'Content-Type': 'multipart/form-data' } });
}
// 校验上传的附列资料压缩包内的文件类型
export async function checkFileGrid(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/flzlgl/checkFileGrid`, { method: 'POST', data: param, headers: { 'Content-Type': 'multipart/form-data' } });
}
// 获取数据检查异常疑点列表
export async function mdtJcSjhfx(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/mdtsjjc/mdtJcSjhfx`, { method: 'POST', data: param });
}
// 获取数据检查异常疑点列表
export async function checkCkshScsbsj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/scsbsj/sjjc/checkCkshScsbsj`, { method: 'POST', data: param });
}
// 删除附列资料信息
export async function deleteFlzl(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/flzlgl/deleteFlzl`, { method: 'POST', data: param });
}
// 正式申报
export async function ycsbZssb(param: any) {
  // return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/zssb/ycsbZssb`, { method: 'POST', data: param });
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/zssb/zssbGz`, { method: 'POST', data: param });
}
// 正式申报 检查
export async function flzlCheck(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/flzlgl/flzlCheck`, { method: 'POST', data: param });
}
// 正式申报 (新)
export async function ycsbZssbNew(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/zssb/ycsbZssb`, { method: 'POST', data: param });
}
// 数据自检上传服务
export async function ycsbSjzjSq2(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/sjzj/sjzjSq`, { method: 'POST', data: param });
}
// 数据自检上传服务
export async function ycsbSjzjSq(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/sjzj/ycsbSjzjSq`, { method: 'POST', data: param });
}

export async function queryYcsbZssbDzxx(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/zssb/queryYcsbZssbDzxx`, { method: 'POST', data: param });
}

// ************************************************ 其他接口 ************************************************

// 菜单
export async function fetchMenuData(param: any) {
  return request(`${API_URL_BASE}/dditSaas/dldj/getMenuJsonByToken`, { method: 'POST', data: param });
}

// 获取集成方访问路径
export async function getJcurlForXtjc(param: any) {
  return request(`${API_URL_BASE}/saas/xtjc/getJcurlForXtjc`, { method: 'POST', data: param });
}
// 获取集成方访问路径
export async function enterpriseAuthorization(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqy/qysq`, { method: 'POST', data: param });
}

// 获取
export async function getColumn(param: any) {
  return request(`${API_URL_BASE}/hx/ty/config/createConfig`, { method: 'POST', data: param });
}

// 通用获取下拉树数据
export async function getTreeCode(param?: any) {
  return request(`${API_URL_BASE}/hx/ty/crud/getComboTree`, { method: 'POST', data: param });
}

export async function zhOutLogin(param?: any, token?:any) {
  return request(`${API_URL_BASE}/hx/qx/token/logout`, { method: 'POST', data: param, headers: {accessToken: token} });
}

// 权限管理-用户管理-新增/修改用户
export async function saveOrUpdateYh(param?: any) {
  // return request(`${API_URL_BASE}/yw/dditSaas/qxyh/saveOrUpdateYh`, { method: 'POST', data: param });
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/saveOrUpdateYh`, { method: 'POST', data: param });
}
// 权限管理-用户管理-新增/修改用户
export async function updatePassw0rd(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/updatePassw0rd`, { method: 'POST', data: param });
}
// 权限管理-用户管理-修改用户状态
export async function updateYhYxbz(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/updateYhYxbz`, { method: 'POST', data: param });
}
// 权限管理-用户管理-绑定角色
export async function yhBdJs(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/yhBdJs`, { method: 'POST', data: param });
}
// 权限管理-（用户管理-绑定企业）或（企业管理-绑定用户）
export async function yhBdQy(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/yhBdQy`, { method: 'POST', data: param });
}
// 权限管理-企业管理-新增/修改企业
export async function saveOrUpdateQy(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqy/saveOrUpdateQy`, { method: 'POST', data: param });
}
// 权限管理-企业管理-删除企业
export async function deleteQy(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqy/deleteQy`, { method: 'POST', data: param });
}
// 权限管理-企业管理-所在地区列表
export async function queryDmDqLoginSaas(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqy/queryDmDqLoginSaas`, { method: 'POST', data: param });
}
// 权限管理-角色管理-获取角色菜单树
export async function queryJsCdTree(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxjs/queryJsCdTree`, { method: 'POST', data: param });
}
// 权限管理-角色管理-保存角色菜单树
export async function saveJsCdGx(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxjs/saveJsCdGx`, { method: 'POST', data: param });
}
// 权限管理-角色管理-新增/修改角色
export async function saveOrUpdateJs(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxjs/saveOrUpdateJs`, { method: 'POST', data: param });
}
// 权限管理-角色管理-删除角色
export async function deleteJs(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxjs/deleteJs`, { method: 'POST', data: param });
}
// 权限管理-菜单管理-获取菜单
export async function queryCdTree(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxcd/queryCdTree`, { method: 'POST', data: param });
}
// 权限管理-菜单管理-新增/修改菜单树节点
export async function saveOrUpdateCd(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxcd/saveOrUpdateCd`, { method: 'POST', data: param });
}
// 权限管理-菜单管理-校验菜单代码是否重复
export async function checkCd(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxcd/checkCd`, { method: 'POST', data: param });
}
// 权限管理-菜单管理-删除菜单树节点
export async function deleteCd(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxcd/deleteCd`, { method: 'POST', data: param });
}

// 发票管理-在线开票-发票开具
export async function sqfpkj(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/vtax-fpgl/sqfpkj`, { method: 'POST', data: param });
}

export async function gtTsxx(param: any) {
  return request(`${API_URL_BASE}/hts/ckfp/gt/gtTsxx`, { method: 'POST', data: param });
}

export async function remvoeHmdKhda(param: any) {
  return request(`${API_URL_BASE}/ddzx/khdagl/remvoeHmdKhda`, { method: 'POST', data: param });
}
export async function cdDcsjzd(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxcd/cdDcsjzd`, { method: 'POST', data: param });
}


/**********************************************在线申报转移至本系统表单采集 start****************************************************/




// 带出表单其他项
export async function queryHlxx(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/ywcsxx/queryHlxx`, { method: 'POST', data: param });
}

// 指定url获取码表
export async function getUrlCode(url: any, param: any) {
  return request(`${API_URL_BASE}${url}`, { method: 'POST', data: param });
}

/**********************************************在线申报转移至本系统表单采集 end****************************************************/

export async function openfolder(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpgl/openfolder`, { method: 'POST', data: param });
}

export async function isvalidpath(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpgl/isvalidpath`, { method: 'POST', data: param });
}

// 导入
export async function importExecl(url: any, param: any) {
  return request1(url, { method: 'POST', data: param });
}
export async function exportPager(param: any) {
  return request(`${API_URL_BASE}/hx/ty/crud/exportPager`, { method: 'POST', data: param });
}

// 模板下载自定义url(GET)
export async function templateDownloadCustom(url: any, param: any) {
  return request1(`${API_URL_BASE}${url}/${param}`, { method: 'GET', data: param });
}
// ********************************************************************************************************
// 基础配置 ************************************************************************************************
// 删除
export async function baseDelete(param: any) {
  if (param.url === `${API_URL_BASE}/yw/bszx/wbsj/bgd/deleteBgd21`) {
    param.data = { uuid: myUtil.text.arrayToStr(param.data.uuids) };
  }
  return request(param.url, { method: 'POST', data: param.data });
}
// 获取表单
export async function baseShow(param: any) {
  const { data, url } = param;
  return request(url, { method: 'POST', data });
}
// 编辑(新建、更新)
export async function baseEdit(param: any) {
  const { data, url } = param;
  const serviceUrl = url;
  return request(serviceUrl, { method: 'POST', data: data });
}

// ********************************************************************************************************
// 申报系统 ************************************************************************************************
// 列表组件
export async function getGridData(url: string, param: any) {
  return request(url, { method: 'POST', data: param });
}
// 获取商品码信息
export async function getCmCode(param: any) {
  return request(`${API_URL_BASE}/hx/ty/code/getCmCode`, { method: 'POST', data: param });
}
// ********************************************************************************************************
// ********************************************************************************************************
// 配单

// 智能配单-查询自动配单信息
export async function queryZnpdZdppInfo(param?: any) {
  return request(`${API_URL_BASE}/yw/mts/znpd/tjpd/pdgzcx`, { method: 'POST', data: param });
}
// 智能配单明细-出口报关单明细信息
export async function queryZnpdmxCkbgdMxInfo(param?: any) {
  return request(`${API_URL_BASE}/yw/mts/znpd/bgd/getBgdInfo`, { method: 'POST', data: param });
}
// 智能配单-查询自动配单信息-可参与配单关单条数
export async function queryZnpdZdppPdgdts(param?: any) {
  return request(`${API_URL_BASE}/yw/mts/znpd/bgd/getKpdBgdCount`, { method: 'POST', data: param });
}
// 智能配单-查询自动配单信息-可参与配单发票条数
export async function queryZnpdZdppPdfpts(param?: any) {
  return request(`${API_URL_BASE}/yw/mts/znpd/fp/dzfpGetCount`, { method: 'POST', data: param });
}
// 智能配单-自动配单
export async function savemtsZnpdZdpd(param?: any) {
  return request(`${API_URL_BASE}/yw/mts/znpd/tjpd/kspd`, { method: 'POST', data: param });
}
// 智能配单明细-生成明细-校验申报信息
export async function checkZnpdSbxx(param?: any) {
  return request(`${API_URL_BASE}/yw/mts/znpd/qrpd/qrpdScmxSbxxCheck`, { method: 'POST', data: param });
}
// 智能配单明细-提示信息
export async function queryMtsZnpdmxTsxx(param: any) {
  return request(`${API_URL_BASE}/yw/mts/znpd/qrpd/tsxxcx`, { method: 'POST', data: param });
}
// 智能配单明细-生成明细
export async function mtsZnpdmxScmx(param?: any) {
  return request(`${API_URL_BASE}/yw/mts/znpd/qrpd/qrpdScmxOnTj`, { method: 'POST', data: param });
}
// 智能配单明细-放弃配单
export async function mtsZnpdmxFqpd(param?: any) {
  return request(`${API_URL_BASE}/yw/mts/znpd/qrpd/fqpd`, { method: 'POST', data: param });
}
// 智能配单明细-生成明细-查询申报信息
export async function queryMtsZnpdSbxx(param?: any) {
  return request(`${API_URL_BASE}/yw/mts/znpd/qrpd/qrpdScmxSbxxCsh`, { method: 'POST', data: param });
}
// 智能配单明细-查询左侧列表
export async function queryZnpdmxSjxqList(param: any) {
  return request(`${API_URL_BASE}/yw/mts/znpd/qrpd/queryLeftBgdPage`, { method: 'POST', data: param });
}
// 智能配单-手动配单提交
export async function commitData(param?: any) {
  return request(`${API_URL_BASE}/yw/mts/znpd/sdpd/commitData`, { method: 'POST', data: param });
}
// ********************************************************************************************************

// 报关单管理-SAAS接口-报关单下载弹窗列表查询
export async function queryPagerXzrw(param?: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/queryPagerXzrw`, { method: 'POST', data: param });
}
// 报关单管理-SAAS接口-报关单下载弹窗查询口岸卡密码
export async function queryKakPassword(param?: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/queryKakPassword`, { method: 'POST', data: param });
}
// 报关单管理-SAAS接口-报关单下载弹窗保存口岸卡密码
export async function saveKakPassword(param?: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/saveKakPassword`, { method: 'POST', data: param });
}
// 关票通-环境检测-SAAS接口-报关单下载弹窗保存口岸卡密码
export async function insertKakRzInfo(param?: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/gt/insertKakRzInfo`, { method: 'POST', data: param });
}
// 报关单管理-SAAS接口-报关单下载弹窗申请报关单下载
export async function sqxz(param?: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/sqxz`, { method: 'POST', data: param });
}
// 报关单管理-SAAS接口-报关单数据检查
export async function checkBgd(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/checkBgd`, { method: 'POST', data: param });
}
// 报关单管理-SAAS接口-代理证明数据检查
export async function checkDlzm(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/dlckhwzm/checkDlzm`, { method: 'POST', data: param });
}
// 报关单管理-SAAS接口-数据导入
export async function uploadScHgCkbgdCj2(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/uploadScHgCkbgdCj2`, { method: 'POST', data: param });
}
// 出口发票-SAAS接口-详细数据查询
export async function queryFpSpPage(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/dzdzfp/queryFpSpPage`, { method: 'POST', data: param });
}
// 出口报关单-SAAS接口-检查报关单号
export async function checkCkbgdh(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/checkCkbgdh`, { method: 'POST', data: param });
}
// 出口报关单-SAAS接口-检查报关单号
export async function updateBgd(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/updateBgd`, { method: 'POST', data: param });
}
// 出口报关单-SAAS接口-检查报关单号
export async function queryFp2Ckznx(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/ckhwznx/queryFp2Ckznx`, { method: 'POST', data: param });
}
// 出口报关单-SAAS接口-报关单明细查询
export async function queryBgdByKey(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/queryBgdByKey`, { method: 'POST', data: param });
}
// 出口报关单-外部信息-更新报关单数据存在标志
export async function updateBgdCzbz(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/updateBgdCzbz`, { method: 'POST', data: param });
}
// 出口报关单-外部信息-更新报关单数据存在标志
export async function gxBgdCzbzSx(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/gxBgdCzbzSx`, { method: 'POST', data: param });
}

export async function gxBgdCzbzCxzx(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/gxBgdCzbzCxzx`, { method: 'POST', data: param });
}
// 出口报关单-数据检查-获取11位商品代码
export async function getCmcode11(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/getCmcode11`, { method: 'POST', data: param });
}
// 出口报关单-数据检查-添加商品码调整表
export async function bgdCktsSbSptz(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/bgdCktsSbSptz`, { method: 'POST', data: param });
}
// 出口报关单-数据检查-修改报关单调整后商品码
export async function updateTzCmcode(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/updateTzCmcode`, { method: 'POST', data: param });
}
// 出口报关单-数据检查-商品码调整汇率保存功能
export async function saveMbHl(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/mbhl/saveMbHl`, { method: 'POST', data: param });
}
// 出口报关单-数据检查-代理证明生成商品码调整表
export async function dlzmCktsSbSptz(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/dlckhwzm/dlzmCktsSbSptz`, { method: 'POST', data: param });
}
// 出口报关单-数据检查-代理证明更新调整后商品代码
export async function updateDlzmTzCmcode(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/dlckhwzm/updateDlzmTzCmcode`, { method: 'POST', data: param });
}
// 增值税专用发票管理-SAAS接口-云平台抵账发票数据状态查询
export async function yzfPtDzfpCx(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/yzfpt/yzfPtDzfpCx`, { method: 'POST', data: param });
}
// 增值税专用发票管理-SAAS接口-云平台抵账发票数据申请
export async function yzfPtDzfpSq(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/yzfpt/yzfPtDzfpSq`, { method: 'POST', data: param });
}
// 代理出口货物证明管理-SAAS接口-云平台抵账发票数据申请
export async function yzfPtDlzmSq(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/yzfpt/yzfPtDlzmSq`, { method: 'POST', data: param });
}
// 增值税专用发票管理-SAAS接口-更新发票认证稽核标志
export async function yzfPtFpxxCx(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/yzfpt/yzfPtFpxxCx`, { method: 'POST', data: param });
}

//********************************************************************************************************

// 获取疑点数据
export async function ydtj(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/ydgl/ydtj`, { method: 'POST', data: param });
}
// 疑点处理信息查询左半部分数据
export async function queryYdclList(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/ydgl/pageLeft`, { method: 'POST', data: param });
}
// 疑点处理信息查询右半部分数据
export async function queryYdclXxList(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/ydgl/pageRight`, { method: 'POST', data: param });
}
// 疑点处理信息查询查看详情
export async function queryYdxxTzff(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ydgl/queryYdxxTzff`, { method: 'POST', data: param });
}
// 退税数据申报 -- 确认疑点处理 设置已调整
export async function changeYdcl(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/ydgl/setydzt`, { method: 'POST', data: param });
}
// 退税数据申报 -- 疑点处理 -- 明细设置为下期申报
export async function mxSetzbsb(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/ydgl/setzbsbForSaas`, { method: 'POST', data: param });
}
// 退税数据申报 -- 疑点处理 -- 获取商品信息
export async function queryYdclSpList(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/ydgl/queryYdclSpList`, { method: 'POST', data: param });
}
// 退税数据申报 -- 疑点处理 -- 保存商品码调整表
export async function scHgsptzGcb(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/ydgl/scHgsptzGcb`, { method: 'POST', data: param });
}
// 退税数据申报 -- 疑点处理 -- 获取右侧列表疑点统计信息
export async function pageRightYdtj(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/ydgl/pageRightYdtj`, { method: 'POST', data: param });
}

// 退税数据申报 -- 疑点处理数量- 疑点批量处理
export async function queryYdplclSpList(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/ydgl/plxg`, { method: 'POST', data: param });
}
// 数据管理 -- 下载
export async function ycsbsjxz(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/yzfpt/ycsbsjxz`, { method: 'POST', data: param });
}
export async function tqdd(param?: any) {
  return request(`${API_URL_BASE}/ddzx/tqdd/tqdd`, { method: 'POST', data: param });
}

// 退税数量申报 -- 疑点处理-表单查询
export async function queryJgbForm(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/ydgl/queryJgbForm`, { method: 'POST', data: param });
}
// 退税数量申报 -- 疑点处理-下期申报所属期批次校验
export async function checkYdglYsb(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/ydgl/checkYdglYsb`, { method: 'POST', data: param });
}
// 2.2 下载任务管理度 重新下载
export async function rwjdcxxz(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/yzfpt/rwjdcxxz`, { method: 'POST', data: param });
}
// 2.2 下载任务管理度 刷新
export async function rwjdsx(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/yzfpt/rwjdsx`, { method: 'POST', data: param });
}
// 2.2 下载任务管理度 -海关数据下载-刷新
export async function rwsxForGpt(param?: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/rwsxForGpt`, { method: 'POST', data: param });
}
// 进出口报关单数据下载
export async function hgsjxz(param: any) {
  return request(`${API_URL_BASE}/yw/saas/yzfpt/hgsjxz`, { method: 'POST', data: param });
}
// 退税汇率管理--汇率查询
export async function tshlglcx(param: any) {
  return request(`${API_URL_BASE}/yw/saas/hlgl/tshlglcx`, { method: 'POST', data: param });
}
// 退税汇率管理--获取当前企业汇率查询规则
export async function tshlxqgzcx(param: any) {
  return request(`${API_URL_BASE}/yw/saas/hlgl/tshlxqgzcx`, { method: 'POST', data: param });
}
// 退税汇率管理--汇率保存
export async function tshlglwh(param: any) {
  return request(`${API_URL_BASE}/yw/saas/hlgl/tshlglwh`, { method: 'POST', data: param });
}
// 退税汇率管理--汇率选取规则保存
export async function tshlxqgzwh(param: any) {
  return request(`${API_URL_BASE}/yw/saas/hlgl/tshlxqgzwh`, { method: 'POST', data: param });
}
// 工作台 退税进度列表
export async function tsjdDataApi(param: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/gztTsjdCx`, { method: 'POST', data: param });
}
// 工作台 退税进度列表 明细
export async function gztTsjdCxMx(param: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/gztTsjdCxMx`, { method: 'POST', data: param });
}
// 工作台 出口美元额
export async function getCkmyeDataApi(param: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/tjndckmye`, { method: 'POST', data: param });
}
// 工作台 饼图 出口报关单申报情况
export async function getCkbgdsbDataApi(param: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/bgdndsbtj`, { method: 'POST', data: param });
}
// 工作台 饼图 进项发票申报情况
export async function getJxfpsbApi(param: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/jxfpndsbtj`, { method: 'POST', data: param });
}

// 工作台 退税日历
export async function tsrlApi(param: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/tsrl`, { method: 'POST', data: param });
}
// 工作台 快捷菜单
export async function getKjcdApi(param: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/queryKjcd`, { method: 'POST', data: param });
}
// 工作台 菜单 列表
export async function queryKpzKjcd(param: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/queryKpzKjcd`, { method: 'POST', data: param });
}
// 工作台 快捷菜单 保存
export async function saveKjcd(param: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/saveKjcd`, { method: 'POST', data: param });
}
// 工作台  业务类型初始化
export async function queryKpzcddm(param: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/queryKpzcddm`, { method: 'POST', data: param });
}
// 资格备案 代办退税备案 校验申请日期
export async function checkScqywtdbtsSqrqYsb(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/scqywtdbts/checkScqywtdbtsSqrqYsb`, { method: 'POST', data: param });
}
// 资格备案 代办退税备案 校验申请日期
export async function checkScqywtdbtsSqrqYz(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/scqywtdbts/checkScqywtdbtsSqrqYz`, { method: 'POST', data: param });
}
export async function checkJtgszbSqrq(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/jtgsba/checkJtgszbSqrq`, { method: 'POST', data: param });
}
// 资格备案 代办退税备案 综服企业税号重复采集校验
export async function checkScqywtdbtsSqrqZfnsrsbh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/scqywtdbts/checkScqywtdbtsSqrqZfnsrsbh`, { method: 'POST', data: param });
}
// 资格备案 代办退税备案 根据委托纳税人识别号查询历史数据
export async function queryScqywtdbtsLssj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/scqywtdbts/queryScqywtdbtsLssj`, { method: 'POST', data: param });
}
// 资格备案 代办退税备案 综服企业代码重复采集
export async function checkScqywtdbtsSqrqZfqydm(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/scqywtdbts/checkScqywtdbtsSqrqZfqydm`, { method: 'POST', data: param });
}
export async function checkJtgszbSh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/jtgsba/checkJtgszbSh`, { method: 'POST', data: param });
}
// 资格备案 代办退税备案 综服企业名称重复采集
export async function checkScqywtdbtsSqrqZfqymc(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/scqywtdbts/checkScqywtdbtsSqrqZfqymc`, { method: 'POST', data: param });
}
//  资格备案 代办退税备案 合同号重复采集
export async function checkScqywtdbtsSqrqDbtshth(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/scqywtdbts/checkScqywtdbtsSqrqDbtshth`, { method: 'POST', data: param });
}
//  资格备案 出口企业申请提醒服务采集
export async function checkCktsywtxYcj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/zgba/cktsywtx/checkCktsywtxYcj`, { method: 'POST', data: param });
}
//  数据下载，反写状态
export async function rwycgx(param: any) {
  return request(`${API_URL_BASE}/yw/saas/yzfpt/rwycgx`, { method: 'POST', data: param });
}
//  创建关票通出口报关单数据下载任务，返回子任务明细
export async function rwscToZffwForGpt(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/rwqdToZffwForGpt`, { method: 'POST', data: param });
}
export async function cxzxForGpt(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/cxzxForGpt`, { method: 'POST', data: param });
}
// 出口发票-数据下载 -- 同步报关单数据
export async function fpzsBgdsjtb(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/sjxzgl/bgdsjtb`, { method: 'POST', data: param });
}
//  代理出口货物证明获取 刷新
export async function yzfPtDlzmCx(param: any) {
  return request(`${API_URL_BASE}/yw/saas/yzfpt/yzfPtDlzmCx`, { method: 'POST', data: param });
}
// [配置管理-海关IC卡管理-初始化查询IC卡系信息]
export async function queryKak(param: any) {
  return request(`${API_URL_BASE}/yw/saas/pzgl/kak/queryKak`, { method: 'POST', data: param });
}
// [配置管理-海关IC卡管理-初始化查询IC卡系信息]新增
export async function saveOrUpdateKak(param: any) {
  return request(`${API_URL_BASE}/yw/saas/pzgl/kak/saveOrUpdateKak`, { method: 'POST', data: param });
}
// [配置管理-海关IC卡管理-初始化查询IC卡系信息]删除
export async function deleteKak(param: any) {
  return request(`${API_URL_BASE}/yw/saas/pzgl/kak/deleteKak`, { method: 'POST', data: param });
}
// [配置管理-海关IC卡管理-初始化查询IC卡系信息]解禁
export async function jcjyKak(param: any) {
  return request(`${API_URL_BASE}/yw/saas/pzgl/kak/jcjyKak`, { method: 'POST', data: param });
}
// [配置管理-海关IC卡管理-初始化查询IC卡系信息]口岸卡信息查询
export async function checkKakPassword(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/gt/checkKakPassword`, { method: 'POST', data: param });
}
// [退税申报-免抵退-首页] 导入
export async function drJ4HgCkbgd(param: any) {
  return request1(`${API_URL_BASE}/yw/bszx/wbsj/bgd/drJ4HgCkbgd`, { method: 'POST', data: param });
}
// [退税申报-免抵退-首页] 文书下载显示
export async function queryWsxzSj(param: any) {
  return request1(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/queryWsxzSj`, { method: 'POST', data: param });
}
// [退税申报-免抵退-首页] 文书下载点击
export async function wsxz(param: any) {
  return request1(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/wsxz`, { method: 'POST', data: param });
}

// [退税申报-免抵退-首页] 出口报关单/代理出口货物证明
export async function bgdAndDlckzmTj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/bgdAndDlckzmTj`, { method: 'POST', data: param });
}
// [退税申报-免抵退-首页] 免抵退税申报
export async function mdtseTj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/mdtseTj`, { method: 'POST', data: param });
}
// [退税申报-免抵退-出口报关单管理-带处理数据] 批量补录
export async function plxgckfph(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/plxgckfph`, { method: 'POST', data: param });
}
// [退税申报-免抵退-出口报关单管理-带处理数据] 批量导入
export async function pldrckfph(param: any) {
  return request1(`${API_URL_BASE}/yw/bszx/wbsj/bgd/pldrckfph`, { method: 'POST', data: param });
}
// [退税申报-免抵退-出口报关单管理-带处理数据] 设置为出口合同号
export async function ckhthTockfph(param: any) {
  return request1(`${API_URL_BASE}/yw/bszx/wbsj/bgd/ckhthTockfph`, { method: 'POST', data: param });
}
// [配置管理-海关IC卡管理-初始化查询IC卡系信息]口岸卡信息查询
export async function xzrwjy(param: any) {
  return request(`${API_URL_BASE}/yw/saas/yzfpt/xzrwjy`, { method: 'POST', data: param });
}
// 数据管理-任务管理-备案单证缺失检查-明细查看-数据下载 校验
export async function checkSjglRwglBgdbadzqsjcMxckSjxz(param: any) {
  return request(`${API_URL_BASE}/yw/saas/yzfpt/checkSjglRwglBgdbadzqsjcMxckSjxz`, { method: 'POST', data: param });
}
// [退税申报-免抵退-出口报关单管理-带处理数据-待确认商品码] 批量补填 判断sheet页是否渲染
export async function checkCkspSheet(param: any) {
  return request1(`${API_URL_BASE}/yw/bszx/wbsj/bgd/checkCkspSheet`, { method: 'POST', data: param });
}

// [退税申报-免抵退-无信息数据-生成信息查询] 初始化数据
export async function getBgdCkxxcxSsqSbpc(param: any) {
  return request1(`${API_URL_BASE}/yw/bszx/wbsj/bgd/getBgdCkxxcxSsqSbpc`, { method: 'POST', data: param });
}

// [退税申报-免抵退-无信息数据-生成信息查询] 生成信息查询、含校验
export async function bgdToCkxxcx(param: any) {
  return request1(`${API_URL_BASE}/yw/bszx/wbsj/bgd/bgdToCkxxcx`, { method: 'POST', data: param });
}

// [退税申报-免抵退-无信息数据-生成报表明细] 生成报表明细
export async function bgdscCkmx(param: any) {
  return request1(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/bgdscCkmx`, { method: 'POST', data: param });
}

// [退税申报-免抵退-出口报关单管理-带处理数据-待确认商品码]- 保存商品码调整
export async function confirmTzckspDm(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/confirmTzckspDm`, { method: 'POST', data: param });
}
// [退税申报-免抵退-出口报关单管理-带处理数据-待补填汇率] - 保存汇率
export async function bgdhlwh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/bgdhlwh`, { method: 'POST', data: param });
}
// [退税申报-免抵退-外部数据] - 导入
export async function importData(param: any) {
  return request(`${API_URL_BASE}/ty/hx/dr/importData`, { method: 'POST', data: param });
}
// [退税申报-免抵退-外部数据-表头统计] - 统计数量
export async function dclsjBttj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/dclsjBttj`, { method: 'POST', data: param });
}

// [退税申报-免抵退-出口报关单管理-可使用数据] 批量修改出口商品代码
export async function plxgckspDm(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/plxgckspDm`, { method: 'POST', data: param });
}

// [退税申报-免抵退-出口报关单管理-可使用数据] 批量修改运费折算数量
export async function plxgYfzssl(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/plxgYfzssl`, { method: 'POST', data: param });
}
// [退税申报-免抵退-出口报关单管理-待处理] 得到商品码表
export async function getPlqrkzmCmcode(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/getPlqrkzmCmcode`, { method: 'POST', data: param });
}
// [退税申报-免退税-首页] 待处理数据/可使用数据
export async function dclsjAndKsysjTj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/dclsjAndKsysjTj`, { method: 'POST', data: param });
}
// [退税申报-免抵退-出口报关单管理-无信息和可使用-汇率] - 保存汇率
export async function bgdhlwhAbz(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/bgdhlwhAbz`, { method: 'POST', data: param });
}
// [退税申报-免退税-首页] 待处理数据/可使用数据 代办退税
export async function dclsjAndKsysjTjdbts(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/dbts/hwlw/tssb/dclsjAndKsysjTj`, { method: 'POST', data: param });
}

// [退税申报-外销商品] - 导入
export async function plfmdr(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/plfmdr`, { method: 'POST', data: param });
}
// 设置税收分类编码
export async function szwxtbz(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/szwxtbz`, { method: 'POST', data: param });
}
// 查询货物税率
export async function queryGgfwCkspFlzs(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/ywcsxx/queryGgfwCkspFlzs`, { method: 'POST', data: param });
}

export async function queryXtBbh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/xtcsxx/queryXtBbh`, { method: 'POST', data: param });
}
export async function kppzCheck(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/kppzCheck`, { method: 'POST', data: param });
}
export async function zdkpcx(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpgl/zdkpcx`, { method: 'POST', data: param });
}
export async function zdkpcx2(param: any) {
  return request(`${API_URL_BASE}/ckfp2/dckp/ckfpkj/zdkpcx`, { method: 'POST', data: param });
}
// 申报文件-反馈读入
export async function shfkwjdr(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/yzqfk/shfkwjdr`, { method: 'POST', data: param });
}
// 申报文件-反馈读入check
export async function shfkdr2Check(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ycsb/yzqfk/shfkdr2Check`, { method: 'POST', data: param });
}


// 数据管理-受托方已开具代理证明查询-删除
export async function scdlzm(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/dlckhwzm/scdlzm`, { method: 'POST', data: param });
}
// ************************************************ 在线开票相关 ************************************************
// 发票申请单 - 校验在线开票配置时是否已经进行前置注册
export async function qrkpjy(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/qrkpjy`, { method: 'POST', data: param });
}
// 发票申请单 - 蓝票开具-开票订单新增”接
export async function kpddxz(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/kpddxz`, { method: 'POST', data: param });
}
// 发票申请单 - 订单提交开票
export async function ddtjkp(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/ddtjkp`, { method: 'POST', data: param });
}
// 发票管理 - 在线开票-重新开票
export async function cxkp(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/cxkp`, { method: 'POST', data: param });
}
// 发票管理 - 在线开票-发票红冲
export async function fphc(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/fphc`, { method: 'POST', data: param });
}
// 发票管理-在线开票-发票作废
export async function fpzf(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/fpzf`, { method: 'POST', data: param });
}
// 发票管理-在线开票-刷新
export async function fpztsx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/fpztsx`, { method: 'POST', data: param });
}
// 发票管理-在线开票-下载PDF
export async function fpxz(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/fpxz`, { method: 'POST', data: param });
}
// 发票管理-在线开票-查询打印机配置
export async function dyjcx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/dyjcx`, { method: 'POST', data: param });
}
// 发票管理-在线开票-打印机保存
export async function dyjglwh(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/dyjglwh`, { method: 'POST', data: param });
}
// 发票管理-在线开票-打印发票
export async function dyfp(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/dyfp`, { method: 'POST', data: param });
}
// 新工作台- 待办事项
export async function queryBacklog(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/queryBacklog`, { method: 'POST', data: param });
}
// 新工作台-待开出口发票报关单
export async function queryDkckfpbgdCount(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/queryDkckfpbgdCount`, { method: 'POST', data: param });
}
// 新工作台-待回填出口发票
export async function queryDhtckfpCount(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/queryDhtckfpCount`, { method: 'POST', data: param });
}
// 新工作台-待申报数据
export async function queryDsbsjCount(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/queryDsbsjCount`, { method: 'POST', data: param });
}
// 新工作台-待完成单证备案
export async function queryDwcdzbaCount(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/queryDwcdzbaCount`, { method: 'POST', data: param });
}
// 发票管理-在线开票-批量下载PDF前校验
export async function fpplxzpdfJy(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/fpplxzpdfJy`, { method: 'POST', data: param });
}
// 发票管理-在线开票-批量下载PDF导出
export async function fpplxzpdfdc(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/fpplxzpdfdc`, { method: 'POST', data: param });
}
// 发票管理-在线开票-批量下载PDF
export async function fpplxzpdf(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/fpplxzpdf`, { method: 'POST', data: param });
}


// ************************************************ 权限管理相关 ************************************************
// 新增或修改权限组
export async function xzHxgQxz(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqxz/xzHxgQxz`, { method: 'POST', data: param });
}
//校验权限组代码是否存在
export async function jyQxzSfcz(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqxz/jyQxzSfcz`, { method: 'POST', data: param });
}
//删除权限组
export async function scQxz(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqxz/scQxz`, { method: 'POST', data: param });
}
//删除权限组
export async function cxQxzQdcdlb(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxty/cxQxzQdcdlb`, { method: 'POST', data: param });
}
//权限组代码关联渠道
export async function glqd(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqxz/glqd`, { method: 'POST', data: param });
}
//删除资源
export async function scZy(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxzy/scZy`, { method: 'POST', data: param });
}
// 自动生成资源代码及序号
export async function sczydm(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxzy/sczydm`, { method: 'POST', data: param });
}
// 新增修改保存
export async function xzHxgZy(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxzy/xzHxgZy`, { method: 'POST', data: param });
}
// 用户默认权限组取值
export async function cxYhMrQxz(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqd/cxYhMrQxz`, { method: 'POST', data: param });
}
// 用户默认权限组取值
export async function xzHxgQd(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqd/xzHxgQd`, { method: 'POST', data: param });
}
// 删除渠道
export async function scQd(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqd/scQd`, { method: 'POST', data: param });
}
export async function dcjb(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxgl/dcjb`, { method: 'POST', data: param });
}
export async function qdsq(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqd/qdsq`, { method: 'POST', data: param });
}
export async function qdDcsjzd(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqd/qdDcsjzd`, { method: 'POST', data: param });
}
export async function apifwDcsjzd(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/apifwgl/apifwDcsjzd`, { method: 'POST', data: param });
}
//删除前校验
export async function scjy(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxty/scjy`, { method: 'POST', data: param });
}
export async function gldq(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqxz/gldq`, { method: 'POST', data: param });
}
export async function glcd(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxty/glcd`, { method: 'POST', data: param });
}
export async function glzy(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqxz/glzy`, { method: 'POST', data: param });
}
export async function glqxz(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqd/glqxz`, { method: 'POST', data: param });
}

// 权限管理-权限组查询
export async function queryQyQxzyList(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqy/queryQyQxzyList`, { method: 'POST', data: param });
}
// 角色列表
export async function cxjslb(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/cxjslb`, { method: 'POST', data: param });
}
// 权限组列表
export async function cxqxzlb(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/cxqxzlb`, { method: 'POST', data: param });
}
export async function deleteYh(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/deleteYh`, { method: 'POST', data: param });
}
//启用停用
export async function qyHtyQy(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqy/qyHtyQy`, { method: 'POST', data: param });
}
//移管确认
export async function qyyg(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/qyyg`, { method: 'POST', data: param });
}
//内销发票开具-未赋码商品
export async function queryNxfpkjWfmspCount(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/queryNxfpkjWfmspCount`, { method: 'POST', data: param });
}
//内销发票开具-未红冲专票
export async function queryNxfpkjWhczpCount(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/queryNxfpkjWhczpCount`, { method: 'POST', data: param });
}
//内销发票开具-红字确认单（全电）
export async function queryNxfpkjHzqrdCount(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/queryNxfpkjHzqrdCount`, { method: 'POST', data: param });
}
// 数电票-身份验证-二维码
export async function getSfrzcode(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/sdp/cxewm`, { method: 'POST', data: param });
}
export async function cxewm(param?: any) {
  return request(`${API_URL_BASE}/yw/ckfpkj/zxkp/sddl/cxewm`, { method: 'POST', data: param });
}

export async function ecrzjgcx(param?: any) {
  return request(`${API_URL_BASE}/yw/ckfpkj/zxkp/sddl/ecrzjgcx`, { method: 'POST', data: param });
}
export async function hqsdpxe(param?: any) {
  return request(`${API_URL_BASE}/yw/ckfpkj/zxkp/sddl/hqsdpxe`, { method: 'POST', data: param });
}
// 数电票-身份验证
export async function sdpPrCode(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/sdp/ecrzjgcx`, { method: 'POST', data: param });
}
// 数电票-确认开票
export async function sdpqrkp(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpsqd/sdpqrkp`, { method: 'POST', data: param });
}
// 数电票-订单提交开票
export async function sdpddtjkp(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/sdp/ddtjkp`, { method: 'POST', data: param });
}
// 数电票-登录
export async function djmndl(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/sdp/djmndl`, { method: 'POST', data: param });
}
// 数电票-查询税控信息
export async function skxxcx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/sdp/skxxcx`, { method: 'POST', data: param });
}
// 数电票-在线开票-发票管理-发票红冲
export async function sdpfphc(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/sdpfphc`, { method: 'POST', data: param });
}

// 数电票-在线开票-发票管理-发票红冲
export async function sdpfphc2(param?: any) {
  return request(`${API_URL_BASE}/ckfp2/zxkp/sdpfphc`, { method: 'POST', data: param });
}
// 数电票-在线开票-导入模板开具-确认开票
export async function sdpqrkpDrmb(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/drmbkj/sdpqrkp`, { method: 'POST', data: param });
}
// 数电票-在线开票-发票管理-发票红冲提交开票
export async function sdphdtjkp(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/fpgl/sdphdtjkp`, { method: 'POST', data: param });
}
// 数电票-发票管理-更新状态（在线开票）
export async function fpztsxZx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/sdp/fpztsx`, { method: 'POST', data: param });
}
// 数电票-发票管理-更新状态（在线开票）-同步更细
export async function sdpZtsxtb(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/zxkp/sdp/sdpZtsxtb`, { method: 'POST', data: param });
}
export async function cxsddlxx(param?: any) {
  return request(`${API_URL_BASE}/yw/ckfpkj/zxkp/sddl/cxsddlxx`, { method: 'POST', data: param });
}
export async function getJsxxByFjyhuuid(param?: any) {
  return request(`${API_URL_BASE}/saas/queryJsxxByFjyhuuid`, { method: 'POST', data: param });
}
export async function qyKhda(param?: any) {
  return request(`${API_URL_BASE}/ddzx/khdagl/qyKhda`, { method: 'POST', data: param });
}
export async function yrhmdKhda(param?: any) {
  return request(`${API_URL_BASE}/ddzx/khdagl/bchmdKhda`, { method: 'POST', data: param });
}
export async function bckhda(param?: any) {
  return request(`${API_URL_BASE}/ddzx/khdagl/bckhda`, { method: 'POST', data: param });
}

//免抵退核销明细列表
export async function dcByParams(param?: any) {
  return request(`${API_URL_BASE}/ty/hx/dc/dcByParams`, { method: 'POST', data: param });
}
//配置管理-进料核销配置管理
export async function jlhxpzcx(param?: any) {
  return request(`${API_URL_BASE}/yw/pzgl/jlhxpzgl/jlhxpzcx`, { method: 'POST', data: param });
}
//配置管理-进料核销配置管理-保存
export async function jlhxpzwh(param?: any) {
  return request(`${API_URL_BASE}/yw/pzgl/jlhxpzgl/jlhxpzwh`, { method: 'POST', data: param });
}

//电子税务局登录账号配置管理 初始化查询
export async function queryDjdlInfo(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/queryDjdlInfo`, { method: 'POST', data: param });
}
//电子税务局登录账号配置管理 保存
export async function saveDjdlInfo(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/saveDjdlInfo`, { method: 'POST', data: param });
}
// 配置管理-智能配单配置管理-基础配置-查询
export async function znpdJcsjcx(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/znpdpzgl/jcpzcx`, { method: 'POST', data: param });
}
// 配置管理-智能配单配置管理-基础配置-保存
export async function znpdJcsjsave(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/znpdpzgl/jcpzcxSave`, { method: 'POST', data: param });
}
// 配置管理-智能配单配置管理-单位管理-编辑
export async function dwglUpdate(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/znpdpzgl/dwglUpdate`, { method: 'POST', data: param });
}
// 数据管理-任务下载-关票通-取消执行
export async function qxzxForGpt(param?: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/qxzxForGpt`, { method: 'POST', data: param });
}
// 数据管理-出口货物报关单-删除
export async function bgdscDelete(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/bgdsc`, { method: 'POST', data: param });
}


// ************************************************ 发票管理新接口 ************************************************
export async function qrkptj(param: any) {
  return request(`${API_URL_BASE}/ckfp2/drmbkj/qrkptj`, { method: 'POST', data: param });
}
export async function scjc(param: any) {
  return request(`${API_URL_BASE}/ckfp2/zxkp/scjc`, { method: 'POST', data: param });
}
export async function sqdqrkptj(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpsqd/sqdqrkptj`, { method: 'POST', data: param });
}

export async function checkDlt(param: any) {
  return request(`${API_URL_BASE}/ckfp2/zxkp/checkDlt`, { method: 'POST', data: param });
}
export async function ddtjkp2(param: any) {
  return request(`${API_URL_BASE}/ckfp2/zxkp/ddtjkp`, { method: 'POST', data: param });
}
export async function checkDlt2(param: any) {
  return request(`${API_URL_BASE}/yw/ckfpkj/zxkp/sddl/checkDlt`, { method: 'POST', data: param });
}
export async function sfczdlzfp(param: any) {
  return request(`${API_URL_BASE}/yw/ckfpkj/zxkp/sddl/sfczdlzfp`, { method: 'POST', data: param });
}
export async function sdgxrzzt(param: any) {
  return request(`${API_URL_BASE}/yw/ckfpkj/zxkp/sddl/sdgxrzzt`, { method: 'POST', data: param });
}
// 退税申报-转不退税
export async function bgdzbts(param: any) {
  return request(`${API_URL_BASE}/tssb/wbsjgl/bgdzbts`, { method: 'POST', data: param });
}
// 退税申报-转退税
export async function btssjZts(param: any) {
  return request(`${API_URL_BASE}/tssb/wbsjgl/bgdzts`, { method: 'POST', data: param });
}
// 退税申报-试算进项税额转出额-校验
export async function btssjSsjy(param: any) {
  return request(`${API_URL_BASE}/tssb/wbsjgl/btssjSsjy`, { method: 'POST', data: param });
}
// // 退税申报-试算进项税额转出额-导出
export async function btssjSsjgdc(param: any) {
  return request(`${API_URL_BASE}/tssb/wbsjgl/btssjSsjgdc`, { method: 'POST', data: param });
}
// 退税申报-试算进项税额转出额-确定
export async function btssjSsqd(param: any) {
  return request(`${API_URL_BASE}/tssb/wbsjgl/btssjSsqd`, { method: 'POST', data: param });
}
// 退税申报-试算进项税额转出额-导入
export async function btzssldrTS(param: any) {
  return request(`${API_URL_BASE}/tssb/wbsjgl/btzssldr`, { method: 'POST', data: param });
}
// 退税申报-试算进项税额转出额-计算进项税额转出额
export async function btssjJsJxsezce(param: any) {
  return request(`${API_URL_BASE}/tssb/wbsjgl/btssjJsJxsezce`, { method: 'POST', data: param });
}
export async function kpdwwh(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/kpdwwh`, { method: 'POST', data: param });
}

export async function kpdwsc(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/kpdwsc`, { method: 'POST', data: param });
}
export async function kpdwcheck(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/kpdwcheck`, { method: 'POST', data: param });
}
export async function queryDmAdminDqSaas(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqy/queryDmAdminDqSaas`, { method: 'POST', data: param });
}
export async function enableOrDisableYh(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/enableOrDisableYh`, { method: 'POST', data: param });
}
export async function retrieveYh(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/retrieveYh`, { method: 'POST', data: param });
}
export async function queryQyPager(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqy/queryQyPager`, { method: 'POST', data: param });
}
export async function saveCdQxzCyhly(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxcd/saveCdQxzCyhly`, { method: 'POST', data: param });
}

export async function saveQxzGlfw(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqxz/saveQxzGlfw`, { method: 'POST', data: param });
}

export async function saveOrUpdateQxfw(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxhdfw/saveOrUpdateQxfw`, { method: 'POST', data: param });
}

export async function saveOrUpdateApifw(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/apifwgl/saveOrUpdateApifw`, { method: 'POST', data: param });
}

export async function deleteFffw(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxhdfw/deleteFffw`, { method: 'POST', data: param });
}

export async function deleteQxfw(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxhdfw/deleteQxfw`, { method: 'POST', data: param });
}

export async function saveOrUpdateFffw(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxhdfw/saveOrUpdateFffw`, { method: 'POST', data: param });
}

export async function deleteApifw(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/apifwgl/deleteApifw`, { method: 'POST', data: param });
}

export async function queryYhPagerTree(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/queryYhPagerTree`, { method: 'POST', data: param });
}
export async function relateApifwToQy(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/apifwgl/relateApifwToQy`, { method: 'POST', data: param });
}

export async function retrieveQy(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqy/retrieveQy`, { method: 'POST', data: param });
}

export async function setAsTheDefaultPermissionGroup(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqd/setAsTheDefaultPermissionGroup`, { method: 'POST', data: param });
}

export async function getYhInfo(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/getYhInfo`, { method: 'POST', data: param });
}

export async function checkFwDm(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxhdfw/checkFwDm`, { method: 'POST', data: param });
}

export async function getApifwxx(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/apifwgl/getApifwxx`, { method: 'POST', data: param });
}

export async function checkApifwDm(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/apifwgl/checkApifwDm`, { method: 'POST', data: param });
}
export async function yhsq(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/yhsq`, { method: 'POST', data: param });
}

export async function qysqForQxqygl(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqy/qysqForQxqygl`, { method: 'POST', data: param });
}
export async function yhhy(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxyh/yhhy`, { method: 'POST', data: param });
}
export async function qyhy(param: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/qxqy/qyhy`, { method: 'POST', data: param });
}
export async function bcsddlxx(param: any) {
  return request(`${API_URL_BASE}/yw/ckfpkj/zxkp/sddl/bcsddlxx`, { method: 'POST', data: param });
}

export async function scdl(param: any) {
  return request(`${API_URL_BASE}/yw/ckfpkj/zxkp/sddl/scdl`, { method: 'POST', data: param });
}

export async function tjdxyzm(param: any) {
  return request(`${API_URL_BASE}/yw/ckfpkj/zxkp/sddl/tjdxyzm`, { method: 'POST', data: param });
}
/**********************************************代理证明配单 end****************************************************/

// 电局登录服务-账号密码登录
export async function simulationLoginBymm(param: any, Token: any) {
  return request(`${API_URL_DZSWJ}/rpa/login/simulationLoginBymm`, { method: 'POST', data: param, headers: { accessToken: Token, accessClientId: '1' } });
}
// 电局登录服务-扫码登录
export async function simulationLoginBysm(param: any, Token: any) {
  return request(`${API_URL_DZSWJ}/rpa/login/simulationLoginBysm`, { method: 'POST', data: param, headers: { accessToken: Token, accessClientId: '1' } });
}
// 电局登录服务-输入短信验证
export async function simulationLoginPhoneNum(param: any, Token: any) {
  return request(`${API_URL_DZSWJ}/rpa/login/simulationLoginPhoneNum`, { method: 'POST', data: param, headers: { accessToken: Token, accessClientId: '1' } });
}
// 电局登录服务-发送短信
export async function simulationLoginPhoneNumGet(param: any, Token: any) {
  return request(`${API_URL_DZSWJ}/rpa/login/simulationLoginPhoneNumGet`, { method: 'POST', data: param, headers: { accessToken: Token, accessClientId: '1' } });
}
// 电局登录服务-选择身份类型
export async function simulationLoginSelectRole(param: any, Token: any) {
  return request(`${API_URL_DZSWJ}/rpa/login/simulationLoginSelectRole`, { method: 'POST', data: param, headers: { accessToken: Token, accessClientId: '1' } });
}
// 电局登录服务-登录过程状态查询
export async function simulationLoginProcessQuery(param: any, Token: any) {
  return request(`${API_URL_DZSWJ}/rpa/login/simulationLoginProcessQuery`, { method: 'POST', data: param, headers: { accessToken: Token, accessClientId: '1' } });
}
// 电局登录服务-
export async function simulationLoginStateQueryDzswjxt(param: any, Token: any) {
  return request(`${API_URL_DZSWJ}/rpa/login/simulationLoginStateQueryDzswjxt`, { method: 'POST', data: param, headers: { accessToken: Token, accessClientId: '1' } });
}

export async function saveDjdlzh(param: any) {
  return request(`${API_URL_BASE}/yw/tssb/j4rpa/saveDjdlzh`, { method: 'POST', data: param });
}

export async function hqJ4RpaToken(param: any) {
  return request(`${API_URL_BASE}/yw/tssb/j4rpa/hqJ4RpaToken`, { method: 'POST', data: param });
}

export async function queryDjdlzh(param: any) {
  return request(`${API_URL_BASE}/yw/tssb/j4rpa/queryDjdlzh`, { method: 'POST', data: param });
}

// 订单中心-待结算-待结算订单保存
export async function updateDjsdd(param: any) {
  return request(`${API_URL_BASE}/ddzx/ddgl/updateDjsdd`, { method: 'POST', data: param });
}
export async function createKptzs(param: any) {
  return request(`${API_URL_BASE}/ddzx/ddgl/createKptzs`, { method: 'POST', data: param });
}
export async function ddPd(param: any) {
  return request(`${API_URL_BASE}/ddzx/ddgl/ddPd`, { method: 'POST', data: param });
}
export async function scmx(param: any) {
  return request(`${API_URL_BASE}/ddzx/ddgl/scmx`, { method: 'POST', data: param });
}

export async function ddzyt(param: any) {
  return request(`${API_URL_BASE}/ddzx/ddgl/ddzyt`, { method: 'POST', data: param });
}
export async function cancelLogin(param: any) {
  return request(`${API_URL_BASE}/yw/cancelLogin`, { method: 'POST', data: param });
}
export async function getBgdZdxzPz(param: any) {
  return request(`${API_URL_BASE}/saas/pzgl/dsrwgl/bgd/getBgdZdxzPz`, { method: 'POST', data: param });
}
export async function tyBgdZdxzPz(param: any) {
  return request(`${API_URL_BASE}/saas/pzgl/dsrwgl/bgd/tyBgdZdxzPz`, { method: 'POST', data: param });
}
export async function sendTestMail(param: any) {
  return request(`${API_URL_BASE}/saas/pzgl/dsrwgl/bgd/sendTestMail`, { method: 'POST', data: param });
}
export async function getXtSzxx(param: any) {
  return request(`${API_URL_BASE}/saas/pzgl/dsrwgl/bgd/getXtSzxx`, { method: 'POST', data: param });
}
export async function saveBgdZdxzPz(param: any) {
  return request(`${API_URL_BASE}/saas/pzgl/dsrwgl/bgd/saveBgdZdxzPz`, { method: 'POST', data: param });
}
// 报关单批量设置
export async function batchSetBgd(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/hgsjcx/batchSetBgd`, { method: 'POST', data: param });
}
// 进项发票批量设置
export async function batchSetJxfp(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/jxfpcx/batchSetJxfp`, { method: 'POST', data: param });
}
export async function queryHhcb(param: any) {
  return request(`${API_URL_BASE}/yw/saas/pzgl/hhcb/queryHhcb`, { method: 'POST', data: param });
}
export async function updateHhcb(param: any) {
  return request(`${API_URL_BASE}/yw/saas/pzgl/hhcb/updateHhcb`, { method: 'POST', data: param });
}
// 申报业务数据匹配 -- 自动匹配
export async function zdppBadz(param: any) {
  return request(`${API_URL_BASE}/yw/badze/sjpp/zdppBadz`, { method: 'POST', data: param });
}
// 自动匹配 -- 查询单证齐全报关单
export async function queryDzqqBgd(param: any) {
  return request(`${API_URL_BASE}/yw/badze/sjpp/queryDzqqBgd`, { method: 'POST', data: param });
}
// 自动匹配 -- 查询单证不齐报关单
export async function queryDzbqBgd(param: any) {
  return request(`${API_URL_BASE}/yw/badze/sjpp/queryDzbqBgd`, { method: 'POST', data: param });
}
// 备案基础配置 -- 查看配置管理
export async function queryBadzepz(param: any) {
  return request(`${API_URL_BASE}/yw/badze/pzgl/queryBadzepz`, { method: 'POST', data: param });
}
// 备案基础配置 -- 设置启用状态
export async function updateXybz(param: any) {
  return request(`${API_URL_BASE}/yw/badze/pzgl/updateXybz`, { method: 'POST', data: param });
}
// 台账筛选
export async function zzsfptzsx(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/dzdzfp/zzsfptzsx`, { method: 'POST', data: param });
}
export async function zxqjy(param: any) {
  return request(`${API_URL_BASE}/saas/sjgl/fpsjxz/zxqjy`, { method: 'POST', data: param });
}
export async function kszx(param: any) {
  return request(`${API_URL_BASE}/saas/sjgl/fpsjxz/kszx`, { method: 'POST', data: param });
}
export async function cjrw(param: any) {
  return request(`${API_URL_BASE}/saas/sjgl/fpsjxz/cjrw`, { method: 'POST', data: param });
}

export async function deleteCkxshtByIds(param: any) {
  return request(`${API_URL_BASE}/yw/badze/ckxsht/deleteCkxshtByIds`, { method: 'POST', data: param });
}
export async function zdyxj(param: any) {
  return request(`${API_URL_BASE}/ddzx/ddgl/xj`, { method: 'POST', data: param });
}
export async function cjrwSdbswj(param: any) {
  return request(`${API_URL_BASE}/saas/sjgl/fpsjxz/cjrwSdbswj`, { method: 'POST', data: param });
}

export async function cjrwFpztgx(param: any) {
  return request(`${API_URL_BASE}/saas/sjgl/fpztgx/cjrw`, { method: 'POST', data: param });
}
export async function tszlxzjy(param: any) {
  return request(`${API_URL_BASE}/yw/tssb/tszl/tszlxzjy`, { method: 'POST', data: param });
}
export async function tszljydc(param: any) {
  return request(`${API_URL_BASE}/yw/tssb/tszl/tszljydc`, { method: 'POST', data: param });
}
export async function tszlxz(param: any) {
  return request(`${API_URL_BASE}/yw/tssb/tszl/tszlxz`, { method: 'POST', data: param });
}
// 出口货物转内销证明-新增修改
export async function saveCkznxMx(param: any) {
  return request(`${API_URL_BASE}/saas/qttms/zmsb/saveCkznxMx`, { method: 'POST', data: param });
}
// 出口货物已补税/未退税证明-新增修改
export async function saveYbsWtsMx(param: any) {
  return request(`${API_URL_BASE}/saas/qttms/zmsb/saveYbsWtsMx`, { method: 'POST', data: param });
}

export async function bgdpdfyl(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/hgsjcx/bgdpdfyl`, { method: 'POST', data: param });
}

export async function cxscbgdpdf(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/hgsjcx/cxscbgdpdf`, { method: 'POST', data: param });
}
export async function fpyl(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/jxfpcx/fpyl`, { method: 'POST', data: param });
}
export async function cxxj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/cxxj`, { method: 'POST', data: param });
}
export async function sjglCkbgdcxCjbzxj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/cjbzXj`, { method: 'POST', data: param });
}
export async function cxxj2(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/jxfpcx/cxxj`, { method: 'POST', data: param });
}

// 出口发票开具 -- 按报关单开具 -- 台账导入
export async function kptzdr(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/tz/kptzdr`, { method: 'POST', data: param });
}
// 新企业首次登录系统，配置汇率规则及出口发票汇率规则
export async function initXtzy(param: any) {
  return request(`${API_URL_BASE}/yw/saas/gzt/initXtzy`, { method: 'POST', data: param });
}
// 维护自动开票标志
export async function whzdkpbz(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/whzdkpbz`, { method: 'POST', data: param });
}
export async function pldy(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/jxfpcx/pldy`, { method: 'POST', data: param });
}
export async function hqSsSsq(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/ywcsxx/hqSsSsq`, { method: 'POST', data: param });
}
export async function hqSsPc(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/ywcsxx/hqSsPc`, { method: 'POST', data: param });
}
export async function tszbqd(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/tszbqd`, { method: 'POST', data: param });
}
export async function tszbcs(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/tszbcs`, { method: 'POST', data: param });
}
export async function tszbcsMdt(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/tszbcs`, { method: 'POST', data: param });
}
export async function tszbqdMdt(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/tszbqd`, { method: 'POST', data: param });
}
// 消费税台账筛选
export async function xfsfptzsx(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/xfsfp/xfsfptzsx`, { method: 'POST', data: param });
}
export async function getPzxx(param?: any) {
  return request(`${API_URL_BASE}/dditSaas/qxpz/getPzxx`, { method: 'POST', data: param });
}
export async function savePzxx(param?: any) {
  return request(`${API_URL_BASE}/dditSaas/qxpz/savePzxx`, { method: 'POST', data: param });
}
// 退税申报（免退）-台账配单-模板下载
export async function tssbTzpdMbxz(param?: any) {
  return request(`${API_URL_BASE}/saas/tssb/tzpd/mbxz`, { method: 'POST', data: param });
}
// 退税申报（免退）-台账配单-自动配单
export async function tssbTzpdZdpd(param?: any) {
  return request(`${API_URL_BASE}/saas/tssb/tzpd/zdpd`, { method: 'POST', data: param });
}

// 退税申报（免退）-台账配单-生成明细
export async function tssbTzpdInitScmx(param?: any) {
  return request(`${API_URL_BASE}/saas/tssb/tzpd/initScmx`, { method: 'POST', data: param });
}
// 退税申报（免退）-台账配单-生成明细
export async function tssbTzpdScmx(param?: any) {
  return request(`${API_URL_BASE}/saas/tssb/tzpd/scmx`, { method: 'POST', data: param });
}
// 配单任务-删除
export async function deletePdrwByIds(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/sjpp/pdrw/deletePdrwMx`, { method: 'POST', data: param });
}

// 配单任务-任务详情
export async function queryPdrwRwxq(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/sjpp/pdrw/queryPdrwRwxq`, { method: 'POST', data: param });
}

// 税务反馈数据查询-不予办理转明细采集
export async function byblzzmcjByIds(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/swfksjcx/mtssb/byblzzmcjByIds`, { method: 'POST', data: param });
}

// 税务反馈数据查询-还原申报情况
export async function hysbqkByIds(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/swfksjcx/mtssb/hysbqk`, { method: 'POST', data: param });
}



export async function saveCdfz(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/cdfzgl/saveCdfz`, { method: 'POST', data: param });
}

export async function deleteCdfz(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/cdfzgl/deleteCdfz`, { method: 'POST', data: param });
}

export async function cxCdfzCdlb(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/cdfzgl/cxCdfzCdlb`, { method: 'POST', data: param });
}

export async function glcdfzcd(param?: any) {
  return request(`${API_URL_BASE}/yw/dditSaas/cdfzgl/glcdfzcd`, { method: 'POST', data: param });
}
export async function gxsxpzYxbz(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/aipdgl/gxsxpzYxbz`, { method: 'POST', data: param });
}
export async function gxsxpzYxbz2(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/cjpdgl/gxsxpzYxbz`, { method: 'POST', data: param });
}
export async function cxjcpz(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/aipdgl/cxjcpz`, { method: 'POST', data: param });
}
export async function bcjcpz(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/aipdgl/bcjcpz`, { method: 'POST', data: param });
}

export async function cxsxx(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/aipdgl/cxsxx`, { method: 'POST', data: param });
}
export async function initScmx(param?: any) {
  return request(`${API_URL_BASE}/saas/tssb/pd/initScmx`, { method: 'POST', data: param });
}
export async function ppjsc(param?: any) {
  return request(`${API_URL_BASE}/saas/tssb/aipd/ppjsc`, { method: 'POST', data: param });
}

export async function scmxMx(param?: any) {
  return request(`${API_URL_BASE}/saas/tssb/aipd/scmx`, { method: 'POST', data: param });
}

export async function cxjcpz2(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/cjpdgl/cxjcpz`, { method: 'POST', data: param });
}
export async function bcjcpz2(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/cjpdgl/bcjcpz`, { method: 'POST', data: param });
}
export async function sjpp(param?: any) {
  return request(`${API_URL_BASE}/saas/tssb/cjpd/sjpp`, { method: 'POST', data: param });
}
export async function queryCjPdrwRwxq(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/sjpp/pdrw/queryCjPdrwRwxq`, { method: 'POST', data: param });
}
export async function jnhydSaveOrUpdate(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/cjpdgl/jnhydSaveOrUpdate`, { method: 'POST', data: param });
}
export async function jnhydDel(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/cjpdgl/jnhydDel`, { method: 'POST', data: param });
}
export async function sjsc3(param?: any) {
  return request(`${API_URL_BASE}/saas/tssb/cjpd/scmx`, { method: 'POST', data: param });
}
export async function getJnhydsj(param?: any) {
  return request(`${API_URL_BASE}/saas/pzgl/cjpdgl/getJnhydsj`, { method: 'POST', data: param });
}
export async function getSmzt(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/hgjc/getSmzt`, { method: 'POST', data: param });
}
export async function startSm(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/hgjc/startSm`, { method: 'POST', data: param });
}
export async function initSm(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/hgjc/initSm`, { method: 'POST', data: param });
}
export async function getCgtj(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/hgjctj/getCgtj`, { method: 'POST', data: param });
}
export async function getZblx(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/hgjctj/getZblx`, { method: 'POST', data: param });
}
export async function getInitTj(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/hgjctj/getInitTj`, { method: 'POST', data: param });
}
export async function gxQybz(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/hgjctj/gxQybz`, { method: 'POST', data: param });
}
export async function queryFxzbByZbdm(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/hgjctj/queryFxzbByZbdm`, { method: 'POST', data: param });
}
export async function saveFxzbByZbdm(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/hgjctj/saveFxzbByZbdm`, { method: 'POST', data: param });
}
export async function getXzbg(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/hgjc/getXzbg`, { method: 'POST', data: param });
}
export async function cxscbg(param?: any) {
  return request(`${API_URL_BASE}/yw/saas/hgjc/cxscbg`, { method: 'POST', data: param });
}


// 申报业务数据匹配 -- 解除匹配
export async function badzJcpp(param: any) {
  return request(`${API_URL_BASE}/yw/badze/sjpp/badzJcpp`, { method: 'POST', data: param });
}

// 申报业务数据匹配 -- 查询备案单证其他单证明细份数
export async function querySjppQtdzMxfs(param: any) {
  return request(`${API_URL_BASE}/yw/badze/sjpp/querySjppQtdzMxfs`, { method: 'POST', data: param });
}

// 备案基础配置 -- 设置启用状态
export async function checkPzglExistsDzlxInSjpp(param: any) {
  return request(`${API_URL_BASE}/yw/badze/pzgl/checkPzglExistsDzlxInSjpp`, { method: 'POST', data: param });
}
// 数据管理-报关单下载-校验YBT登录态是否存在
export async function checkDltForYbt(param?: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/checkDltForYbt`, { method: 'POST', data: param });
}
export async function cxzxForYbt(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/cxzxForYbt`, { method: 'POST', data: param });
}
// 退税汇率管理--获取当前企业汇率配置情况
export async function getQyhlpz(param: any) {
  return request(`${API_URL_BASE}/yw/saas/hlgl/getQyhlpz`, { method: 'POST', data: param });
}
export async function qxzxForYbt(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/qxzxForYbt`, { method: 'POST', data: param });
}

export async function gdhdrwqxzxcheck(param?: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/gdhdrwqxzxcheck`, { method: 'POST', data: param });
}
export async function gdhdrwqxzx(param?: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/gdhdrwqxzx`, { method: 'POST', data: param });
}
// 进项发票池查询批量设置
export async function batchSetJxfpccx(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/jxfpccx/batchSetJxfpccx`, { method: 'POST', data: param });
}
// 出口收汇模板下载初始化申报信息
export async function queryCkshSbxx(param: any) {
  return request(`${API_URL_BASE}/yw/tssb/cksh/initSbxx`, { method: 'POST', data: param });
}

// 配置管理-外商管理-外商付汇关系管理-付汇人配置-新建/修改付汇人
export async function saveOrUpdateFhr(param?: any) {
  return request(`${API_URL_BASE}/yw/pzgl/wsgl/wsfhgxgl/saveOrUpdateFhr`, { method: 'POST', data: param });
}

// 配置管理-外商管理-外商付汇关系管理-付汇人配置-获取付汇人表单信息
export async function getFhrInfo(param: any) {
  return request(`${API_URL_BASE}/yw/pzgl/wsgl/wsfhgxgl/querywsfhgxglFhrform`, { method: 'POST', data: param });
}

// 配置管理-外商管理-外商付汇关系管理-付汇人配置-删除付汇人
export async function deleteFhr(param?: any) {
  return request(`${API_URL_BASE}/yw/pzgl/wsgl/wsfhgxgl/wsfhgxFhrsc`, { method: 'POST', data: param });
}

// 配置管理-外商管理-外商付汇关系管理-境外收货人配置-删除境外收货人
export async function deleteJwshr(param?: any) {
  return request(`${API_URL_BASE}/yw/pzgl/wsgl/wsfhgxgl/wsfhgxJwshrsc`, { method: 'POST', data: param });
}
// 配置管理-外商管理-外商付汇关系管理-付汇人配置-绑定境外收货人
export async function fhrBdJwshr(param?: any) {
  return request(`${API_URL_BASE}/yw/pzgl/wsgl/wsfhgxgl/fhrBdJwshr`, { method: 'POST', data: param });
}

// 配置管理-外商管理-外商付汇关系管理-境外收货人配置-境外收货人表单信息
export async function getJwshrInfo(param: any) {
  return request(`${API_URL_BASE}/yw/pzgl/wsgl/wsfhgxgl/querywsfhgxglJwshrform`, { method: 'POST', data: param });
}

// 配置管理-外商管理-外商付汇关系管理-境外收货人配置-修改境外收货人
export async function saveOrUpdateJwshr(param?: any) {
  return request(`${API_URL_BASE}/yw/pzgl/wsgl/wsfhgxgl/saveOrUpdateJwshr`, { method: 'POST', data: param });
}

// 配置管理-外商管理-外商付汇关系管理-提取境外收货人
export async function wsgltqkh(param?: any) {
  return request(`${API_URL_BASE}/yw/pzgl/wsgl/wsfhgxgl/tqjwshr`, { method: 'POST', data: param });
}

// 按报关单智能配单-智能配单
export async function zdpd(param: any) {
  return request(`${API_URL_BASE}/saas/tssb/bgdzxpd/zdpd`, { method: 'POST', data: param });
}

// 按报关单自动配单-右侧已匹配发票列表查询
export async function pdjgYppFp(param: any) {
  return request(`${API_URL_BASE}/saas/tssb/bgdzxpd/pdjgYppFp`, { method: 'POST', data: param });
}

// 按报关单自动配单-报关单列表查询
export async function pdjgBgdxx(param: any) {
  return request(`${API_URL_BASE}/saas/tssb/bgdzxpd/pdjgBgdxx`, { method: 'POST', data: param });
}

// 按报关单自动配单-生成明细按钮
export async function pdjgScmx(param: any) {
  return request(`${API_URL_BASE}/saas/tssb/bgdzxpd/pdjgScmx`, { method: 'POST', data: param });
}

//  创建LT客户端工具出口报关单数据下载任务，返回子任务明细
export async function rwqdToZffwForLtkhdgj(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/rwqdToZffwForLtkhdgj`, { method: 'POST', data: param });
}
export async function cxzxForLtkhdgj(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/cxzxForLtkhdgj`, { method: 'POST', data: param });
}
export async function cxzirwForLtkhdgjqxzx(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/cxzirwForLtkhdgjqxzx`, { method: 'POST', data: param });
}
export async function qxzxForLtkhdgj(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/qxzxForLtkhdgj`, { method: 'POST', data: param });
}
// 根据进货凭证号获取消费税信息
export async function queryXfsxxByJhpzh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/queryXfsxxByJhpzh`, { method: 'POST', data: param });
}
export async function xfsfppdfyl(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/xfsfp/xfsfppdfyl`, { method: 'POST', data: param });
}
export async function xfspldy(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/xfsfp/xfspldy`, { method: 'POST', data: param });
}
export async function getHsxyUrl(param: any) {
  return request(`${API_URL_BASE}/xtcspz/getHsxyUrl`, { method: 'POST', data: param });
}
export async function getXhsjzrData(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/shsjzr/getXhsjzrData`, { method: 'POST', data: param });
}
export async function startDownload(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/shsjzr/startDownload`, { method: 'POST', data: param });
}
export async function reDownload(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/shsjzr/reDownload`, { method: 'POST', data: param });
}
export async function createBaseDataTask(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/shsjzr/createBaseDataTask`, { method: 'POST', data: param });
}
export async function xhsjzrKakCheckData(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/shsjzr/xhsjzrKakCheckData`, { method: 'POST', data: param });
}
export async function xhsjzrKakSave(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/shsjzr/xhsjzrKakSave`, { method: 'POST', data: param });
}
export async function pdCheckByHistoryData(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/shsjzr/pdCheckByHistoryData`, { method: 'POST', data: param });
}
export async function fpzxpdCheckByHistoryData(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/shsjzr/fpzxpdCheckByHistoryData`, { method: 'POST', data: param });
}
export async function exportExcelSjzrxzWsbBgdFp(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/shsjzr/exportExcelSjzrxzWsbBgdFp`, { method: 'POST', data: param });
}
export async function startDownload7MainInfoFp(param: any) {
  return request(`${API_URL_BASE}/yw/saas/sjgl/shsjzr/startDownload7MainInfoFp`, { method: 'POST', data: param });
}
// 金四rpa退税审核进度同步
export async function getJ4TsshjdInfo(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/shjgcx/getJ4TsshjdInfo`, { method: 'POST', data: param });
}
// 判断企业是否有菜单访问权限
export async function pdCdqxBySbqyuuid(param: any) {
  return request(`${API_URL_BASE}/saas/pdCdqxBySbqyuuid`, { method: 'POST', data: param });
}

// 外贸免退税退税指标测算阈值获取
export async function mtsTszbcsHqTszbyz(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/mtsTszbcsHqTszbyz`, { method: 'POST', data: param });
}

// 生产免抵退退税指标测算阈值获取
export async function mdtTszbcsHqTszbyz(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/mdtTszbcsHqTszbyz`, { method: 'POST', data: param });
}

// 外贸免退税明细-导入修改
export async function mtsImportUpdate(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/mtsImportUpdate`, { method: 'POST', data: param });
}

// 生产免抵退明细-导入修改
export async function mdtImportUpdate(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/mdtImportUpdate`, { method: 'POST', data: param });
}

export async function tuishuijihuaAdd(param: any) {
  return request(`${API_URL_BASE}/saas/tuishuijihua/addData`, { method: 'POST', data: param });
}

export async function tuishuijihuaDel(param: any) {
  return request(`${API_URL_BASE}/saas/tuishuijihua/delData`, { method: 'POST', data: param });
}

export async function tuishuijihuaAddCheck(param: any) {
  return request(`${API_URL_BASE}/saas/tuishuijihua/addDataCheck`, { method: 'POST', data: param });
}

export async function queryMdtHzFk(param: any) {
  return request(`${API_URL_BASE}/saas/tuishuijihua/queryMdtHzFk`, { method: 'POST', data: param });
}

// 进项、销项发票下载取消执行
export async function qxzxJshst(param: any) {
  return request(`${API_URL_BASE}/saas/sjgl/fpsjxz/qxzx`, { method: 'POST', data: param });
}
// 出口收汇明细采集通过ckbgdh查询对应字段
export async function queryShmxByCkbgdh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/wbsj/bgd/queryTssbBgdByCkbgdh`, { method: 'POST', data: param });
}
// 根据关联号获取出口信息
export async function queryMdtCkxxByGlh(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/queryCkxxByGlh`, { method: 'POST', data: param });
}
// 获取关联号数据
export async function queryMdtGlhBySsq(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mdt/hwlw/tssb/queryMdtGlhBySsq`, { method: 'POST', data: param });
}
// 根据来料加工免税证明编号+序号 获取来料加工免税证明信息
export async function getLljgmszmxxByBhxh(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/lljghx/getLljgmszmxxByBhxh`, { method: 'POST', data: param });
}
export async function checkYwlxForYbswts(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/zmkj/ckhwybswts/checkYwlx`, { method: 'POST', data: param });
}
// 获取收汇数据定时匹配配置信息
export async function getShsjdsppPz(param: any) {
  return request(`${API_URL_BASE}/saas/pzgl/dsrwgl/shsjpp/getShsjppPz`, { method: 'POST', data: param });
}
// 停用收汇数据定时匹配任务
export async function tyShsjppdsRw(param: any) {
  return request(`${API_URL_BASE}/saas/pzgl/dsrwgl/shsjpp/tyShsjppdsRw`, { method: 'POST', data: param });
}
// 保存收汇数据定时匹配配置
export async function saveShsjdsppPz(param: any) {
  return request(`${API_URL_BASE}/saas/pzgl/dsrwgl/shsjpp/saveShsjdsppPz`, { method: 'POST', data: param });
}

export async function queryCjSbpc(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/qtyw/khdshwc/queryCjSbpc`, { method: 'POST', data: param });
}

export async function zrqrb(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/qtyw/khdshwc/zrqrb`, { method: 'POST', data: param });
}

export async function bydqdqrsj(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/qtyw/khdshwc/bydqdqrsj`, { method: 'POST', data: param });
}

export async function mtsZnpdCjpdDzgxbc(param?: any) {
  return request(`${API_URL_BASE}/saas/tssb/cjpd/dzgxbc`, { method: 'POST', data: param });
}
