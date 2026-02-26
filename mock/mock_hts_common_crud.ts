import mockjs from 'mockjs';
import getRowData from './mock_row_data';

// 测试服务器响应时间
const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

// 获取token
function getToken(req: any, res: any) {
  return res.json({
    status: 'ok',
    token: 'local_access_token_01234567890',
  });
}

// 获取token
function getUser(req: any, res: any) {
  return res.json({
    status: 'ok',
    name: 'admin',
  });
}

// 获取token
function oauth(req: any, res: any) {
  let code = req.body.loginUserName === 'admin' ? '200' : '500';
  let body: any = {
    ACCESS_TOKEN: 'local_access_token_01234567890',
  };
  let returnData = {
    code,
    body,
  };
  return res.json(returnData);
}

// 获取登录人信息
async function getLoginUserInfoDict(req: any, res: any) {
  const returnData = {
    code: '200',
    body: {
      userId: 'ADM_001', userName: 'admin', loginName: 'admin', usedFlag: 'Y',
      menuInfo: [
        { hideInMenu: 'N', path: '/easy_dev/qx', name: '系统管理', icon: 'DeploymentUnitOutlined', routes: [
          { hideInMenu: 'N', path: '/easy_dev/qx/bm', component: './easy_dev/qx/bm', name: '部门管理' },
          { hideInMenu: 'N', path: '/easy_dev/qx/yh', component: './easy_dev/qx/yh', name: '用户管理' },
          { hideInMenu: 'N', path: '/easy_dev/qx/js', component: './easy_dev/qx/js', name: '角色管理' },
          { hideInMenu: 'N', path: '/easy_dev/qx/cd', component: './easy_dev/qx/cd', name: '菜单管理' },
          { hideInMenu: 'N', path: '/easy_dev/qx/zy', component: './easy_dev/qx/zy', name: '资源管理' }
        ] },
        { hideInMenu: 'N', path: '/easy_dev/dict', name: '数据元管理', icon: 'DatabaseOutlined', routes: [
        ] },
        { hideInMenu: 'N', path: '/easy_dev/pro', name: '应用管理', icon: 'AppstoreOutlined', routes: [
        ] }
    ]
    }
  };
  await waitTime(200);
  return res.json(returnData);
}

// 获取登录人信息
async function getLoginUserInfo(req: any, res: any) {
  const returnData = {
    code: '200',
    body: {
      name: 'admin',
      qxyh: {
        yddh: mockjs.mock('@guid'),
        yhuuid1: 'A183E35FDD32CC93E0100001'
      },
      qxQys: [
        {
          cktsqylxDm: 'wm',
          nsrmc: '本地测试用户',
          hgqyDm: '210120345R',
          nsrsbh: '91123456789123456W',
          shxydm: '91123456789123456W',
          kzxxDms: ['WZHQY', 'FQMSSXZS', 'KJMY', 'FLGLCD', 'TSGMS'],
          tgshzlBz: mockjs.mock('@pick(["Y", "N"])'),
        }
      ]
    }
  };
  await waitTime(200);
  return res.json(returnData);
}

// 通用crud 列表查询
async function queryPager(req: any, res: any) {
  const { body } = req;
  const { searchModel = {} } = body;
  let { page = 1, pageSize = 10 } = searchModel;
  let rows: any[] = [];
  for (let i = 0; i < pageSize; i += 1) {
    rows.push(getRowData());
  }
  let returnData: any = {
    code: '200',
    // success: false,
    body: {
      rowCount: rows.length,
      rows,
      page,
      statistics: {
        sum: {
          cjzj: 1399999,
          mylaj: 1359999,
          cksl: 569999,
        },
        min: {
          cjzj: 19,
          mylaj: 55,
          cksl: 599,
        },
        max: {
          cjzj: 998,
          mylaj: 667,
          cksl: 56999,
        },
        avg: {
          cjzj: 123,
          mylaj: 76,
          cksl: 9889,
        }
      }
    },
  };
  await waitTime(200);
  return res.json(returnData);
}

// 通用crud 列表查询
async function queryPager2(req: any, res: any) {
  let rows: any[] = [];
  for (let i = 0; i < 15; i += 1) {
    rows.push(getRowData());
  }
  let returnData: any = {
    code: '200',
    body: rows,
  };
  await waitTime(200);
  return res.json(returnData);
}

// 通用crud 列表查询
async function queryPager3(req: any, res: any) {
  const { body } = req;
  const { page } = body;
  let rows: any[] = [];
  for (let i = 0; i < 5; i += 1) {
    rows.push(getRowData());
  }
  let returnData: any = {
    code: '200',
    body: {
      rowCount: 50,
      rows,
      page,
    },
  };
  await waitTime(200);
  return res.json(returnData);
}

// 通用crud 列表查询
async function queryPager4(req: any, res: any) {
  const { body } = req;
  const { tjyf } = body;
  let rows: any[] = [
    { tjyf, swcode: '15000000000', swname: '重庆', channel_id: 'CKTS.SBXT.ONLINE', channel_name: '出口退税申报系统（在线版）', ts: mockjs.mock('@integer(1, 99)') },
    { tjyf, swcode: '13100000000', swname: '上海', channel_id: 'CKTS.SBXT.ONLINE', channel_name: '出口退税申报系统（在线版）', ts: mockjs.mock('@integer(1, 99)') },
    { tjyf, swcode: '13100000000', swname: '上海', channel_id: 'CKTS.SBXT.XTTS', channel_name: '	出口退税申报系统（小图退税）', ts: mockjs.mock('@integer(1, 99)') },
    { tjyf, swcode: '13100000000', swname: '上海', channel_id: 'CKTS.SBXT.HTSLX', channel_name: '	慧退税离线', ts: mockjs.mock('@integer(1, 99)') },
    { tjyf, swcode: '12100000000', swname: '辽宁', channel_id: 'CKTS.SBXT.ONLINE', channel_name: '出口退税申报系统（在线版）', ts: mockjs.mock('@integer(1, 99)') },
    { tjyf, swcode: '12100000000', swname: '辽宁', channel_id: 'CKTS.SBXT.SZDYCK.GPS', channel_name: '深圳单一窗口（关票税）', ts: mockjs.mock('@integer(1, 99)') },
    { tjyf, swcode: '12102000000', swname: '大连', channel_id: 'CKTS.SBXT.ONLINE', channel_name: '出口退税申报系统（在线版）', ts: mockjs.mock('@integer(1, 99)') },
    { tjyf, swcode: '12102000000', swname: '大连', channel_id: 'CKTS.SBXT.XTTS', channel_name: '	出口退税申报系统（小图退税）', ts: mockjs.mock('@integer(1, 99)') },
    { tjyf, swcode: '12102000000', swname: '大连', channel_id: 'CKTS.SBXT.HTSLX', channel_name: '	慧退税离线', ts: mockjs.mock('@integer(1, 99)') },
    { tjyf, swcode: '12102000000', swname: '大连', channel_id: 'CKTS.SBXT.SZDYCK.GPS', channel_name: '深圳单一窗口（关票税）', ts: mockjs.mock('@integer(1, 99)') },
    { tjyf, swcode: '14400000000', swname: '广东', channel_id: 'CKTS.SBXT.XTTS', channel_name: '	出口退税申报系统（小图退税）', ts: mockjs.mock('@integer(1, 99)') },
    { tjyf, swcode: '14400000000', swname: '广东', channel_id: 'CKTS.SBXT.HTSLX', channel_name: '	慧退税离线', ts: mockjs.mock('@integer(1, 99)') },
  ];
  let returnData: any = {
    code: '200',
    body: rows,
  };
  await waitTime(200);
  return res.json(returnData);
}

// 通用crud 列表查询
async function queryPager5(req: any, res: any) {
  let returnData: any = {
    body: {
      total: [
        { reqCount: 0, resCount: 0, lrrq: '', tjgz: '合计' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04' },
        { reqCount: 308, resCount: 1240, lrrq: '2023-04-05' },
        { reqCount: 4224, resCount: 18113, lrrq: '2023-04-06' },
        { reqCount: 3323, resCount: 9308, lrrq: '2023-04-07' },
        { reqCount: 806, resCount: 13459, lrrq: '2023-04-08' },
        { reqCount: 8661, resCount: 42120, lrrq: '合计' }
      ],
      grid: [
        [
          { reqCount: 0, resCount: 0, lrrq: '', tjgz: 'TYSJSB_UP' },
          { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'TYSJSB_UP' },
          { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'TYSJSB_UP' },
          { reqCount: 0, resCount: 0, lrrq: '2023-04-05', tjgz: 'TYSJSB_UP' },
          { reqCount: 12, resCount: 12, lrrq: '2023-04-06', tjgz: 'TYSJSB_UP' },
          { reqCount: 26, resCount: 26, lrrq: '2023-04-07', tjgz: 'TYSJSB_UP' },
          { reqCount: 0, resCount: 0, lrrq: '2023-04-08', tjgz: 'TYSJSB_UP' },
          { reqCount: 38, resCount: 38, lrrq: '合计', tjgz: 'TYSJSB_UP' }
        ],
        [
          { reqCount: 0, resCount: 0, lrrq: '', tjgz: 'RZFPFK_UP' },
          { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'RZFPFK_UP' },
          { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'RZFPFK_UP' },
          { reqCount: 1, resCount: 1, lrrq: '2023-04-05', tjgz: 'RZFPFK_UP' },
          { reqCount: 71, resCount: 71, lrrq: '2023-04-06', tjgz: 'RZFPFK_UP' },
          { reqCount: 45, resCount: 45, lrrq: '2023-04-07', tjgz: 'RZFPFK_UP' },
          { reqCount: 9, resCount: 9, lrrq: '2023-04-08', tjgz: 'RZFPFK_UP' },
          { reqCount: 126, resCount: 126, lrrq: '合计', tjgz: 'RZFPFK_UP' }
        ],
        [
          { reqCount: 0, resCount: 0, lrrq: '', tjgz: 'TYSJSB_SEL' },
          { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'TYSJSB_SEL' },
          { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'TYSJSB_SEL' },
          { reqCount: 1, resCount: 1, lrrq: '2023-04-05', tjgz: 'TYSJSB_SEL' },
          { reqCount: 182, resCount: 215, lrrq: '2023-04-06', tjgz: 'TYSJSB_SEL' },
          { reqCount: 228, resCount: 228, lrrq: '2023-04-07', tjgz: 'TYSJSB_SEL' },
          { reqCount: 15, resCount: 15, lrrq: '2023-04-08', tjgz: 'TYSJSB_SEL' },
          { reqCount: 426, resCount: 459, lrrq: '合计', tjgz: 'TYSJSB_SEL' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'SJZJ_SEL' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'SJZJ_SEL' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'SJZJ_SEL' },
        { reqCount: 94, resCount: 94, lrrq: '2023-04-05', tjgz: 'SJZJ_SEL' },
        { reqCount: 845, resCount: 891, lrrq: '2023-04-06', tjgz: 'SJZJ_SEL' },
        { reqCount: 760, resCount: 780, lrrq: '2023-04-07', tjgz: 'SJZJ_SEL' },
        { reqCount: 233, resCount: 233, lrrq: '2023-04-08', tjgz: 'SJZJ_SEL' },
        { reqCount: 1932, resCount: 1998, lrrq: '合计', tjgz: 'SJZJ_SEL' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'TYSHFK_DOWN' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'TYSHFK_DOWN' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'TYSHFK_DOWN' },
        { reqCount: 2, resCount: 2, lrrq: '2023-04-05', tjgz: 'TYSHFK_DOWN' },
        { reqCount: 63, resCount: 63, lrrq: '2023-04-06', tjgz: 'TYSHFK_DOWN' },
        { reqCount: 67, resCount: 67, lrrq: '2023-04-07', tjgz: 'TYSHFK_DOWN' },
        { reqCount: 24, resCount: 24, lrrq: '2023-04-08', tjgz: 'TYSHFK_DOWN' },
        { reqCount: 156, resCount: 156, lrrq: '合计', tjgz: 'TYSHFK_DOWN' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'TYSHFK_UP' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'TYSHFK_UP' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'TYSHFK_UP' },
        { reqCount: 3, resCount: 3, lrrq: '2023-04-05', tjgz: 'TYSHFK_UP' },
        { reqCount: 87, resCount: 112, lrrq: '2023-04-06', tjgz: 'TYSHFK_UP' },
        { reqCount: 77, resCount: 77, lrrq: '2023-04-07', tjgz: 'TYSHFK_UP' },
        { reqCount: 26, resCount: 26, lrrq: '2023-04-08', tjgz: 'TYSHFK_UP' },
        { reqCount: 193, resCount: 218, lrrq: '合计', tjgz: 'TYSHFK_UP' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'WBSJ_BGD_CZ_LIST' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'WBSJ_BGD_CZ_LIST' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'WBSJ_BGD_CZ_LIST' },
        { reqCount: 40, resCount: 930, lrrq: '2023-04-05', tjgz: 'WBSJ_BGD_CZ_LIST' },
        { reqCount: 723, resCount: 14136, lrrq: '2023-04-06', tjgz: 'WBSJ_BGD_CZ_LIST' },
        { reqCount: 364, resCount: 6184, lrrq: '2023-04-07', tjgz: 'WBSJ_BGD_CZ_LIST' },
        { reqCount: 133, resCount: 12735, lrrq: '2023-04-08', tjgz: 'WBSJ_BGD_CZ_LIST' },
        { reqCount: 1260, resCount: 33985, lrrq: '合计', tjgz: 'WBSJ_BGD_CZ_LIST' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'SJZJ_LIST' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'SJZJ_LIST' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'SJZJ_LIST' },
        { reqCount: 15, resCount: 57, lrrq: '2023-04-05', tjgz: 'SJZJ_LIST' },
        { reqCount: 99, resCount: 179, lrrq: '2023-04-06', tjgz: 'SJZJ_LIST' },
        { reqCount: 80, resCount: 127, lrrq: '2023-04-07', tjgz: 'SJZJ_LIST' },
        { reqCount: 24, resCount: 39, lrrq: '2023-04-08', tjgz: 'SJZJ_LIST' },
        { reqCount: 218, resCount: 402, lrrq: '合计', tjgz: 'SJZJ_LIST' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'SJZJ_DOWN' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'SJZJ_DOWN' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'SJZJ_DOWN' },
        { reqCount: 29, resCount: 29, lrrq: '2023-04-05', tjgz: 'SJZJ_DOWN' },
        { reqCount: 291, resCount: 453, lrrq: '2023-04-06', tjgz: 'SJZJ_DOWN' },
        { reqCount: 272, resCount: 312, lrrq: '2023-04-07', tjgz: 'SJZJ_DOWN' },
        { reqCount: 58, resCount: 83, lrrq: '2023-04-08', tjgz: 'SJZJ_DOWN' },
        { reqCount: 650, resCount: 877, lrrq: '合计', tjgz: 'SJZJ_DOWN' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'YBJK_UP_ZJZYSP' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'YBJK_UP_ZJZYSP' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'YBJK_UP_ZJZYSP' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-05', tjgz: 'YBJK_UP_ZJZYSP' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-06', tjgz: 'YBJK_UP_ZJZYSP' },
        { reqCount: 1, resCount: 1, lrrq: '2023-04-07', tjgz: 'YBJK_UP_ZJZYSP' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-08', tjgz: 'YBJK_UP_ZJZYSP' },
        { reqCount: 1, resCount: 1, lrrq: '合计', tjgz: 'YBJK_UP_ZJZYSP' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'CKTS_BA_BAXX_LIST' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'CKTS_BA_BAXX_LIST' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'CKTS_BA_BAXX_LIST' },
        { reqCount: 70, resCount: 70, lrrq: '2023-04-05', tjgz: 'CKTS_BA_BAXX_LIST' },
        { reqCount: 873, resCount: 881, lrrq: '2023-04-06', tjgz: 'CKTS_BA_BAXX_LIST' },
        { reqCount: 506, resCount: 516, lrrq: '2023-04-07', tjgz: 'CKTS_BA_BAXX_LIST' },
        { reqCount: 97, resCount: 97, lrrq: '2023-04-08', tjgz: 'CKTS_BA_BAXX_LIST' },
        { reqCount: 1546, resCount: 1564, lrrq: '合计', tjgz: 'CKTS_BA_BAXX_LIST' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'WBSJ_FP_CZ_LIST' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'WBSJ_FP_CZ_LIST' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'WBSJ_FP_CZ_LIST' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-05', tjgz: 'WBSJ_FP_CZ_LIST' },
        { reqCount: 4, resCount: 4, lrrq: '2023-04-06', tjgz: 'WBSJ_FP_CZ_LIST' },
        { reqCount: 3, resCount: 3, lrrq: '2023-04-07', tjgz: 'WBSJ_FP_CZ_LIST' },
        { reqCount: 1, resCount: 1, lrrq: '2023-04-08', tjgz: 'WBSJ_FP_CZ_LIST' },
        { reqCount: 8, resCount: 8, lrrq: '合计', tjgz: 'WBSJ_FP_CZ_LIST' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'RZFPFK_SEL' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'RZFPFK_SEL' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'RZFPFK_SEL' },
        { reqCount: 4, resCount: 4, lrrq: '2023-04-05', tjgz: 'RZFPFK_SEL' },
        { reqCount: 192, resCount: 200, lrrq: '2023-04-06', tjgz: 'RZFPFK_SEL' },
        { reqCount: 116, resCount: 116, lrrq: '2023-04-07', tjgz: 'RZFPFK_SEL' },
        { reqCount: 27, resCount: 27, lrrq: '2023-04-08', tjgz: 'RZFPFK_SEL' },
        { reqCount: 339, resCount: 347, lrrq: '合计', tjgz: 'RZFPFK_SEL' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'RZFPFK_DOWN' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'RZFPFK_DOWN' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'RZFPFK_DOWN' },
        { reqCount: 1, resCount: 1, lrrq: '2023-04-05', tjgz: 'RZFPFK_DOWN' },
        { reqCount: 61, resCount: 61, lrrq: '2023-04-06', tjgz: 'RZFPFK_DOWN' },
        { reqCount: 39, resCount: 39, lrrq: '2023-04-07', tjgz: 'RZFPFK_DOWN' },
        { reqCount: 10, resCount: 10, lrrq: '2023-04-08', tjgz: 'RZFPFK_DOWN' },
        { reqCount: 111, resCount: 111, lrrq: '合计', tjgz: 'RZFPFK_DOWN' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'SJSB_LIST' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'SJSB_LIST' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'SJSB_LIST' },
        { reqCount: 2, resCount: 2, lrrq: '2023-04-05', tjgz: 'SJSB_LIST' },
        { reqCount: 19, resCount: 54, lrrq: '2023-04-06', tjgz: 'SJSB_LIST' },
        { reqCount: 26, resCount: 41, lrrq: '2023-04-07', tjgz: 'SJSB_LIST' },
        { reqCount: 1, resCount: 1, lrrq: '2023-04-08', tjgz: 'SJSB_LIST' },
        { reqCount: 48, resCount: 98, lrrq: '合计', tjgz: 'SJSB_LIST' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'SJZJ_UP' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'SJZJ_UP' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'SJZJ_UP' },
        { reqCount: 39, resCount: 39, lrrq: '2023-04-05', tjgz: 'SJZJ_UP' },
        { reqCount: 302, resCount: 323, lrrq: '2023-04-06', tjgz: 'SJZJ_UP' },
        { reqCount: 337, resCount: 362, lrrq: '2023-04-07', tjgz: 'SJZJ_UP' },
        { reqCount: 64, resCount: 69, lrrq: '2023-04-08', tjgz: 'SJZJ_UP' },
        { reqCount: 742, resCount: 793, lrrq: '合计', tjgz: 'SJZJ_UP' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'TYSHFK_SEL' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'TYSHFK_SEL' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'TYSHFK_SEL' },
        { reqCount: 5, resCount: 5, lrrq: '2023-04-05', tjgz: 'TYSHFK_SEL' },
        { reqCount: 290, resCount: 290, lrrq: '2023-04-06', tjgz: 'TYSHFK_SEL' },
        { reqCount: 278, resCount: 278, lrrq: '2023-04-07', tjgz: 'TYSHFK_SEL' },
        { reqCount: 74, resCount: 74, lrrq: '2023-04-08', tjgz: 'TYSHFK_SEL' },
        { reqCount: 647, resCount: 647, lrrq: '合计', tjgz: 'TYSHFK_SEL' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'SJZJ_TO_SJSB' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'SJZJ_TO_SJSB' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'SJZJ_TO_SJSB' },
        { reqCount: 2, resCount: 2, lrrq: '2023-04-05', tjgz: 'SJZJ_TO_SJSB' },
        { reqCount: 108, resCount: 108, lrrq: '2023-04-06', tjgz: 'SJZJ_TO_SJSB' },
        { reqCount: 90, resCount: 90, lrrq: '2023-04-07', tjgz: 'SJZJ_TO_SJSB' },
        { reqCount: 9, resCount: 9, lrrq: '2023-04-08', tjgz: 'SJZJ_TO_SJSB' },
        { reqCount: 209, resCount: 209, lrrq: '合计', tjgz: 'SJZJ_TO_SJSB' }
        ],
        [{ reqCount: 0, resCount: 0, lrrq: '', tjgz: 'YBJK_UP_DZDZ_HWXX' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-03', tjgz: 'YBJK_UP_DZDZ_HWXX' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-04', tjgz: 'YBJK_UP_DZDZ_HWXX' },
        { reqCount: 0, resCount: 0, lrrq: '2023-04-05', tjgz: 'YBJK_UP_DZDZ_HWXX' },
        { reqCount: 2, resCount: 60, lrrq: '2023-04-06', tjgz: 'YBJK_UP_DZDZ_HWXX' },
        { reqCount: 8, resCount: 16, lrrq: '2023-04-07', tjgz: 'YBJK_UP_DZDZ_HWXX' },
        { reqCount: 1, resCount: 7, lrrq: '2023-04-08', tjgz: 'YBJK_UP_DZDZ_HWXX' },
        { reqCount: 11, resCount: 83, lrrq: '合计', tjgz: 'YBJK_UP_DZDZ_HWXX' }
        ]
      ],
      title: [
        { lrrq: '' },
        { lrrq: '2023-04-03' },
        { lrrq: '2023-04-04' },
        { lrrq: '2023-04-05' },
        { lrrq: '2023-04-06' },
        { lrrq: '2023-04-07' },
        { lrrq: '2023-04-08' },
        { lrrq: '合计' }
      ]
    },
    code: '200',
  };
  await waitTime(200);
  return res.json(returnData);
}

// 通用crud 删除
async function commonDelete(req: any, res: any) {
  // 响应数据
  const returnData = {
    code: '2000',
    desc: '成功',
    body: '【mock】删除成功',
  };
  await waitTime(500);
  return res.json(returnData);
}

// 通用crud 表单查询
async function queryForm(req: any, res: any) {
  let data = getRowData();
  // 响应数据
  const returnData = {
    body: data,
    code: '200',
    desc: '【mock】表单查询成功',
  };
  await waitTime(500);
  return res.json(returnData);
}

// 一次性token
async function getOneTimeToken(req: any, res: any) {
  const returnData = {
    code: '200',
    body: 'onetimetoken',
  };
  await waitTime(500);
  return res.json(returnData);
}

// getDownload
async function getDownload(req: any, res: any) {
  const returnData = {
    code: '200',
    body: 'getDownload',
  };
  await waitTime(500);
  return res.json(returnData);
}

// 测试数据：返回200
async function returnCode200(req: any, res: any) {
  const returnData = {
    code: '200',
    desc: '【mock】成功',
  };
  await waitTime(1500);
  return res.json(returnData);
}

// 测试数据：返回901
async function returnCode901(req: any, res: any) {
  const returnData = {
    code: '901',
    desc: '【mock】901 error',
  };
  await waitTime(500);
  return res.json(returnData);
}

// 测试数据：返回500
async function returnCode500(req: any, res: any) {
  const returnData = {
    code: '500',
    desc: '【mock】失败',
    msg: '【msg】失败',
  };
  await waitTime(500);
  return res.json(returnData);
}

// 列表查询
async function queryPagerS21(req: any, res: any) {
  let rows: any[] = [];
  for (let i = 0; i < 100; i += 1) {
    rows.push(getRowData());
  }
  let returnData = rows;
  await waitTime(200);
  return res.json(returnData);
}

// 数据驱动 数据元 - 获取物理表
async function retrieveObjectByDomain(req: any, res: any) {
  await waitTime(200);
  return res.json({
    code: '200',
    body: {
      pageSize: 10,
      page: 1,
      searchModel: null,
      rowCount: 1,
      rows: [
        {
          dictDomainId: 'uuidsaas', dictObjectId: "mts_tssb", dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', hasDictKeys: ['uuid'], hasDictFields: [
            'uuid_mts_tssb_uuid', 'uuid_mts_tssb_ckbgdh', 'uuid_mts_tssb_tse', 'uuid_mts_tssb_ssq',
          ], hasDictFieldsDetail: [
            { dictFieldId: 'uuid_mts_tssb_uuid', dictDomainId: 'uuidsaas', dictFieldName: 'uuid', dictFieldType: 'varchar(32)', dictFieldDesc: 'UUID', dictFieldNullAble : "NO" },
            { dictFieldId: 'uuid_mts_tssb_ckbgdh', dictDomainId: 'uuidsaas', dictFieldName: 'ckbgdh', dictFieldType: 'char(1)', dictFieldDesc: '报关单号', dictFieldNullAble : "NO" },
            { dictFieldId: 'uuid_mts_tssb_tse', dictDomainId: 'uuidsaas', dictFieldName: 'tse', dictFieldType: 'varchar(32)', dictFieldDesc: '退税额', dictFieldNullAble : "YES", dictFieldDefaultValue: 0 },
            { dictFieldId: 'uuid_mts_tssb_ssq', dictDomainId: 'uuidsaas', dictFieldName: 'ssq', dictFieldType: 'varchar(60)', dictFieldDesc: '申报年月1', dictFieldNullAble : "YES" },
          ]
        },
        {
          dictDomainId: 'uuidsaas', dictObjectId: "mts_tsjh", dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', hasDictFields: [
            'uuid_mts_tsjh_cytgbz', 'uuid_mts_tsjh_ghfnsrsbh1',
          ], hasDictFieldsDetail: [
            { dictFieldId: 'uuid_mts_tsjh_cytgbz', dictDomainId: 'uuidsaas', dictFieldName: 'cytgbz', dictFieldType: 'varchar(32)', dictFieldDesc: '数据检查状态', dictFieldNullAble : "YES"},
            { dictFieldId: 'uuid_mts_tsjh_ghfnsrsbh1', dictDomainId: 'uuidsaas', dictFieldName: 'ghfnsrsbh1', dictFieldType: 'varchar(60)', dictFieldDesc: '纳税人识别号', dictFieldNullAble : "NO", dictFieldDefaultValue: 99 },
          ]
        },
        { dictDomainId: 'uuidsaas', dictObjectId: "zmkj_zxsb_zm_dljk", dictObjectTableName: 'zmkj_zxsb_zm_dljk', dictObjectDesc: '代理进口货物证明' },
      ],
    }
  })
}

// 数据驱动 码表配置
async function retrieveCode(req: any, res: any) {
  await waitTime(200);
  return res.json({
    code: '200',
    body: {
      pageSize: 10,
      page: 1,
      searchModel: null,
      rowCount: 1,
      rows: [
        { dictDomainId: 'uuidsaas', dictCodeId: "key_a", dictCodeName: 'key_a_name', dictCodeObjectId: 'mts_tsjh', dictCodeFieldId: 'uuid_mts_tsjh_uuid', dictCodeFieldIdAs: 'code', dictCodeFieldName: 'uuid_mts_tsjh_sbpc', dictCodeFieldNameAs: 'value' },
        { dictDomainId: 'uuidsaas', dictCodeId: "key_b", dictCodeName: 'key_b_name', dictCodeObjectId: 'mts_tsjh', dictCodeFieldId: 'uuid_mts_tsjh_uuid', dictCodeFieldIdAs: 'code', dictCodeFieldName: 'uuid_mts_tsjh_sbpc', dictCodeFieldNameAs: 'value' },
        { dictDomainId: 'uuidsaas', dictCodeId: "key_c", dictCodeName: 'key_c_name', dictCodeObjectId: 'mts_tsjh', dictCodeFieldId: 'uuid_mts_tsjh_uuid', dictCodeFieldIdAs: 'code', dictCodeFieldName: 'uuid_mts_tsjh_sbpc', dictCodeFieldNameAs: 'value' },
      ],
    }
  })
}

// 数据驱动 mts_tsjh
const dbField_mts_tsjh = [
  { uuid: '10', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tsjh_uuid', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'uuid', dictFieldDesc: 'UUID', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '11', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tsjh_ssq', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'ssq', dictFieldDesc: '申报年月', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '12', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tsjh_sbpc', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'sbpc', dictFieldDesc: '申报批次', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '13', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tsjh_cytgbz', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'cytgbz', dictFieldDesc: '数据检查状态', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '14', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tsjh_jhpzh', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'jhpzh', dictFieldDesc: '进货凭证号', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '15', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tsjh_kprq', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'kprq', dictFieldDesc: '开票日期', dictFieldType: 'datetime', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '16', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tsjh_ghfnsrsbh1', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'ghfnsrsbh1', dictFieldDesc: '纳税人识别号', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '17', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tsjh_tse', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'tse', dictFieldDesc: '可退税额', dictFieldType: 'decimal(18,6)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '18', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tsjh_bz', dictObjectId: 'mts_tsjh', dictObjectTableName: 'mts_tsjh', dictObjectDesc: '进货明细申报', dictFieldName: 'bz', dictFieldDesc: '备注', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
];

// 数据驱动 mts_tsjh
const dbField_mts_tssb = [
  { uuid: '20', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tssb_uuid', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'uuid', dictFieldDesc: 'UUID', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '21', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tssb_ssq', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'ssq', dictFieldDesc: '申报年月', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '22', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tssb_sbpc', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'sbpc', dictFieldDesc: '申报批次', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '23', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tssb_glh', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'glh', dictFieldDesc: '关联号', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '24', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tssb_ckbgdh', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'ckbgdh', dictFieldDesc: '报关单号', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '25', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tssb_dlzmh', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'dlzmh', dictFieldDesc: '代理证明号', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '26', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tssb_tse', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'tse', dictFieldDesc: '退税额', dictFieldType: 'decimal(18,6)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '27', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tssb_ckrq', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'ckrq', dictFieldDesc: '出口日期', dictFieldType: 'datetime', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '28', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tssb_ckspDm', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'ckspDm', dictFieldDesc: '商品代码', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '29', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_mts_tssb_sbhgspmc', dictObjectId: 'mts_tssb', dictObjectTableName: 'mts_tssb', dictObjectDesc: '出口明细申报', dictFieldName: 'sbhgspmc', dictFieldDesc: '商品名称', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
];

// 数据驱动 dbField_zmkj_zxsb_zm_dljk
const dbField_zmkj_zxsb_zm_dljk = [
  { uuid: '31', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_zmkj_zxsb_zm_dljk_ssq', dictObjectId: 'zmkj_zxsb_zm_dljk', dictObjectTableName: 'zmkj_zxsb_zm_dljk', dictObjectDesc: '代理进口货物证明', dictFieldName: 'ssq', dictFieldDesc: '申报年月', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '32', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_zmkj_zxsb_zm_dljk_sbpc', dictObjectId: 'zmkj_zxsb_zm_dljk', dictObjectTableName: 'zmkj_zxsb_zm_dljk', dictObjectDesc: '代理进口货物证明', dictFieldName: 'sbpc', dictFieldDesc: '申报批次', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '33', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_zmkj_zxsb_zm_dljk_wtfnsrmc', dictObjectId: 'zmkj_zxsb_zm_dljk', dictObjectTableName: 'zmkj_zxsb_zm_dljk', dictObjectDesc: '代理进口货物证明', dictFieldName: 'wtfnsrmc', dictFieldDesc: '委托企业名称', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
  { uuid: '34', dictDomainId: 'uuidsaas', dictFieldId: 'uuid_zmkj_zxsb_zm_dljk_wtfnsrsbh', dictObjectId: 'zmkj_zxsb_zm_dljk', dictObjectTableName: 'zmkj_zxsb_zm_dljk', dictObjectDesc: '代理进口货物证明', dictFieldName: 'wtfnsrsbh', dictFieldDesc: '委托企业税号', dictFieldType: 'varcher(32)', updateTime : 1723699864640, addTime : 1723699864640 },
];

// 数据驱动 tsjh 页面元素
const pageInfoTsjh = {
  page_id: 'example_unit_config1',
  module_key: 'unit_key_tsjh',
  form_title: '进货明细',
  grid_title: '进货明细',
  grid_columns: [
    { title: '申报年月', dataIndex: 'ssq', width: 180, dictFieldId: 'uuid_mts_tsjh_ssq', dictFieldName: 'ssq', dictObjectTableName: 'mts_tsjh' },
    { title: '申报批次', dataIndex: 'sbpc', width: 60, sorter: true, dictFieldId: 'uuid_mts_tsjh_sbpc', dictFieldName: 'sbpc', dictObjectTableName: 'mts_tsjh' },
    { title: '数据检查状态', dataIndex: 'cytgbz', width: 180, dictFieldId: 'uuid_mts_tsjh_cytgbz', dictFieldName: 'cytgbz', dictObjectTableName: 'mts_tsjh' }
  ],
  filter_items: [
    { name: 'ckhth', label: '出口合同号', type: 1, },
  ],
  form_items: [
    { label: '出口日期', type: 5, name: 'ckrq1', format: 'YYYY-MM-DD' },
    { label: '出口合同号', type: 1, name: 'ckhth', range: true },
    { label: '核销单号', type: 1, name: 'hxdh', defaultValue: '12311234' },
  ],
  toolbar_default: {
    add: true,
    edit: true,
    delete: true,
    setting: true,
    full: true,
    download: true,
    upload: true,
    reload: true,
  },
  grid_handle_columns_default: {
    delete: true,
    edit: true,
  },
  db_fields: [...dbField_mts_tsjh, ...dbField_mts_tssb, ...dbField_zmkj_zxsb_zm_dljk],
  customer_toolbar: [
    { name: '自定义0', key: 'cus0', func: 'handleCus0' },
    { name: '自定义1', key: 'cus1', func: 'handleCus1' },
  ],
  handle_columns: [
    { name: '重置密码', key: 'cs11', func: 'handleCzmm1' },
    { name: '变更状态', key: 'cs21', func: 'handleBgzt1' },
  ],
  dict_api_grid_query: {
    type: 'c',
    url: '/queryPager',
    rel: {
      mainObjet: "28c0478520e7475e81a3129e0ee5a471",
      joins: [
        { dictObjectId1: 'mts_tsjh', dictFieldId1: 'uuid_mts_tsjh_jhpzh', dictObjectId2: 'mts_tssb', dictFieldId2: 'uuid_mts_tssb_glh', joinType: 'left join', on: 'mts_tsjh.mts_tssb=mts_tssb.mts_tssb' },
        { dictObjectId1: 'mts_tsjh', dictFieldId1: 'uuid_mts_tssb_sbpc', dictObjectId2: 'mts_tssb', dictFieldId2: 'uuid_mts_tssb_sbpc', joinType: 'left join', on: 'mts_tsjh.mts_tssb=mts_tssb.mts_tssb' },
      ],
      otherConds: "28c0478520e7475e81a3129e0ee5a471.2155f2158077476680c9b49005d5f52c !='2222222222222222'"
    },
  },
  dict_api_form_query: {
    type: 'c',
    url: '/queryPager',
    rel: {
      mainObjet: "28c0478520e7475e81a3129e0ee5a471",
      joins: [
        { dictObjectId1: 'mts_tsjh', dictFieldId1: 'uuid_mts_tsjh_jhpzh', dictObjectId2: 'mts_tssb', dictFieldId2: 'uuid_mts_tssb_glh', joinType: 'left join', on: 'mts_tsjh.mts_tssb=mts_tssb.mts_tssb' },
        { dictObjectId1: 'mts_tsjh', dictFieldId1: 'uuid_mts_tssb_sbpc', dictObjectId2: 'mts_tssb', dictFieldId2: 'uuid_mts_tssb_sbpc', joinType: 'left join', on: 'mts_tsjh.mts_tssb=mts_tssb.mts_tssb' },
      ],
      key: [
        { dictObjectId: 'mts_tsjh', dictFieldId: 'uuid_mts_tsjh_uuid', dictObjectTableName: 'mts_tssb', dictFieldName: 'uuid', dictObjectId1: 'mts_tsjh___uuid_mts_tsjh_uuid' },
        { dictObjectId: 'mts_tsjh', dictFieldId: 'uuid_mts_tsjh_jhpzh', dictObjectTableName: 'mts_tssb', dictFieldName: 'jhpzh', dictObjectId1: 'mts_tsjh___uuid_mts_tsjh_jhpzh' }
      ]
    },
  },
}

// 数据驱动 tsjh 页面元素
const pageInfoTssb = {
  page_id: 'example_unit_config2',
  module_key: 'unit_key_tssb',
  form_title: '出口明细',
  grid_title: '出口明细',
  grid_columns: [
    { title: '报关单号', dataIndex: 'ckbgdh', width: 180, dictFieldId: 'uuid_mts_tssb_ckbgdh', dictFieldName: 'ckbgdh', dictObjectTableName: 'mts_tssb', dictFieldDesc: '报关单号' },
    { title: '代理证明号', dataIndex: 'dlzmh', width: 180, sorter: true, dictFieldId: 'uuid_mts_tssb_dlzmh', dictFieldName: 'dlzmh', dictObjectTableName: 'mts_tssb', dictFieldDesc: '代理证明号' },
  ],
  filter_items: [
    { name: 'ckhth', label: '出口合同号', type: 1, dictFieldId: 'uuid_mts_tssb_ckhth', dictFieldName: 'ckhth', dictObjectTableName: 'mts_tssb', dictFieldDesc: '出口合同号' },
    { name: 'ckrq1', label: '出口日期', type: 5, dictFieldId: 'uuid_mts_tssb_ckrq1', dictFieldName: 'ckrq1', dictObjectTableName: 'mts_tssb', dictFieldDesc: '出口日期' },
  ],
  form_items: [
    { label: '出口日期', type: 5, name: 'ckrq1', format: 'YYYY-MM-DD', dictFieldId: 'uuid_mts_tssb_ckrq1', dictFieldName: 'ckrq1', dictObjectTableName: 'mts_tssb', dictFieldDesc: '出口日期' },
    { label: '出口合同号', type: 1, name: 'ckhth', range: true, dictFieldId: 'uuid_mts_tssb_ckhth', dictFieldName: 'ckhth', dictObjectTableName: 'mts_tssb', dictFieldDesc: '出口合同号' },
    { label: '核销单号', type: 1, name: 'hxdh', defaultValue: '12311234', dictFieldId: 'uuid_mts_tssb_hxdh', dictFieldName: 'hxdh', dictObjectTableName: 'mts_tssb', dictFieldDesc: '核销单号' },
  ],
  toolbar_default: {
    add: true,
    edit: true,
    delete: true,
    setting: true,
    full: true,
    download: true,
    upload: true,
    reload: true,
  },
  grid_handle_columns_default: {
    delete: true,
    edit: true,
  },
  db_fields: [...dbField_mts_tsjh, ...dbField_mts_tssb, ...dbField_zmkj_zxsb_zm_dljk],
  customer_toolbar: [
    { name: '自定义0', key: 'cus0', func: 'handleCus0' },
    { name: '自定义1', key: 'cus1', func: 'handleCus1' },
    { name: '自定义2', key: 'cus2', func: 'handleCus2' },
  ],
  handle_columns: [
    { name: '重置密码', key: 'cs11', func: 'handleCzmm1' },
    { name: '变更状态', key: 'cs21', func: 'handleBgzt1' },
  ],
  dict_api_grid_query: {
    type: 'c',
    url: '/queryPager',
    rel: {
      mainObjet: "28c0478520e7475e81a3129e0ee5a471",
      joins: [
        { dictObjectId1: 'mts_tsjh', dictFieldId1: 'uuid_mts_tsjh_jhpzh', dictObjectId2: 'mts_tssb', dictFieldId2: 'uuid_mts_tssb_glh', joinType: 'left join', on: 'mts_tsjh.mts_tssb=mts_tssb.mts_tssb' },
      ],
      otherConds: "28c0478520e7475e81a3129e0ee5a471.2155f2158077476680c9b49005d5f52c !='2222222222222222'"
    }
  },
};

// 数据驱动 业务域
async function retrieveDomain(req: any, res: any) {
  const { body } = req;
  const { page } = body;
  let returnData: any = {
    code: '200',
    body: [
      { dictDomainId: 'uuidsaas', dictDomainName: '出口退税', dictDomainNameEng: 'ckts' },
      { dictDomainId: 'uuidhsxy', dictDomainName: '慧税学苑', dictDomainNameEng: 'hsxy' },
    ]
  };
  await waitTime(200);
  return res.json(returnData);
}

// 数据驱动 数据元 - 获取物理表字段
async function retrieveFieldByObject(req: any, res: any) {
  let rows: any = [];
  if (req.body.dictObjectId === 'mts_tsjh') {
    rows = dbField_mts_tsjh;
  } else if (req.body.dictObjectId === 'mts_tssb') {
    rows = dbField_mts_tssb;
  } else if (req.body.dictObjectId === 'zmkj_zxsb_zm_dljk') {
    rows = dbField_zmkj_zxsb_zm_dljk;
  }
  await waitTime(200);
  return res.json({
    code: '200',
    body: rows,
  })
}

// 数据驱动 应用管理 列表查询
async function retrieveApp(req: any, res: any) {
  const { body } = req;
  const { page } = body;
  let returnData: any = {
    code: '200',
    body: {
      rowCount: 2,
      rows: [
        { dictDomainId: 'uuidsaas', version: 'V1.0', appId: 'app_id_1', appName: 'SAAS_冷部署', appEnName: 'SAAS cold deploy', httpRoot: 'http://192.168.21.3/', javaProjectConfig: { type: 'mySql', userName: 'root', password: 'root', url: 'http://127.0.0.1', storageType: 'storageType' }, javaProjectPath: 'c:/test/test', dbConfig: { type: 'mySql', userName: 'root', password: 'root', url: 'http://127.0.0.1' } },
        { dictDomainId: 'uuidsaas', version: 'V1.0', appId: 'app_id_2', appName: 'SAAS_热部署', appEnName: 'SAAS hot deploy', httpRoot: 'http://192.168.21.3/', javaProjectConfig: { type: 'mySql', userName: 'root', password: 'root', url: 'http://127.0.0.1', storageType: 'storageType' }, javaProjectPath: 'c:/test/test', dbConfig: { type: 'mySql', userName: 'root', password: 'root', url: 'http://127.0.0.1' } },
      ],
      page,
    },
  };
  await waitTime(200);
  return res.json(returnData);
}

// 数据驱动 配置列表查询
async function retrieveFieldPager(req: any, res: any) {
  const { body } = req;
  const { page } = body;
  let returnData: any = {
    code: '200',
    body: {
      rowCount: 21,
      rows: [...dbField_mts_tsjh, ...dbField_mts_tssb, ...dbField_zmkj_zxsb_zm_dljk],
      page,
    },
  };
  await waitTime(200);
  return res.json(returnData);
}

// 数据驱动 后端应用管理 列表查询
async function retrieveAppModule(req: any, res: any) {
  const { body } = req;
  const { page } = body;
  let returnData: any = {
    code: '200',
    body: {
      rowCount: 2,
      rows: [
        { appId: 'app_id_1', appModuleId: 'uuidtssb', appModuleName: '退税申报', appModulePath: 'saas_tssb', version: 'V1.0', dictAppModuleDef: pageInfoTssb, updateTime : 1723699864640, addTime : 1723699864640 },
        { appId: 'app_id_1', appModuleId: 'uuidtsjh', appModuleName: '退税进货', appModulePath: 'saas_tsjh', version: 'V1.0', dictAppModuleDef: pageInfoTsjh, updateTime : 1723699864640, addTime : 1723699864640 },
      ],
      page,
    },
  };
  await waitTime(200);
  return res.json(returnData);
}

// 数据驱动 根据configKey加载config
async function retrieveAppModuleDetail(req: any, res: any) {
  const { body = {} } = req;
  let returnData: any = {
    code: '200',
    desc: '【mock】表单查询成功',
    body: {
      appModuleView: {},
      appModule: {},
    }
  };
  if (body.appModuleId === 'uuidtsjh') {
    let appInfo = {
      appId: 'id_saas',
      appModuleId: 'uuidtsjh',
      appModuleName: '进货明细',
      route: '/example/unit_tool/eg_tsjh',
    }
    returnData.body.appModule = appInfo;
    returnData.body.appModuleView.dictAppModuleDef = pageInfoTsjh;
  } else {
    let appInfo = {
      appId: 'id_saas',
      appModuleId: 'uuidtssb',
      appModuleName: '出口明细',
      route: '/example/unit_tool/eg_tssb',
    }
    returnData.body.appModule = appInfo;
    returnData.body.appModuleView.dictAppModuleDef = pageInfoTssb;
  }
  await waitTime(200);
  return res.json(returnData);
}

// 数据驱动 查询页面元素json
async function automaticPageDef(req: any, res: any) {
  let returnData: any = {
    code: '200',
    body: {}
  };
  if (req.url.indexOf('tssb') > 0) {
    returnData.body = pageInfoTssb;
  } else if (req.url.indexOf('tsjh') > 0) {
    returnData.body = pageInfoTsjh;
  }
  await waitTime(200);
  return res.json(returnData);
}

// 数据驱动 查询页面元素json
async function createAppModuleByExcelData(req: any, res: any) {
  let returnData: any = {
    code: '200',
  };
  await waitTime(200);
  return res.json(returnData);
}

// 数据驱动 码表 列表查询
// 		{ title: '物理表字段英文名', dataIndex: 'dictFieldNameForName', width: 130 },
// 		{ title: '物理表字段中文名', dataIndex: 'dictFieldDescForName', width: 130 },
// 		{ title: '映射Name', dataIndex: 'dictCodeFieldNameAs', width: 90 },
// 	] },
async function queryPagerCode(req: any, res: any) {
  const { body } = req;
  const { page } = body;
  let returnData: any = {
    code: '200',
    body: {
      rowCount: 2,
      rows: [
        { dictDomainId: 'uuidsaas', dictCodeId: 'code_dept', dictCodeName: '码表部门', dictCodeObjectId: 'mts_tsjh', dictFieldNameForId: 'dictFieldId', dictFieldDescForId: 'uuid', dictCodeFieldIdAs: 'code', dictFieldNameForName: 'ssq', dictFieldDescForName: '申报年月', dictCodeFieldNameAs: 'name' },
        { dictDomainId: 'uuidsaas', dictCodeId: 'code_gljb', dictCodeName: '码表职别', dictCodeObjectId: 'mts_tsjh', dictFieldNameForId: 'dictFieldId', dictFieldDescForId: 'uuid', dictCodeFieldIdAs: 'code', dictFieldNameForName: 'ssq', dictFieldDescForName: '申报年月', dictCodeFieldNameAs: 'name' },
      ],
      page,
    },
  };
  await waitTime(200);
  return res.json(returnData);
}

// 通用crud 列表查询 权限 角色
async function queryPagerJs(req: any, res: any) {
  const { body } = req;
  const { page } = body;
  let rows: any[] = [];
  for (let i = 0; i < 10; i += 1) {
    rows.push(getRowData());
  }
  let returnData: any = {
    code: '200',
    // success: false,
    body: {
      rowCount: 100,
      rows: [
        { roleId: '11', roleName: mockjs.mock('@string(10)')},
        { roleId: '12', roleName: mockjs.mock('@string(10)')},
        { roleId: '13', roleName: mockjs.mock('@string(10)')},
        { roleId: '14', roleName: mockjs.mock('@string(10)')},
      ],
      page,
    },
  };
  await waitTime(200);
  return res.json(returnData);
}

export default {
  'POST /ns/base/getToken': getToken,
  'POST /ns/base/getUser': getUser,
  'POST /hx/qx/token/oauth': oauth,
  'POST /hx/qx/token/getLoginUserInfo': getLoginUserInfo,
  'POST /hx/ty/crud/queryPager': queryPager,    // 列表查询
  'POST /dict/automatic/queryPager': queryPager,    // 列表查询
  'POST /dict/automatic/exp/bs/queryPager': queryPager,    // 列表查询
  'POST /dict/automatic/exp/bs/queryPager/:id': queryPager,    // 列表查询
  'POST /dict/automatic/saveOrUpdate': returnCode200,    // return 200
  'POST /dict/automatic/queryForm': queryForm,      // 表单查询
  'POST /dict/automatic/delete': commonDelete,      // 表单删除
  'POST /hx/ty/crud/queryPager2': queryPager2,    // 列表查询
  'POST /hx/ty/crud/queryPager3': queryPager3,    // 列表查询
  'POST /hx/ty/crud/queryPager4': queryPager4,    // 列表查询
  'POST /hx/ty/crud/queryPager5': queryPager5,    // 列表查询
  'POST /hx/ty/crud/delete': commonDelete,      // 表单删除
  'POST /hx/ty/crud/queryForm': queryForm,      // 表单查询
  'POST /hx/ty/crud/saveOrUpdate': returnCode200,    // return 200
  'POST /test/returnCode200': returnCode200,    // return 200
  'POST /test/returnCode500': returnCode500,    // return 500
  'POST /hx/ty/check/callServiceCheck': returnCode901,
  'POST /hx/qx/token/getOneTimeToken': getOneTimeToken,
  'GET /hx/ty/report/excelReportGet/EXAMPLE_DATA_PAGE_1/onetimetoken': getDownload,
  'POST /hx/ty/crud/queryPagerS21': queryPagerS21,    // 列表查询
  'POST /ns/base/list/user': queryPager,    // 列表查询
  'POST /ns/base/list/user_log': queryPager,    // 列表查询
  // 数据驱动 ***********************************************************************************************************************************
  'POST /dict/mgmt/domain/retrieveDomain': retrieveDomain,                                    // 数据驱动 产品线
  'POST /dict/mgmt/field/retrieveFieldPager': retrieveFieldPager,                             // 数据驱动 数据元 - 获取物理表字段 列表中使用
  'POST /dict/mgmt/table/retrieveObjectByDomain': retrieveObjectByDomain,                     // 数据驱动 数据元 - 获取物理表
  'POST /dict/mgmt/table/retrieveObjectDetailByDomain': retrieveObjectByDomain,               // 数据驱动 数据元 - 获取物理表 含明细
  'POST /dict/mgmt/table/createObject': returnCode200,                                        // 数据驱动 数据元 - 创建物理表
  'POST /dict/mgmt/field/retrieveFieldByObject': retrieveFieldByObject,                       // 数据驱动 数据元 - 获取物理表字段 数据元配置弹窗使用
  'POST /dict/app/mgr/retrieveApp': retrieveApp,                                              // 数据驱动 应用管理 列表查询
  'POST /dict/app/mgr/createApp': returnCode200,                                              // 数据驱动 应用管理 列表查询
  'POST /dict/app/mgr/retrieveAppDetail': queryForm,                                          // 数据驱动 应用管理 表单查询
  'POST /dict/app/mgr/retrieveAppModule': retrieveAppModule,                                  // 数据驱动 应用模块管理 列表查询
  'POST /dict/app/mgr/retrieveAppModuleDetail': retrieveAppModuleDetail,                      // 数据驱动 应用模块管理 表单查询
  'POST /dict/automatic/center/pageDef/:id': automaticPageDef,                                // 数据驱动 查询页面元素json
  'POST /dict/app/mgr/createAppModule': returnCode200,                                        // 数据驱动 应用视图保存
  'POST /dict/app/mgr/createAppModuleByExcelData': createAppModuleByExcelData,                // 数据驱动 保存Excel至数据库
  // 数据驱动 权限 登录 *************************************************************************************************************************
  'POST /dict/security/login': returnCode200, // 数据驱动 权限 登录
  'POST /dict/login/getLoginUserInfo': getLoginUserInfoDict, // 数据驱动 权限 登录
  // 数据驱动 权限 codetable
  'POST /dict/mgmt/retrieveCode': retrieveCode,
  'POST /dict/mgmt/createCode': returnCode200,
  'POST /dict/mgmt/retrieveCodeDetail': returnCode200,
  'POST /dict/mgmt/code/queryPager': queryPagerCode,
  // 数据驱动 权限 ******************************************************************************************************************************
  'POST /dict/auth/user/queryPager': queryPager,// 权限 用户 ok
  'POST /dict/auth/user/delete': returnCode200,// 权限 用户 ok
  'POST /dict/auth/user/add': returnCode200,// 权限 用户 ok
  'POST /dict/auth/role/queryPager': queryPagerJs,// 权限 角色 ok
  'POST /dict/auth/role/delete': returnCode200,// 权限 角色 ok
  'POST /dict/auth/role/add': returnCode200,// 权限 角色 ok
  'POST /dict/auth/admin/setUserRole': returnCode200,// 权限 角色 设置用户角色 ok
  'POST /dict/auth/admin/setMenuRole': returnCode200,// 权限 菜单 设置角色菜单 ok
  'POST /dict/auth/menu/delete': returnCode200,// 权限 菜单 ok
  'POST /dict/auth/menu/add': returnCode200,// 权限 菜单 ok
  'POST /dict/qx/bm/queryPager': queryPager,// 权限 部门
  'POST /dict/qx/bm/delete': returnCode200,// 权限 部门
  'POST /dict/qx/bm/saveOrUpdate': returnCode200,// 权限 部门
  'POST /dict/qx/zy/queryPager': queryPager,// 权限 资源
  'POST /dict/qx/zy/delete': returnCode200,// 权限 资源
  'POST /dict/qx/zy/saveOrUpdate': returnCode200,// 权限 资源
};
