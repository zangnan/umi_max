/**
 * title: formUtil-injection 去重测试
 * 场景：生成文件已含 formUtil 导入语句
 * 期望：不重复注入
 */
import formUtil from '@/components/DDForm/formUtil';
import React from 'react';
import UnitUtil from '@/components/DDBunit/unit_util';

const Foo: React.FC = () => {
  const tmpItemsNew = UnitUtil.code.initFormItemsCodeTable([{ label: 'test' }]);
  return <div>{tmpItemsNew.length}</div>;
};

export default Foo;