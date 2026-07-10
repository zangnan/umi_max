import { intl } from '@/components/DDAssist/util';
import React, { useEffect, useRef, Fragment, useState } from 'react';
import { useRouteData} from 'umi';
import DDBunit2 from '@/pages/hts/components/DDBunit2_ckts/DDBunit2_CKTS';
import {  message, Tag, Badge, Space, Form, Upload, Button, Tooltip} from 'antd';
import { QuestionCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import cktsUtil from '@/pages/hts/cktsUtil';
import Ydgl from '@/pages/hts/ckts/ydgl/ydgl';
import History from '@/pages/hts/ckts/sbsjcx/lssbsjcx/lssbsjcx';
import Shsjxz from '@/pages/hts/ckts/sbsjcx/shsjxz/shsjxz';
import Shjdcx from './shjdcx/shjdcx';
import unitConfig from './sbsjcxConfig';
import Func from './sbsjcxFun';
import myUtil from '@/components/DDAssist/util';
import { UploadOutlined, ClockCircleOutlined, InboxOutlined } from '@ant-design/icons';
import DDAlert from '@/pages/hts/components/DDAlert';
import { shfkdr2, shfkdr2Check } from '@/pages/hts/services/htsApi';
import importStyle from './importStyle.less';
import Tsxx from '../../ckts/scsbsj/tsxx';
import { useAccess, history } from 'umi';
import qxUtil from '@/pages/hts/common/qxUtil';



export type SbsjcxProps = {
  ywKey?: any;
}
const errorMsgRef: any = React.createRef();
const TableList: React.FC<SbsjcxProps> = ({
  ywKey = '',
}) => {
  const { Dragger } = Upload;
  const access = useAccess(); // 权限
  const routeMatch = useRouteData();     // 获取当前路由的匹配信息
  // 根据路径获取业务key
  const getMyYwKey = () => {
    // yeKey 是父组件传递
    if (ywKey) {
      myUtil.sessionStore.setItem('sbsjcxYwKey', ywKey);
      return ywKey;
    }
    const [pathname] = [...routeMatch.route.path.split('/')].reverse();
    // yeKey 是根据固定的URL格式获取 /ckts/sbsjcx/
    if (routeMatch.route.path.indexOf('/ckts/sbsjcx/') > -1) {
      return pathname;
    }
    // yeKey 从菜单树获取
    const menuObj = myUtil.menu.getMenuObjByName(pathname);
    let key: any = menuObj?.ywKey;
    if (!key) {
      key = myUtil.sessionStore.getItem('sbsjcxYwKey');
    } else {
      myUtil.sessionStore.setItem('sbsjcxYwKey', key);
    }
    return key;
  }
  const [myYwKey] = useState<string>(getMyYwKey());  // 测试用数据 MDT MTS ZGBA_BA ZMKJ_DLCK ZGBA_BABG
  const refYdgl: any = useRef();
  const refHistory: any = useRef();
  const refShsjxz: any = useRef();
  const refShjdcx: any = useRef();
  
  // const intl = useIntl();


  // 列表列
  const getColumns = () => {
    // 列表表头格式化: 审核情况
    const titleNameCnt = (
      <Tooltip title={(
          <div>
            <div>疑点数量合计/允许挑过疑点数量/不允许挑过疑点数量。</div>
            <div>点击数字可查看对应疑点信息。</div>
          </div>
        )}>
        审核情况 <QuestionCircleOutlined />
      </Tooltip>
    );
    // 审核状态
    const titleNameSjsbztDm = (
      <Fragment>
        审核状态
        {/* <Tooltip title='点击刷新数据审核结果'>
          <ReloadOutlined onClick={() => reloadGrid()} />
        </Tooltip> */}
      </Fragment>
    );
    // 列表内容格式化: 审核状态
    const renderColumnSjsbztDm = (text: string) => {
      if (text === '0') {
        return <Tag color="orange">申报中</Tag>
      }
      if (text === '1') {
        return <Tag color="blue">审核中</Tag>
      }
      if (text === '2') {
        return <Tag color="red">审核失败</Tag>
      }
      if (text === '3') {
        return <Tag color="green">审核成功</Tag>
      }
      return <Tag color="orange">申报中</Tag>;
    }
    const renderColumnSjsbxxms = (text: any, record: any) => {
        if (!text?.trim() && record.sjsbztDm != '2' && record.sjsbztDm != '3') {
          return "文件上传中，请尝试刷新操作，更新审核状态";
        }
        return text;
    }

    // 列表内容格式化: 税务事项通知书
    const renderColumnSwsxtzs = (text: any, record: any) => {
      if (text === 'Y') {
        if (record.zysltzs === 'Y') {
          return <Button type='link' onClick={() => downloadFile(record, 1, '20')} >准予受理通知书</Button>
        }
        if (record.bysltzs === 'Y') {
          return <Button type='link' onClick={() => downloadFile(record, 1, '21')} >不予受理通知书</Button>
        }
        if (record.bybltzs === 'Y') {
          return <Button type='link' onClick={() => downloadFile(record, 1, '22')} >不予办理通知书</Button>
        }
        if (record.bytstzs === 'Y') {
          return <Button type='link' onClick={() => downloadFile(record, 1, '23')} >不予退税通知书</Button>
        }
      }
      return null;
    }
    // 列表内容格式化: 税务事项通知书
    const renderColumnZmwskj = (text: any, record: any) => {
      if (text === 'Y') {
        return <Button type='link' onClick={() => downloadFile(record, 2)} >文书下载</Button>
      }
      return null;
    }
    // 列表内容格式化: 自检情况
    const renderColumnCnt = (text: any, record: any) => {
      let info;
      const {cnt, ktgCnt, btgCnt, sjsbuuid } = record;
      if (cnt === 0) {
        info = (
          <div>
            <div>自检情况无疑点</div>
          </div>
        );
      } else {
        info = (
          <div>
            <div>疑点总数 { cnt } 条</div>
            <div>允许挑过 { ktgCnt } 条</div>
            <div>不允许挑过 { btgCnt } 条</div>
          </div>
        );
      }
      let renderText: any = '';
      if (sjsbuuid) {  // 原系统显示只判断3 ??
        renderText = (
          <Tooltip title={info}>
            <Space>
              <span onClick={() => showExcptionDetail(record, 1)} ><Badge showZero count={cnt} style={{ backgroundColor: cnt > 0 ? '#f50': '#108ee9' }} /></span>
              <span onClick={() => showExcptionDetail(record, 2)} ><Badge showZero count={ktgCnt} style={{ backgroundColor: cnt > 0 ? '#f50': '#108ee9' }} /></span>
              <span onClick={() => showExcptionDetail(record, 3)} ><Badge showZero count={btgCnt} style={{ backgroundColor: cnt > 0 ? '#f50': '#108ee9' }} /></span>
            </Space>
          </Tooltip>
        )
      }
      return renderText;
    }
    const cols = [];
    if (cktsUtil.moduleType(myYwKey, 'SQRQ')) { // 是否有申请日期
      cols.push({ title: '申请日期', dataIndex: 'tbrq1', width: 120, render: { type: 'date', format: 'yyyy-MM-DD' } });
    } else {
      cols.push({ title: '所属期', dataIndex: 'ssq', width: 65 });
      if (cktsUtil.moduleType(myYwKey, 'SBPC')) { // 是否有申报批次
				cols.push({ title: '批次', dataIndex: 'sbpc', width: 50 });
			}
    }
    cols.push({ title: '申报时间', dataIndex: 'sjsbsj', width: 160, render: { type: 'date', format: 'yyyy-MM-DD HH:mm:ss' } });
    if (myYwKey.indexOf('MDT') > -1 || myYwKey.indexOf('MTS') > -1 || myYwKey.indexOf('DBTS') > -1) {
      cols.push({ title: titleNameSjsbztDm, dataIndex: 'sjsbztDm', width: 100, render: renderColumnSjsbztDm, filter: {
        type: 'Select',
        codeTable: 'CODE_STATIC_TSSB_SHZT:03',
      }});
    } else {
      cols.push({ title: titleNameSjsbztDm, dataIndex: 'sjsbztDm', width: 100, render: renderColumnSjsbztDm });
    }
    cols.push({ title: '审核流程信息', dataIndex: 'sjsbxxms', ellipsis: true, render:  renderColumnSjsbxxms});
    // // 判断是否有自检
    // if (cktsUtil.moduleType(myYwKey, 'SJZJ')) {
    //   cols.push({ title: titleNameCnt, dataIndex: 'cnt', width: 150, ellipsis: true, render: renderColumnCnt });
		// }
    // cols.push({ title: '税务事项通知书', dataIndex: 'swsxtzs', ellipsis: true, width: 130, fixed: 'right', render: renderColumnSwsxtzs });
    // // 判断是否为单证业务，若不是则屏蔽 文书开具列
    // if (myYwKey.indexOf('ZMKJ_') > -1) {
    //   cols.push({ title: '证明文书开具', dataIndex: 'zmwskj', ellipsis: true, width: 130, fixed: 'right', render: renderColumnZmwskj });
		// }
    return cols;
  }

  // 添加私有页面或组件
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(refHistory);
    otherRef.push(refShsjxz);
    otherRef.push(myYwKey);
    otherRef.push(refShjdcx);
    return otherRef;
  };


// 配置项：反馈读入
Func.shfkdr = (param: any) => {
  const beforeUpload = (file: any) => {
    if(!file.name.toUpperCase().endsWith(".XML")){
      message.info('上传文件必须是XML文件。');
      return Upload.LIST_IGNORE;
    } else {
      return false;
    }
  }
  const [pathname] = [...routeMatch.route.path.split('/')].reverse();
  let menuId = '1105';
  if (routeMatch.route.path.indexOf('/ckts/scsbsj/') === -1) {
    const menuObj = myUtil.menu.getMenuObjByName(pathname);
    menuId = menuObj.pid;
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
                  <td width="20%" className={importStyle.textCenter}>{myUtil.text.formatNum(file.size?(file.size/1024):0, '0,0')}KB</td>
                  <td width="18%" className={importStyle.textCenter}><ClockCircleOutlined />&nbsp;待上传</td>
                  <td width="17%" className={importStyle.textCenter}><a onClick={()=>actions.remove()}>删除</a></td>
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
        formData.append('fileName', values.file[0].originFileObj);
        formData.append('file-name-suffix', values.file[0].name);
        shfkdr2Check(formData).then((res1) => {
          thisObj.setState({ masker: false });
          if (res1.code === '200') {
            // thisObj.setState({ masker: true });
            // DDAlert.close();
            // shfkdr2(formData).then((res) => {
            //   const { code, body, msg } = res;
            //   if (code === '200') {
            //     thisObj.setState({ masker: false });
            //     message.success(body);
            //   } else {
            //     thisObj.setState({ masker: false });
            //     message.error(msg);
            //   }
            // });
            DDAlert.close();
            drcgTz();
          } else if(res1.code === '901') {
            errorMsgRef.current!.showModal(res1.body,'901',formData,'1');
            DDAlert.close();
          }else if(res1.code === '902') {
            errorMsgRef.current!.showModal(res1.body,'902',formData,'1');
            DDAlert.close();
          }else{
            message.error(res1.msg);
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


  // 疑点查询
  const showExcptionDetail = (record: any, type: any) => {
    if (!record.sjsbuuid) {
      message.error('无法进行疑点查看');
			return;
		}
    const curShowModal = refYdgl.current!.showModal;
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
    curShowModal(param);
  };

  // 下载申报文件
  const downloadFile = (record: any, type: any, cktszmlxDm?: any) => {
    const url = '/yw/bszx/ggfw/shjgcx/downloadSxwsGet/';
    const params: any = {
      accessClientId: '1',
      lcslid: record.lcslid,
      djxh: record.djxh,
      swsxtzs: record.swsxtzs,
      ywKey: myYwKey,
    }
    if (type === 1) {
      params.cktszmlxDm = cktszmlxDm;
    }
    if (type === 2) { // 证明类
      params.zmwskj = record.zmwskj;
    }
    cktsUtil.downloadFileCkts(url, params);
  };

  // 刷新数据审核结果
  const reloadGrid = () => {
    const refUnit = Func.refUnit;
    refUnit.current!.reload();
  };

  // 配置项：自定义操作列
  const getHandleColumns = () => {
    const handleCols = [];
    handleCols.push({ name: '刷新', key: 'sx', func: 'reloadColumn', display: 'displayReload' });
    handleCols.push({ name: '审核进度', key: 'shjd', func: 'shjdcxColumn', display: 'displayShjdcx' });
    return handleCols;
  };

  // useEffect
  
    const config: any = { ...unitConfig };
    const key = getMyYwKey();

    // 初始查询条件
    config.gridParams = {
      initSearchModal: [
        { property: 'ywKey', value: key, op: 'al' },
      ],
    }

    // 配置列表列
    config.grid_columns = getColumns();
		// 控制是否显示【反馈录入】【审核数据下载】按钮
		if ('ZMKJ_BBCKTSZM' == key || 'ZMKJ_CKZMZFQD' == key || (key.indexOf('ZGBA_') == 0 && key != 'ZGBA_CKTSYWTX') || key == 'JLJG_JHFPBA' || key == 'JLJG_JHFPBG') {
			config.customer_toolbar = [];
		}
		if (key.indexOf('QTYW_') == 0 && key != 'QTYW_CKXXCX' && key != 'QTYW_JHPZXXHT') {
			config.customer_toolbar = [];
		}
    if('JLJG_MDTHX' === key ){
			config.customer_toolbar = [];
    }
    // edit by yangzq 金四地区没有代理进口、出口信息查询、进货凭证回退的反馈下载，保留反馈读入
    if (qxUtil.getZy({ zycode: 'S_000001_000001', accessObj: access, }) && ('ZMKJ_DLJK' == key || key.indexOf('QTYW_') == 0)) {
      config.customer_toolbar = [{ name: '反馈读入', key: 'fkdr', func: 'shfkdr' }];
    }
    if ('QTYW_HWCHS' === key) {
      config.customer_toolbar = [
        { name: '反馈读入', key: 'fkdr', func: 'shfkdr' },
        { name: '审核数据下载', key: 'shsjxz', func: 'shsjxz'}
      ];
    }

    config.handle_columns = getHandleColumns();
    
  
  return (
    <>
      <DDBunit2 config={config} func={Func} />
      <History onRef={refHistory} ywKey={myYwKey}/>
      <Ydgl onRef={refYdgl} ywKey={myYwKey}/>
      <Shsjxz onRef={refShsjxz} ywKey={myYwKey}/>
      <Tsxx onRef={errorMsgRef} />
      <Shjdcx onRef={refShjdcx} />
    </>
  );
};

export default TableList;
