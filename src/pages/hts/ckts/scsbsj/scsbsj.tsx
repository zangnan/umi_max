import { intl } from '@/components/DDAssist/util';
import React, { useEffect, useRef, Fragment, useState, } from 'react';
import { useRouteData, history } from 'umi';
import { useAccess } from 'umi';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import Func from './scsbsjFun';
import { Button, Tag, Tooltip, Badge, Space, message, Upload, Form} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { querySfxgbz, shfkwjdr, shfkdr2Check } from '@/pages/hts/services/htsApi';
import cktsUtil from '@/pages/hts/cktsUtil';
import unitConfig from './scsbsjConfig';
import Sjhz from '@/pages/hts/ckts/scsbsj/sjhz/sjhz';
import GeneratedForm from '@/pages/hts/ckts/scsbsj/qrscsbsj/qrscsbsj';
import ReportGrid from '@/pages/hts/ckts/scsbsj/dybbxz/dybbxz';
import Zlsc from '@/pages/hts/ckts/scsbsj/zlsc/zlsc';
import GeneratedData from '@/pages/hts/ckts/scsbsj/sbmxcx/sbmxcx';
import Ydgl from '@/pages/hts/ckts/ydgl/ydgl';
import Ydgl2 from '@/pages/hts/ckts/ydgl2';
import myUtil from '@/components/DDAssist/util';
import qxUtil from '@/pages/hts/common/qxUtil';
import { ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import importStyle from './importStyle.less';
import DDAlert from '@/pages/hts/components/DDAlert';
import Tsxx from './tsxx';
import Tszlxz from './tszlxz';
import Zssb from './modal_zssb';



export type ScsbsjProps = {
  ywKey?: any;
  children?: any;
}
const errorMsgRef: any = React.createRef();


const Scsbsj: React.FC<ScsbsjProps> = ({
  ywKey = '',  // 测试用数据 MDT MTS ZGBA_BA ZMKJ_DLCK
  children,
}) => {
  const routeMatch = useRouteData();     // 获取当前路由的匹配信息

  const { Dragger } = Upload;

  const [pathname] = [...routeMatch.route.path.split('/')].reverse();
  // const intl = useIntl();

  // 根据路径获取业务key
  // 在 usermenu（sessionStore 动态菜单）中找 scsbsj 父节点的 ywKey
  // 匹配条件：节点 component === './hts/ckts/scsbsj/scsbsj' 且 currentPath 是其子路由或自身
  const findScsbsjYwKey = (currentPath: string, userMenu: any[]): string => {
    const findParent = (nodes: any[]): any => {
      for (const n of nodes) {
        if (n.component === './hts/ckts/scsbsj/scsbsj' && n.ywKey) {
          // 场景 A：currentPath 就是 scsbsj 父节点本身（如 /25/2505）
          if (n.path === currentPath) return n;
          // 场景 B：currentPath 是其子路由（如 /25/2505/SBMXCX_250501）
          if (n.routes?.some((r: any) => r.path === currentPath)) return n;
        }
        if (n.routes?.length) {
          const r = findParent(n.routes);
          if (r) return r;
        }
      }
      return null;
    };
    const parent = findParent(userMenu || []);
    return parent?.ywKey || '';
  };

  const getMyYwKey = () => {
    // yeKey 是父组件传递
    if (ywKey) {
      myUtil.sessionStore.setItem('scsbsjYwKey', ywKey);
      return ywKey;
    }
    // yeKey 是根据固定的URL格式获取 /ckts/scsbsj/
    if (routeMatch.route.path.indexOf('/ckts/scsbsj/') > -1) {
      return pathname;
    }
    // SaaS 路由 fallback：在 usermenu（sessionStore）中找 scsbsj 父节点的 ywKey
    // 场景：访问 /25/2505 或 /25/2505/SBMXCX_250501
    // 优先用 usermenu（动态菜单，包含 SaaS 节点）；老菜单走 myUtil.menu.getMenuObjByName
    const userMenu = myUtil.sessionStore.getItem('usermenu') || [];
    const saasKey = findScsbsjYwKey(routeMatch.route.path, userMenu);
    if (saasKey) {
      myUtil.sessionStore.setItem('scsbsjYwKey', saasKey);
      return saasKey;
    }
    // yeKey 从菜单树获取
    const menuObj = myUtil.menu.getMenuObjByName(pathname);
    let key: any = menuObj?.ywKey;
    if (!key) {
      key = myUtil.sessionStore.getItem('scsbsjYwKey');
    } else {
      myUtil.sessionStore.setItem('scsbsjYwKey', key);
    }
    return key;
  }

  const [myYwKey] = useState<string>(getMyYwKey());
  // const [lcswsxDm] = useState<string>('LCSXA081049001');  // 测试用数据
  const [lcswsxDm, setLcswsxDm] = useState<string>('LCSXA081049001');  // 测试用数据
  const [showFlzl, setShowFlzl] = useState<boolean>(false);   // 附列资料
  const refYdgl: any = useRef();
  const refYdgl2: any = useRef();
  const refXz: any = useRef();
  const refGeneratedForm: any = useRef(); // index:0
  const refSjhz: any = useRef(); // index:1
  const refReportGrid: any = useRef(); // index:2
  const refAttachmentData: any = useRef(); // index:4
  const refGeneratedData: any = useRef(); // index:5
  const [myConfig, setMyConfig] = useState<any>(null);
  const access = useAccess(); // 权限
  const qylx = cktsUtil.sys.enterpriseType(); // 企业类型
  const refZssb: any = useRef();


  // 单一窗口调整
  const paramDyck = {
    qxCode: 'tssb_dyck',
    accessObj: access,
  }

  // 附列资料
  const paramFlzl = {
    qxCode: 'flzl',
    accessObj: access,
  }

  const zyParam = {
    zycode: 'S_000001_000001',
    accessObj: access,
  }

  // UAT环境标识
  const paramUat = {
    qxCode: 'qd_uat',
    accessObj: access,
  }

  // 列表列
  const getColumns = (isShowFlzl: any) => {

    // 列表表头格式化: 自检情况
    const titleNameCnt = (
      <Tooltip title={(
        <div>
          <div>疑点数量合计/允许挑过疑点数量/不允许挑过疑点数量。</div>
          <div>点击数字可查看对应疑点信息。</div>
        </div>
      )}>
        {'疑点情况'} <QuestionCircleOutlined />
      </Tooltip>
    );

    // 列表表头格式化: 数据自检结果
    const titleNameSjzjpw = (
      // todo
      <Fragment>
        数据自检结果
        {/* <Tooltip title='点击刷新数据自检结果'>
          <ReloadOutlined onClick={() => reloadGrid()} />
        </Tooltip> */}
      </Fragment>
    );

    // 列表内容格式化: 申报文件
    const renderColumnWjm = (_text: any, record: any) => {
      return <Tooltip title={record.wjm}>
        <a onClick={() => { downloadFile(record) }} style={{ cursor: 'pointer' }}>{record.wjm}</a>
      </Tooltip>
    }

    // 列表内容格式化: 申报状态
    const renderColumnSjsbuuid = (text: string, record: any) => {
      if (record?.sjsbuuid?.trim()) {
        if (record?.sjsbztDm === '1' || record?.sjsbztDm === '2' || record?.sjsbztDm === '3') {
          return (<Tag color="blue">已申报</Tag>);
        } else {
          return (<Tag color="blue">申报中</Tag>);
        }
      }
      if (record.sjzjsj && (`${record.sjzjsj}`).trim()) {               // 有数据自检时间，显示已自检
        return (<Tag color="blue">已自检</Tag>);
      }
      return (<Tag>未申报</Tag>)                  // 默认显示未申报
    }

    // 列表内容格式化: 数据自检结果
    const renderColumnSjzjpw = (text: string, record: any) => {
      let renderText;
      if (text) {
        renderText = <Tag color="cyan">自检排位：{text}</Tag>;
      } else if (record.fkztDm === '1') {
        renderText = <Tag color="blue">自检中</Tag>;
      } else if (record.fkztDm === '2') {
        renderText = (<Fragment><Tag color="red">自检失败</Tag><Tooltip placement="topLeft" title={record.fkxxms}>{record.fkxxms}</Tooltip></Fragment>);
      } else if (record.fkztDm === '3') {
        renderText = <Tag color="green">自检成功</Tag>;
      } else if (record.sjzjuuid && (record.sjzjuuid).trim()) {
        renderText = <Tag color="orange">已上传待自检</Tag>;
      }
      return renderText;
    }

    // 列表内容格式化: 自检情况
    const renderColumnCnt = (text: any, record: any) => {
      let info;
      const { cnt, ktgCnt, btgCnt, sjzjuuid, fkztDm } = record;
      if (cnt === 0) {
        info = (
          <div>
            <div>自检情况无疑点</div>
          </div>
        );
      } else {
        info = (
          <div>
            <div>疑点总数 {cnt} 条</div>
            <div>允许挑过 {ktgCnt} 条</div>
            <div>不允许挑过 {btgCnt} 条</div>
          </div>
        );
      }
      let renderText;
      if (sjzjuuid && (fkztDm === '3' || fkztDm === '2')) {  // 原系统显示只判断3 ??
        renderText = (
          <Tooltip title={info}>
            <Space>
              <span style={{ cursor: 'pointer' }} onClick={() => showExcptionDetail(record, 1)} ><Badge showZero count={cnt} style={{ backgroundColor: cnt > 0 ? '#f50' : '#108ee9' }} /></span>
              <span style={{ cursor: 'pointer' }} onClick={() => showExcptionDetail(record, 2)} ><Badge showZero count={ktgCnt} style={{ backgroundColor: cnt > 0 ? '#f50' : '#108ee9' }} /></span>
              <span style={{ cursor: 'pointer' }} onClick={() => showExcptionDetail(record, 3)} ><Badge showZero count={btgCnt} style={{ backgroundColor: cnt > 0 ? '#f50' : '#108ee9' }} /></span>
            </Space>
          </Tooltip>
        )
      } else {
        renderText = '';
      }
      return renderText;
    }

    // 列表内容格式化: 报送资料
    const renderColumnBszl = (text: any, record: any) => {
      let sjsbztDm = record.sjsbztDm;
      let btnContent: any;
      if (isShowFlzl && sjsbztDm == '1') {
        btnContent = <Fragment>资料上传</Fragment>;
      }
      return <Button type='link' onClick={() => uploadFile(record)} >{btnContent}</Button>
    }

    // 1.所属期 2.批次 3.申请日期 4.生成时间(不显示) 5.申报文件
    // 6.申报/申请状态 7.数据自检时间 8.数据自检结果 9.自检结果fkxxms(作废不显示) 10.自检情况 11.附列资料(不显示)
    const cols = [];
    if (cktsUtil.moduleType(myYwKey, 'SQRQ')) { // 是否有申请日期
      cols.push({ title: '申请日期', dataIndex: 'tbrq1', width: 120, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD' } });
    } else {
      cols.push({ title: '所属期', dataIndex: 'ssq', width: 65, align: 'center' });
      if (cktsUtil.moduleType(myYwKey, 'SBPC')) { // 是否有申报批次
        cols.push({ title: '批次', dataIndex: 'sbpc', width: 50, align: 'center' });
      }
    }
    cols.push({ title: '申报文件', dataIndex: 'wjm', width: 180, ellipsis: true, render: renderColumnWjm });
    // 网报 申请状态或者申报状态 隐藏
    if (!qxUtil.getQxz(paramDyck) || myYwKey === 'MDT' || myYwKey === 'MTS' || myYwKey === 'DBTS') {
      if (myYwKey === 'MDT' || myYwKey === 'MTS' || myYwKey === 'DBTS') {
        cols.push({
          title: myYwKey.indexOf('ZMKJ_') > -1 ? '申请状态' : '申报状态', dataIndex: 'sbztDm', width: 100, align: 'center', render: renderColumnSjsbuuid,
          filter: {
            type: 'Select',
            codeTable: 'CODE_STATIC_TSSB_SBZT:03',
          }
        });
      } else {
        cols.push({ title: myYwKey.indexOf('ZMKJ_') > -1 ? '申请状态' : '申报状态', dataIndex: 'sbztDm', width: 100, align: 'center', render: renderColumnSjsbuuid });
      }
    }

    // 数据生成时间
    cols.push({ title: '数据生成时间', dataIndex: 'sbwjscsj', width: 160, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } });

    // 是否有自检
    console.log(myYwKey)
    const dzswjPbyw = ['ZMKJ_LLJGHX', 'ZMKJ_DLJK', 'ZMKJ_WTCK'];// , 'JLJG_MDTHX'
    if (cktsUtil.moduleType(myYwKey, 'SJZJ') && (!qxUtil.getZy(zyParam) || !dzswjPbyw.includes(myYwKey))) {
      // 是否显示自检时间（网报不显示自检）
      if (!qxUtil.getQxz(paramDyck) || myYwKey === 'MDT' || myYwKey === 'MTS' || myYwKey === 'DBTS' || myYwKey === 'JLJG_MDTHX') {
        cols.push({ title: '数据自检时间', dataIndex: 'sjzjsj', width: 160, align: 'center', render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } });
        cols.push({ title: titleNameSjzjpw, dataIndex: 'sjzjpw', width: 160, ellipsis: true, render: renderColumnSjzjpw });
      }
      cols.push({ title: titleNameCnt, dataIndex: 'cnt', width: 150, ellipsis: true, render: renderColumnCnt });
    }

    // 报送资料
    if (isShowFlzl && qxUtil.getQxz(paramFlzl)) {
      cols.push({ title: '报送资料', dataIndex: 'bszl', width: 80, align: 'center', fixed: 'right', render: renderColumnBszl });
    }
    return cols;
  };

  // 工具栏
  const getCustomerToobar = () => {
    const ywKey = getMyYwKey();
    const tBars: any = [];
    tBars.push({ name: '生成申报数据', key: 'tssb_scsbsj', func: 'dataCreate' });
    tBars.push({ name: '撤销申报数据', key: 'tssb_cxsbsj', func: 'dataRecall' });
    if (ywKey === 'MTS') {
      tBars.push({ name: '数据汇总', key: 'tssb_sjhz', func: 'dataGather' });
    }
    // 网报 数据自检按钮  证明申报、购进、核销 隐藏
    const btncommon_002 = {
      btncode: 'common_002',
      accessObj: access,
      ywKey: myYwKey,
      qylx,
    }

    if (cktsUtil.moduleType(myYwKey, 'SJZJ')) {
      // 金四地区。以下功能屏蔽数据自检按钮。
      const dzswjPbyw = ['ZMKJ_LLJGHX', 'ZMKJ_DLJK', 'ZMKJ_WTCK'];//, 'JLJG_MDTHX'
      if (qxUtil.getZy(zyParam) && dzswjPbyw.includes(myYwKey)) {
        //
      } else {
        if (!qxUtil.getBtnQxz(btncommon_002) || !cktsUtil.moduleType(myYwKey, 'dyck_sjzj')) {
          tBars.push({ name: '数据自检', key: 'tssb_sjzj', func: 'dataCheck' });
        }
      }
    }

    // 网报 证明申请(正式申报)按钮 证明申报、购进 隐藏证明申请按钮,  其他业务、资格备案隐藏正式申报按钮
    const btncommon_003 = {
      btncode: 'common_003',
      accessObj: access,
      ywKey: myYwKey,
      qylx,
    }
    const zssbDisabled = qxUtil.getQxz(paramUat);
    if (!qxUtil.getBtnQxz(btncommon_003) || !cktsUtil.moduleType(myYwKey, 'dyck_zmsq')) {
      // 正式申报前需要强制数据自检的业务
      const sjzjToZssbYwKeys = ['MDT', 'MTS', 'DBTS', 'ZMKJ_LLJG', 'ZMKJ_DLCK', 'ZMKJ_CKHWZNX', 'ZMKJ_TYYBS', 'QTYW_HWCHS'];
      if (sjzjToZssbYwKeys.includes(myYwKey)) {
        tBars.push({name: myYwKey.indexOf('ZMKJ_') > -1 ? '证明申请' : '正式申报', key: 'tssb_zmsq_zssb', func: 'proveApplyNew', disabled: zssbDisabled});
      } else {
        tBars.push({name: myYwKey.indexOf('ZMKJ_') > -1 ? '证明申请' : '正式申报', key: 'tssb_zmsq_zssb', func: 'proveApply', disabled: zssbDisabled});
      }
      // if (myYwKey.indexOf('MDT') > -1 || myYwKey.indexOf('MTS') > -1 || myYwKey.indexOf('DBTS') > -1) {
      //   tBars.push({ name: '正式申报', key: 'tssb_zmsq_zssb_new', func: 'proveApplyNew' });
      // } else {
      //   tBars.push({ name: myYwKey.indexOf('ZMKJ_') > -1 ? '证明申请' : '正式申报', key: 'tssb_zmsq_zssb', func: 'proveApply' });
      // }
    }
    if (cktsUtil.moduleType(myYwKey, 'BBDY')) {
      tBars.push({ name: '打印报表下载', key: 'tssb_lssbjl', func: 'reportPrint' });
    }

    // 单一窗口 下载申报文件按钮  证明申报、其他业务、资格备案、购进 核销 显示,
    const btncommon_005 = {
      btncode: 'common_005',
      accessObj: access,
      ywKey: myYwKey,
      qylx,
    }
    if (!qxUtil.getBtnQxz(btncommon_005) && cktsUtil.moduleType(myYwKey, 'dyck_xzsbwj')) {
      tBars.push({ name: '下载申报文件', key: 'tssb_xzsbwj', func: 'downloadFileBtn' });
    }

    // 单一窗口 反馈读入按钮  证明申报、其他业务、资格备案、购进 核销 显示,
    const btncommon_006 = {
      btncode: 'common_006',
      accessObj: access,
      ywKey: myYwKey,
      qylx,
    }
    if (!qxUtil.getBtnQxz(btncommon_006) && cktsUtil.moduleType(myYwKey, 'dyck_fkdr')) {
      tBars.push({ name: '反馈读入', key: 'tssb_fkdr', func: 'fkdr' });
    }

    return tBars;
  };

  // 配置项：自定义操作列
  const getHandleColumns = () => {
    const handleCols = [];
    const btncommon_004 = {
      btncode: 'common_004',
      accessObj: access,
      ywKey: myYwKey,
      qylx
    }
    if (cktsUtil.moduleType(myYwKey, 'SJZJ')) {
      // 单一窗口 刷新按钮  证明申报、其他业务、资格备案、购进 核销 隐藏,
      if (!qxUtil.getBtnQxz(btncommon_004) || !cktsUtil.moduleType(myYwKey, 'dyck_sx')) {
        handleCols.push({ name: '刷新', key: 'sx', func: 'reloadColumn', display: 'displayReload' });
      }
      if (myYwKey != 'QTYW_HWCHS' ) {
        handleCols.push({ name: '疑点智能处理', key: 'ydzncl', func: 'showExcptionDetail2', display: 'displayYdzncl' }); // todo
      }
    }
    handleCols.push({ name: '申报明细查看', key: 'sbmxck', func: 'viewData' });
    if (myYwKey == 'MTS' || myYwKey == 'MDT') {
      handleCols.push({ name: '退税资料下载', key: 'tszlxz', func: 'tszlxz' });
    }
    return handleCols;
  };

  // 添加私有页面或组件
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refGeneratedForm);
    otherRef.push(refSjhz);
    otherRef.push(refReportGrid);
    otherRef.push(myYwKey);
    otherRef.push(refAttachmentData);
    otherRef.push(refGeneratedData);
    otherRef.push(refXz);
    otherRef.push(refZssb);

    return otherRef;
  };

  // 配置项：反馈读入
  Func.fkdr = (param: any) => {
    const { unitRef } = param;
    // 获取菜单id
    let menuId = '1105';
    if (routeMatch.route.path.indexOf('/ckts/scsbsj/') === -1) {
      const menuObj = myUtil.menu.getMenuObjByName(pathname);
      menuId = menuObj.pid;
    }
    const beforeUpload = (file: any) => {
      if (!file.name.toUpperCase().endsWith(".XML")) {
        message.info('上传文件必须是XML文件。');
        return Upload.LIST_IGNORE;
      } else {
        return false;
      }
    }

    DDAlert.open({
      title: '反馈读入',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      width: 720,
      content: <>
        <Form.Item labelCol={{ span: 24 }} wrapperCol={{ span: 24 }} label="文件选择" name="file" valuePropName="fileList" rules={[{ required: true, message: '请选择上传的文件' }]} getValueFromEvent={(e: any) => { if (Array.isArray(e)) { return e; } return e && e.fileList; }}>
          <Dragger
            maxCount={1}
            showUploadList={true}
            beforeUpload={beforeUpload}
            itemRender={(originNode, file, currFileList, actions: { download: any, preview: any, remove: any }) => (
              <table className={importStyle.importTable}>
                <tr>
                  <th>文件名</th>
                  <th>文件大小</th>
                  <th>状态</th>
                  <th>操作</th>
                </tr>
                <tr>
                  <td width='45%' className={importStyle.textCenter}>
                    <Tooltip title={file.name}>
                      <div className={importStyle.textName}>{file.name}</div>
                    </Tooltip>
                  </td>
                  <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size ? (file.size / 1024) : 0, '0,0')}KB</td>
                  <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                  <td width="17%" className={importStyle.textCenter}><a onClick={() => actions.remove()}>删除</a></td>
                </tr>
              </table>
            )}
          >
            <p className="ant-upload-drag-icon">
              <InboxOutlined />
            </p>
            <p className="ant-upload-text">点击或将文件拖拽到此区域</p>
          </Dragger>
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          const formData = new FormData();
          formData.append('cdDm', menuId);
          formData.append('file', values.file[0].originFileObj);
          formData.append('fileName', values.file[0].name);
          shfkdr2Check(formData).then((res) => {
            thisObj.setState({ masker: false });
            const { code, body, msg } = res;
            if (code == '200') {
              DDAlert.close();
              drcgTz();
            } else if (code == '901') {
              errorMsgRef.current!.showModal(body, '901', formData, '2');
            } else if (code == '902') {
              errorMsgRef.current!.showModal(body, '902', formData, '2');
            } else {
              message.error(msg);
            }

          });



        });
      },
    });
  }

  const drcgTz = () => {
    DDAlert.open({
      title: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_title' }),
      info: intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_info' }),
      infoType: 'success',
      content: [
        intl.formatMessage({ id: 'message_jljghx_sjxz_sjxz_content_xzrw' }),
      ],
      okText: '转任务管理',
      okCallbackFn: function () {
        history.push('/02/0201');
      }
    });
  }

  // 查看疑点查询
  const showExcptionDetail = (record: any, type: any) => {
    if (record.cnt <= 0) {
      return;
    }
    let ktgydbz = '';
    if (type === 2) { // 可挑过
      ktgydbz = 'Y'; // 不可挑过
    } else if (type === 3) {
      ktgydbz = 'N';
    }
    const param = record;
    param.ktgydbz = ktgydbz;
    param.ywKey = myYwKey;
    const curShowModal = refYdgl.current!.showModal;
    const cs: any = {
      ssq: record.ssq,
      sbpc: record.sbpc,
      sjzjuuid: record.sjzjuuid,
      lcswsxDm: record.lcswsxDm,
      ywKey: myYwKey,
    }
    curShowModal(param);
  };
  // 查看疑点查询2
  Func.showExcptionDetail2 = (param: any) => {
    const { record } = param;
    if (record.cnt <= 0) {
      return;
    }
    let ktgydbz = '';
    // if (type === 2) { // 可挑过
    // 	ktgydbz = 'W'; // 不可挑过
    // } else if (type === 3) {
    // 	ktgydbz = 'E';
    // }
    const params = record;
    params.ktgydbz = ktgydbz;
    params.ywKey = myYwKey;
    const curShowModal = refYdgl2.current!.showModal;
    const cs: any = {
      ssq: record.ssq,
      sbpc: record.sbpc,
      sjzjuuid: record.sjzjuuid,
      lcswsxDm: record.lcswsxDm,
      ywKey: myYwKey,
    }
    curShowModal(params, cs);
  };

  // 下载申报文件
  const downloadFile = async (record: any) => {
    const url = '/yw/bszx/ggfw/scsbsj/sjgl/sbwjXzGet/';
    const params = {
      ssq: record.ssq,
      sbwjuuid: record.sbwjuuid,
      ywKey: myYwKey
    }
    const unitRef = Func.unitRef;
    unitRef.current?.setMasker(true);
    await cktsUtil.downloadFileCkts(url, params);
    unitRef.current?.setMasker(false);
  };

  // 资料上传
  const uploadFile = (record: any) => {
    // queryDsbsjLb(record).then((response) => {
    //   const { code, msg } = response;
    //   if (code === '200') {
    //     const curShowModal = refAttachmentData.current!.showModal;
    //     curShowModal(record);
    //   } else if (code === '200') {
    //     message.info(msg);
    //   }
    // })
    setLcswsxDm(record.lcswsxDm);
    const curShowModal = refAttachmentData.current!.showModal;
    curShowModal(record, Func.unitRef);
  };

  // 刷新数据审核结果
  const reloadGrid = () => {
    const unitRef = Func.unitRef;
    unitRef.current!.reload2();
  };


  // useEffect
  useEffect(() => {
    const key = getMyYwKey();
    // 是否有附列资料
    let showFlzlTmp = false;

    if (history.location.pathname.indexOf('SBMXCX_05030201') > 0) {
      showFlzlTmp = true;
      setShowFlzl(true);
    }
    const myConfigTmp: any = { ...unitConfig };
    // 配置项：自定义工具栏
    myConfigTmp.customer_toolbar = getCustomerToobar();
    // 初始查询条件
    myConfigTmp.gridParams = {
      initSearchModal: [
        { property: 'ywKey', value: key, op: 'al' },
      ],
    }
    // 配置列表列
    myConfigTmp.grid_row_key = 'sbwjuuid';
    myConfigTmp.grid_columns = getColumns(showFlzlTmp);
    myConfigTmp.handle_columns = getHandleColumns();
    if (key.indexOf('ZMKJ_') > -1) {
      myConfigTmp.grid_title = '证明申请';
    }
    if (key.indexOf('ZGBA_') > -1 || key.indexOf('QTYW_') > -1) {
      myConfigTmp.grid_title = '数据申报';
    }
    if (key == 'JLJG_MDTHX') {
      myConfigTmp.grid_title = '核销数据申报';
    }
    setMyConfig(myConfigTmp);
  }, []);

  return (<>
    {myConfig && <DDBunit2 config={myConfig} func={Func} />}
    <GeneratedForm onRef={refGeneratedForm} ywKey={myYwKey} showFlzl={showFlzl} />
    <Sjhz onRef={refSjhz} />
    <ReportGrid onRef={refReportGrid} ywKey={myYwKey} />
    <GeneratedData onRef={refGeneratedData} ywKey={myYwKey} />
    <Ydgl onRef={refYdgl} ywKey={myYwKey} />
    <Ydgl2 onRef={refYdgl2} ywKey={myYwKey} />
    <Tsxx onRef={errorMsgRef} />
    <Tszlxz onRef={refXz} ywKey={myYwKey} />
    <Zssb onRef={refZssb} ywKey={myYwKey} />
  </>);
};

export default Scsbsj;
