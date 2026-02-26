import React from 'react';
import { cloneDeep } from 'lodash';

const Func: any = {
  refUnit: React.createRef(),
};

// 表单提交前调用
Func.formBeforeSubmit = (param: any) => {
  const { values } = param;
  values.menuActive = values.menuActive ? 'Y' : 'N';
  values.menuFullScreen = values.menuFullScreen ? 'Y' : 'N';
  values.menuHide = values.menuHide ? 'Y' : 'N';
  return {
    values,
  };
}

// 树节点选择
Func.treeOnSelect = (param: any) => {
  const { values } = param;
  let tmpMenuActive = values?.menuActive || 'Y';
  let tmpMenuFullScreen = values?.menuFullScreen || 'N';
  let tmpMenuHide = values?.menuHide || 'N';
  const displayProcessing = {
    menuActive: tmpMenuActive === 'Y' ? true : false,
    menuFullScreen: tmpMenuFullScreen === 'Y' ? true : false,
    menuHide: tmpMenuHide === 'Y' ? true : false,
  }
  return {
    values: {
      ...values,
      ...displayProcessing,
    },
  };
}

// 表单事件：OnChange
Func.eventOnChange = {
  changeMenuType: (param: any) => {
    const { value, form, setMyItems, myItems } = param;
    let formType = Func.formType;
    let tmprightFormItems: any = cloneDeep(myItems);
    if (formType === 'add') { // 新建
      if (value === '9') { // 按钮
        tmprightFormItems[0].readOnly = false;
        form.setFieldsValue({ menuId: '', });
      } else { // 菜单
        tmprightFormItems[0].readOnly = true;
      }
      setMyItems(tmprightFormItems);
    }
  },
}

export default Func;