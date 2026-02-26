import { message, Tooltip, Badge, Space, Segmented } from 'antd';
import React from 'react';
import myUtil from '@/components/DDAssist/util';
import { testReturnCode200 } from '@/services/hts/api';
import { FilePdfTwoTone } from '@ant-design/icons';

const Func: any = {
  refUnit: React.createRef(),
};

const badgeSuccess = <Badge status="success" key='success' />;
const badgeError = <Badge status="error" key='error' />;

// 页面元素初始化后执行 useEffectEnd -> afterReload
Func.useEffectEnd = (param: any) => {
  console.info('页面元素初始化后执行', param);
}

// 列表数据加载后执行 useEffectEnd -> afterReload
Func.afterReload = (param: any) => {
  console.info('列表数据加载后执行', param);
};

// 表单新建初始化
Func.initAddForm = (param: any) => {
  console.info('表单新建初始化', param);
  const { form, handleModalVisible, pageId, unitKey, refUnit } = param;
  refUnit.current?.setMasker(true);
  testReturnCode200().then((response) => {
    const { code } = response;
    refUnit.current?.setMasker(false);
    if (code === '200') {
      form.setFieldsValue({
        ckbgdh: '123456789012345678',
        spxxArray: [{spmc: 'test123'}],
      });
      handleModalVisible(true);
    }
  })
}

// 表单编辑初始化
Func.initEditForm = (param: any) => {
  console.info('表单编辑初始化', param);
  const { handleModalVisible } = param;
  handleModalVisible(true);
}

// 表单提交前调用
Func.formBeforeSubmit = (param: any) => {
  console.info('表单提交前调用', param);
  return true;
}

// 删除前调用
Func.beforeDelete = (param: any) => {
  console.info('删除前调用', param);
  return true;
}

// 删除失败后调用
Func.afterDeletionFailure = (param: any) => {
  console.info('删除失败后调用', param);
}

// 列表行单击事件
Func.gridOnRowClick = (param: any) => {
  console.info('列表行单击事件', param);
}

// 列表行双击击事件
Func.gridOnRowDoubleClick = (param: any) => {
  console.info('列表行双击击事件', param);
}

// 配置项：列表首选项改变时回调，即选择Chexcbox、Radion回调
Func.rowSelection = (param: any) => {
  console.info('列表首选项改变时回调', param);
  const { refUnit } = param;
  // 设置按钮屏蔽
  const btnFunc: any = refUnit.current!.handleCustomerToobarBtn();
  btnFunc.setBtnDisabled('cs2', false);
  btnFunc.setBtnDisabled('cs1', true);
}

// 列表自定义渲染
Func.columnsRender = {
  // 银行账号
  renderExampleYhzh: (param: any) => {
    return myUtil.grid.formatBankNo(param);
  },
  // 报关单号
  renderCkbgdh: (param: any) => {
    const sybz = param?.record.sybz; // N=未使用; Y=已使用
    const czbz1 = param?.record.czbz1; // N=不存在; Y=存在
    const ckbgdh = param?.record.ckbgdh;
    const fileIcon = (
      <span
        key='ckbgdh_ele_span'
        style={{ marginLeft: '5px', cursor: 'pointer' }}
        onClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        <FilePdfTwoTone />
      </span>
    );
    const html = [];
    const ckbgdhEle = (
      <a key='ckbgdh_ele_link' type="link" onClick={(event: any) => {
          event.stopPropagation();
        }}
      >
        {ckbgdh}
      </a>
    );
    html.push(sybz === 'Y' ? badgeSuccess : badgeError);
    html.push(czbz1 === 'Y' ? badgeSuccess : badgeError);
    html.push(ckbgdhEle);
    html.push(fileIcon);
    // 列表列tooltip
    const tip = () => {
      const info = [];
      info.push(
        sybz === 'Y' ? (
          <div>使用状态：{badgeSuccess} 已使用</div>
        ) : (
          <div>使用状态：{badgeError} 未使用</div>
        ),
      );
      info.push(
        czbz1 === 'Y' ? <div>关单信息：{badgeSuccess} 有</div> : <div>关单信息：{badgeError} 无</div>,
      );
      return info;
    };
    return <Tooltip title={() => tip()}><Space>{html}</Space></Tooltip>;
  },
  // 数据检查状态
  renderExampleXh4: (param: any) => {
    const { text } = param;
    return <a onClick={(event: any) => {
      event.stopPropagation();
      Func.openDrawer(param);
    }}>{text}
    </a>;
  },
}

// 开关图标点击回调
Func.poweroff = {
  // 状态列
  handleSetStatus: (param: any) => {
    console.info('开关图标点击回调', param);
  },
}

// 配置项：自定义工具栏
Func.handleCostomerToobar1 = (param: any) => {
  const { selectionRowKeys, refGrid, refUnit } = param;
  // 获取列表数据
  const gridData = refUnit.current?.getGridData();
  // 获取页头筛选区域数据
  const headerFilterValue = refGrid.current?.getHeaderFilter();
  console.info('配置项：自定义工具栏', param, gridData, headerFilterValue);
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info('请选择要操作的数据！');
    return;
  } else {
    message.info({
      content: `当前选中 ${selectionRowKeys.length} 条数据！`,
      onClose: () => {
        // testFlag, 演示用数据
        refGrid.current?.reload({ testFlag: 111 }); // 刷新并清空SelectionRows、SelectionRowKeys
      }
    });
  }
}

// 配置项：自定义工具栏
Func.handleCostomerToobar2 = (param: any) => {
  console.info('配置项：自定义工具栏', param);
  const { refUnit } = param;
  refUnit.current?.setMasker(true);
  testReturnCode200({ id: 1 }).then((response) => {
    const { code, desc } = response;
    refUnit.current?.setMasker(false);
    refUnit.current?.setSelectionRowKeys([]);  // 设置SelectionRows
    refUnit.current?.setSelectionRows([]);     // 设置SelectionRowKeys
    refUnit.current?.reload(); // 刷新并清空SelectionRows、SelectionRowKeys
    if (code === '200') {
      message.info(desc);
    } else {
      message.error(desc);
    }
  })
}

// 配置项：自定义工具栏
Func.handleCostomerImport = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[1]) {
    param.columns = [
      { title: '用户ID', dataIndex: 'user_id' },
      { title: '用户名', dataIndex: 'user_name' },
      { title: '登录名', dataIndex: 'login_name' },
      { title: '密码', dataIndex: 'password' },
      { title: '电话', dataIndex: 'phone' },
      { title: '使用标识', dataIndex: 'used_flag' },
      { title: 'customer_config', dataIndex: 'customer_config' },
      { title: 'add_time', dataIndex: 'add_time' },
      { title: 'add_user_id', dataIndex: 'add_user_id' },
      { title: 'update_time', dataIndex: 'update_time' },
      { title: 'update_user_id', dataIndex: 'update_user_id' },
    ];
    param.templateUrl = '/import_template/user.xlsx';
    param.tableKey = 'sys_user';
    otherRef[1].current?.showModal(param);
  }
}

// 配置项：自定义工具栏
Func.importDbTable = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  // debugger
  if (otherRef && otherRef[2]) {
    // param.tableKey = 'user';
    otherRef[2].current?.showModal(param);
  }
}

// 配置项：自定义工具栏
Func.importDbTableData = (param: any) => {
  const { refUnit } = param;
  const otherRef = refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[3]) {
    otherRef[3].current?.showModal(param);
  }
}

// 配置项：自定义操作列
Func.handleColumns1 = (param: any, event: any) => {
  event.stopPropagation();
  const { target, currentTarget } = event;
  console.info('配置项：自定义操作列', param, event, target);
  currentTarget.disabled = true;
  currentTarget.innerText = '测试11';
  const antBtnLink: any = document.querySelectorAll(".ant-table-cell .ant-btn.cs12");
  antBtnLink.forEach((item: any) => {
    item.disabled = true;
    item.innerText = '测试22';
  });
}

// 配置项：自定义操作列
Func.handleColumns2 = (param: any, event: any) => {
  event.stopPropagation();
  const { record, refGrid } = param;
  console.info('配置项：自定义操作列', param, event, record);
  message.info({
    content: '配置项：自定义操作列2',
    onClose: () => {
      refGrid.current!.reload({
        afterReload: () => {
          const antBtnLink: any = document.querySelectorAll(".toobar-right .ant-btn");
          if (antBtnLink?.length > 0) {
            antBtnLink[0].disabled = true;
            antBtnLink[0].innerText = '测试222';
          }
        }
      }); // 仅刷新列表数据
    }
  });
}

// 配置项：自定义操作列
Func.handleColumns3 = (param: any, event: any) => {
  event.stopPropagation();
  const { refUnit } = param;
  refUnit.current?.setMasker(true);
  testReturnCode200().then((response) => {
    const { code, desc } = response;
    refUnit.current?.setMasker(false);
    if (code === '200') {
      message.info(desc);
      // 设置按钮屏蔽
      const btnFunc: any = refUnit.current!.handleCustomerToobarBtn();
      btnFunc.setBtnDisabled('cs1', true);
    } else {
      message.error(desc);
    }
  })
}

// 配置项：自定义操作列是否可用
Func.setCs3Disabled = (record: any) => {
  if (record.jgfsDm === '0139' || record.jgfsDm === '0110' || record.jgfsDm === '0160') {
    return true;
  }
  return false;
}

// 配置项：自定义列表标题区域
Func.setGridTitle = (param: any) => {
  console.info('配置项：自定义列表标题区域', param);
  const options = ['选择A', '选择B', '跳转C']
  const ele = <Segmented options={options} onChange={(value: any) => {
    if (value === '跳转C') {
      window.location.replace(`${window.location.origin}/example/json_page/unit2`);
    }
  }}/>
  return ele;
}

// 开启自定义Drawer
Func.openDrawer = (param: any) => {
  console.info('开启自定义Drawer', param);
  const { otherRef } = param;
  // const otherRef = param.refUnit.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
};

// 表单事件：OnClick
Func.eventOnSearch = {
  onSearch1: (param: any) => {
    console.info('表单事件：onSearch1');
    // value, event, form: useform, myItems, setMyItems, otherParam, item: myItems[i]
    console.info(param);
    const { otherParam } = param;
    if (otherParam?.otherRef?.length > -1) {
      otherParam?.otherRef[0].current?.showModal(param);
    }
  },
}

// 设置默认操作列-编辑 只读属性
Func.setEditDisabled = (param: any) => {
  if (param.cjhghbzmDm ===  'USD') {
    return true;
  }
  return false;
}

// 设置默认操作列-删除 只读属性
Func.setEditDisabled = (param: any) => {
  if (param.cjhghbzmDm ===  'USD') {
    return true;
  }
  return false;
}

// 表单保存成功后回调
Func.afterFormSaveSuccess = () => {
  myUtil.code.updateCodeTableByKeys(['code_dm_def_contract']);
}

// 表单删除成功后回调
Func.afterFormDeleteSuccess = () => {
  myUtil.code.updateCodeTableByKeys(['code_dm_def_contract']);
}

export default Func;