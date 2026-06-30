import { Modal, Button, message, Input } from 'antd';
import React, { useState, useImperativeHandle } from 'react';
import DDBaseGrid from '@/components/DDBaseGrid';
import CONSTANTS from '@/components/DDAssist/constants';
import myUtil from '@/components/DDAssist/util';
import { login } from '@/pages/hts/services/htsApi';
import { fetchMenuData, zhOutLogin } from '@/pages/hts/services/htsApi';
import { history, useModel } from 'umi';
import './index.less';

export type LoginCompanyProps = {
  onRef?: any;
  doSubmit?: any;
}

const LoginCompany: React.FC<LoginCompanyProps> = ({
  onRef,
  doSubmit,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [gridData, setGridData] = useState<any>([]);
  const [allGridData, setAllGridData] = useState<any>([]); // 存储所有数据用于筛选
  const [searchText, setSearchText] = useState<string>(''); // 筛选文本
  const [loginInfo, setLoginInfo] = useState<any>([]);
  const { initialState, setInitialState } = useModel('@@initialState');

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s: any) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const selectCompany = async (record: any) => {
    // myUtil.sessionStore.clear('codeTable');
    // debugger
    if (doSubmit) {
      // 登录入口
      const param: any = {
        sbqyuuid: record.sbqyuuid,
        username: loginInfo.username,
        password: loginInfo.password,
        type: '2'
      }
      doSubmit(param)
    } else {
      // 切换企业入口
      window.localStorage.removeItem('sqyxqSytsFlag');
      const userInfo = myUtil.sessionStore.getItem('userInfo');
      const param: any = {
        sbqyuuid: record.sbqyuuid,
        yhuuid1: userInfo?.qxyh?.yhuuid1,
      }
      const msg: any = await login({ ...param });
      if (msg.code === '200') {
        message.success('切换企业成功！');
        const qhqToken = localStorage.getItem('accessToken');
        await zhOutLogin({}, qhqToken);
        if (msg?.body?.ACCESS_TOKEN) {
          localStorage.setItem('accessToken', msg?.body?.ACCESS_TOKEN);
        }
        // if (msg?.body?.DDIT_SAAS_JC_TOKEN) {
        //   localStorage.setItem('dditSaasJcToken', msg?.body?.DDIT_SAAS_JC_TOKEN);
        // }
        // 获得用户信息
        await fetchUserInfo();
        // 重新获得菜单
        let body: any = [];
        const res = await fetchMenuData({});
        body = res?.body;
        // 获取树结构数据每个routes第一行的path
        function firstPath (data: any): any {
          let redirectPath;
          if (data[0].routes && data[0].routes.length > 0) {
            redirectPath = firstPath(data[0].routes);
          } else {
            redirectPath = data[0].path
          }
          return redirectPath;
        }
        // 递归树结构
        function treeData (data: any) {
          data.forEach((item: any) => {
            if (item.routes && item.routes.length > 0) {
              treeData(item.routes);
              if (!item.hideInMenu) { // 拼接redirect
                const redirectPath = firstPath(item.routes);
                item.routes.push({ path: item.path, redirect: redirectPath })
              }
            }
          });
        }
        treeData(body);
        myUtil.sessionStore.setItem('usermenu', body);
        setModalVisible(false)
        /** 此方法会跳转到 redirect 参数所在的位置 */
        if (!history) return;
        const { query } = history.location;
        const { redirect } = query as { redirect: string };
        history.push(redirect || '/');
        return;
      } else {
        message.error(msg?.msg);
      }
    }
  }



  // 企业类型
  const renderCktsqylxDm = (text: any) => {
    if (text === 'SC') {
      return (<span>{'生产'}</span>)
    } else if (text === 'WM') {
      return (<span>{'外贸'}</span>)
    } else if (text === 'QT') {
      return (<span>{'其他'}</span>)
    }
    return (<span></span>)
  }


  const renderSysj = (param: any) => {
    if (param <= 5) {
      return <div style={{ color: '#FF0000' }}>{param}</div>
    } else {
      return <>{param}</>
    }
  }
  // 开启
  const showModal = (param: any) => {
    let qxQysSaas: any;
    if (param.qxQysSaas && param.qxQysSaas.length > 0) {
      qxQysSaas = param.qxQysSaas;
    } else {
      qxQysSaas = myUtil.localStore.getItem('qxQysSaas');
      // 排序， 已选择企业放首行
      const userInfo = myUtil.sessionStore.getItem('userInfo');
      let obj = {};
      qxQysSaas.forEach((item: any, index: any) => {
        if (item.nsrsbh === userInfo?.qxQys[0].nsrsbh) {
          obj = item;
          qxQysSaas.splice(index, 1);
          return;
        }
      })
      qxQysSaas.unshift(obj);
    }
    setGridData(qxQysSaas);
    setAllGridData(qxQysSaas); // 保存所有数据
    setModalVisible(true);
    setLoginInfo(param.loginInfo);
    setSearchText(''); // 清空搜索文本
  };
  // 切换企业时，将当前所在企业按钮置灰
  const isDisabled = (record: any) => {
    const userInfo = myUtil.sessionStore.getItem('userInfo');
    if (record.nsrsbh === userInfo?.qxQys[0].nsrsbh) {
      return true;
    }
    return false;
  }

  // 筛选功能
  const handleSearch = () => {
    if (!searchText.trim()) {
      setGridData(allGridData);
      return;
    }

    const filteredData = allGridData.filter((item: any) => {
      return (
        item.nsrmc?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.nsrsbh?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.shxydm?.toLowerCase().includes(searchText.toLowerCase()) ||
        item.hgqyDm?.toLowerCase().includes(searchText.toLowerCase())
      );
    });

    setGridData(filteredData);
  };

  // 重置筛选
  const handleReset = () => {
    setSearchText('');
    setGridData(allGridData);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Modal
      title='企业'
      open={modalVisible}
      wrapClassName='standard-modal'
      width={CONSTANTS.C_MODAL_WIDTH_X3}
      footer={null}
      onCancel={() => setModalVisible(false)}
      mask={{ closable: false }}
    >
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>企业筛选:</span>
          <Input
            placeholder="请输入企业名称/纳税人识别号/社会信用代码/海关企业代码"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            style={{ width: 450 }}
          />
        </div>
        <div>
          <Button type="primary" onClick={handleSearch} style={{ marginRight: 8 }}>搜索</Button>
          <Button onClick={handleReset}>重置</Button>
        </div>
      </div>
      <DDBaseGrid
        userDataSource={gridData}
        columns={[
          { title: '企业名称', dataIndex: 'nsrmc', ellipsis: true, fixed: 'left' },
          { title: '海关企业代码', dataIndex: 'hgqyDm', width: 120 },
          { title: '纳税人识别号', dataIndex: 'nsrsbh', width: 180, ellipsis: true },
          { title: '社会信用代码', dataIndex: 'shxydm', width: 180, ellipsis: true },
          // { title: '企业类型', dataIndex: 'cktsqylxDm', width: 100, codeTable: ['code_dm_rd_cktsqylx', '01'], render: renderCktsqylxDm },
          { title: '企业类型', dataIndex: 'cktsqylxDm', width: 100, codeTable: 'code_dm_rd_cktsqylx:01', render: renderCktsqylxDm },
          // { title: '授权状态', dataIndex: 'sqzt', width: 100, ellipsis: true},
          // { title: '授权剩余时间', dataIndex: 'sqyxqSyts', width: 100, align:'right',ellipsis: true , render: renderSysj},
          {
            title: '操作', width: 60, fixed: 'right', align: 'center', render: (record: any) => (<>
              <Button type='link' disabled={isDisabled(record)} onClick={async () => { await selectCompany(record) }} >选择</Button>
            </>)
          },
        ]}
        scroll={{ x: '500px' }}
        showSerialNumber
      />
    </Modal>
  );
};

export default LoginCompany;
