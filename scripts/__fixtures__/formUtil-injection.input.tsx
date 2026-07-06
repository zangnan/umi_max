/**
 * title: formUtil-injection 测试
 * 场景：源文件含 UnitUtil.code.initFormItemsCodeTable 调用
 * 期望：生成文件自动注入 formUtil 导入语句（rename 不在本规则范围内）
 */
import React from 'react';
import UnitUtil from '@/components/DDBunit/unit_util';

const Foo: React.FC = () => {
  const tmpItemsNew = UnitUtil.code.initFormItemsCodeTable([{ label: 'test' }]);
  return <div>{tmpItemsNew.length}</div>;
};

export default Foo;