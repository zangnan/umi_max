import { request } from 'umi';
import request1 from 'umi-request';

// ************************************************ 备案单证 ************************************************

// 备案单证 - 资料归档 - 撤销备案
export async function cancellationOfFiling(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/zlgd/cxba`, { method: 'POST', data: param });
}

// 备案单证 -  资料归档 - 资料归档
export async function dataArchiving(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/zlgd/zlgd`, { method: 'POST', data: param });
}

// 备案单证 -  资料归档 - 下载
export async function dzbaZlgdXz(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/abgdxzfj`, { method: 'POST', data: param });
}

// 备案单证 - 单证备案 - 资料采集 - 下载
export async function dzbaZlcjXz(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/abgdxzfj`, { method: 'POST', data: param });// 只mock一个下载
}

// 单证管理 - 单证备案 - 下载
export async function dzbadzglxz(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/adzxzfj`, { method: 'POST', data: param });// 只mock一个下载
}

// 备案单证 - 单证备案 - 按所属期下载
export async function dzbaZlcjSqq(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/assqxzfj`, { method: 'POST', data: param });// 只mock一个下载
}

// 备案单证 - 单证备案 - 按报关单 - 资料撤档
export async function dzbaZlcdBgd(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/abgddy/zlcd`, { method: 'POST', data: param });// 只mock一个下载
}

// 备案单证 - 单证备案 - 按所属期 - 资料撤档
export async function dzbaZlcdSsq(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/assqdy/zlcd`, { method: 'POST', data: param });// 只mock一个下载
}

// 备案单证 - 单证备案 - 资料采集 - 单证信息 - 关联单证接口
export async function badzDzbaZlcjGldzjk(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/zlcj/gldz`, { method: 'POST', data: param });
}

// 备案单证 - 单证备案 - 资料采集 - 单证信息 - 解除接口
export async function badzDzbaZlcjJcgljk(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/zlcj/jcgl`, { method: 'POST', data: param });
}

// 备案单证 - 单证备案 - 单证备案 - 获取申报数据
export async function obtainDeclarationData(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/dzba/cxthqsbsjqzjy`, { method: 'POST', data: param });
}

// 备案单证 - 单证备案 - 单证备案 - 获取申报数据-文件上传
export async function fkhqsbsjqzjy(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/dzba/fkhqsbsjqzjy`, { method: 'POST', data: param });
}

// 备案单证 - 单证备案 - 单证备案 - 获取申报数据-保存
export async function hqsbsjSave(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/dzba/hqsbsj`, { method: 'POST', data: param });
}

// 备案单证 - 单证备案 - 单证备案 - 获取申报数据-上传
export async function drfkwj(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/dzba/drfkwj`, { method: 'POST', data: param });
}

// 备案单证 - 单证备案 - 单证备案 - 删除
export async function sbsjsc(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/dzba/sbsjsc`, { method: 'POST', data: param });
}

// 备案单证 - 单证备案 - 资料采集 - 完成备案
export async function completeFiling(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/zlcj/wcba`, { method: 'POST', data: param });
}

// 备案单证 - 备案单证设置 - 基础查询
export async function badzszjccx(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/badzsz/cxjcsz`, { method: 'POST', data: param });
}

// 备案单证 - 备案单证设置 - 基础查询-保存
export async function badzszjccxSave(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/badzsz/jcszbc`, { method: 'POST', data: param });
}

// 备案单证 - 备案单证设置 - 基础查询-检查
export async function badzszjccxCheck(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/badzsz/jcszgdljjy`, { method: 'POST', data: param });
}

// 备案单证 - 备案单证设置 - 基础查询-查询系统版本
export async function badzjcszQueryXtbb(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/getXtbb`, { method: 'POST', data: param });
}

// 备案单证 - 单证备案 - 单证备案 - 修改受理日期
export async function modifySlrqjk(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/dzba/slrqbc`, { method: 'POST', data: param });
}

// 备案单证 - 备案设置 - 顺序设置 - 保存
export async function badzSzSxszSave(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/badzsz/zlsxszbc`, { method: 'POST', data: param });
}

// 备案单证 - 核查调阅 - 核查报送
export async function badzHcdyHcbs(param?: any) {
  return request(`${API_URL_BASE}/hts/badz/hcdy/badzHcdyHcbs`, { method: 'POST', data: param });
}

// 备案单证 - 共通功能 - 下载资料
export async function badzAbgdxzfj(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/assqzdbgdxzfj`, { method: 'POST', data: param });
}

// 备案单证 - 共通功能 - 打印成册
export async function hcdyHcrwDycc(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/hcdy/hcrwDycc`, { method: 'POST', data: param });
}

// 备案单证 - 资料调阅 - 按报关单调阅 - 打印成册
export async function abgdDyccData(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/abgddy/dycc`, { method: 'POST', data: param });
}

// 备案单证 - 资料调阅 - 按报关单调阅 - 打印成册(多条)
export async function abgdDyccDataDT(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/abgddy/dtdycc`, { method: 'POST', data: param });
}

// 备案单证 - 资料调阅 - 按所属期调阅 - 打印成册
export async function assqDyccData(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/assqdy/dycc`, { method: 'POST', data: param });
}

// 备案单证 - 资料调阅 - 按所属期调阅 - 调阅
export async function assqDyData(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/assqdy/dy`, { method: 'POST', data: param });
}

// 备案单证 - 资料调阅 - 按报关单调阅 - 调阅
export async function abgdDyData(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/abgddy/dy`, { method: 'POST', data: param });
}

// 备案单证 - 共通功能 - 调阅
export async function hcdyHcrwDy(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/hcdy/hcrwHcrwDy`, { method: 'POST', data: param });
}

// 备案单证 - 共通功能 - 调阅-获取单证名称
export async function getDzmcTree(param?: any) {
  return request(`${API_URL_BASE}/hx/ty/crud/getComboTree`, { method: 'POST', data: param });
}

// 备案单证 - 共通功能 - 调阅-获取单证名称
export async function getDzmcTree2(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/getBadzlxYzjdTree`, { method: 'POST', data: param });
}
// 备案单证 - 单证备案 - 资料调阅  - 生成所属期数据
export async function scssqsj(param?: any) {
  return request(`${API_URL_BASE}/hts/badz/zlgl/scssqsj`, { method: 'POST', data: param });
}
// 备案单证 - 资料归档 - 预览
export async function badzZlgdYl(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/abgdyl`, { method: 'POST', data: param });
}
// 备案单证 - 资料归档 - 预览 - 查看详情
export async function badzZlgdYlCkxq(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/adzyl`, { method: 'POST', data: param });
}
// 备案单证 - 资料调阅 - 按所属期 - 按所属期调阅
export async function badzScssqsj(param: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/assqdy/scssqsj`, { method: 'POST', data: param });
}

// 单证上传-详细页保存
export async function tzsx(param: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/zlcj/tzsx`, { method: 'POST', data: param });
}

// 备案单证 - 共通功能 - 上一单下一单报关单
export async function qhBgdh(param?: any) {
  return request(`${API_URL_BASE}/hts/badz/common/qhBgdh`, { method: 'POST', data: param });
}

// 备案单证 - 共通功能 - 上传保存
export async function funcDzglbc(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/dzgl/dzglbc`, { method: 'POST', data: param });
}

// 备案单证 - 共通功能 - 上一单下一单报关单
export async function deleteCheck(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/dzgl/dzglsc`, { method: 'POST', data: param });
}
// 备案单证 - 共通功能 - 根据单证编号，单证名称获取数据
export async function getDataFromDzbh(param?: any) {
  return request(`${API_URL_BASE}/hts/badz/common/getDataFromDzbh`, { method: 'POST', data: param });
}

// 备案单证 - 核查任务 - 生成核查文件
export async function hcdyHcrwSchcwj(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/hcdy/hcrwSchcwj`, { method: 'POST', data: param });
}

// 备案单证 - 备案设置 - 保存
export async function badzBazlszSave(param?: any) {
  return request(`${API_URL_BASE}/hts/badz/hcrw/badzBazlszSave`, { method: 'POST', data: param });
}

// 备案单证 - 核查调阅 - 创建核查任务保存-ssq
export async function hcdyHcrwCjrw(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/hcdy/hcrwCjrw`, { method: 'POST', data: param });
}
// 备案单证 - 核查调阅 - 创建核查任务保存-bgd
export async function hcrwAbgdcjrwbgd(param?: any) {
  return request1(`${API_URL_BASE}/yw/sb/badz/hcdy/hcrwAbgdcjrw`, { method: 'POST', data: param });
}

// 备案单证 - 核查调阅 -任务详情 - 填写审核说明创建核查任务保存
export async function saveRwxxHcsmbc(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/hcdy/rwxxHcsmbc`, { method: 'POST', data: param });
}

// 备案单证 - 路径转base64
export async function jzfjToPath(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/jzfjToPath`, { method: 'POST', data: param });
}

// 备案单证 - 共通 - 附件转化
export async function changeJzfjToPath(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/jzfjToPath`, { method: 'POST', data: param });
}

// 备案单证-数据下载-数据下载
export async function sjxzBadz(param: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/sjxz/sjxz`, { method: 'POST', data: param });
}

// 备案单证-数据下载-数据下载校验
export async function sjxzjy(param: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/sjxz/sjxzjy`, { method: 'POST', data: param });
}

// 备案单证-进度查询-删除
export async function sjxzsc(param: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/sjxz/sjxzsc`, { method: 'POST', data: param });
}

// 备案单证-进度查询-重新下载
export async function sjxzCxxzBadz(param: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/sjxz/sjxzCxxz`, { method: 'POST', data: param });
}

// 资料顺序设置
export async function getTreeCode2(param?: any) {
  return request(`${API_URL_BASE}/hx/ty/crud/getComboTree`, { method: 'POST', data: param });
}

// 获取企业类型
export async function getQylxInfo(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/getQxInfo`, { method: 'POST', data: param });
}

// 单证上传-详细页保存
export async function xxybc(param: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/zlcj/xxybc`, { method: 'POST', data: param });
}

// 进料加工核销-数据下载-查询口岸卡密码
export async function queryKakMm(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/sjxz/queryKakMm`, { method: 'POST', data: param });
}

// 通用获取下拉树数据
export async function getTreeCode(param?: any) {
  return request(`${API_URL_BASE}/hx/ty/crud/getComboTree`, { method: 'POST', data: param });
}

// 进料加工核销-数据下载-环境检测
export async function khdHjjc(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/sjxz/khdHjjc`, { method: 'POST', data: param });
}

export async function gtTsxx(param: any) {
  return request(`${API_URL_BASE}/hts/ckfp/gt/gtTsxx`, { method: 'POST', data: param });
}

// 退税数据申报 -- 数据汇总查询 -- 删除
export async function deleteHcrwHcrwsc(param: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/hcdy/hcrwHcrwsc`, { method: 'POST', data: param });
}

/**********************************************文书下载 start****************************************************/
export async function downloadZmws(param?: any) {
  return request(`${API_URL_BASE}/yw/dzgj/swws/zmws/downloadZmws`, { method: 'POST', data: param });
}

// 出口报关单-SAAS接口-备案单证初始化
export async function queryBadzCsh(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/badz/comn/cshsj`, { method: 'POST', data: param });
}

// ************************************************ 备案单证2.0 ************************************************
// 备案单证2.0-表单保存前校验
export async function badzCallServiceCheck(param: any) {
  return request(`${API_URL_BASE}/yw/badze/gtgn/checkDateUnique`, { method: 'POST', data: param });
}
// 备案单证2.0-工作台-“备案单证目录”列表“选择”按钮弹窗页面“确认”按钮
export async function saveOrUpdateBafs(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/baqk/saveOrUpdateBafs`, { method: 'POST', data: param });
}
// 备案单证2.0-工作台-“备案单证目录”列表“查看”按钮弹窗页面“装订成册”按钮
export async function saveOrUpdateZzbaBaqk(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/baqk/saveOrUpdateZzbaBaqk`, { method: 'POST', data: param });
}
// 备案单证2.0-工作台-“备案单证目录”列表“查看”按钮
export async function queryZzbaTjsj(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/baqk/queryZzbaTjsj`, { method: 'POST', data: param });
}
// 备案单证2.0-工作台-“备案单证目录”列表“详情”按钮
export async function queryBadzMlSjtj(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/gtgn/queryBadzMlSjtj`, { method: 'POST', data: param });
}
// 备案单证2.0-业务匹配-右侧列表删除按钮
export async function deleteBaqkAndDzRelation(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/sjpp/deleteBaqkAndDzRelation`, { method: 'POST', data: param });
}
// 备案单证2.0-业务匹配-右侧列表保存按钮
export async function saveBaqkAndDzRelation(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/sjpp/saveBaqkAndDzRelation`, { method: 'POST', data: param });
}
// 备案单证2.0-装订成册-装订成册备案前置内容
export async function queryTjfs(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/zdcc/queryTjfs`, { method: 'POST', data: param });
}
// 备案单证2.0-装订成册-装订成册备案确认
export async function updateBawcbz(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/zdcc/updateBawcbz`, { method: 'POST', data: param });
}
// 备案单证2.0-装订成册-撤销备案
export async function cxZdcc(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/zdcc/cxZdcc`, { method: 'POST', data: param });
}
// 备案单证2.0-预览
export async function viewBdazFjImage(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/gtgn/viewBdazFjImage`, { method: 'POST', data: param });
}
// 备案单证2.0-资料管理-右侧目录表单详情按钮
export async function queryGdzlkDzWj(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/gdzlk/queryGdzlkDzWj`, { method: 'POST', data: param });
}
// 备案单证2.0-退税申报撤销备案单证数据
export async function chBadzSJ(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/baqk/chBadzSJ`, { method: 'POST', data: param });
}
// 备案单证2.0-文件上传
export async function uploadBadzWjnr(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/gtgn/uploadBadzWjnr`, { method: 'POST', data: param });
}
// 申报业务数据匹配 -- 自动匹配
export async function zdppBadz(param: any) {
  return request(`${API_URL_BASE}/yw/badze/sjpp/zdppBadz`, { method: 'POST', data: param });
}
// 备案基础配置 -- 查看配置管理
export async function queryBadzepz(param: any) {
  return request(`${API_URL_BASE}/yw/badze/pzgl/queryBadzepz`, { method: 'POST', data: param });
}
// 备案基础配置 -- 设置启用状态
export async function updateXybz(param: any) {
  return request(`${API_URL_BASE}/yw/badze/pzgl/updateXybz`, { method: 'POST', data: param });
}
export async function deleteGhhtDatas(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/ghht/deleteGhhtDatas`, { method: 'POST', data: param });
}
export async function deleteWmzhfwhtByIds(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/wmzhfwht/deleteWmzhfwhtByIds`, { method: 'POST', data: param });
}
export async function deleteTydByIds(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/tyd/deleteTydByIds`, { method: 'POST', data: param });
}
export async function deleteYsfpByIds(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/ysfp/deleteYsfpByIds`, { method: 'POST', data: param });
}
export async function deleteWtbgxyByIds(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/wtbgxy/deleteWtbgxyByIds`, { method: 'POST', data: param });
}
export async function deleteDlbgfwfpByIds(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/dlbgfwfp/deleteDlbgfwfpByIds`, { method: 'POST', data: param });
}
export async function deleteQtdzByIds(param?: any) {
  return request(`${API_URL_BASE}/yw/badze/qtdz/deleteQtdzByIds`, { method: 'POST', data: param });
}
