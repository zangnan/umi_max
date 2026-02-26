import React from 'react';

const Func: any = {
  unitRef: React.createRef(),
};

// 配置项：绑定角色
Func.bindRole = (param: any, event: any) => {
  event.stopPropagation();
  const { otherRef } = param;
  if (otherRef && otherRef[0]) {
    otherRef[0].current?.showModal(param);
  }
}

// 列表自定义渲染
Func.columnsRender = {
  // 角色
  // renderRoleId: (param: any) => {
  //   const roleList = param?.record?.hasRoleList || []; // N=未使用; Y=已使用
  //   const roleNameArr: any = [];
  //   roleList.forEach((item: any) => {
  //     if (item?.roleName) {
  //       roleNameArr.push(item.roleName);
  //     }
  //   });
  //   let str = roleNameArr.join('，');
  //   return str;
  // },
  // 角色
  renderRoleId: (param: any) => {
    const role_id = param?.record?.role_id || ''; // N=未使用; Y=已使用
    return role_id;
  },
}

export default Func;