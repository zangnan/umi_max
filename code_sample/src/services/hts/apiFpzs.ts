import { request } from 'umi';
import request1 from 'umi-request';

// ************************************************ 出口发票 ************************************************

// [出口发票-发票概览-未开数据] (3.2.1 未开票外部数据统计)
export async function queryBgdwksj(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fptj/bgdwksj`, { method: 'POST', data: param });
}

// [出口发票-发票概览-发票申请单] (3.2.2 发票申请单数据统计)
export async function queryFpsqdsj(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fptj/fpsqdsj`, { method: 'POST', data: param });
}

// [出口发票-发票概览-已申请数据] (3.2.3 历史开票情况统计)
export async function queryQrkpsj(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fptj/qrkpsj`, { method: 'POST', data: param });
}

// [出口发票-发票概览-发票开具区间统计] (3.2.4 发票开具区间统计)
export async function queryQjlskpsj(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fptj/qjlskpsj`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-税收分类编码查询] (3.3.8 税收分类编码列表查询（按选中报关单号分组）)
export async function ssflbmcx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/ssflbmcx`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-设置税收分类编码] (3.3.9 设置税收分类编码)
export async function ssflbmsz(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/ssflbmsz`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-购买方信息列表查询] (3.3.10 购买方信息列表查询（按选中报关单号分组）)
export async function gmfxxcx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/gmfxxcx`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-设置购买方信息] (3.3.11 设置购买方信息)
export async function gmfxxsz(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/gmfxxsz`, { method: 'POST', data: param });
}

// ]出口发票-按报关单开具-修改购买方名称] (3.3.12 修改报关单购买方)
export async function xbgdkhxx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/xbgdkhxx`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-查询汇率信息] (3.3.13 汇率列表查询)
export async function hlxxcx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/hlxxcx`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-汇率信息查询] (3.3.14 设置汇率)
export async function hlxxsz(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/hlxxsz`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-暂不开票设置] (3.3.15 设置暂不开票)
export async function zbkpztsz(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/zbkpztsz`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-立即开票 统计开票信息] (3.3.16 统计开票信息)
export async function tjkpxx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/tjkpxx`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-查询编辑开票关单信息] (3.3.17 查询可编辑开票的关单信息)
export async function kbjkpbgdcx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/kbjkpbgdcx`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-立即开票数据] (3.3.18 立即开票数据)
export async function scfpsqd(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/scfpsqd`, { method: 'POST', data: param });
}

// 生成发票申请单前，判断是否需要校验登录态
export async function ljkpjy(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/ljkpjy`, { method: 'POST', data: param });
}

// [出口发票-发票管理-下载开票] (3.3.18 校验)
export async function xzkpwjCheck(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpgl/xzkpwjCheck`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-导入税收分类编码] (无) 导入
export async function importssflbm(param?: any) {
  return request1(`${API_URL_BASE}/yw/fpzs/bgdkp/importssflbm`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-导出税收分类编码] (无)
export async function exportssflbm(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/exportssflbm`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-导入购买方信息] (无) 导入
export async function importgmf(param?: any) {
  return request1(`${API_URL_BASE}/yw/fpzs/bgdkp/importgmf`, { method: 'POST', data: param, });
}

// [出口发票-按报关单开具-导出购买方信息] (无)
export async function exportgmf(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/exportgmf`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-获取报关单统计] (无)
export async function tbbgdsjtj(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/tbbgdsjtj`, { method: 'POST', data: param });
}

// [出口发票-按报关单开具-获取报关单数据处理]（无）
export async function tbbgdsjcl(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/tbbgdsjcl`, { method: 'POST', data: param });
}

// 出口发票-按报关单开具 -- 数电票是否允许生成开票
export async function qdfpissckp(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/bgdkp/qdfpissckp`, { method: 'POST', data: param });
}

// [出口发票-导入模板开具-开票申请单明细预览] (3.5.2 开票申请单明细预览)
export async function fpsqdmxcx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/drmbkj/fpsqdmxcx`, { method: 'POST', data: param });
}

// [出口发票-导入模板开具-删除数据] (3.5.3 删除开票申请单)
export async function drmbkjSc(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/drmbkj/scfpsqd`, { method: 'POST', data: param });
}

// [出口发票-导入模板开具 导入立即开票] (3.5.5 导入立即开票) 导入
export async function fpsqdsjdr(param?: any) {
  return request1(`${API_URL_BASE}/yw/fpzs/drmbkj/fpsqdsjdr`, { method: 'POST', data: param });
}

// [出口发票-导入模板开具-保存发票申请单] (3.5.7 采集立即开票)
export async function bcfpsqd(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/drmbkj/bcfpsqd`, { method: 'POST', data: param });
}

// [出口发票-导入模板开具-申请单确认开票] (3.5.8 申请单确认开票)
export async function fpsqdqrkp(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/drmbkj/fpsqdqrkp`, { method: 'POST', data: param });
}

// [出口发票-导入模板开具-查询单据编号 (3.5.9 查询单据编号)
export async function queryDjbh(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/drmbkj/queryDjbh`, { method: 'POST', data: param });
}

// [出口发票-发票申请单-查询申请单明细] (3.6.3 申请单明细查询)
export async function querySqdmxcx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpsqd/sqdmxcx`, { method: 'POST', data: param });
}

// [出口发票-发票申请单-发票申请单调整-开票调整查询] (3.6.4 申请单调整查询)
export async function xzsqdtzmxcx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpsqd/xzsqdtzmxcx`, { method: 'POST', data: param });
}

// [出口发票-发票申请单-调整保存] (3.6.5 申请单调整保存)
export async function xzsqdtzbc(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpsqd/xzsqdtzbc`, { method: 'POST', data: param });
}

// [出口发票-发票申请单-保存] (3.6.6 申请单编辑保存)
export async function saveFpsqdxxbc(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpsqd/sqdbjbc`, { method: 'POST', data: param });
}

// [出口发票-发票申请单-确认开票查询统计信息] (3.6.7 确认开票统计查询)
export async function querySqdqrkptj(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpsqd/sqdqrkptj`, { method: 'POST', data: param });
}

// [出口发票-发票申请单-确认开票] (3.6.8 申请单确认开票)
export async function sqdqrkp(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpsqd/sqdqrkp`, { method: 'POST', data: param });
}

// [出口发票-发票申请单-单据号重排序] (3.6.9 单据序号重排)
export async function sqddjxhcp(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpsqd/djxhcp`, { method: 'POST', data: param });
}

// [出口发票-发票申请单-删除] (3.6.10 删除发票申请单)
export async function sqdSccz(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpsqd/sccz`, { method: 'POST', data: param });
}

//[出口发票-发票管理-发票路径获取] (无)
export async function fpljhq(param: any) {
  return request(`${API_URL_BASE}/dditSaas/khdgj/ckfp/fpljhq`, { method: 'POST', data: param });
}

// [出口发票-发票配置-发票文件回填] (3.7.2 发票文件回填)
export async function fpkjwjht(param?: any) {
  return request1(`${API_URL_BASE}/yw/fpzs/fpgl/fpkjwjht`, { method: 'POST', data: param });
}

// [出口发票-发票配置-设置取消开票] (3.7.3 设置取消开票)
export async function qxkp(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpgl/qxkp`, { method: 'POST', data: param });
}

// [出口发票-发票配置-设置发票红冲] (3.7.4 设置发票冲红)
export async function fpch(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpgl/fpch`, { method: 'POST', data: param });
}

// [出口发票-发票配置-设置发票作废-导出开票 ] (3.7.5 设置发票作废)
export async function fpzfDckp(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpgl/fpzf`, { method: 'POST', data: param });
}

// [出口发票-发票配置-下载开票文件] (3.7.6 下载开票文件)
export async function xzkpwj(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpgl/xzkpwj`, { method: 'POST', data: param });
}

// [出口发票-发票配置-保存基础开票配置和关单开票配置] (3.9.1.2.2/3.9.2.2.2 新增或修改开票配置)
export async function kppzwh(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/kppzwh`, { method: 'POST', data: param });
}

// [出口发票-发票配置-查询销售方配置] (3.9.3.2.1 查询开票销方配置信息)
export async function xsfpzcx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/xsfpzcx`, { method: 'POST', data: param });
}

// [出口发票-发票配置-保存销售方配置] (3.9.3.2.2 新增或修改销售方配置)
export async function xsfpzwh(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/xsfpzwh`, { method: 'POST', data: param });
}

// [出口发票-发票配置-客户管理 删除客户] (3.9.4.2 删除客户信息)
export async function khglsc(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/khglsc`, { method: 'POST', data: param });
}

// [出口发票-发票配置-客户管理 数据导入] (3.9.4.4 导入客户信息)
export async function sjdr(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/sjdr`, { method: 'POST', data: param });
}

// [出口发票-发票配置-客户管理-提取境外收货人] (3.9.4.5 提取境外收货人)
export async function khgltqbgdxx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/khgltqbgdxx`, { method: 'POST', data: param });
}

// [出口发票-发票配置-客户管理-设置客户状态] (3.9.4.6 设置客户状态)
export async function khglszzt(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/khglszzt`, { method: 'POST', data: param });
}

// [出口发票-发票配置-客户管理 新建 校验境外收发货人名称是否唯一] (3.9.4.7 校验购买方名称唯一)
export async function checkghfnsrmc(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/checkghfnsrmc`, { method: 'POST', data: param });
}

// [出口发票-发票配置-客户管理 自动带出购方信息
export async function queryGhfxx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/queryGhfxx`, { method: 'POST', data: param });
}

// [出口发票-发票配置-汇率管理-汇率查询] (3.9.5.1 汇率查询)
export async function hlglcx(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/hlglcx`, { method: 'POST', data: param });
}

// [出口发票-发票配置-汇率管理-保存] (3.9.5.3 汇率保存)
export async function fphlwh(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/fphlwh`, { method: 'POST', data: param });
}

// [出口发票-发票配置-汇率管理-同步退税汇率] (3.9.5.6 同步退税汇率)
export async function tbtshl(param: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/tbtshl`, { method: 'POST', data: param });
}

// [出口发票-发票配置-外销商品管理-删除外销商品管理] (3.9.6.4 删除外销商品)
export async function wxspsc(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/wxspsc`, { method: 'POST', data: param });
}

// [出口发票-发票配置-外销商品管理-赋码查询] (3.9.6.5 外销商品赋码 )
export async function wxspfm(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/wxspfm`, { method: 'POST', data: param });
}

// [出口发票-发票配置-外销商品管理-设置退免税类型] (3.9.6.6 设置商品标志 )
export async function wxspsztmsbz(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/wxspsztmsbz`, { method: 'POST', data: param });
}

// [出口发票-发票配置-外销商品管理-提取商品信息] (3.9.6.7 提取商品信息 )
export async function wxsptqbgdxx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/wxsptqbgdxx`, { method: 'POST', data: param });
}

// [出口发票-发票配置-其他商品配置-删除其他商品] (3.9.7.3 删除其他商品)
export async function qtspsc(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/qtspsc`, { method: 'POST', data: param });
}

// [出口发票-发票配置 其他商品配置 新增其他商品信息，校验商品信息是否已存在] (3.9.7.5 新增商品校验)
export async function qtspwhcheck(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/qtspwhcheck`, { method: 'POST', data: param });
}

// [出口发票-发票配置-其他商品配置-导入其他商品] (3.9.7.6 导入其他商品)
export async function qtspsjdr(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/qtspsjdr`, { method: 'POST', data: param });
} 

// [出口发票-发票配置-备注管理-查询备注业务字段项、基本数据项] (3.9.8.1 备注业务字段项查询 3.9.8.2 备注基本数据项查询)
export async function bzglcx(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/bzglcx`, { method: 'POST', data: param });
}

// [出口发票-发票配置-备注管理-保存 (3.9.8.3 备注字段项更新保存)
export async function bzglwh(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/bzglwh`, { method: 'POST', data: param });
}

// [出口发票-发票配置-贸易性质退税标志设置] (无)
export async function myxzsztsbz(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/myxzpz/sztsbz`, { method: 'POST', data: param });
}
// [出口发票-发票配置-贸易性质处理方式
export async function myxzszClfs(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/myxzpz/szBgdCllxDm`, { method: 'POST', data: param });
}

// 出口发票开具2.0 -2.1.5更新蓝票或作废票发票状态
export async function lzorzfGxzt(param?: any) {
  return request(`${API_URL_BASE}/ckfp2/zxkp/gxlphzfpfpzt`, { method: 'POST', data: param });
}
// 出口发票开具2.0 -2.1.4更新红票发票状态
export async function gxhpfpzt(param?: any) {
  return request(`${API_URL_BASE}/ckfp2/zxkp/gxhpfpzt`, { method: 'POST', data: param });
}
// 出口发票开具2.0-状态跟踪-红票-3.3.4.2.4删除
export async function ztgzHpDelete(param?: any) {
  return request(`${API_URL_BASE}/ckfp2/zxkp/kpztgz/hcsbsc`, { method: 'POST', data: param });
}
// 出口发票开具2.0-通用接口-开票统计
export async function djcsjkptj(param?: any) {
  return request(`${API_URL_BASE}/ckfp2/zxkp/ckfpkj/djcsjkptj`, { method: 'POST', data: param });
}
// 出口发票开具2.0-状态跟踪-作废-3.3.4.3.4删除
export async function ztgzZfDelete(param?: any) {
  return request(`${API_URL_BASE}/ckfp2/zxkp/kpztgz/zfsbsc`, { method: 'POST', data: param });
}
// [出口发票-导入模板开具-开票申请单明细预览] (2.1.12明细数据查询)
export async function fpmxcx2(param?: any) {
  return request(`${API_URL_BASE}/ckfp2/zxkp/ckfpkj/fpmxcx`, { method: 'POST', data: param });
}
// [出口发票-导入模板开具-开票申请单明细预览] (2.1.12明细数据修改)
export async function fpmxbc2(param?: any) {
  return request(`${API_URL_BASE}/ckfp2/zxkp/ckfpkj/fpmxbc`, { method: 'POST', data: param });
}
// 3.2.2.1 批量修改备注
export async function plxg(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fpsqd/plxg`, { method: 'POST', data: param });
}
// 境外收货人唯一性校验(新增接口)
export async function checkjwshrmc(param?: any) {
  return request(`${API_URL_BASE}/yw/fpzs/fppz/checkjwshrmc`, { method: 'POST', data: param });
}
// 保存数电登陆账号
export async function saveFpfwDzswjzh(param?: any) {
  return request(`${API_URL_BASE}/yw/ckfpkj/zxkp/sddl/saveDzswjdlzh`, { method: 'POST', data: param });
}




