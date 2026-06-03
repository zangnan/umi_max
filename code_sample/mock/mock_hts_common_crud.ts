import { Request, Response } from 'express';
import mockjs from 'mockjs';
import getRowData from './mock_row_data';

// 通用crud 删除
async function commonDelete(req: Request, res: Response) {
    // 响应数据
    const returnData = {
        code: '200',
        desc: '成功',
        body: '【mock】删除成功',
    };
    await waitTime(500);
    return res.json(returnData);
}

// 通用crud 表单查询
async function queryForm(req: Request, res: Response) {
    const { body } = req;
    const { key } = body;
    let data = {};
    if (key === 'JLJG_ZXSB_SB_JLJG_MDTHX_G' || key === 'JLJG_ZXSB_SB_JLJG_HGSJTZ_G' || key === 'ZXSB_SB_JLJG_JHFPL_CKMX') {
        data = mockjs.mock({
            uuid: mockjs.mock('@guid'),
            ssq: mockjs.mock('@pick(["2021", "2020"])') + mockjs.mock('@date("MM")'),
            sbxh: mockjs.mock('@integer(12345678, 92345678)'),
            jljgszch: mockjs.mock('@pick(["E", "C", "H", "T"])') + mockjs.mock('@integer(12345678912, 92345678912)'),
            hxqsrq: mockjs.mock('@integer(1579072395000, 1610694795000)'),
            hxjzrq: mockjs.mock('@integer(1610694795000, 1636961251000)'),
            nd: mockjs.mock('@date("yyyy")'),
            jljgsjfpl: mockjs.mock('@float(9, 99, 2, 2)'),
            rmblaj: mockjs.mock('@float(999, 9999999, 2, 2)'),
            ytzmdtse: mockjs.mock('@float(999, 9999999, 2, 2)'),
            mdtsbdmzhdkse: mockjs.mock('@float(999, 9999999, 2, 2)'),
            jljghxsjlyDm: mockjs.mock('@pick(["1", "2", "3", "4"])'),
            bz: mockjs.mock('@pick(["来料加工的成品放弃不作价设备料件放弃", ""])'),
            jckbzDm: mockjs.mock('@pick(["E", "I"])'),
            ckbgdh: mockjs.mock('@pick(["531665584983909600000", "817971066919959600000"])'),
            dlckhwzmhm: '',
            ckrq1: 1622476800000,
            sbckxsemy: mockjs.mock('@float(999, 9999999, 2, 2)'),
            ckxse: mockjs.mock('@float(999, 9999999, 2, 2)'),
            jljgmsjkljzcjsjgmy: mockjs.mock('@float(999, 9999999, 2, 2)'),
            jljgmsjkljzcjsjgrmb: mockjs.mock('@float(999, 9999999, 2, 2)'),
            msjkljhgszgshxfs: mockjs.mock('@float(999, 9999999, 2, 2)'),
            jljgmsjkljzcjsjg: mockjs.mock('@float(999, 9999999, 2, 2)'),
            jgfsDm: mockjs.mock('@pick(["0110", "0130", "0139"])'),
            jgfsmc: mockjs.mock('@pick(["一般贸易", "加工贸易", "补偿贸易", "协定贸易", "边境贸易", "双边贸易", "多边贸易"])'),
            qtxx: mockjs.mock('@pick(["其他信息111111", "其他信息222222222222222"])'),
        });
    } else {
        data = getRowData(key);
    }
    // 响应数据
    const returnData = {
        body: data,
        code: '200',
        desc: '【mock】表单查询成功',
    };
    await waitTime(500);
    return res.json(returnData);
}

// 通用 小计
async function xj(req: Request, res: Response) {
    const result = [
        { uuid: mockjs.mock('@guid'), pjz: 964.8179, zxz: 1, zdz: 15300, zdmc: "应调免抵退", hj: 42451.9895 },
        { uuid: mockjs.mock('@guid'), pjz: 27989.067, zxz: 0.31, zdz: 789789, zdmc: "应调不得免抵", hj: 1231518.95 },
        { uuid: mockjs.mock('@guid'), pjz: 33.8179, zxz: 3.31, zdz: 351, zdmc: "已申报出口额", hj: 311.9895 },
        { uuid: mockjs.mock('@guid'), pjz: 12.8177, zxz: 3.31, zdz: 531, zdmc: "复审应调免抵退", hj: 121.9895 },
        { uuid: mockjs.mock('@guid'), pjz: 32.856, zxz: 3.31, zdz: 231, zdmc: "复审应调不得免抵", hj: 311.9895 },
    ];
    const returnData = {
        code: '200',
        desc: '',
        body: result,
    };
    await waitTime(500);
    return res.json(returnData);
}

// 通用 参数查询
async function queryParams(req: Request, res: Response) {
    const { body } = req;
    const { key } = body;
    let rows: any[] = [];
    for (let i = 0; i < 15; i += 1) {
        if (key === 'JLJG_YCSB_SB_JLJG_YDFKB_JDJBHZ_PARAMS') {
            rows.push(mockjs.mock({
                uuid: mockjs.mock('@guid'),
                sjzjuuid: mockjs.mock('@guid'),
                ydbh: mockjs.mock('@pick("B0805","B0811","B0815","B0828")'),
                mxts: mockjs.mock('@integer(5, 8)'),
                ydjbDm: mockjs.mock('@pick("E","W")'),
                ydyy: mockjs.mock('@pick("所属期填写错误", "未填写《生产企业进料加工业务免抵退税核销表》")'), // 疑点原因
                clfs: mockjs.mock('@pick("检查错误数据重写填写。", "撤回申报数据重新采集《生产企业进料加工业务免抵退税核销表》")'), // 处理方式
            }));
        } else if (key === 'JLJG_YCSB_SB_JLJG_YDFKB_JDMXLB_PARAMSS') {
            rows.push(mockjs.mock({
                uuid: mockjs.mock('@guid'),
                shdxmc: mockjs.mock('@pick("《生产企业出口非自产货物消费税退税申报表》", "《外贸企业出口非自产货物消费税退税申报表》")'),
                sbxh: "0000000" + mockjs.mock('@integer(1, 8)'),
                ydnr: mockjs.mock('@pick(["申报的《生产企业出口非自产货物消费税退税申报表》中（出口退（免）税业务类型代码集合)项为空，不予受理", "申报的《生产企业出口非自产货物消费税退税申报表》中（出口退（免）税业务类型代码集合)项为空"])'),
            }));
        }
    }
    if (key === 'GFCX_CS_ZXSB_FPKJ_KHGLPZ') {
        rows.push({ ghfqyjc: '大连龙图', ghfkhyxmc: '中国银行', ghfdz: '辽宁省大连高新技术产业园区七贤南路115号12A 层', ghfshxydm: '11110200736441124Y', ghfnsrmc: '大连龙图信息技术股份有限公司', ghfyhzh: '111000000000789', khuuid: '1', ghflxdh: '0411-39940613' });
        rows.push({ ghfqyjc: '携程', ghfkhyxmc: '招商银行', ghfdz: '深圳高新技术产业园区七贤南路115号12A 层', ghfshxydm: '33330200736441124Y', ghfnsrmc: '携程计算机技术（上海）有限公司', ghfyhzh: '222000000000789', khuuid: '2', ghflxdh: '0411-39940614' });
        rows.push({ ghfqyjc: '唯品会', ghfkhyxmc: '建设银行', ghfdz: '广州高新技术产业园区七贤南路115号12A 层', ghfshxydm: '55550200736441124Y', ghfnsrmc: '广州唯品会信息科技有限公司', ghfyhzh: '333000000000789', khuuid: '3', ghflxdh: '0411-39940615' });
        rows.push({ ghfqyjc: '盛大', ghfkhyxmc: '工商银行', ghfdz: '上海高新技术产业园区七贤南路115号12A 层', ghfshxydm: '66660200736441124Y', ghfnsrmc: '上海盛大网络发展有限公司', ghfyhzh: '444000000000789', khuuid: '4', ghflxdh: '0411-39940616' });
        rows.push({ ghfqyjc: '云商', ghfkhyxmc: '交通银行', ghfdz: '苏州高新技术产业园区七贤南路115号12A 层', ghfshxydm: '99990200736441124Y', ghfnsrmc: '苏宁云商集团股份有限公司', ghfyhzh: '555000000000789', khuuid: '5', ghflxdh: '0411-39940617' });
    }
    const returnData = {
        code: '200',
        body: rows,
    };
    return res.json(returnData);
}

// 通用crud 列表查询
async function queryPager(req: Request, res: Response) {
    const { body } = req;
    const { key, page } = body;
    let rows: any[] = [];
    if (key === 'CX_BADZ_CS_ZXSB_BADZLXPZ') {
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "010103", "badzlxmc": "外贸企业购货合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "4", "yxbz": "Y", "xybz": "N", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "010201", "badzlxmc": "海运提单", "sjbadzlxDm": "010200", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "5", "yxbz": "Y", "xybz": "N", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "010202", "badzlxmc": "航空运单", "sjbadzlxDm": "010200", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "6", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "010203", "badzlxmc": "铁路运单", "sjbadzlxDm": "010200", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "7", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "010204", "badzlxmc": "货物承运单据", "sjbadzlxDm": "010200", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "8", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "010205", "badzlxmc": "邮政收据", "sjbadzlxDm": "010200", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "9", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "010206", "badzlxmc": "出口企业承付运费的国内运输发票", "sjbadzlxDm": "010200", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "10", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "010207", "badzlxmc": "出口企业承付费用的国际货物运输代理服务费发票", "sjbadzlxDm": "010200", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "11", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "010301", "badzlxmc": "委托报关协议", "sjbadzlxDm": "010300", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "12", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "010302", "badzlxmc": "代理报关服务费发票", "sjbadzlxDm": "010300", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "13", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "020101", "badzlxmc": "出口货物报关单", "sjbadzlxDm": "020100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "14", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "N", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "020102", "badzlxmc": "代理出口货物证明", "sjbadzlxDm": "020100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "15", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "020103", "badzlxmc": "无纸化放行通知书", "sjbadzlxDm": "020100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "16", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "020104", "badzlxmc": "装箱单", "sjbadzlxDm": "020100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "17", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "020201", "badzlxmc": "出口发票", "sjbadzlxDm": "020200", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "18", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "020202", "badzlxmc": "自制出口发票", "sjbadzlxDm": "020200", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "19", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "020203", "badzlxmc": "进项增值税专用发票", "sjbadzlxDm": "020200", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "20", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "020204", "badzlxmc": "代办退税专用发票", "sjbadzlxDm": "020200", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "21", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "030101", "badzlxmc": "收汇凭证", "sjbadzlxDm": "030100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "22", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "sbqyuuid": "D1856A185CEA80D0E055000000000001", "badzlxDm": "021002", "badzlxmc": "yddddddddddddd", "sjbadzlxDm": "020200", "yzjdbz": "Y", "sfkbjbz": "Y", "xh": "23", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "N" });
    } else if (key === 'ZXSB_TZ_RW') {
        // 数据更新
        for (let i = 0; i < 10; i += 1) {
            let n1 = i % 7;
            let n2 = i % 5;
            let n3 = i % 3;
            let flag = '';
            let desc = '';
            let zxjssj = '';
            if (n1 === 0) {
                flag = '';
                desc = '';
            } else if (n2 === 0) {
                flag = 'Y';
                desc = `成功更新${mockjs.mock('@integer(100, 200)')}条报关单明细、${mockjs.mock('@integer(100, 200)')}条进货发票明细`;
                zxjssj = mockjs.mock('@integer(1579072395000, 1610694795000)');
            } else if (n3 === 0) {
                flag = 'N';
                desc = '下载失败，网络连接异常。';
            }
            rows.push(mockjs.mock({
                rwuuid: mockjs.mock('@guid'),
                tzlxmc: n3 === 0 ? '出口报关单明细' : '增值税专用发票明细',
                cxtj: n3 === 0 ? '出口年月：202008-202106' : '开票年月：201912-202010',
                xzdyuuid: n3 === 0 ? 'BGDTZ2211010001' : 'JHFPTZ2211010002',
                cgbz: flag,
                jhwcsj: mockjs.mock('@integer(1579072395000, 1610694795000)'),
                sysj: mockjs.mock('@pick(["5", "20", "40", "60"])'),
                xxnr: desc,
                zxkssj: mockjs.mock('@integer(1579072395000, 1610694795000)'),
                zxjssj,
                jhjssj: mockjs.mock('@integer(1579072395000, 1610694795000)'),
            }));
        }
    } if (key === 'CX_SJFX_WM_TSQK_TSSBQK_XZ_SBBQD') {
        rows = [
            {
                uuid: mockjs.mock('@guid'),
                bdmc: '外贸企业出口退税出口明细申报表',
                sbts: mockjs.mock('@float(1, 99, 0, 0)'),
            },
            {
                uuid: mockjs.mock('@guid'),
                bdmc: '外贸企业出口退税进货明细申报表',
                sbts: mockjs.mock('@float(1, 99, 0, 0)'),
            },
            {
                uuid: mockjs.mock('@guid'),
                bdmc: '海关出口商品代码、名称、退税率调整对应表',
                sbts: mockjs.mock('@float(1, 99, 0, 0)'),
            },
            {
                uuid: mockjs.mock('@guid'),
                bdmc: key === 'ZXSB_TZ_MTS_SBBQD' ? '出口货物收汇申报表' : '出口货物收汇情况表',
                sbts: mockjs.mock('@float(1, 99, 0, 0)'),
            },
            {
                uuid: mockjs.mock('@guid'),
                bdmc: '出口货物不能收汇申报表',
                sbts: mockjs.mock('@float(1, 99, 0, 0)'),
            },
            {
                uuid: mockjs.mock('@guid'),
                bdmc: '外贸企业调整申报',
                sbts: mockjs.mock('@float(1, 99, 0, 0)'),
            },
            {
                uuid: mockjs.mock('@guid'),
                bdmc: '跨境应税行为免退税申报明细表',
                sbts: mockjs.mock('@float(1, 99, 0, 0)'),
            },
        ];
    } else if (key === 'CX_SJFX_SC_TSQK_TSSBQK_XZ_SBBQD') {
        rows = [
            { bdmc: '出口货物劳务免抵退税申报明细表', sbts: 10 },
            { bdmc: '海关出口商品代码、名称、退税率调整对应表', sbts: 6 },
            { bdmc: key === 'ZXSB_TZ_MDT_SBQDMX' ? '出口货物收汇申报表' : '出口货物收汇情况表', sbts: 22 },
            { bdmc: '出口货物不能收汇申报表', sbts: 32 },
            { bdmc: '出口货物离岸价差异原因说明表', sbts: 41 },
            { bdmc: '视同自产进货明细清单', sbts: 45 },
            { bdmc: '国际运输（港澳台运输）免抵退税申报明细表', sbts: 16 },
            { bdmc: '航空国际运输收入清算账单申报明细表', sbts: 21 },
            { bdmc: '国际客运(含香港直通车)运输清算函件明细表', sbts: 5 },
            { bdmc: '中国铁路总公司国际货物运输明细表', sbts: 7 },
            { bdmc: '跨境应税行为免抵退税申报明细表', sbts: 90 },
            { bdmc: '跨境应税行为收讫营业款明细清单', sbts: 10 },
        ];
    } else if (key === 'WBSJ_CKBGD_DQRCKSPKZMKZ_PAGER' || key === 'WBSJ_CKBGD_DQRCKSPKZMTZ_PAGER' || key === 'CX_SAAS_QXGL_QXZGL' || key === 'CX_SAAS_QXGL_QDGL'
        || key === 'CX_SAAS_QXGL_QXZGL_CXGLDQ'
        || key === 'CX_SAAS_QXGL_ZYGL'

    ) {
        for (let i = 0; i < 100; i += 1) {
            rows.push(mockjs.mock({
                uuid: mockjs.mock('@guid'),
                qdDm: mockjs.mock('@guid'),
                ssdq: mockjs.mock('@guid'),
                zyDm2: mockjs.mock('@guid'),
                mrQxzDm: mockjs.mock('@pick(["01010001", "01010002", "01010003"])'),
                mrQxzmc: mockjs.mock('@pick(["单一窗口", "单一窗口1", "单一窗口2"])'),
                zymc2: mockjs.mock('@pick(["地区1", "地区2", "地区3", "地区4"])'),
                cdDm: mockjs.mock('@guid'),
                cdmc: mockjs.mock('@pick(["渠道1", "渠道2", "渠道3", "渠道4"])'),
                xh: mockjs.mock('@pick(["01", "02", "03", "04"])'),
                ssdq1mc: mockjs.mock('@pick(["地区1", "地区2", "地区3", "地区4"])'),
                qdmc: mockjs.mock('@pick(["渠道1", "渠道2", "渠道3", "渠道4"])'),
                dlyzbz: mockjs.mock('@pick(["Y", "N"])'),
                apijcbz: mockjs.mock('@pick(["Y", "N"])'),
                ymjcbz: mockjs.mock('@pick(["Y", "N"])'),
                checkbz: mockjs.mock('@pick(["Y", "N"])'),
                qxzDm: mockjs.mock('@guid'),
                qxzmc: mockjs.mock('@pick(["权限组1", "权限组2", "权限组3", "权限组4"])'),
                qxzms: mockjs.mock('@pick(["权限组描述:SSSSSSSSSSS", "权限组描述:XXXXXXXXXXX"])'),
                yxbz: mockjs.mock('@pick(["Y", "N"])'),
                dqbz1: mockjs.mock('@pick(["Y", "N"])'),
                qdbz3: mockjs.mock('@pick(["Y", "N"])'),
                yhbz: mockjs.mock('@pick(["Y", "N"])'),
                spdmList: [{ ckspDm: '199845454', ckspmc: '独脚架、双脚架、三脚', tsl: '13.00' }, { ckspDm: '76042854166', ckspmc: '卤制品', tsl: '6.00' },],
                ckspDm: mockjs.mock('@pick(["4412991090", "02011000",])'),
                ckspmc: '其他含喹琳或异喹啉环',
                ckrq1: mockjs.mock('@pick(["1670813598000", "1622476800000"])'),
                tzhckspDm: '',
                hgspmc: mockjs.mock('@pick(["整头及半头鲜、冷牛肉", "其他保温瓶", "其他至少有一表层是非", "其他流量阀"])'),
                tzhhgspmc: mockjs.mock('@pick(["整头及半头鲜、冷牛肉", "其他保温瓶", "其他至少有一表层是非", "其他流量阀"])'),
                hgckspmc: mockjs.mock('@pick(["整头及半头鲜、冷牛肉", "其他保温瓶", "其他至少有一表层是非", "其他流量阀"])'),
            }));
        }
    } else if (key === 'WBSJ_CKBGD_DBTHL_QUERY_PAGER') {
        for (let i = 0; i < 7; i += 1) {
            rows.push(mockjs.mock({
                sbqyuuid: mockjs.mock('@guid'),
                hbzmDm: mockjs.mock('@pick(["USD", "CNY"])'),
                hbmc: mockjs.mock('@pick(["美元", "人民币"])'),
                hlrq: mockjs.mock('@pick(["2022-01-01", "2022-11-05", "2022-10-01", "2022-9-30"])'),
                fphlxqgzDm: "11",
                hluuid: mockjs.mock('@pick(["2022-01-01", "2022-11-05", "2022-10-01", "2022-9-30"])') + mockjs.mock('@float(1000, 9000, 0, 0)'),
            }));
        }
    } else if (key === 'SAAS_TSSB_MTS_AIPD_CKMX_CX') {
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E055000000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E02300000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D044000000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E05521000000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E0553000000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E12055000000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E0545000000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E03455000000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E055010000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E055040000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E055660000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E051230000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E66gg0000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E0523400000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E05502350000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E055000070000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E0550005000000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E05523450000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });
        rows.push({ "kyCksl":10,kyDecksl:12.31,kycjsl:100,"uuid": "D1856A185CEA80D0E055034600000001", "glh": "010102", "badzlxmc": "外贸综合服务合同", "sjbadzlxDm": "010100", "yzjdbz": "Y", "sfkbjbz": "N", "xh": "3", "yxbz": "Y", "xybz": "Y", "ckhwbgdbz": "Y", "dlckhwzmbz": "Y", "badzlxyybz": "Y" });

    }else {
        for (let i = 0; i < 30; i += 1) {
            rows.push(getRowData(key));
        }
    }

    let returnData: any = {
        code: '200',
        body: {
            rowCount: 100,
            rows,
            page,
        },
    };
    return res.json(returnData);
}

// 测试数据
async function returnCode(req: Request, res: Response) {
    const { body } = req;
    let returnData;
    if (body.id === 1) {
        returnData = {
        code: '200',
        desc: '【mock】成功',
        };
    } else {
        returnData = {
        code: '500',
        desc: '【mock】失败',
        };
    }
    await waitTime(500);
    return res.json(returnData);
}

// 测试数据：返回200
async function returnCode200(req: Request, res: Response) {
    const returnData = {
        code: '200',
        desc: '【mock】成功',
    };
    await waitTime(500);
    return res.json(returnData);
}

async function cxYhMrQxz(req: Request, res: Response) {
    const returnData = {
        "body": [{
            "mrQxzDm": "01010001",
            "mrQxzmc": "单一窗口"
        },
        {
            "mrQxzDm": "01010002",
            "mrQxzmc": "单一窗口2"
        },
        {
            "mrQxzDm": "01010003",
            "mrQxzmc": "单一窗口3"
        }
        ],
        "code": "200"
    }
    await waitTime(500);
    return res.json(returnData);
}


// 测试数据：返回500
async function returnCode500(req: Request, res: Response) {
    const returnData = {
        code: '500',
        desc: '【mock】失败',
    };
    await waitTime(500);
    return res.json(returnData);
}

// 测试服务器响应时间
const waitTime = (time: number = 100) => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        }, time);
    });
};

async function xhcp(req: Request, res: Response) {
    const returnData = {
        code: '200',
        body: { mdtTs: 1, hxTs: 1 },
    };
    await waitTime(2000);
    return res.json(returnData);
}

async function jyQxzSfcz(req: Request, res: Response) {
    const returnData = {
        "code": "200",
        "msg": "权限组代码已存在"
    };
    await waitTime(2000);
    return res.json(returnData);
}

async function sczydm(req: Request, res: Response) {
    const returnData = {
        "body": {
            "zyDm2": "11100000000",
            "xh": '09',
        },
        "code": "200"
    };
    await waitTime(2000);
    return res.json(returnData);
}

async function cxQxzQdcdlb(req: Request, res: Response) {
    const returnData = {
        "body": [
            {
                "checkedStr": "N",
                "wlxh": "010001",
                "cdDm": "00",
                "children": [
                    {
                        "checkedStr": "N",
                        "cdDm": "0001",
                        "children": [

                        ],
                        "checked": true,
                        "pid": "00",
                        "id": "0001",
                        "title": "未命名",
                        "qxzDm": "030001"
                    }
                ],
                "checked": true,
                "id": "00",
                "title": "工作台",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "02",
                "children": [
                    {
                        "checkedStr": "N",
                        "wlxh": "020001",
                        "cdDm": "0201",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "02",
                        "id": "0201",
                        "title": "下载任务管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "0202",
                        "children": [
                            {
                                "checkedStr": "N",
                                "wlxh": "020002",
                                "cdDm": "020201",
                                "children": [

                                ],
                                "checked": true,
                                "pid": "0202",
                                "id": "020201",
                                "title": "海关数据下载",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "020003",
                                "cdDm": "020202",
                                "children": [

                                ],
                                "checked": true,
                                "pid": "0202",
                                "id": "020202",
                                "title": "受托方已开具代理证明下载",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "020004",
                                "cdDm": "020203",
                                "children": [

                                ],
                                "checked": true,
                                "pid": "0202",
                                "id": "020203",
                                "title": "发票数据下载",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "020005",
                                "cdDm": "020204",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0202",
                                "id": "020204",
                                "title": "税务反馈下载",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020205",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0202",
                                "id": "020205",
                                "title": "税务事项文书下载",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020206",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0202",
                                "id": "020206",
                                "title": "查询台账",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "02",
                        "id": "0202",
                        "title": "数据下载",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "0203",
                        "children": [
                            {
                                "checkedStr": "N",
                                "wlxh": "020006",
                                "cdDm": "020301",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0203",
                                "id": "020301",
                                "title": "出口货物报关单",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "020007",
                                "cdDm": "020302",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0203",
                                "id": "020302",
                                "title": "进口货物报关单",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "020055",
                                "cdDm": "020303",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0203",
                                "id": "020303",
                                "title": "增值税专用缴款书",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "02",
                        "id": "0203",
                        "title": "海关数据查询",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "020008",
                        "cdDm": "0204",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "02",
                        "id": "0204",
                        "title": "受托方已开具代理出口证明查询",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "0205",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "020501",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020030",
                                        "cdDm": "02050101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020501",
                                        "id": "02050101",
                                        "title": "海关加工贸易手册数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020031",
                                        "cdDm": "02050102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020501",
                                        "id": "02050102",
                                        "title": "海关加工贸易账册数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020032",
                                        "cdDm": "02050103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020501",
                                        "id": "02050103",
                                        "title": "海关保税核注清单数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020033",
                                        "cdDm": "02050104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020501",
                                        "id": "02050104",
                                        "title": "海关核销报关单数据",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0205",
                                "id": "020501",
                                "title": "加贸海关数据查询",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020502",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020034",
                                        "cdDm": "02050201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020502",
                                        "id": "02050201",
                                        "title": "税务已核销手册数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020035",
                                        "cdDm": "02050202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020502",
                                        "id": "02050202",
                                        "title": "税务已核销账册数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020036",
                                        "cdDm": "02050203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020502",
                                        "id": "02050203",
                                        "title": "税务已核销报关单数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020037",
                                        "cdDm": "02050204",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020502",
                                        "id": "02050204",
                                        "title": "税务免抵退出口明细数据",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0205",
                                "id": "020502",
                                "title": "加贸反馈数据查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "02",
                        "id": "0205",
                        "title": "加贸数据查询",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "0206",
                        "children": [
                            {
                                "checkedStr": "N",
                                "wlxh": "020009",
                                "cdDm": "020601",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0206",
                                "id": "020601",
                                "title": "增值税发票底账数据",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "02",
                        "id": "0206",
                        "title": "进项发票数据查询",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "0207",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "020701",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020038",
                                        "cdDm": "02070101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070101",
                                        "title": "生产企业出口货物劳务免抵退税申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020039",
                                        "cdDm": "02070102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070102",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020040",
                                        "cdDm": "02070103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070103",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020041",
                                        "cdDm": "02070104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070104",
                                        "title": "出口货物离岸价差异原因说明表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020042",
                                        "cdDm": "02070105",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070105",
                                        "title": "视同自产进货明细清单",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "02070106",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070106",
                                        "title": "先退税后核销企业免抵退税申报附表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020043",
                                        "cdDm": "02070107",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070107",
                                        "title": "国际运输（港澳台运输）免抵退税申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020044",
                                        "cdDm": "02070108",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070108",
                                        "title": "航空国际运输收入清算账单申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020045",
                                        "cdDm": "02070109",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070109",
                                        "title": "国际客运（含香港直通车）旅客、行李包裹运输清算函件明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020046",
                                        "cdDm": "02070110",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070110",
                                        "title": "中国铁路总公司国际货物运输明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020047",
                                        "cdDm": "02070111",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070111",
                                        "title": "跨境应税行为免抵退税申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020048",
                                        "cdDm": "02070112",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070112",
                                        "title": "跨境应税行为收讫营业款明细清单",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020049",
                                        "cdDm": "02070113",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020701",
                                        "id": "02070113",
                                        "title": "免抵退税申报汇总表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0207",
                                "id": "020701",
                                "title": "免抵退税",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020702",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020010",
                                        "cdDm": "02070201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020702",
                                        "id": "02070201",
                                        "title": "外贸企业出口退税出口明细申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020011",
                                        "cdDm": "02070202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020702",
                                        "id": "02070202",
                                        "title": "外贸企业出口退税进货明细申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020012",
                                        "cdDm": "02070203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020702",
                                        "id": "02070203",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020013",
                                        "cdDm": "02070204",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020702",
                                        "id": "02070204",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020014",
                                        "cdDm": "02070205",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020702",
                                        "id": "02070205",
                                        "title": "外贸企业调整申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020015",
                                        "cdDm": "02070206",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020702",
                                        "id": "02070206",
                                        "title": "跨境应税行为免退税申报明细表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0207",
                                "id": "020702",
                                "title": "免退税",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020703",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020016",
                                        "cdDm": "02070301",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020703",
                                        "id": "02070301",
                                        "title": "外贸综合服务企业代办退税申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020017",
                                        "cdDm": "02070302",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020703",
                                        "id": "02070302",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020018",
                                        "cdDm": "02070303",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020703",
                                        "id": "02070303",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020019",
                                        "cdDm": "02070304",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020703",
                                        "id": "02070304",
                                        "title": "代办退税应退税款明细",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0207",
                                "id": "020703",
                                "title": "代办退税",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020704",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "02070401",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020704",
                                        "id": "02070401",
                                        "title": "出口已使用过的设备退税申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "02070402",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020704",
                                        "id": "02070402",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "02070403",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020704",
                                        "id": "02070403",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0207",
                                "id": "020704",
                                "title": "已使用过设备退税",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "020020",
                                "cdDm": "020705",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0207",
                                "id": "020705",
                                "title": "购进自用货物退税",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020706",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0207",
                                "id": "020706",
                                "title": "航天发射",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020707",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "02070701",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020707",
                                        "id": "02070701",
                                        "title": "生产企业出口非自产货物消费税退税申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "02070702",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020707",
                                        "id": "02070702",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "02070703",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020707",
                                        "id": "02070703",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0207",
                                "id": "020707",
                                "title": "出口非自产退消费税",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020708",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020050",
                                        "cdDm": "02070801",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020708",
                                        "id": "02070801",
                                        "title": "进料加工业务统计查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020051",
                                        "cdDm": "02070802",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020708",
                                        "id": "02070802",
                                        "title": "进料加工业务免抵退税核销表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020052",
                                        "cdDm": "02070803",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020708",
                                        "id": "02070803",
                                        "title": "进料加工业务免抵退税核销表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020053",
                                        "cdDm": "02070804",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020708",
                                        "id": "02070804",
                                        "title": "已核销手（账）册海关数据调整表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020054",
                                        "cdDm": "02070805",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020708",
                                        "id": "02070805",
                                        "title": "已核销手（账）册海关数据调整表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0207",
                                "id": "020708",
                                "title": "进料加工核销",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020709",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020021",
                                        "cdDm": "02070901",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070901",
                                        "title": "来料加工免税证明",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020022",
                                        "cdDm": "02070902",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070902",
                                        "title": "来料加工免税核销",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "02070903",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070903",
                                        "title": "准予免税购进卷烟证明",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "02070904",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070904",
                                        "title": "出口卷烟已免税证明",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "02070905",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070905",
                                        "title": "出口卷烟免税核销",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "02070906",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070906",
                                        "title": "免税出口卷烟计划",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020023",
                                        "cdDm": "02070907",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070907",
                                        "title": "代理出口货物证明",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020024",
                                        "cdDm": "02070908",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070908",
                                        "title": "代理进口货物证明",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020025",
                                        "cdDm": "02070909",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070909",
                                        "title": "委托出口货物证明",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020056",
                                        "cdDm": "02070910",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070910",
                                        "title": "出口已补税/未退税证明（外贸）",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020026",
                                        "cdDm": "02070911",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070911",
                                        "title": "出口已补税/未退税证明（生产）",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020027",
                                        "cdDm": "02070912",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070912",
                                        "title": "出口转内销证明",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "02070913",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020709",
                                        "id": "02070913",
                                        "title": "中标证明通知书",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0207",
                                "id": "020709",
                                "title": "证明业务",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020710",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020028",
                                        "cdDm": "02071001",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020710",
                                        "id": "02071001",
                                        "title": "出口信息查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "020029",
                                        "cdDm": "02071002",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "020710",
                                        "id": "02071002",
                                        "title": "进货凭证信息回退",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0207",
                                "id": "020710",
                                "title": "其他申报业务",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020711",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0207",
                                "id": "020711",
                                "title": "税务事项通知书",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "020712",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0207",
                                "id": "020712",
                                "title": "税务事项文书",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "02",
                        "id": "0207",
                        "title": "税务反馈数据查询",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "0208",
                        "children": [
                            {
                                "checkedStr": "N",
                                "wlxh": "120001",
                                "cdDm": "3001",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0208",
                                "id": "3001",
                                "title": "税率查询",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "120002",
                                "cdDm": "3002",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0208",
                                "id": "3002",
                                "title": "业务类型码表查询",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "120003",
                                "cdDm": "3003",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0208",
                                "id": "3003",
                                "title": "关区码表查询",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "120004",
                                "cdDm": "3004",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0208",
                                "id": "3004",
                                "title": "贸易性质码表查询",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "120005",
                                "cdDm": "3005",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0208",
                                "id": "3005",
                                "title": "货币码表查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "02",
                        "id": "0208",
                        "title": "码表查询",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "02",
                "title": "数据管理",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "03",
                "children": [
                    {
                        "checkedStr": "N",
                        "wlxh": "040004",
                        "cdDm": "0301",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "030101",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010100",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010100",
                                        "title": "采集首页",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010101",
                                        "title": "汇率管理",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010102",
                                        "title": "出口货物报关单管理",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010103",
                                        "title": "代理出口货物证明管理",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010104",
                                        "title": "技术出口与服务外包数据管理",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010105",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010105",
                                        "title": "生产企业出口货物劳务免抵退税申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010106",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010106",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010107",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010107",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010108",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010108",
                                        "title": "出口货物离岸价差异原因说明表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010109",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010109",
                                        "title": "视同自产进货明细清单",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010110",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010110",
                                        "title": "先退税后核销企业免抵退税申报附表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010111",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010111",
                                        "title": "国际运输（港澳台运输）免抵退税申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010112",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010112",
                                        "title": "航空国际运输收入清算账单申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010113",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010113",
                                        "title": "国际客运（含香港直通车）旅客、行李包裹运输清算函件明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010114",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010114",
                                        "title": "中国铁路总公司国际货物运输明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010115",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010115",
                                        "title": "跨境应税行为免抵退税申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010116",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030101",
                                        "id": "03010116",
                                        "title": "跨境应税行为收讫营业款明细清单",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0301",
                                "id": "030101",
                                "title": "明细数据采集",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "030102",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0301",
                                "id": "030102",
                                "title": "确认汇总表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "030103",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010301",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030103",
                                        "id": "03010301",
                                        "title": "生产企业出口货物劳务免抵退税申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010302",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030103",
                                        "id": "03010302",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010303",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030103",
                                        "id": "03010303",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010304",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030103",
                                        "id": "03010304",
                                        "title": "出口货物离岸价差异原因说明表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010305",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030103",
                                        "id": "03010305",
                                        "title": "视同自产进货明细清单",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010306",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030103",
                                        "id": "03010306",
                                        "title": "先退税后核销企业免抵退税申报附表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010307",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030103",
                                        "id": "03010307",
                                        "title": "国际运输（港澳台运输）免抵退税申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010308",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030103",
                                        "id": "03010308",
                                        "title": "航空国际运输收入清算账单申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010309",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030103",
                                        "id": "03010309",
                                        "title": "国际客运（含香港直通车）旅客、行李包裹运输清算函件明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010310",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030103",
                                        "id": "03010310",
                                        "title": "中国铁路总公司国际货物运输明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010311",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030103",
                                        "id": "03010311",
                                        "title": "跨境应税行为免抵退税申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03010312",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030103",
                                        "id": "03010312",
                                        "title": "跨境应税行为收讫营业款明细清单",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0301",
                                "id": "030103",
                                "title": "退税申报",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "030104",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0301",
                                "id": "030104",
                                "title": "申报结果查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "03",
                        "id": "0301",
                        "title": "货物劳务及服务退税申报",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "0302",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "030201",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03020101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030201",
                                        "id": "03020101",
                                        "title": "采集首页",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03020102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030201",
                                        "id": "03020102",
                                        "title": "出口已使用过的设备退税申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03020103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030201",
                                        "id": "03020103",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03020104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030201",
                                        "id": "03020104",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0302",
                                "id": "030201",
                                "title": "明细数据采集",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "030202",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03020201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030202",
                                        "id": "03020201",
                                        "title": "出口已使用过的设备退税申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03020202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030202",
                                        "id": "03020202",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03020203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030202",
                                        "id": "03020203",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0302",
                                "id": "030202",
                                "title": "退税申报",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "030203",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0302",
                                "id": "030203",
                                "title": "申报结果查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "03",
                        "id": "0302",
                        "title": "出口已使用过设备退税",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "0304",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "030401",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03040101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030401",
                                        "id": "03040101",
                                        "title": "采集首页",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03040102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030401",
                                        "id": "03040102",
                                        "title": "生产企业出口非自产货物消费税退税申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03040103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030401",
                                        "id": "03040103",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03040104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030401",
                                        "id": "03040104",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0304",
                                "id": "030401",
                                "title": "明细数据采集",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "030402",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03040201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030402",
                                        "id": "03040201",
                                        "title": "生产企业出口非自产货物消费税退税申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03040202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030402",
                                        "id": "03040202",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03040203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030402",
                                        "id": "03040203",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0304",
                                "id": "030402",
                                "title": "退税申报",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "030403",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0304",
                                "id": "030403",
                                "title": "申报结果查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "03",
                        "id": "0304",
                        "title": "出口非自产消费税退税",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "03",
                "title": "退税申报（生产）（电局）",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "04",
                "children": [
                    {
                        "checkedStr": "N",
                        "wlxh": "040001",
                        "cdDm": "0401",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "040101",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040101",
                                        "id": "04010101",
                                        "title": "智能配单首页",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040101",
                                        "id": "04010102",
                                        "title": "汇率管理",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040101",
                                        "id": "04010103",
                                        "title": "出口货物报关单管理",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040101",
                                        "id": "04010104",
                                        "title": "增值税专用发票管理",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010105",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040101",
                                        "id": "04010105",
                                        "title": "代理货物证明管理",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010106",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040101",
                                        "id": "04010106",
                                        "title": "报关单逐项配单",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010107",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040101",
                                        "id": "04010107",
                                        "title": "发票逐项配单",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010108",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040101",
                                        "id": "04010108",
                                        "title": "智能配单",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010109",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040101",
                                        "id": "04010109",
                                        "title": "代理证明数据配单",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010110",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040101",
                                        "id": "04010110",
                                        "title": "商品品名分类配单",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0401",
                                "id": "040101",
                                "title": "智能配单",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "040102",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040102",
                                        "id": "04010201",
                                        "title": "采集首页",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040102",
                                        "id": "04010202",
                                        "title": "外贸企业出口退税出口明细申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040102",
                                        "id": "04010203",
                                        "title": "外贸企业出口退税进货明细申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010204",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040102",
                                        "id": "04010204",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010205",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040102",
                                        "id": "04010205",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010206",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040102",
                                        "id": "04010206",
                                        "title": "外贸企业调整申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010207",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040102",
                                        "id": "04010207",
                                        "title": "跨境应税行为免退税申报明细表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0401",
                                "id": "040102",
                                "title": "明细数据采集",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "040104",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010401",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040104",
                                        "id": "04010401",
                                        "title": "外贸企业出口退税出口明细申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010402",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040104",
                                        "id": "04010402",
                                        "title": "外贸企业出口退税进货明细申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010403",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040104",
                                        "id": "04010403",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010404",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040104",
                                        "id": "04010404",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010405",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040104",
                                        "id": "04010405",
                                        "title": "外贸企业调整申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04010406",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040104",
                                        "id": "04010406",
                                        "title": "跨境应税行为免退税申报明细表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0401",
                                "id": "040104",
                                "title": "退税申报",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "040105",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0401",
                                "id": "040105",
                                "title": "申报结果查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "04",
                        "id": "0401",
                        "title": "货物劳务及服务退税申报",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "040002",
                        "cdDm": "0403",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "040301",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040301",
                                        "id": "04030101",
                                        "title": "智能配单首页",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040301",
                                        "id": "04030102",
                                        "title": "汇率管理",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040301",
                                        "id": "04030103",
                                        "title": "出口货物报关单管理",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040301",
                                        "id": "04030104",
                                        "title": "增值税专用发票管理",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030105",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040301",
                                        "id": "04030105",
                                        "title": "报关单逐项配单",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030106",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040301",
                                        "id": "04030106",
                                        "title": "商品品名分类配单",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0403",
                                "id": "040301",
                                "title": "智能配单",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "040302",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040302",
                                        "id": "04030201",
                                        "title": "采集首页",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040302",
                                        "id": "04030202",
                                        "title": "外贸综合服务企业代办退税申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040302",
                                        "id": "04030203",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030204",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040302",
                                        "id": "04030204",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0403",
                                "id": "040302",
                                "title": "明细数据采集",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "040303",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030301",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040303",
                                        "id": "04030301",
                                        "title": "外贸综合服务企业代办退税申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030302",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040303",
                                        "id": "04030302",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04030303",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040303",
                                        "id": "04030303",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0403",
                                "id": "040303",
                                "title": "退税申报",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "040304",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0403",
                                "id": "040304",
                                "title": "申报结果查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "04",
                        "id": "0403",
                        "title": "外贸综合服务企业代办退税申报表",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "0404",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "040401",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04040101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040401",
                                        "id": "04040101",
                                        "title": "采集首页",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04040102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040401",
                                        "id": "04040102",
                                        "title": "出口已使用过的设备退税申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04040103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040401",
                                        "id": "04040103",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04040104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040401",
                                        "id": "04040104",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0404",
                                "id": "040401",
                                "title": "明细数据采集",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "040402",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04040201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040402",
                                        "id": "04040201",
                                        "title": "出口已使用过的设备退税申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04040202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040402",
                                        "id": "04040202",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04040203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040402",
                                        "id": "04040203",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0404",
                                "id": "040402",
                                "title": "退税申报",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "040403",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0404",
                                "id": "040403",
                                "title": "申报结果查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "04",
                        "id": "0404",
                        "title": "出口已使用过设备退税",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "0406",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "040601",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0406",
                                "id": "040601",
                                "title": "明细数据采集",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "040602",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04060201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040602",
                                        "id": "04060201",
                                        "title": "航天发射业务免退税",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0406",
                                "id": "040602",
                                "title": "退税申报",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "040603",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0406",
                                "id": "040603",
                                "title": "申报结果查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "04",
                        "id": "0406",
                        "title": "航天发射业务免退税",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "04",
                "title": "退税申报（外贸）（电局）",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "09",
                "children": [
                    {
                        "checkedStr": "N",
                        "wlxh": "030001",
                        "cdDm": "0901",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "09",
                        "id": "0901",
                        "title": "发票概览",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "030002",
                        "cdDm": "0902",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "09",
                        "id": "0902",
                        "title": "报关单管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "030003",
                        "cdDm": "0903",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "09",
                        "id": "0903",
                        "title": "按报关单开具",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "030004",
                        "cdDm": "0904",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "09",
                        "id": "0904",
                        "title": "按报关单开具",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "030005",
                        "cdDm": "0905",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "09",
                        "id": "0905",
                        "title": "导入模板开具",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "030006",
                        "cdDm": "0906",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "09",
                        "id": "0906",
                        "title": "发票申请单",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "030007",
                        "cdDm": "0907",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "09",
                        "id": "0907",
                        "title": "发票管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "0908",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "09",
                        "id": "0908",
                        "title": "发票配置",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "0909",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "09",
                        "id": "0909",
                        "title": "发票管理(vTax)",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "09",
                "title": "出口发票开具",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "10",
                "children": [
                    {
                        "checkedStr": "N",
                        "cdDm": "1001",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "100101",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1001",
                                "id": "100101",
                                "title": "数据下载",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "100102",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1001",
                                "id": "100102",
                                "title": "进度查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "10",
                        "id": "1001",
                        "title": "数据下载管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "050001",
                        "cdDm": "1002",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "10",
                        "id": "1002",
                        "title": "单证管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1003",
                        "children": [
                            {
                                "checkedStr": "N",
                                "wlxh": "050002",
                                "cdDm": "100301",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1003",
                                "id": "100301",
                                "title": "单证备案",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "050003",
                                "cdDm": "100302",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1003",
                                "id": "100302",
                                "title": "资料采集",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "10",
                        "id": "1003",
                        "title": "单证备案",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "050004",
                        "cdDm": "1004",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "10",
                        "id": "1004",
                        "title": "资料归档",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1005",
                        "children": [
                            {
                                "checkedStr": "N",
                                "wlxh": "050005",
                                "cdDm": "100501",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1005",
                                "id": "100501",
                                "title": "按报关单调阅",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "050006",
                                "cdDm": "100502",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1005",
                                "id": "100502",
                                "title": "按所属期调阅",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "10",
                        "id": "1005",
                        "title": "资料调阅",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1006",
                        "children": [
                            {
                                "checkedStr": "N",
                                "wlxh": "050007",
                                "cdDm": "100601",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1006",
                                "id": "100601",
                                "title": "核查任务",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "050008",
                                "cdDm": "100602",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1006",
                                "id": "100602",
                                "title": "任务详情",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "10",
                        "id": "1006",
                        "title": "核查调阅",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1007",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "10",
                        "id": "1007",
                        "title": "备案设置",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "10",
                "title": "备案单证",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "11",
                "children": [
                    {
                        "checkedStr": "N",
                        "cdDm": "1101",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "110101",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1101",
                                "id": "110101",
                                "title": "数据下载",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "110102",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1101",
                                "id": "110102",
                                "title": "进度查询",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "110103",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "11010301",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "110103",
                                        "id": "11010301",
                                        "title": "加工贸易手册数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "11010302",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "110103",
                                        "id": "11010302",
                                        "title": "加工贸易账册数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "11010303",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "110103",
                                        "id": "11010303",
                                        "title": "保税核注清单数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "11010304",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "110103",
                                        "id": "11010304",
                                        "title": "核销报关单数据",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "1101",
                                "id": "110103",
                                "title": "加贸海关数据查询",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "110104",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "11010401",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "110104",
                                        "id": "11010401",
                                        "title": "已核销手册数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "11010402",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "110104",
                                        "id": "11010402",
                                        "title": "已核销账册数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "11010403",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "110104",
                                        "id": "11010403",
                                        "title": "已核销报关单数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "11010404",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "110104",
                                        "id": "11010404",
                                        "title": "免抵退出口明细数据",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "1101",
                                "id": "110104",
                                "title": "加贸反馈数据查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "11",
                        "id": "1101",
                        "title": "数据下载管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "110001",
                        "cdDm": "1102",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "11",
                        "id": "1102",
                        "title": "智能分析",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "110002",
                        "cdDm": "1103",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "11",
                        "id": "1103",
                        "title": "内部台账",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "110003",
                        "cdDm": "1104",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "11",
                        "id": "1104",
                        "title": "核销申报数据管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1105",
                        "children": [
                            {
                                "checkedStr": "N",
                                "wlxh": "110004",
                                "cdDm": "110501",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1105",
                                "id": "110501",
                                "title": "进料加工业务免抵退税核销表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "110005",
                                "cdDm": "110502",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1105",
                                "id": "110502",
                                "title": "已核销手（账）册海关数据调整表",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "11",
                        "id": "1105",
                        "title": "核销数据申报",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "110006",
                        "cdDm": "1106",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "11",
                        "id": "1106",
                        "title": "申报进度查询",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "110007",
                        "cdDm": "1107",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "11",
                        "id": "1107",
                        "title": "核销数据查询",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1108",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "11",
                        "id": "1108",
                        "title": "核销数据查询",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1109",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "11",
                        "id": "1109",
                        "title": "核销数据查询",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1110",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "11",
                        "id": "1110",
                        "title": "核销数据查询",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1111",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "11",
                        "id": "1111",
                        "title": "核销数据查询",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "11",
                "title": "进料加工核销",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "15",
                "children": [

                ],
                "checked": false,
                "id": "15",
                "title": "智能配单Iframe",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "16",
                "children": [
                    {
                        "checkedStr": "N",
                        "cdDm": "1601",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "16",
                        "id": "1601",
                        "title": "免退税申报（外贸）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1602",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "16",
                        "id": "1602",
                        "title": "外综服代办退税申报（外贸）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1603",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "16",
                        "id": "1603",
                        "title": "出口已使用过设备退税（外贸）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1604",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "16",
                        "id": "1604",
                        "title": "购进自用货物退税（外贸）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1605",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "16",
                        "id": "1605",
                        "title": "航天发射业务免退税（外贸）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1606",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "16",
                        "id": "1606",
                        "title": "出口货物报关单管理（外贸）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1607",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "16",
                        "id": "1607",
                        "title": "增值税专用发票管理（外贸）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1608",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "16",
                        "id": "1608",
                        "title": "报关单逐项配单",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1609",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "16",
                        "id": "1609",
                        "title": "发票逐项配单",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "16",
                "title": "LayUI退税申报（外贸）",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "17",
                "children": [
                    {
                        "checkedStr": "N",
                        "cdDm": "1701",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "17",
                        "id": "1701",
                        "title": "免抵退税申报（生产）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1702",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "17",
                        "id": "1702",
                        "title": "出口已使用过设备退税（生产）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1703",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "17",
                        "id": "1703",
                        "title": "购进自用货物退税（生产）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1704",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "17",
                        "id": "1704",
                        "title": "出口非自产消费税退税（生产）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1705",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "17",
                        "id": "1705",
                        "title": "出口货物报关单管理（生产）",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "17",
                "title": "LayUI退税申报（生产）",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "18",
                "children": [
                    {
                        "checkedStr": "N",
                        "cdDm": "1801",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "180101",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1801",
                                "id": "180101",
                                "title": "来料加工免税证明",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "180102",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1801",
                                "id": "180102",
                                "title": "来料加工免税证明核销",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "18",
                        "id": "1801",
                        "title": "来料加工免税证明申请表",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1802",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "180201",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1802",
                                "id": "180201",
                                "title": "准予免税购进卷烟证明",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "180202",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1802",
                                "id": "180202",
                                "title": "出口烟卷已免税证明（生产）",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "180203",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1802",
                                "id": "180203",
                                "title": "出口烟卷免税核销申请",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "18",
                        "id": "1802",
                        "title": "免税出口卷烟管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1803",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "18",
                        "id": "1803",
                        "title": "代理出口货物证明",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1804",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "18",
                        "id": "1804",
                        "title": "代理进口货物证明",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1805",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "18",
                        "id": "1805",
                        "title": "委托出口货物证明",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1806",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "18",
                        "id": "1806",
                        "title": "出口货物转内销证明（外贸）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1807",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "18",
                        "id": "1807",
                        "title": "出口货物退运证明（外贸）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1808",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "18",
                        "id": "1808",
                        "title": "出口货物退运证明（生产）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1809",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "18",
                        "id": "1809",
                        "title": "中标证明通知书",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1810",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "18",
                        "id": "1810",
                        "title": "补办出口退免税证明",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1811",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "18",
                        "id": "1811",
                        "title": "作废出口退免税证明",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "18",
                "title": "LayUI证明申报",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "19",
                "children": [
                    {
                        "checkedStr": "N",
                        "cdDm": "1901",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "190101",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1901",
                                "id": "190101",
                                "title": "出口退免税备案变更",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "190102",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1901",
                                "id": "190102",
                                "title": "出口退免税备案撤回",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "19",
                        "id": "1901",
                        "title": "出口退（免）税备案管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1902",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "190201",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1902",
                                "id": "190201",
                                "title": "代办退税备案",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "190202",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1902",
                                "id": "190202",
                                "title": "代办退税备案撤回",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "19",
                        "id": "1902",
                        "title": "代办退税备案管理（生产）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1903",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "190301",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1903",
                                "id": "190301",
                                "title": "出口放弃退免税声明",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "190302",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1903",
                                "id": "190302",
                                "title": "出口放弃免税权声明",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "190303",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "1903",
                                "id": "190303",
                                "title": "恢复出口退免税声明",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "19",
                        "id": "1903",
                        "title": "放弃退（免）税备案",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1904",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "19",
                        "id": "1904",
                        "title": "集团公司成员企业备案",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1905",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "19",
                        "id": "1905",
                        "title": "边贸代理备案",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1906",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "19",
                        "id": "1906",
                        "title": "先退税后核销资格申请（生产）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "1907",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "19",
                        "id": "1907",
                        "title": "出口退税业务提醒信息",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "19",
                "title": "LayUI资格备案",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "20",
                "children": [
                    {
                        "checkedStr": "N",
                        "cdDm": "2001",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "200101",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2001",
                                "id": "200101",
                                "title": "一类出口企业评定申请",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "200102",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2001",
                                "id": "200102",
                                "title": "出口企业分类管理复评申请",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "20",
                        "id": "2001",
                        "title": "出口企业分类管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2002",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "20",
                        "id": "2002",
                        "title": "出口信息查询申请",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2003",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "20",
                        "id": "2003",
                        "title": "企业撤回申报数据申请（外贸）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2004",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "20",
                        "id": "2004",
                        "title": "企业撤回申报数据申请（生产）",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2005",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "20",
                        "id": "2005",
                        "title": "进货凭证信息回退",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "20",
                "title": "LayUI其他申报",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "21",
                "children": [
                    {
                        "checkedStr": "N",
                        "cdDm": "2101",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "21",
                        "id": "2101",
                        "title": "用户管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2102",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "21",
                        "id": "2102",
                        "title": "企业管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2103",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "21",
                        "id": "2103",
                        "title": "角色管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2104",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "21",
                        "id": "2104",
                        "title": "菜单管理",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "21",
                "title": "权限管理",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "22",
                "children": [
                    {
                        "checkedStr": "N",
                        "wlxh": "100001",
                        "cdDm": "2201",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "22",
                        "id": "2201",
                        "title": "退税汇率管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2202",
                        "children": [
                            {
                                "checkedStr": "N",
                                "wlxh": "100002",
                                "cdDm": "220201",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2202",
                                "id": "220201",
                                "title": "受托/委托企业信息管理",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "100003",
                                "cdDm": "220202",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2202",
                                "id": "220202",
                                "title": "外商管理",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "22",
                        "id": "2202",
                        "title": "客户信息管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "100004",
                        "cdDm": "2203",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "22",
                        "id": "2203",
                        "title": "发票配置管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "100005",
                        "cdDm": "2204",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "22",
                        "id": "2204",
                        "title": "单证备案配置管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "100006",
                        "cdDm": "2205",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "22",
                        "id": "2205",
                        "title": "监管方式码表管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2206",
                        "children": [
                            {
                                "checkedStr": "N",
                                "wlxh": "100007",
                                "cdDm": "220601",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2206",
                                "id": "220601",
                                "title": "海关IC卡管理",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "100008",
                                "cdDm": "220602",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2206",
                                "id": "220602",
                                "title": "解除禁用海关IC卡",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "100009",
                                "cdDm": "220603",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2206",
                                "id": "220603",
                                "title": "海关IC卡操作日志",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "22",
                        "id": "2206",
                        "title": "海关IC卡管理",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "22",
                "title": "配置管理",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "23",
                "children": [
                    {
                        "checkedStr": "N",
                        "wlxh": "090001",
                        "cdDm": "2301",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "23",
                        "id": "2301",
                        "title": "数据更新",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2302",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "230201",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090002",
                                        "cdDm": "23020101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230201",
                                        "id": "23020101",
                                        "title": "分月汇总",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090003",
                                        "cdDm": "23020102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230201",
                                        "id": "23020102",
                                        "title": "分商品出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090004",
                                        "cdDm": "23020103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230201",
                                        "id": "23020103",
                                        "title": "分国别出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090005",
                                        "cdDm": "23020104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230201",
                                        "id": "23020104",
                                        "title": "分口岸出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090006",
                                        "cdDm": "23020105",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230201",
                                        "id": "23020105",
                                        "title": "分监管方式出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090007",
                                        "cdDm": "23020106",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230201",
                                        "id": "23020106",
                                        "title": "分运输方式出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090008",
                                        "cdDm": "23020107",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230201",
                                        "id": "23020107",
                                        "title": "合同出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090009",
                                        "cdDm": "23020108",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230201",
                                        "id": "23020108",
                                        "title": "分境外收货人出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090010",
                                        "cdDm": "23020109",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230201",
                                        "id": "23020109",
                                        "title": "出口退税率分布",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2302",
                                "id": "230201",
                                "title": "出口情况",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "230202",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090011",
                                        "cdDm": "23020201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230202",
                                        "id": "23020201",
                                        "title": "增值税专用发票明细",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090012",
                                        "cdDm": "23020202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230202",
                                        "id": "23020202",
                                        "title": "未申报增值税专用发票明细",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090013",
                                        "cdDm": "23020203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230202",
                                        "id": "23020203",
                                        "title": "发票退税情况分月汇总",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090014",
                                        "cdDm": "23020204",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230202",
                                        "id": "23020204",
                                        "title": "供应商发票退税情况",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2302",
                                "id": "230202",
                                "title": "发票退税情况",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "230203",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090015",
                                        "cdDm": "23020301",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230203",
                                        "id": "23020301",
                                        "title": "出口报关单明细",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090016",
                                        "cdDm": "23020302",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230203",
                                        "id": "23020302",
                                        "title": "未申报出口报关单明细",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090017",
                                        "cdDm": "23020303",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230203",
                                        "id": "23020303",
                                        "title": "报关单退税情况分月汇总",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090018",
                                        "cdDm": "23020304",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230203",
                                        "id": "23020304",
                                        "title": "出口合同退税情况汇总",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2302",
                                "id": "230203",
                                "title": "报关单退税情况",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "230204",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090019",
                                        "cdDm": "23020401",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230204",
                                        "id": "23020401",
                                        "title": "退税申报情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090020",
                                        "cdDm": "23020402",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230204",
                                        "id": "23020402",
                                        "title": "分商品退税情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090021",
                                        "cdDm": "23020403",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230204",
                                        "id": "23020403",
                                        "title": "供应商退税情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090022",
                                        "cdDm": "23020404",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230204",
                                        "id": "23020404",
                                        "title": "不予退税明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "23020405",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230204",
                                        "id": "23020405",
                                        "title": "不予退税明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090023",
                                        "cdDm": "23020406",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230204",
                                        "id": "23020406",
                                        "title": "暂不办理明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "23020407",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230204",
                                        "id": "23020407",
                                        "title": "暂不办理明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090024",
                                        "cdDm": "23020408",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230204",
                                        "id": "23020408",
                                        "title": "不予办理明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "23020409",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "230204",
                                        "id": "23020409",
                                        "title": "不予办理明细查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2302",
                                "id": "230204",
                                "title": "退税情况",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "23",
                        "id": "2302",
                        "title": "统计报表",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "23",
                "title": "统计分析（外贸）",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "24",
                "children": [
                    {
                        "checkedStr": "N",
                        "wlxh": "090043",
                        "cdDm": "2401",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "24",
                        "id": "2401",
                        "title": "数据更新",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2402",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "240201",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090025",
                                        "cdDm": "24020101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240201",
                                        "id": "24020101",
                                        "title": "分月汇总",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090026",
                                        "cdDm": "24020102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240201",
                                        "id": "24020102",
                                        "title": "分商品出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090027",
                                        "cdDm": "24020103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240201",
                                        "id": "24020103",
                                        "title": "分国别出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090028",
                                        "cdDm": "24020104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240201",
                                        "id": "24020104",
                                        "title": "分口岸出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090029",
                                        "cdDm": "24020105",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240201",
                                        "id": "24020105",
                                        "title": "分监管方式出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090030",
                                        "cdDm": "24020106",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240201",
                                        "id": "24020106",
                                        "title": "分运输方式出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090031",
                                        "cdDm": "24020107",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240201",
                                        "id": "24020107",
                                        "title": "合同出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090032",
                                        "cdDm": "24020108",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240201",
                                        "id": "24020108",
                                        "title": "分境外收货人出口情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090033",
                                        "cdDm": "24020109",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240201",
                                        "id": "24020109",
                                        "title": "出口退税率分布",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2402",
                                "id": "240201",
                                "title": "出口情况",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "240202",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090034",
                                        "cdDm": "24020201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240202",
                                        "id": "24020201",
                                        "title": "出口报关单明细",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090035",
                                        "cdDm": "24020202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240202",
                                        "id": "24020202",
                                        "title": "未申报出口报关单明细",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090036",
                                        "cdDm": "24020203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240202",
                                        "id": "24020203",
                                        "title": "报关单退税情况分月汇总",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090037",
                                        "cdDm": "24020204",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240202",
                                        "id": "24020204",
                                        "title": "出口合同退税情况汇总",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2402",
                                "id": "240202",
                                "title": "报关单退税情况",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "240203",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090038",
                                        "cdDm": "24020301",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240203",
                                        "id": "24020301",
                                        "title": "退税申报情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090039",
                                        "cdDm": "24020302",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240203",
                                        "id": "24020302",
                                        "title": "分商品退税情况",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090040",
                                        "cdDm": "24020303",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240203",
                                        "id": "24020303",
                                        "title": "不予退税明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "24020304",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240203",
                                        "id": "24020304",
                                        "title": "不予退税明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "24020305",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240203",
                                        "id": "24020305",
                                        "title": "不予退税明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090041",
                                        "cdDm": "24020306",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240203",
                                        "id": "24020306",
                                        "title": "暂不办理明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "24020307",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240203",
                                        "id": "24020307",
                                        "title": "暂不办理明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "24020308",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240203",
                                        "id": "24020308",
                                        "title": "暂不办理明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "090042",
                                        "cdDm": "24020309",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240203",
                                        "id": "24020309",
                                        "title": "不予办理明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "24020310",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240203",
                                        "id": "24020310",
                                        "title": "不予办理明细查询",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "24020311",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "240203",
                                        "id": "24020311",
                                        "title": "不予办理明细查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2402",
                                "id": "240203",
                                "title": "退税情况",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "24",
                        "id": "2402",
                        "title": "统计报表",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "24",
                "title": "统计分析（生产）",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "25",
                "children": [
                    {
                        "checkedStr": "N",
                        "wlxh": "040006",
                        "cdDm": "2501",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "25",
                        "id": "2501",
                        "title": "首页",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2502",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "250201",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040007",
                                        "cdDm": "25020101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250201",
                                        "id": "25020101",
                                        "title": "待处理数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040008",
                                        "cdDm": "25020102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250201",
                                        "id": "25020102",
                                        "title": "无信息数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040009",
                                        "cdDm": "25020103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250201",
                                        "id": "25020103",
                                        "title": "可使用数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040010",
                                        "cdDm": "25020104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250201",
                                        "id": "25020104",
                                        "title": "已使用数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040011",
                                        "cdDm": "25020105",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250201",
                                        "id": "25020105",
                                        "title": "不退税数据",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2502",
                                "id": "250201",
                                "title": "出口报关单管理",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250202",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040012",
                                        "cdDm": "25020201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250202",
                                        "id": "25020201",
                                        "title": "待处理数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040013",
                                        "cdDm": "25020202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250202",
                                        "id": "25020202",
                                        "title": "可使用数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040014",
                                        "cdDm": "25020203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250202",
                                        "id": "25020203",
                                        "title": "已使用数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040015",
                                        "cdDm": "25020204",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250202",
                                        "id": "25020204",
                                        "title": "不退税数据",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2502",
                                "id": "250202",
                                "title": "代理出口货物证明管理",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "25",
                        "id": "2502",
                        "title": "外部数据管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2503",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "250301",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040016",
                                        "cdDm": "25030101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250301",
                                        "id": "25030101",
                                        "title": "生产企业出口货物劳务免抵退税申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040017",
                                        "cdDm": "25030102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250301",
                                        "id": "25030102",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040018",
                                        "cdDm": "25030103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250301",
                                        "id": "25030103",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040019",
                                        "cdDm": "25030104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250301",
                                        "id": "25030104",
                                        "title": "出口货物离岸价差异原因说明表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040020",
                                        "cdDm": "25030105",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250301",
                                        "id": "25030105",
                                        "title": "视同自产进货明细清单",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2503",
                                "id": "250301",
                                "title": "生产企业出口货物劳务免抵退税申报明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250302",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040021",
                                        "cdDm": "25030201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250302",
                                        "id": "25030201",
                                        "title": "国际运输（港澳台运输）免抵退税申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040022",
                                        "cdDm": "25030202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250302",
                                        "id": "25030202",
                                        "title": "航空国际运输收入清算账单申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040023",
                                        "cdDm": "25030203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250302",
                                        "id": "25030203",
                                        "title": "国际客运（含香港直通车）旅客、行李包裹运输清算函件明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040024",
                                        "cdDm": "25030204",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250302",
                                        "id": "25030204",
                                        "title": "中国铁路总公司国际货物运输明细表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2503",
                                "id": "250302",
                                "title": "国际运输（港澳台运输）免抵退税申报明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250303",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040025",
                                        "cdDm": "25030301",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250303",
                                        "id": "25030301",
                                        "title": "跨境应税行为免抵退税申报明细表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040026",
                                        "cdDm": "25030302",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "250303",
                                        "id": "25030302",
                                        "title": "跨境应税行为收讫营业款明细清单",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2503",
                                "id": "250303",
                                "title": "跨境应税行为免抵退税申报明细表",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "25",
                        "id": "2503",
                        "title": "明细采集",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "040027",
                        "cdDm": "2504",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "25",
                        "id": "2504",
                        "title": "确认汇总表",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "040028",
                        "cdDm": "2505",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "250501",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2505",
                                "id": "250501",
                                "title": "生产企业出口货物劳务免抵退税申报明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250502",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2505",
                                "id": "250502",
                                "title": "海关出口商品代码、名称、退税率调整对应表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250503",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2505",
                                "id": "250503",
                                "title": "出口货物收汇情况表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250504",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2505",
                                "id": "250504",
                                "title": "出口货物离岸价差异原因说明表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250505",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2505",
                                "id": "250505",
                                "title": "视同自产进货明细清单",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250506",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2505",
                                "id": "250506",
                                "title": "先退税后核销企业免抵退税申报附表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250507",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2505",
                                "id": "250507",
                                "title": "国际运输（港澳台运输）免抵退税申报明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250508",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2505",
                                "id": "250508",
                                "title": "航空国际运输收入清算账单申报明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250509",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2505",
                                "id": "250509",
                                "title": "国际客运（含香港直通车）旅客、行李包裹运输清算函件明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250510",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2505",
                                "id": "250510",
                                "title": "中国铁路总公司国际货物运输明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250511",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2505",
                                "id": "250511",
                                "title": "跨境应税行为免抵退税申报明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250512",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2505",
                                "id": "250512",
                                "title": "跨境应税行为收讫营业款明细清单",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "25",
                        "id": "2505",
                        "title": "退税申报",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "040029",
                        "cdDm": "2506",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "250601",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2506",
                                "id": "250601",
                                "title": "生产企业出口货物劳务免抵退税申报明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250602",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2506",
                                "id": "250602",
                                "title": "海关出口商品代码、名称、退税率调整对应表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250603",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2506",
                                "id": "250603",
                                "title": "出口货物收汇情况表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250604",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2506",
                                "id": "250604",
                                "title": "出口货物离岸价差异原因说明表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250605",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2506",
                                "id": "250605",
                                "title": "视同自产进货明细清单",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250606",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2506",
                                "id": "250606",
                                "title": "先退税后核销企业免抵退税申报附表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250607",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2506",
                                "id": "250607",
                                "title": "国际运输（港澳台运输）免抵退税申报明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250608",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2506",
                                "id": "250608",
                                "title": "航空国际运输收入清算账单申报明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250609",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2506",
                                "id": "250609",
                                "title": "国际客运（含香港直通车）旅客、行李包裹运输清算函件明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250610",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2506",
                                "id": "250610",
                                "title": "中国铁路总公司国际货物运输明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250611",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2506",
                                "id": "250611",
                                "title": "跨境应税行为免抵退税申报明细表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "250612",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2506",
                                "id": "250612",
                                "title": "跨境应税行为收讫营业款明细清单",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "25",
                        "id": "2506",
                        "title": "申报结果查询",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "25",
                "title": "退税申报（生产）",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "26",
                "children": [
                    {
                        "checkedStr": "N",
                        "wlxh": "040501",
                        "cdDm": "2601",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "26",
                        "id": "2601",
                        "title": "首页",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2602",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "260201",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040502",
                                        "cdDm": "26020101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260201",
                                        "id": "26020101",
                                        "title": "待处理数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040503",
                                        "cdDm": "26020102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260201",
                                        "id": "26020102",
                                        "title": "无信息数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040504",
                                        "cdDm": "26020103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260201",
                                        "id": "26020103",
                                        "title": "可使用数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040505",
                                        "cdDm": "26020104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260201",
                                        "id": "26020104",
                                        "title": "已使用数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040506",
                                        "cdDm": "26020105",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260201",
                                        "id": "26020105",
                                        "title": "不退税数据",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2602",
                                "id": "260201",
                                "title": "出口报关单管理",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260202",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040507",
                                        "cdDm": "26020201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260202",
                                        "id": "26020201",
                                        "title": "待处理数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040508",
                                        "cdDm": "26020202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260202",
                                        "id": "26020202",
                                        "title": "可使用数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040509",
                                        "cdDm": "26020203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260202",
                                        "id": "26020203",
                                        "title": "已使用数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040510",
                                        "cdDm": "26020204",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260202",
                                        "id": "26020204",
                                        "title": "不可退税数据",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2602",
                                "id": "260202",
                                "title": "代理出口货物证明管理",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260203",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040511",
                                        "cdDm": "26020301",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260203",
                                        "id": "26020301",
                                        "title": "可使用数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040512",
                                        "cdDm": "26020302",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260203",
                                        "id": "26020302",
                                        "title": "已使用数据",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2602",
                                "id": "260203",
                                "title": "进项发票管理",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "26",
                        "id": "2602",
                        "title": "外部数据管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2603",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "260301",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040513",
                                        "cdDm": "26030101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260301",
                                        "id": "26030101",
                                        "title": "外贸企业出口退税出口明细申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040514",
                                        "cdDm": "26030102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260301",
                                        "id": "26030102",
                                        "title": "外贸企业出口退税进货明细申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040515",
                                        "cdDm": "26030103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260301",
                                        "id": "26030103",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040516",
                                        "cdDm": "26030104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260301",
                                        "id": "26030104",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2603",
                                "id": "260301",
                                "title": "外贸企业出口退税出口明细申报表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260302",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040517",
                                        "cdDm": "26030201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260302",
                                        "id": "26030201",
                                        "title": "外贸企业调整申报",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2603",
                                "id": "260302",
                                "title": "外贸企业调整申报",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260303",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040518",
                                        "cdDm": "26030301",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "260303",
                                        "id": "26030301",
                                        "title": "跨境应税行为免退税申报明细表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2603",
                                "id": "260303",
                                "title": "跨境应税行为免退税申报明细表",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "26",
                        "id": "2603",
                        "title": "明细采集",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2604",
                        "children": [
                            {
                                "checkedStr": "N",
                                "wlxh": "040519",
                                "cdDm": "260401",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2604",
                                "id": "260401",
                                "title": "报关单逐项配单",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "040520",
                                "cdDm": "260402",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2604",
                                "id": "260402",
                                "title": "发票逐项配单",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "040521",
                                "cdDm": "260403",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2604",
                                "id": "260403",
                                "title": "智能配单",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "040522",
                                "cdDm": "260404",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2604",
                                "id": "260404",
                                "title": "代理出口货物证明配单",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "26",
                        "id": "2604",
                        "title": "数据匹配",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "040523",
                        "cdDm": "2605",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "260501",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2605",
                                "id": "260501",
                                "title": "外贸企业出口退税出口明细申报表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260502",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2605",
                                "id": "260502",
                                "title": "外贸企业出口退税进货明细申报表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260503",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2605",
                                "id": "260503",
                                "title": "海关出口商品代码、名称、退税率调整对应表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260504",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2605",
                                "id": "260504",
                                "title": "出口货物收汇情况表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260505",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2605",
                                "id": "260505",
                                "title": "外贸企业调整申报",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260506",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2605",
                                "id": "260506",
                                "title": "跨境应税行为免退税申报明细表",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "26",
                        "id": "2605",
                        "title": "退税申报",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "040524",
                        "cdDm": "2606",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "260601",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2606",
                                "id": "260601",
                                "title": "外贸企业出口退税出口明细申报表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260602",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2606",
                                "id": "260602",
                                "title": "外贸企业出口退税进货明细申报表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260603",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2606",
                                "id": "260603",
                                "title": "海关出口商品代码、名称、退税率调整对应表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260604",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2606",
                                "id": "260604",
                                "title": "出口货物收汇情况表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260605",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2606",
                                "id": "260605",
                                "title": "外贸企业调整申报",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "260606",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2606",
                                "id": "260606",
                                "title": "跨境应税行为免退税申报明细表",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "26",
                        "id": "2606",
                        "title": "申报结果查询",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "26",
                "title": "退税申报（外贸）",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "27",
                "children": [
                    {
                        "checkedStr": "N",
                        "wlxh": "040701",
                        "cdDm": "2701",
                        "children": [

                        ],
                        "checked": false,
                        "pid": "27",
                        "id": "2701",
                        "title": "首页",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2702",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "270201",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040702",
                                        "cdDm": "27020101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "270201",
                                        "id": "27020101",
                                        "title": "待处理数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040703",
                                        "cdDm": "27020102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "270201",
                                        "id": "27020102",
                                        "title": "无信息数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040704",
                                        "cdDm": "27020103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "270201",
                                        "id": "27020103",
                                        "title": "可使用数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040705",
                                        "cdDm": "27020104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "270201",
                                        "id": "27020104",
                                        "title": "已使用数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040706",
                                        "cdDm": "27020105",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "270201",
                                        "id": "27020105",
                                        "title": "不退税数据",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2702",
                                "id": "270201",
                                "title": "出口报关单管理",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "270202",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040707",
                                        "cdDm": "27020201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "270202",
                                        "id": "27020201",
                                        "title": "可使用数据",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040708",
                                        "cdDm": "27020202",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "270202",
                                        "id": "27020202",
                                        "title": "已使用数据",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2702",
                                "id": "270202",
                                "title": "进项发票管理",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "27",
                        "id": "2702",
                        "title": "外部数据管理",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2703",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "270301",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040709",
                                        "cdDm": "27030101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "270301",
                                        "id": "27030101",
                                        "title": "外贸综合服务企业代办退税申报表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040710",
                                        "cdDm": "27030102",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "270301",
                                        "id": "27030102",
                                        "title": "海关出口商品代码、名称、退税率调整对应表",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "wlxh": "040711",
                                        "cdDm": "27030103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "270301",
                                        "id": "27030103",
                                        "title": "出口货物收汇情况表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "2703",
                                "id": "270301",
                                "title": "外贸综合服务企业代办退税申报表",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "27",
                        "id": "2703",
                        "title": "明细采集",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "2704",
                        "children": [
                            {
                                "checkedStr": "N",
                                "wlxh": "040712",
                                "cdDm": "270401",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2704",
                                "id": "270401",
                                "title": "报关单逐项配单",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "27",
                        "id": "2704",
                        "title": "数据匹配",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "040713",
                        "cdDm": "2705",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "270501",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2705",
                                "id": "270501",
                                "title": "外贸综合服务企业代办退税申报表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "270502",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2705",
                                "id": "270502",
                                "title": "海关出口商品代码、名称、退税率调整对应表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "270503",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2705",
                                "id": "270503",
                                "title": "出口货物收汇情况表",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "27",
                        "id": "2705",
                        "title": "退税申报",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "040714",
                        "cdDm": "2706",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "270601",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2706",
                                "id": "270601",
                                "title": "外贸综合服务企业代办退税申报表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "270602",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2706",
                                "id": "270602",
                                "title": "海关出口商品代码、名称、退税率调整对应表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "270603",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "2706",
                                "id": "270603",
                                "title": "出口货物收汇情况表",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "27",
                        "id": "2706",
                        "title": "申报结果查询",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "27",
                "title": "代办退税",
                "qxzDm": "030001"
            },
            {
                "checkedStr": "N",
                "cdDm": "qt",
                "children": [
                    {
                        "checkedStr": "N",
                        "wlxh": "040005",
                        "cdDm": "0303",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "030301",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0303",
                                "id": "030301",
                                "title": "明细数据采集",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "030302",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "03030201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "030302",
                                        "id": "03030201",
                                        "title": "购进自用货物退税申报表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0303",
                                "id": "030302",
                                "title": "退税申报",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "030303",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0303",
                                "id": "030303",
                                "title": "申报结果查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "qt",
                        "id": "0303",
                        "title": "购进自用货物退税申报表",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "wlxh": "040003",
                        "cdDm": "0405",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "040501",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0405",
                                "id": "040501",
                                "title": "明细数据采集",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "040502",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "04050201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "040502",
                                        "id": "04050201",
                                        "title": "购进自用货物退税申报表",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "0405",
                                "id": "040502",
                                "title": "退税申报",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "040503",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "0405",
                                "id": "040503",
                                "title": "申报结果查询",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "qt",
                        "id": "0405",
                        "title": "购进自用货物退税申报表",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "05",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "0501",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "0501",
                                "title": "来料加工免税证明申请表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "060001",
                                "cdDm": "050101",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "05010101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "050101",
                                        "id": "05010101",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "05010102",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "0501010201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "05010102",
                                                "id": "0501010201",
                                                "title": "来料加工免税证明申请表",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "050101",
                                        "id": "05010102",
                                        "title": "证明申请",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "05010103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "050101",
                                        "id": "05010103",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "050101",
                                "title": "来料加工免税证明申请表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "060002",
                                "cdDm": "050102",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "05010201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "050102",
                                        "id": "05010201",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "05010202",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "0501020201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "05010202",
                                                "id": "0501020201",
                                                "title": "来料加工出口货物免税证明核销申请表",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "050102",
                                        "id": "05010202",
                                        "title": "证明申请",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "05010203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "050102",
                                        "id": "05010203",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "050102",
                                "title": "来料加工出口货物免税证明核销申请表",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "060003",
                                "cdDm": "0503",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050301",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0503",
                                        "id": "050301",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050302",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05030201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "050302",
                                                "id": "05030201",
                                                "title": "代理出口货物证明申请表",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0503",
                                        "id": "050302",
                                        "title": "证明申请",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050303",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0503",
                                        "id": "050303",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "0503",
                                "title": "代理出口货物证明",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "060004",
                                "cdDm": "0504",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050401",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0504",
                                        "id": "050401",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050402",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05040201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "050402",
                                                "id": "05040201",
                                                "title": "代理进口货物证明申请表",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0504",
                                        "id": "050402",
                                        "title": "证明申请",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050403",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0504",
                                        "id": "050403",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "0504",
                                "title": "代理进口货物证明",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "060005",
                                "cdDm": "0505",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050501",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0505",
                                        "id": "050501",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050502",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05050201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "050502",
                                                "id": "05050201",
                                                "title": "委托出口货物证明",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0505",
                                        "id": "050502",
                                        "title": "证明申请",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050503",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0505",
                                        "id": "050503",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "0505",
                                "title": "委托出口货物证明",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "060006",
                                "cdDm": "0506",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050601",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0506",
                                        "id": "050601",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050602",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05060201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "050602",
                                                "id": "05060201",
                                                "title": "出口货物转内销证明申报表（外贸）",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0506",
                                        "id": "050602",
                                        "title": "证明申请",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050603",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0506",
                                        "id": "050603",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "0506",
                                "title": "出口货物转内销证明（外贸）",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "060007",
                                "cdDm": "0507",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050701",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0507",
                                        "id": "050701",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050702",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05070201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "050702",
                                                "id": "05070201",
                                                "title": "未退税证明（外贸）",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0507",
                                        "id": "050702",
                                        "title": "证明申请",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050703",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0507",
                                        "id": "050703",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "0507",
                                "title": "出口货物已补税/未退税证明（外贸）",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "0508",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050801",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0508",
                                        "id": "050801",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050802",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05080201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "050802",
                                                "id": "05080201",
                                                "title": "未退税证明（生产）",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0508",
                                        "id": "050802",
                                        "title": "证明申请",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050803",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0508",
                                        "id": "050803",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "0508",
                                "title": "出口货物已补税/未退税证明（生产）",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "060008",
                                "cdDm": "0509",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050901",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0509",
                                        "id": "050901",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050902",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05090201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "050902",
                                                "id": "05090201",
                                                "title": "关于补办出口退税有关证明的申请",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0509",
                                        "id": "050902",
                                        "title": "证明申请",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "050903",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0509",
                                        "id": "050903",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "0509",
                                "title": "关于补办出口退税有关证明的申请",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "0510",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "051001",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05100101",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "051001",
                                                "id": "05100101",
                                                "title": "明细数据采集",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05100102",
                                                "children": [
                                                    {
                                                        "checkedStr": "N",
                                                        "cdDm": "0510010201",
                                                        "children": [

                                                        ],
                                                        "checked": false,
                                                        "pid": "05100102",
                                                        "id": "0510010201",
                                                        "title": "准予免税购进卷烟证明",
                                                        "qxzDm": "030001"
                                                    }
                                                ],
                                                "checked": false,
                                                "pid": "051001",
                                                "id": "05100102",
                                                "title": "证明申请",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05100103",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "051001",
                                                "id": "05100103",
                                                "title": "申报结果查询",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0510",
                                        "id": "051001",
                                        "title": "准予免税购进卷烟证明",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "051002",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05100201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "051002",
                                                "id": "05100201",
                                                "title": "明细数据采集",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05100202",
                                                "children": [
                                                    {
                                                        "checkedStr": "N",
                                                        "cdDm": "0510020201",
                                                        "children": [

                                                        ],
                                                        "checked": false,
                                                        "pid": "05100202",
                                                        "id": "0510020201",
                                                        "title": "出口烟卷已免税证明（生产）",
                                                        "qxzDm": "030001"
                                                    }
                                                ],
                                                "checked": false,
                                                "pid": "051002",
                                                "id": "05100202",
                                                "title": "证明申请",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05100203",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "051002",
                                                "id": "05100203",
                                                "title": "申报结果查询",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0510",
                                        "id": "051002",
                                        "title": "出口烟卷已免税证明（生产）",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "051003",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05100301",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "051003",
                                                "id": "05100301",
                                                "title": "明细数据采集",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05100302",
                                                "children": [
                                                    {
                                                        "checkedStr": "N",
                                                        "cdDm": "0510030201",
                                                        "children": [

                                                        ],
                                                        "checked": false,
                                                        "pid": "05100302",
                                                        "id": "0510030201",
                                                        "title": "出口烟卷免税核销申请",
                                                        "qxzDm": "030001"
                                                    }
                                                ],
                                                "checked": false,
                                                "pid": "051003",
                                                "id": "05100302",
                                                "title": "证明申请",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05100303",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "051003",
                                                "id": "05100303",
                                                "title": "申报结果查询",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0510",
                                        "id": "051003",
                                        "title": "出口烟卷免税核销申请",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "0510",
                                "title": "免税出口卷烟管理",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "0511",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "051101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0511",
                                        "id": "051101",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "051102",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05110201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "051102",
                                                "id": "05110201",
                                                "title": "中标证明通知书",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0511",
                                        "id": "051102",
                                        "title": "证明申请",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "051103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0511",
                                        "id": "051103",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "0511",
                                "title": "中标证明通知书",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "0512",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "051201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0512",
                                        "id": "051201",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "051202",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "05120201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "051202",
                                                "id": "05120201",
                                                "title": "出口退（免）税相关证明作废",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0512",
                                        "id": "051202",
                                        "title": "证明申请",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "051203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0512",
                                        "id": "051203",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "05",
                                "id": "0512",
                                "title": "出口退（免）税相关证明作废",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "qt",
                        "id": "05",
                        "title": "证明申报",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "07",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "0701",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "07",
                                "id": "0701",
                                "title": "出口退（免）税备案管理",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "080001",
                                "cdDm": "070101",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "07010101",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "070101",
                                        "id": "07010101",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "07010102",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "0701010201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "07010102",
                                                "id": "0701010201",
                                                "title": "出口退（免）税备案变更",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "070101",
                                        "id": "07010102",
                                        "title": "数据申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "07010103",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "070101",
                                        "id": "07010103",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "07",
                                "id": "070101",
                                "title": "出口退（免）税备案变更",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "070102",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "07010201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "070102",
                                        "id": "07010201",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "07010202",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "0701020201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "07010202",
                                                "id": "0701020201",
                                                "title": "出口退（免）税备案撤回",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "070102",
                                        "id": "07010202",
                                        "title": "数据申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "07010203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "070102",
                                        "id": "07010203",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "07",
                                "id": "070102",
                                "title": "出口退（免）税备案撤回",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "0702",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070201",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07020101",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070201",
                                                "id": "07020101",
                                                "title": "明细数据采集",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07020102",
                                                "children": [
                                                    {
                                                        "checkedStr": "N",
                                                        "cdDm": "0702010201",
                                                        "children": [

                                                        ],
                                                        "checked": false,
                                                        "pid": "07020102",
                                                        "id": "0702010201",
                                                        "title": "代办退税情况备案表",
                                                        "qxzDm": "030001"
                                                    }
                                                ],
                                                "checked": false,
                                                "pid": "070201",
                                                "id": "07020102",
                                                "title": "数据申报",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07020103",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070201",
                                                "id": "07020103",
                                                "title": "申报结果查询",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0702",
                                        "id": "070201",
                                        "title": "代办退税备案",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070202",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07020201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070202",
                                                "id": "07020201",
                                                "title": "明细数据采集",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07020202",
                                                "children": [
                                                    {
                                                        "checkedStr": "N",
                                                        "cdDm": "0702020201",
                                                        "children": [

                                                        ],
                                                        "checked": false,
                                                        "pid": "07020202",
                                                        "id": "0702020201",
                                                        "title": "代办退税备案撤回",
                                                        "qxzDm": "030001"
                                                    }
                                                ],
                                                "checked": false,
                                                "pid": "070202",
                                                "id": "07020202",
                                                "title": "数据申报",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07020203",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070202",
                                                "id": "07020203",
                                                "title": "申报结果查询",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0702",
                                        "id": "070202",
                                        "title": "代办退税备案撤回",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "07",
                                "id": "0702",
                                "title": "代办退税备案管理",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "0703",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070301",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07030101",
                                                "children": [
                                                    {
                                                        "checkedStr": "N",
                                                        "cdDm": "0703010101",
                                                        "children": [

                                                        ],
                                                        "checked": false,
                                                        "pid": "07030101",
                                                        "id": "0703010101",
                                                        "title": "出口货物劳务放弃退（免）税声明",
                                                        "qxzDm": "030001"
                                                    },
                                                    {
                                                        "checkedStr": "N",
                                                        "cdDm": "0703010102",
                                                        "children": [

                                                        ],
                                                        "checked": false,
                                                        "pid": "07030101",
                                                        "id": "0703010102",
                                                        "title": "放弃适用增值税零税率声明",
                                                        "qxzDm": "030001"
                                                    }
                                                ],
                                                "checked": false,
                                                "pid": "070301",
                                                "id": "07030101",
                                                "title": "明细数据采集",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07030102",
                                                "children": [
                                                    {
                                                        "checkedStr": "N",
                                                        "cdDm": "0703010201",
                                                        "children": [

                                                        ],
                                                        "checked": false,
                                                        "pid": "07030102",
                                                        "id": "0703010201",
                                                        "title": "出口货物劳务放弃退（免）税声明",
                                                        "qxzDm": "030001"
                                                    },
                                                    {
                                                        "checkedStr": "N",
                                                        "cdDm": "0703010202",
                                                        "children": [

                                                        ],
                                                        "checked": false,
                                                        "pid": "07030102",
                                                        "id": "0703010202",
                                                        "title": "放弃适用增值税零税率声明",
                                                        "qxzDm": "030001"
                                                    }
                                                ],
                                                "checked": false,
                                                "pid": "070301",
                                                "id": "07030102",
                                                "title": "数据申报",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07030103",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070301",
                                                "id": "07030103",
                                                "title": "申报结果查询",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0703",
                                        "id": "070301",
                                        "title": "出口放弃退免税声明",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070302",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07030201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070302",
                                                "id": "07030201",
                                                "title": "明细数据采集",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07030202",
                                                "children": [
                                                    {
                                                        "checkedStr": "N",
                                                        "cdDm": "0703020201",
                                                        "children": [

                                                        ],
                                                        "checked": false,
                                                        "pid": "07030202",
                                                        "id": "0703020201",
                                                        "title": "出口放弃免税权声明",
                                                        "qxzDm": "030001"
                                                    }
                                                ],
                                                "checked": false,
                                                "pid": "070302",
                                                "id": "07030202",
                                                "title": "数据申报",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07030203",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070302",
                                                "id": "07030203",
                                                "title": "申报结果查询",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0703",
                                        "id": "070302",
                                        "title": "出口放弃免税权声明",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070303",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07030301",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070303",
                                                "id": "07030301",
                                                "title": "明细数据采集",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07030302",
                                                "children": [
                                                    {
                                                        "checkedStr": "N",
                                                        "cdDm": "0703030201",
                                                        "children": [

                                                        ],
                                                        "checked": false,
                                                        "pid": "07030302",
                                                        "id": "0703030201",
                                                        "title": "恢复出口退免税声明",
                                                        "qxzDm": "030001"
                                                    }
                                                ],
                                                "checked": false,
                                                "pid": "070303",
                                                "id": "07030302",
                                                "title": "数据申报",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07030303",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070303",
                                                "id": "07030303",
                                                "title": "申报结果查询",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0703",
                                        "id": "070303",
                                        "title": "恢复出口退免税声明",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "07",
                                "id": "0703",
                                "title": "放弃退（免）税备案",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "0704",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070401",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0704",
                                        "id": "070401",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070402",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07040201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070402",
                                                "id": "07040201",
                                                "title": "集团公司成员企业备案",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0704",
                                        "id": "070402",
                                        "title": "数据申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070403",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0704",
                                        "id": "070403",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "07",
                                "id": "0704",
                                "title": "集团公司成员企业备案",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "080002",
                                "cdDm": "0705",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070501",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07050101",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070501",
                                                "id": "07050101",
                                                "title": "采集首页",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07050102",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070501",
                                                "id": "07050102",
                                                "title": "出口货物报关单管理",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07050103",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070501",
                                                "id": "07050103",
                                                "title": "以边境小额贸易方式代理外国企业、外国自然人报关出口货物备案表",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0705",
                                        "id": "070501",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070502",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07050201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070502",
                                                "id": "07050201",
                                                "title": "以边境小额贸易方式代理外国企业、外国自然人报关出口货物备案表",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0705",
                                        "id": "070502",
                                        "title": "数据申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070503",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0705",
                                        "id": "070503",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "07",
                                "id": "0705",
                                "title": "边贸代理备案",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "0706",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070601",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0706",
                                        "id": "070601",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070602",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07060201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070602",
                                                "id": "07060201",
                                                "title": "先退税后核销资格申请",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0706",
                                        "id": "070602",
                                        "title": "数据申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070603",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0706",
                                        "id": "070603",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "07",
                                "id": "0706",
                                "title": "先退税后核销资格申请",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "cdDm": "0707",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070701",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0707",
                                        "id": "070701",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070702",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "07070201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "070702",
                                                "id": "07070201",
                                                "title": "出口退税业务提醒信息",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0707",
                                        "id": "070702",
                                        "title": "数据申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "070703",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0707",
                                        "id": "070703",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "07",
                                "id": "0707",
                                "title": "出口退税业务提醒信息",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "qt",
                        "id": "07",
                        "title": "资格备案",
                        "qxzDm": "030001"
                    },
                    {
                        "checkedStr": "N",
                        "cdDm": "08",
                        "children": [
                            {
                                "checkedStr": "N",
                                "cdDm": "0801",
                                "children": [

                                ],
                                "checked": false,
                                "pid": "08",
                                "id": "0801",
                                "title": "出口企业分类管理",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "070001",
                                "cdDm": "080101",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "08010101",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "0801010101",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "08010101",
                                                "id": "0801010101",
                                                "title": "出口退（免）税企业内部风险控制体系建设情况报告",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "0801010102",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "08010101",
                                                "id": "0801010102",
                                                "title": "生产型出口企业生产能力情况报告（生产）",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "080101",
                                        "id": "08010101",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "08010102",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "0801010201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "08010102",
                                                "id": "0801010201",
                                                "title": "出口退（免）税企业内部风险控制体系建设情况报告",
                                                "qxzDm": "030001"
                                            },
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "0801010202",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "08010102",
                                                "id": "0801010202",
                                                "title": "生产型出口企业生产能力情况报告（生产）",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "080101",
                                        "id": "08010102",
                                        "title": "数据申报（生产）",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "08010103",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "0801010301",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "08010103",
                                                "id": "0801010301",
                                                "title": "出口退（免）税企业内部风险控制体系建设情况报告",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "080101",
                                        "id": "08010103",
                                        "title": "数据申报（外贸）",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "08010104",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "080101",
                                        "id": "08010104",
                                        "title": "申报结果查询（生产）",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "08010105",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "080101",
                                        "id": "08010105",
                                        "title": "申报结果查询（外贸）",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "08",
                                "id": "080101",
                                "title": "一类出口企业评定申请",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "070002",
                                "cdDm": "080102",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "08010201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "080102",
                                        "id": "08010201",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "08010202",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "0801020201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "08010202",
                                                "id": "0801020201",
                                                "title": "出口企业分类管理复评申请表",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "080102",
                                        "id": "08010202",
                                        "title": "数据申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "08010203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "080102",
                                        "id": "08010203",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "08",
                                "id": "080102",
                                "title": "出口企业分类管理复评",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "070003",
                                "cdDm": "0802",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "080201",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0802",
                                        "id": "080201",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "080202",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "08020201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "080202",
                                                "id": "08020201",
                                                "title": "进货凭证信息回退",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0802",
                                        "id": "080202",
                                        "title": "数据申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "080203",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0802",
                                        "id": "080203",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "08",
                                "id": "0802",
                                "title": "进货凭证信息回退",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "070004",
                                "cdDm": "0803",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "080301",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0803",
                                        "id": "080301",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "080302",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "08030201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "080302",
                                                "id": "08030201",
                                                "title": "出口信息查询",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0803",
                                        "id": "080302",
                                        "title": "数据申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "080303",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0803",
                                        "id": "080303",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "08",
                                "id": "0803",
                                "title": "出口信息查询",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "070006",
                                "cdDm": "0804",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "080401",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0804",
                                        "id": "080401",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "080402",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "08040201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "080402",
                                                "id": "08040201",
                                                "title": "企业撤回退（免）税申报申请表（生产）",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0804",
                                        "id": "080402",
                                        "title": "数据申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "080403",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0804",
                                        "id": "080403",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "08",
                                "id": "0804",
                                "title": "企业撤回退（免）税申报（生产）",
                                "qxzDm": "030001"
                            },
                            {
                                "checkedStr": "N",
                                "wlxh": "070005",
                                "cdDm": "0805",
                                "children": [
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "080501",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0805",
                                        "id": "080501",
                                        "title": "明细数据采集",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "080502",
                                        "children": [
                                            {
                                                "checkedStr": "N",
                                                "cdDm": "08050201",
                                                "children": [

                                                ],
                                                "checked": false,
                                                "pid": "080502",
                                                "id": "08050201",
                                                "title": "企业撤回退（免）税申报申请表（外贸）",
                                                "qxzDm": "030001"
                                            }
                                        ],
                                        "checked": false,
                                        "pid": "0805",
                                        "id": "080502",
                                        "title": "数据申报",
                                        "qxzDm": "030001"
                                    },
                                    {
                                        "checkedStr": "N",
                                        "cdDm": "080503",
                                        "children": [

                                        ],
                                        "checked": false,
                                        "pid": "0805",
                                        "id": "080503",
                                        "title": "申报结果查询",
                                        "qxzDm": "030001"
                                    }
                                ],
                                "checked": false,
                                "pid": "08",
                                "id": "0805",
                                "title": "企业撤回退（免）税申报（外贸）",
                                "qxzDm": "030001"
                            }
                        ],
                        "checked": false,
                        "pid": "qt",
                        "id": "08",
                        "title": "其他业务",
                        "qxzDm": "030001"
                    }
                ],
                "checked": false,
                "id": "qt",
                "title": "其他（退）免税",
                "qxzDm": "030001"
            }
        ],
        "code": "200",
        "desc": "成功",
        "msg": null,
        "type": ""
    }
    await waitTime(2000);
    return res.json(returnData);
}




async function exportPager(req: Request, res: Response) {
    const returnData = {
        code: '200',
        body: { filePath: 'XXXXX/XXXXX' },
    };
    await waitTime(2000);
    return res.json(returnData);
}

async function openFile(req: Request, res: Response) {
    const returnData = {
        code: '200',
        body: { filePath: 'XXXXX/XXXXX' },
        desc: 'xxxx'
    };
    await waitTime(5000);
    return res.json(returnData);
}

async function ddPd(req: Request, res: Response) {
    const returnData = {
        "body": {
            "cgts": 22,
            "sbts": 44,
            "pdmxList": [
                {   
                    "pdjg":"Y",
                    "bgdhgbh": "123",
                    "hwxh": "444",
                    "hgckhwbgdsbrq": "555",
                    "ckny": "666",
                    "ckrq1": 1708923339,
                    "hzdwmc": "888",
                    "ckhth": "99",
                    "hgckspDm": "100",
                    "hgspmc": "111",
                    "cksl": 1,
                    "hgjldwmc": "12",
                    "fphm": "13",
                    "fpDm": "14",
                    "kprq": "15",
                    "bgdpdsblxDm": "16",
                    "pduuid":"13123123"
                }
            ]
        },
        "code": "200",
        "desc": "成功",
        "msg": null,
        "type": ""
    };

    await waitTime(5000);
    return res.json(returnData);
}

export default {
    'POST /hx/ty/crud/queryPager': queryPager,    // 列表查询
    'POST /hx/ty/crud/delete': commonDelete,      // 表单删除
    'POST /hx/ty/crud/queryForm': queryForm,      // 表单查询
    'POST /hx/ty/commonextbtn/xj': xj,           // 小计
    'POST /hx/ty/crud/saveOrUpdate': returnCode200,    // return 200
    'POST /test/returnCode200': returnCode200,    // return 200
    'POST /test/returnCode500': returnCode500,    // return 500
    'POST /hx/ty/crud/queryParams': queryParams,      // 表单查询
    'POST /hx/ty/commonextbtn/xhcp': xhcp,      // 序号重排
    'POST /hx/ty/crud/exportPager': exportPager,      // 导出
    'POST /hx/ty/file/openFile': openFile,      // 导出
    'POST   /yw/dditSaas/qxqxz/xzHxgQxz': xhcp,      // 导出
    'POST   /yw/dditSaas/qxqxz/jyQxzSfcz': jyQxzSfcz,      // 导出
    'POST   /yw/dditSaas/qxqxz/scQxz': jyQxzSfcz,      // 导出
    'POST   /yw/dditSaas/qxty/cxQxzQdcdlb': cxQxzQdcdlb,      // 导出
    'POST   /yw/dditSaas/qxzy/sczydm': sczydm,      // 导出
    'POST   /yw/dditSaas/qxzy/xzHxgZy': returnCode200,      // 导出
    'POST   /yw/dditSaas/qxqd/cxYhMrQxz': cxYhMrQxz,      // 导出
    'POST   /yw/dditSaas/qxqd/xzHxgQd': returnCode200,      // 导出
    'POST   /yw/dditSaas/qxqd/scQd': returnCode200,      // 导出
    'POST   /yw/dditSaas/qxty/scjy': returnCode200,      // 导出
    'POST   /yw/dditSaas/qxqxz/glqd': returnCode200,      // 导出
    'POST   /yw/dditSaas/qxqxz/gldq': returnCode200,      // 导出
    'POST   /yw/dditSaas/qxqxz/glcd': returnCode200,      // 导出
    'POST   /yw/dditSaas/qxqxz/glzy': returnCode200,      // 导出
    'POST   /yw/dditSaas/qxqd/glqxz': returnCode200,      // 导出
    'POST   /ddzx/khdagl/queryKhda': queryPager,      // 导出
    'POST   /ddzx/khdagl/qyKhda': returnCode200,      // 导出
    'POST   /ddzx/khdagl/yrhmdKhda': returnCode200,
    'POST   /ddzx/khdagl/bckhda': returnCode200,
    'POST /ddzx/khdagl/remvoeHmdKhda': returnCode200,
    'POST /test/returnCode': returnCode,
    'POST /ddzx/ddgl/createKptzs': exportPager,      // 导出
    'POST /ddzx/ddgl/ddPd': ddPd,
    'POST /ddzx/ddgl/scmx': ddPd,

};
