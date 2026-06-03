import { message } from 'antd';
import React from 'react';
import { testReturnCode, testReturnCode200 } from '@/services/hts/api';

const Func: any = {
  unitRef: React.createRef(),
};

// 列表自定义渲染
Func.columnsRender = {
  // 申报业务
  renderSbyw: (param: any) => {
    const {text} = param;
    let reVal = '--';
    if (text == '1') {
      reVal = '退税申报f';
    } else if (text == '2') {
      reVal = '代理出口f';
    } else if (text == '6') {
      reVal = '代办退税f';
    }
    return reVal;
  },
  // 征免类型
  renderZmlx: (text: any) => {
    let reVal = '';
    if (text === '4') {
      reVal = '免税f';
    } else if (text === '5') {
      reVal = '征税f';
    } else {
      reVal = '退税f';
    }
    return reVal;
  }
}

// 配置项：自定义工具栏
Func.handleCostomerToobar1 = (param: any) => {
  const { selectionRowKeys, selectionRows, gridRef, unitRef, formQuickFilter } = param;
  const gridData = unitRef.current?.getGridData();
  // console.info('选择行keys');
  // console.info(selectionRowKeys);
  // console.info('选择行rows');
  // console.info(selectionRows);
  // console.info('列表数据');
  // console.info(gridData);
  // console.info('快捷筛选区数据');
  // console.info(formQuickFilter.getFieldsValue());
  if (!selectionRowKeys || selectionRowKeys.length === 0) {
    message.info('请选择要操作的数据！');
    return;
  } else {
    message.info({
      content: `当前选中 ${selectionRowKeys.length} 条数据！`,
      onClose: () => {
        // testFlag, 演示用数据
        gridRef.current?.reload({ testFlag: 111 });
      }
    });
  }
}

// 配置项：自定义工具栏
Func.handleCostomerToobar2 = (param: any) => {
  const { unitRef, gridRef } = param;
  // 获取页头筛选区域数据
  const headerFilterValue = gridRef.current?.getHeaderFilter();
  // console.info(headerFilterValue);
  // id: 1 测试返回码200
  // id: 2 测试返回码500
  unitRef.current?.setMasker(true);
  testReturnCode({ id: 1 }).then((response) => {
    const { code, desc } = response;
    unitRef.current?.setMasker(false);
    // unitRef.current?.setSelectionRowKeys([]);  // 设置SelectionRows
    // unitRef.current?.setSelectionRows([]);     // 设置SelectionRowKeys
    unitRef.current?.reload2(); // 刷新并清空SelectionRows、SelectionRowKeys
    if (code === '200') {
      message.info(desc);
    } else {
      message.error(desc);
    }
  })
}

// 配置项：自定义操作列
Func.handleColumns1 = (param: any, event: any) => {
  event.stopPropagation();
  const { record, gridRef } = param;

  // const { target, currentTarget } = event;
  // currentTarget.disabled = true;
  // currentTarget.innerText = '事项通知书'; = true;

  console.info(record);
  message.info({
    content: '配置项：自定义操作列1',
    onClose: () => {
      gridRef.current!.reload({
        afterReload: () => {
          const antBtnLink: any = document.querySelectorAll(".ant-table-cell .ant-btn.cs1");
          antBtnLink.forEach((item: any) => {
            item.disabled = true;
            item.innerText = 60;
          });
          const timer = setInterval(() => {
            antBtnLink.forEach((item: any) => {
              item.innerText = Number(item.innerText) - 1;
            })
          }, 1000);
          setTimeout(() => {
            antBtnLink.forEach((item: any) => {
              item.disabled = false;
              item.innerText = '事项通知书';
            });
            clearInterval(timer);
          }, 5000);
        }
      }); // 仅刷新列表数据
    }
  });
}

// 配置项：自定义操作列
Func.handleColumns2 = (param: any, event: any) => {
  event.stopPropagation();
  const { unitRef } = param;
  unitRef.current?.setMasker(true);
  testReturnCode200().then((response) => {
    const { code, desc } = response;
    unitRef.current?.setMasker(false);
    if (code === '200') {
      message.info(desc);
      // 设置按钮屏蔽
      const btnFunc: any = unitRef.current!.handleCostomerToobarBtn();
      btnFunc.setBtnDisabled('cs2', false);
    } else {
      message.error(desc);
    }
  })
}

// 配置项：快捷筛选
Func.handleOnChange = (param: any) => {
  const { value, option, gridRef, unitRef, formQuickFilter, event } = param;
  // 设置按钮屏蔽
  const btnFunc: any = unitRef.current!.handleCostomerToobarBtn();
  btnFunc.setBtnDisabled('cs2', false);
  btnFunc.setBtnDisabled('cs1', true);
  // console.info('组件属性 value');
  // console.info(value);
  // console.info('组件属性 option');
  // console.info(option);
  // console.info('组件属性 event');
  // console.info(event);
  // console.info('快捷筛选区数据');
  // console.info(formQuickFilter.getFieldsValue());
  // console.info('gridRef');
  // console.info(gridRef);

  formQuickFilter.validateFields().then((values: any) => {
    // console.info(values);
  })
}

// 配置项：自定义操作列是否可用
Func.setCs2Disabled = (record: any) => {
  if (record.jgfsDm === '0139' || record.jgfsDm === '0110') {
    return true;
  }
  return false;
}

// 配置项：选择Chexcbox Radion 回调
Func.rowSelection = (param: any) => {
  const { selectedRowKeys, selectedRows, unitRef } = param;
  // console.info(selectedRowKeys);
  // console.info(selectedRows);
  // 设置按钮屏蔽
  const btnFunc: any = unitRef.current!.handleCostomerToobarBtn();
  btnFunc.setBtnDisabled('cs2', false);
  btnFunc.setBtnDisabled('cs1', true);
}

// 配置项：设置列表标题
Func.setGridTitle = () => {
  return '自定义标题'
}

// 开启自定义Drawer
Func.openDrawer = (param: any) => {
  // const { unitRef, otherRef } = param;
  const otherRef = param.unitRef.current?.getOtherRefs();
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
};

// 校验规则
Func.grid_filter_quick_bgd = () => {
  return [{ required: true, message: '报关单号必填' }];
}

// 列表行单击事件
Func.gridOnRowClick = (param: any) => {
  const { record, event, gridRef, unitRef, formQuickFilter } = param;
  // console.info(record);
  // console.info(event);
  // console.info(gridRef);
  // console.info(unitRef);
  // console.info(formQuickFilter);
}

// 列表行双击击事件
Func.gridOnRowDoubleClick = (param: any) => {
  const { record, event } = param;
  // console.info(record);
  // console.info(event);
}

// useEffectEnd -> afterReload  页面元素初始化后执行
Func.useEffectEnd = (param: any) => {
  const { gridRef, unitRef } = param;
  // console.info(gridRef);
  // console.info(unitRef);
  message.info('useEffectEnd');
}

// useEffectEnd -> afterReload  列表数据加载后执行
Func.afterReload = (param: any) => {
  const { gridRef, unitRef, gridTotalNum, dataSource } = param;
  // console.info(gridRef);
  // console.info(unitRef);
  // console.info(gridTotalNum);
  // console.info(dataSource);                             // 列表数据
  // console.info(unitRef.current?.getGridData());         // 同上
  message.info('afterReload');
}

// 批量修改参数
Func.getBatchEditParam = (param: any) => {
  const { selectionRows, unitRef, gridRef } = param;
  const wxspVoList: any = [];
  return { wxspVoList };
}

// 新建表单初始化
Func.initAddForm = (param: any) => {
  const { form, handleModalVisible, page_id, unit_key, unitRef } = param;
  unitRef.current?.setMasker(true);
  testReturnCode200().then((response) => {
    const { code } = response;
    unitRef.current?.setMasker(false);
    if (code === '200') {
      form.setFieldsValue({
        ckbgdh: '123456789012345678',
      });
      handleModalVisible(true);
    }
  })
}

Func.formSaveBefore = (param: any) => {

  return param;

}


export default Func;