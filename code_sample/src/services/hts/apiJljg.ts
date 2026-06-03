import { request } from 'umi';

/**********************************************进料加工 start****************************************************/
// 通用获取下拉树数据
export async function getTreeCode(param?: any) {
  return request(`${API_URL_BASE}/hx/ty/crud/getComboTree`, { method: 'POST', data: param });
}

// 进料加工核销-数据下载-驱动下载
export async function sjxzqdxz(param?: any) {
  return request(`${API_URL_BASE}/yw/jljg/sjxz/qdxz`, { method: 'POST', data: param });
}
// 进料加工核销-数据下载-二维码图片
export async function queryEwmtp(param?: any) {
  return request(`${API_URL_BASE}/yw/jljg/sjxz/getQrCode`, { method: 'POST', data: param });
}

// 进料加工核销-数据下载-数据下载
export async function xzrw(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/sqxz`, { method: 'POST', data: param });
}

// 进料加工核销-数据下载-进度查询-批量删除
export async function sjxzDelrw(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/deleteRw`, { method: 'POST', data: param });
}

// 进料加工核销-数据下载-进度查询-重新下载
export async function sjxzCxxz(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/bgd/sjxzCxxz`, { method: 'POST', data: param });
}
// 进料加工核销-数据下载-进度查询-重新下载
export async function cxxz(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/sjxz/cxxz`, { method: 'POST', data: param });
}

// 进料加工核销-智能分析-查询分析中数据条数
export async function calBgdTjmyj(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/sjxz/bgdtjmyj`, { method: 'POST', data: param });
}
// 进料加工核销-智能分析-查询分析中数据条数
export async function calHzqdTjmyj(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/sjxz/hzqdtjmyj`, { method: 'POST', data: param });
}
// 进料加工核销-数据下载-打印
export async function querySjxzDy(param?: any) {
  return request(`${API_URL_BASE}/yw/jljg/sjxz/queryReport`, { method: 'POST', data: param });
}
// 进料加工核销-免抵退核销表-更新计划分配率导出
export async function gxjhfpldc(param?: any) {
  return request(`${API_URL_BASE}/yw/jljg/mxcj/mdthx/gxjhfpldc`, { method: 'POST', data: param });
}
// 进料加工核销-免抵退核销表-更新计划分配率确认
export async function gxsjfpl(param?: any) {
  return request(`${API_URL_BASE}/yw/jljg/mxcj/mdthx/gxsjfpl`, { method: 'POST', data: param });
}
// 进料加工核销-免抵退核销表-更新计划分配率确认-导出
export async function gxsjfpldc(param?: any) {
  return request(`${API_URL_BASE}/hx/ty/report/excelPostReport/EXCEL_REPORT_JLJG_MDTHX_SJFPL/`, { method: 'POST', data: param});
}
// 进料加工核销-报表打印-common
export async function jljghxBbdyCommon(param?: any) {
  return request(`${API_URL_BASE}/hx/ty/report/printReports`, { method: 'POST', data: param });
}
// 进料加工核销-报关单核注清单打印--批量pdf下载
export async function jljghxSjxzPdfPlxz(param?: any) {
  return request(`${API_URL_BASE}/hx/ty/report/PrintReportsAllSingleBusi`, { method: 'POST', data: param });
}
// 智能分析：列表查询
export async function queryZnfxPager(param?: any) {
  return request(`${API_URL_BASE}/yw/jljg/znfx/queryPager`, { method: 'POST', data: param });
}
// 智能分析-差异分析
export async function znfxCyfx(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/znfx/cyfx`, { method: 'POST', data: param });
}
// 进料加工核销-智能分析-生成明细
export async function znfxscmx(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/znfx/scmx`, { method: 'POST', data: param });
}
// 进料加工核销-共通-查询所属期、申报序号初始值
export async function commonInitJbxx(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/sbcs/ywcsxx/queryCjCsh`, { method: 'POST', data: param });
}

// 进料加工核销-智能分析-查询分析中数据条数
export async function jcycxx(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/sjxz/jcycxx`, { method: 'POST', data: param });
}
// 进料加工核销-智能分析-设置忽略
export async function znfxszhl(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/znfx/szhl`, { method: 'POST', data: param });
}
// 内部台账核对：18位关单列表数据
export async function queryNbtzhd18List(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/jljg/tzhd/queryLeftSzcInfo`, { method: 'POST', data: param });
}
// 内部台账核对：删除
export async function deleteTz(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/jljg/tzhd/deleteTz`, { method: 'POST', data: param });
}
// 内部台账核对：删除
export async function tzhd(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/jljg/tzhd/tzhd`, { method: 'POST', data: param });
}
// 内部台账核对-18位-生成核销明细
export async function nbtzhdscmx18(param: any) {
  return request(`${API_URL_BASE}/yw/sb/jljg/tzhd/schxmx/scsj18`, { method: 'POST', data: param });
}
// 内部台账：导出
export async function exportNbtzhd(param?: any) {
  return request(`${API_URL_BASE}/yw/sb/jljg/tzhd/tzhd/dc18`, { method: 'POST', data: param });
}
// 进料加工核销-免抵退核销表-明细统计导出
export async function mxtjldc(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/mxcj/mdthx/mxtjldc`, { method: 'POST', data: param });
}
// 进料加工核销-重新计算分配率.
export async function cxjsfpl(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/mxcj/mdthx/jssjfpl`, { method: 'POST', data: param });
}
// 免抵退核销表重新计算分配率
export async function recalculateMdthxfpl(param: any) {
  return request(`${API_URL_BASE}/hts/ckts/mdthx/recalculateMdthxfpl`, { method: 'POST', data: param });
}
// 进料加工核销-核销申报数据管理-免抵退核销-分配率校验
export async function queryMdthxFpl(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/ggjy/sjyjy/checkSsqYsb`, { method: 'POST', data: param });
}
// 进料加工核销-免抵退核销表-批量删除
export async function mdthxbplsc(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/mxcj/mdthx/plschxb`, { method: 'POST', data: param });
}
// 进料加工核销-免抵退调整表-批量删除
export async function mdttzbplsc(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/mxcj/yhxtzb/plsctzb`, { method: 'POST', data: param });
}
// 进料加工核销-免抵退调整表-数据合并
export async function mdttzbsjhb(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/mxcj/yhxtzb/sjhbhxb`, { method: 'POST', data: param });
}
// 打印报表下载数据展示
export async function queryReportData(param?: any) {
  return request(`${API_URL_BASE}/yw/bszx/ggfw/cxtj/cxtjDyLb`, { method: 'POST', data: param });
}
// 进料加工核销-申报结果查询-进料加工业务统计查询-查询已核销所属期清单
export async function queryJljgtjcxSsqList(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/hxsjcx/querySsqList`, { method: 'POST', data: param });
}

// 进料加工核销-申报结果查询-进料加工业务统计查询-查询进料加工核销汇总
export async function queryYhxHz(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/hxsjcx/queryYhxHz`, { method: 'POST', data: param });
}
// 进料加工核销-进料加工业务免抵退税核销-根据手账册获取实际分配率，应调免抵退，应调不得免抵，已申报出口额数据
export async function queryYwsjBySzc(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/jljg/Jljghx/queryYwsjBySzc`, { method: 'POST', data: param });
}
// 进料加工-智能分析-重新计算美元额-查询
export async function bgdtjmyjjy(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/znfx/bgdtjmyjjy`, { method: 'POST', data: param });
}
// 进料加工-智能分析-重新计算美元额-保存
export async function btxxbc(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/znfx/btxxbc`, { method: 'POST', data: param });
}
// 进料加工-智能分析-重新计算美元额-补填折算数量-导入
export async function btzssldr(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/znfx/btzssldr`, { method: 'POST', data: param });
}
// 进料加工-智能分析-分析状态码表查询
export async function getCodeFxzt(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/znfx/getCodeFxzt`, { method: 'POST', data: param });
}
// 进料加工-智能分析-分析状态查询
export async function queryFxzSjTs(param: any) {
  return request(`${API_URL_BASE}/yw/jljg/znfx/checkRequryFxzt`, { method: 'POST', data: param });
}
export async function cjxxcx(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/cjxxcx`, { method: 'POST', data: param });
}
export async function plcj(param: any) {
  return request(`${API_URL_BASE}/yw/bszx/mts/hwlw/tssb/plcj`, { method: 'POST', data: param });
}

