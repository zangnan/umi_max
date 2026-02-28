import React from 'react';
import myUtil from '@/components/DDAssist/util';
import { Divider, Anchor, Space, FloatButton, theme, Typography, Card, version } from 'antd';
import { cloneDeep } from 'lodash';
import './style.less';

const { Text } = Typography;

const Unit2: React.FC<unknown> = () => {
  // themeToken
  const { useToken } = theme;
  const { token }: any = useToken();
  const colorError: any = token?.Tag?.colorError;

  // const func = (result: any) => { console.log(result); }
  // console.info('test ~~ ', myUtil.sessionStore.getStorage());

  // doc 文本处理
  let myUtilTextContent = [
    {
      id: 'formatNum',
      desc: '基于Numeral.js 处理数字',
      example: `myUtil.date.formatDate(1598366782436, 'YYYY-MM-DD hh:mm:ss' )`,
      res: `${myUtil.text.formatNum(123456789, '0,0.0000')}`,
    },
    {
      id: 'getNumVal',
      desc: '基于Numeral.js 获取数值',
      example: `myUtil.text.getNumVal('123,456,789.0000')`,
      res: `${myUtil.text.getNumVal('123,456,789.0000')}`,
    },
    {
      id: 'leadingZeroize',
      desc: '补0并截取字符',
      example: `myUtil.text.leadingZeroize('abc', 8)`,
      res: `${myUtil.text.leadingZeroize('abc', 8)}`,
    },
    {
      id: 'toUpper',
      desc: '字符转大写',
      example: `myUtil.text.toUpper('abc')`,
      res: `${myUtil.text.toUpper('abc')}`,
    },
    {
      id: 'toLower',
      desc: '字符转小写',
      example: `myUtil.text.toLower('DEF')`,
      res: `${myUtil.text.toLower('DEF')}`,
    },
    {
      id: 'arrayToStr',
      desc: '数组转字符串',
      example: `myUtil.text.arrayToStr(['aa', 'bb', 'cc'])`,
      res: `${myUtil.text.arrayToStr(['aa', 'bb', 'cc'])}`,
      example2: `myUtil.text.arrayToStr(['aa', 'bb', 'cc', 'dd'], '***')`,
      res2: `${myUtil.text.arrayToStr(['aa', 'bb', 'cc', 'dd'], '***')}`,
    },
    {
      id: 'uuid',
      desc: '生成uuid',
      example: `myUtil.text.uuid()`,
      res: `${myUtil.text.uuid()}`,
      example2: `myUtil.text.uuid(8, 10)`,
      res2: `${myUtil.text.uuid(8, 10)}`,
      example3: `myUtil.text.uuid(8, 20)`,
      res3: `${myUtil.text.uuid(8, 20)}`,
    },
    {
      id: 'formatReplace',
      desc: '字符窜占位符替换',
      example: `myUtil.text.formatReplace('今天是{{aaa}}月{{bbb}}日！', { aaa: 6, bbb: 20 })`,
      res: `${myUtil.text.formatReplace('今天是{{aaa}}月{{bbb}}日！', { aaa: 6, bbb: 20 })}`,
    },
    {
      id: 'formatNumRound',
      desc: '将数值四舍五入并保留给定位数的小数',
      example: `myUtil.text.formatNumRound(12.345, 2)`,
      res: `${myUtil.text.formatNumRound(12.345, 2)}`,
    },
    {
      id: 'lowerFirstLetter',
      desc: '首字母变小写',
      example: `myUtil.text.lowerFirstLetter('ABCDE')`,
      res: `${myUtil.text.lowerFirstLetter('ABCDE')}`,
    },
    {
      id: 'camelToUnderscore',
      desc: '字符串驼峰转下划线',
      example: `myUtil.text.camelToUnderscore('abcEefGeg')`,
      res: `${myUtil.text.camelToUnderscore('abcEefGeg')}`,
    },
    {
      id: 'camelToUnderscoreObj',
      desc: '对象key驼峰转下划线',
      example: `myUtil.text.camelToUnderscoreObj({ abcDef: 111, hjKlm: 222 })`,
      res: `{abc_def: 111, hj_klm: 222}`,
    },
    {
      id: 'camelToUnderscoreArray',
      desc: '数组中对象驼峰转下划线',
      example: `myUtil.text.camelToUnderscoreArray([{abcDef: 111, hjKlm: 222}, {uiOp: 333, yuBnm: 444}]))`,
      res: `[{abc_def: 111, hj_klm: 222}, {ui_op: 333, yu_bnm: 444}]`,
    },
    {
      id: 'underscoreToCamel',
      desc: '字符串下划线转驼峰',
      example: `myUtil.text.underscoreToCamel('abc_de_fg'))`,
      res: `${myUtil.text.underscoreToCamel('abc_de_fg')}`,
    },
    {
      id: 'underscoreToCamelObjValue',
      desc: '对象中目标key的属性值下划线转驼峰',
      example: `myUtil.text.underscoreToCamelObjValue({ aa: 'abc_def', bb: 'ee_ff_gg', cc: 'ty_jg'}, ['aa', 'bb'])`,
      res: `{aa: 'abcDef', bb: 'eeFfGg', cc: 'ty_jg'}`,
    },
    {
      id: 'underscoreToCamelObjKey',
      desc: '对象中目标key下划线转驼峰',
      example: `myUtil.text.underscoreToCamelObjKey({ aa_bb: '11', bb_cc: '22', cc_dd: '33'}, ['aa_bb', 'cc_dd'])`,
      res: `{aaBb: '11', bb_cc: '22', ccDd: '33'}`,
    },
    {
      id: 'underscoreToCamelArrayValue',
      desc: '数组对象中目标key的属性值下划线转驼峰',
      example: `myUtil.text.underscoreToCamelArrayValue([{ aa: 'aa_bb_cc', bb: 'dd_ee', cc: 'ff_gg'}, { aa: 'bb_cc', bb: 'tt_rr', cc: 'gg_rr'}], ['aa', 'bb'])`,
      res: `[{aa: 'aaBbCc', bb: 'ddEe', cc: 'ff_gg'},{aa: 'bbCc', bb: 'ttRr', cc: 'gg_rr'}]`,
    },
    {
      id: 'underscoreToCamelArrayKey',
      desc: '数组对象中目标key下划线转驼峰',
      example: `myUtil.text.underscoreToCamelArrayKey([{ aa_bb: 11, bb_cc: 22, cc_dd: 33}, { aa_bb: 55, bb_cc: 66, cc_dd: 77}], ['aa_bb', 'cc_dd'])`,
      res: `[{aaBb: 11, bb_cc: 22, ccDd: 33},{aaBb: 55, bb_cc: 66, ccDd: 77}]`,
    },
    {
      id: 'parseBraces',
      desc: '匹配字符串中{}内的内容，将其中值转数组',
      example: `myUtil.text.parseBraces('{p1}*{p2}*{p3}')`,
      res: `['p1','p2','p3']`,
    },
    {
      id: 'generateRandomNumber',
      desc: '生成长度为指定数值的随机数',
      example: `myUtil.text.generateRandomNumber(3)`,
      res: `${myUtil.text.generateRandomNumber(3)}`,
    },
  ];

  // doc 日期处理
  let myUtilDateContent = [
    {
      id: 'formatDate',
      desc: '将日期格式化成指定格式的字符串',
      example: `myUtil.date.formatDate(1598366782436, 'YYYY-MM-DD hh:mm:ss' )`,
      res: `${myUtil.date.formatDate(1598366782436, 'YYYY-MM-DD hh:mm:ss')}`,
    },
    {
      id: 'getLastWeek',
      desc: '获取上周的起始日期和结束日期',
      example: `myUtil.date.getLastWeek()`,
      res: `startOfWeek: ${myUtil.date.getLastWeek().startOfWeek}`,
      res2: `endOfWeek: ${myUtil.date.getLastWeek().endOfWeek}`,
    },
    {
      id: 'getCurrentWeek',
      desc: '获取本周的起始日期和结束日期',
      example: `myUtil.date.getCurrentWeek()`,
      res: `startOfWeek: ${myUtil.date.getCurrentWeek().startOfWeek}`,
      res2: `endOfWeek: ${myUtil.date.getCurrentWeek().endOfWeek}`,
    },
    {
      id: 'getNextWeek',
      desc: '获取下周的起始日期和结束日期',
      example: `myUtil.date.getNextWeek()`,
      res: `startOfWeek: ${myUtil.date.getNextWeek().startOfWeek}`,
      res2: `endOfWeek: ${myUtil.date.getNextWeek().endOfWeek}`,
    },
    {
      id: 'getLastMonth',
      desc: '获取上个月的起始日期和结束日期',
      example: `myUtil.date.getLastMonth()`,
      res: `startOfMonth: ${myUtil.date.getLastMonth().startOfMonth}`,
      res2: `endOfMonth: ${myUtil.date.getLastMonth().endOfMonth}`,
    },
    {
      id: 'getCurrentMonth',
      desc: '获取本月的起始日期和结束日期',
      example: `myUtil.date.getCurrentMonth()`,
      res: `startOfMonth: ${myUtil.date.getCurrentMonth().startOfMonth}`,
      res2: `endOfMonth: ${myUtil.date.getCurrentMonth().endOfMonth}`,
    },
    {
      id: 'getNextMonth',
      desc: '获取下个月的起始日期和结束日期',
      example: `myUtil.date.getNextMonth()`,
      res: `startOfMonth: ${myUtil.date.getNextMonth().startOfMonth}`,
      res2: `endOfMonth: ${myUtil.date.getNextMonth().endOfMonth}`,
    },
    {
      id: 'getLastYear',
      desc: '获取去年的起始日期和结束日期',
      example: `myUtil.date.getLastYear()`,
      res: `startOfYear: ${myUtil.date.getLastYear().startOfYear}`,
      res2: `endOfYear: ${myUtil.date.getLastYear().endOfYear}`,
    },
    {
      id: 'getCurrentYear',
      desc: '获取本年的起始日期和结束日期',
      example: `myUtil.date.getCurrentYear()`,
      res: `startOfYear: ${myUtil.date.getCurrentYear().startOfYear}`,
      res2: `endOfYear: ${myUtil.date.getCurrentYear().endOfYear}`,
    },
    {
      id: 'getNextYear',
      desc: '获取来年的起始日期和结束日期',
      example: `myUtil.date.getNextYear()`,
      res: `startOfYear: ${myUtil.date.getNextYear().startOfYear}`,
      res2: `endOfYear: ${myUtil.date.getNextYear().endOfYear}`,
    },
    {
      id: 'getLastQuarter',
      desc: '获取上季度的起始日期和结束日期',
      example: `myUtil.date.getLastQuarter()`,
      res: `startOfQuarter: ${myUtil.date.getLastQuarter().startOfQuarter}`,
      res2: `endOfQuarter: ${myUtil.date.getLastQuarter().endOfQuarter}`,
    },
    {
      id: 'getCurrentQuarter',
      desc: '获取本季度的起始日期和结束日期',
      example: `myUtil.date.getCurrentQuarter()`,
      res: `startOfQuarter: ${myUtil.date.getCurrentQuarter().startOfQuarter}`,
      res2: `endOfQuarter: ${myUtil.date.getCurrentQuarter().endOfQuarter}`,
    },
    {
      id: 'getNextQuarter',
      desc: '获取下季度的起始日期和结束日期',
      example: `myUtil.date.getNextQuarter()`,
      res: `startOfQuarter: ${myUtil.date.getNextQuarter().startOfQuarter}`,
      res2: `endOfQuarter: ${myUtil.date.getNextQuarter().endOfQuarter}`,
    },
    {
      id: 'getRecentNDay',
      desc: '获取最近n天的起始日期和结束日期',
      example: `myUtil.date.getRecentNDay(7)`,
      res: `startOfDay: ${myUtil.date.getRecentNDay(7).startOfDay}`,
      res2: `endOfDay: ${myUtil.date.getRecentNDay(7).endOfDay}`,
    },
    {
      id: 'getQZDateBeforeCurr',
      desc: '获取当前时间N年前的第一天和最后一天',
      example: `myUtil.date.getQZDateBeforeCurr(7)`,
      res: `startOfDay: ${myUtil.date.getQZDateBeforeCurr(7).firstDay}`,
      res2: `endOfDay: ${myUtil.date.getQZDateBeforeCurr(7).lastDay}`,
    },
    {
      id: 'generateRandomBirthday',
      desc: '生成随机日期',
      example: `myUtil.date.generateRandomBirthday()`,
      res: `${myUtil.date.generateRandomBirthday()}`,
    },
    {
      id: 'getRandomTimestamp',
      desc: '生成随机时间戳',
      example: `myUtil.date.getRandomTimestamp()`,
      res: `${myUtil.date.getRandomTimestamp()}`,
    },
    {
      id: 'compareTime',
      desc: '判断日期是否在几个月得范围内 (YYYY-MM-DD | YYYY-MM-DD Hi:mm:ss | 时间戳)',
      example: `myUtil.date.compareTime(3, 1598366782436, 1599366782436); // 1598366782436与1599366782436间隔是否在3个月内`,
      res: `${myUtil.date.compareTime(3, 1598366782436, 1599366782436)}`,
      example2: `myUtil.date.compareTime(3, '2020-01-10', '2020-12-10'); // 2020-01-10与2020-12-10间隔是否在3个月内`,
      res2: `${myUtil.date.compareTime(3, '2020-01-10', '2020-12-10')}`,
      example3: `myUtil.date.compareTime(12, '2020-01-10', '2020-12-10'); // 2020-01-10与2020-12-10间隔是否在12个月内`,
      res3: `${myUtil.date.compareTime(12, '2020-01-10', '2020-12-10')}`,
    },
    {
      id: 'accurateDate',
      desc: '日期补全到秒',
      example: `myUtil.date.accurateDate('2020-01-10', '1'); // 将2020-01-10转为2020-01-10 00:00:00`,
      res: `${myUtil.date.accurateDate('2020-01-10', '1')}`,
      example2: `myUtil.date.accurateDate('2020-01-10', '2'); // 将2020-01-10转为2020-01-10 23:59:59`,
      res2: `${myUtil.date.accurateDate('2020-01-10', '2')}`,
    },
    {
      id: 'formatMillisecondsToHMS',
      desc: '格式化毫秒数为 hh:mm:ss',
      example: `myUtil.date.formatMillisecondsToHMS(11123456);`,
      res: `${myUtil.date.formatMillisecondsToHMS(11123456)}`,
    },
    {
      id: 'formatList',
      desc: '兼容的日期格式化格式',
      example: `myUtil.date.formatList();`,
      res: `${myUtil.date.formatList()}`,
    },
  ];

  // doc sessionStore
  let myUtilsessionStoreContent = [
    {
      id: 'setItem',
      desc: '设置键值key的sessionStore数据',
      example: `myUtil.sessionStore.setItem('testSessionStore123', 'testSessionStore123 value' )`,
      res: `${myUtil.sessionStore.setItem('testSessionStore123', 'testSessionStore123 value')}`,
    },
    {
      id: 'getItem',
      desc: '根据键值key从sessionStore里获取数据',
      example: `myUtil.sessionStore.getItem('testSessionStore123')`,
      res: `${myUtil.sessionStore.getItem('testSessionStore123')}`,
    },
    {
      id: 'getStorage',
      desc: '从sessionStore里获取全部数据',
      example: `myUtil.sessionStore.getStorage()`,
      res: `{testSessionStore123: "testSessionStore123 val"}`,
    },
    {
      id: 'clear',
      desc: '根据键值key删除sessionStore里的数据',
      example: `myUtil.sessionStore.clear('testSessionStore123')`,
    },
    {
      id: 'clearAll',
      desc: '删除sessionStore里的所有数据',
      example: `myUtil.sessionStore.clearAll()`,
    },
  ];

  // doc localStore
  let myUtillocalStoreContent = [
    {
      id: 'setItem',
      desc: '设置键值key的localStore数据',
      example: `myUtil.localStore.setItem('testlocalStore123', 'testlocalStore123 value' )`,
      res: `${myUtil.localStore.setItem('testlocalStore123', 'testlocalStore123 value')}`,
      href: 'localStoresetItem',
    },
    {
      id: 'getItem',
      desc: '根据键值key从localStore里获取数据',
      example: `myUtil.localStore.getItem('testlocalStore123')`,
      res: `${myUtil.localStore.getItem('testlocalStore123')}`,
      href: 'localStoregetItem',
    },
    {
      id: 'getStorage',
      desc: '从localStore里获取全部数据',
      example: `myUtil.localStore.getStorage()`,
      res: `{testlocalStore123: "testlocalStore123 val"}`,
      href: 'localStoregetStorage',
    },
    {
      id: 'clear',
      desc: '根据键值key删除localStore里的数据',
      example: `myUtil.localStore.clear('testlocalStore123')`,
      href: 'localStoreclear',
    },
  ];

  // doc modal
  let myUtilModalContent = [
    {
      id: 'getIcon',
      desc: '根据类别获取图标',
      example: `myUtil.modal.getIcon('info'); // error/success/warning/question`,
      resDom: <Space>
        {myUtil.modal.getIcon('info')}
        {myUtil.modal.getIcon('error')}
        {myUtil.modal.getIcon('success')}
        {myUtil.modal.getIcon('warning')}
        {myUtil.modal.getIcon('question')}
      </Space>,
    },
    {
      id: 'info',
      desc: 'info类型提示',
      example: `myUtil.modal.info({title: '导入成功', content: '导入勾选成功'});`,
    },
    {
      id: 'success',
      desc: 'success类型提示',
      example: `myUtil.modal.success({ title: '导入成功', content: [ '转待开票报关单5张', '生产单据号13个', '开票金额123,498.97元', ], onOk: () => { message.info('onOk'); }, });`,
    },
    {
      id: 'error',
      desc: 'error类型提示',
      example: `myUtil.modal.error({ title: '导入成功', content: '导入勾选成功', okText: '知道了~', });`,
    },
    {
      id: 'warning',
      desc: 'warning类型提示',
      example: `myUtil.modal.warning({ title: '导入成功', content: '导入勾选成功', });`,
    },
    {
      id: 'confirm',
      desc: 'confirm类型提示',
      example: `myUtil.modal.confirm({ title: '操作提示', content: '确定删除吗', icon: 'info', onOk() { message.info('onOK'); }, });`,
    },
    {
      id: 'viewJson',
      desc: '展示json数据类型弹窗',
    },
    {
      id: 'init',
      desc: '根据弹窗类型获取弹窗配置文件',
    },
    {
      id: 'getContent',
      desc: '绘制弹窗内容',
    },
    {
      id: 'getFooter',
      desc: '绘制弹窗页脚按钮',
    },
    {
      id: 'update',
      desc: '更新弹窗配置',
    },
    {
      id: 'responseInfo',
      desc: '展示接口响应信息弹窗',
    },
  ];

  // doc tree
  let exampleData1 = {
    nid: '-1',
    ime: 'P0',
    children: [
      {nid: '11', ime: 'A1', a: 1, c: 3},
      {nid: '12', ime: 'A2', a: 12, c: 32, children: [
        {nid: '121', ime: 'A2B1', a: 31, c: 33},
        {nid: '122', ime: 'A2B2', a: 61, c: 43},
      ]},
      {nid: '13', ime: 'A3', children: [
        {nid: '131', ime: 'A3B1', a: 71, c: -3},
        {nid: '132', ime: 'A3B2', a: 81, c: -3},
      ]}
    ]
  };

  let exampleDataArr = [
    {pid: '', nid: '-1', ime: 'P0',},
    {pid: '-1', nid: '11', ime: 'A1', a: 1, c: 3},
    {pid: '-1', nid: '12', ime: 'A2', a: 12, c: 32},
    {pid: '12', nid: '121', ime: 'A2B1', a: 31, c: 33},
    {pid: '12', nid: '122', ime: 'A2B2', a: 61, c: 43},
    {pid: '-1', nid: '13', ime: 'A3'},
    {pid: '13', nid: '131', ime: 'A3B1', a: 71, c: -3},
    {pid: '14', nid: '132', ime: 'A3B2', a: 81, c: -3},
  ];

  // deleteNode
  let exampleData2 = cloneDeep(exampleData1);
  myUtil.tree.deleteNode({ tree: exampleData2, targetId: '12', parent: exampleData2, idText: 'nid'});

  // findNodeInTree
  let exampleData1Arr = [cloneDeep(exampleData1)];
  let targetCondition = myUtil.tree.findNodeInTree({ tree: exampleData1Arr, targetId: '131', idText: 'nid' });


  // findNodeInTree
  let exampleData2Arr = [cloneDeep(exampleData1)];
  myUtil.tree.deleteTargetKey({ tree: exampleData2Arr, targetKey: ['a', 'c'] });

  // transformArrToTree
  let treeArr = cloneDeep(exampleDataArr);
  let eggTransformArrToTree = myUtil.tree.transformArrToTree(treeArr, '-1', { idName:'nid', parentIdName:'pid', childrenName:'children' });

  // setTreeLevels
  let eg10 = cloneDeep([exampleData1]);
  myUtil.tree.setTreeLevels(eg10, 0);

  // setTreeProps
  let eg11 = cloneDeep([exampleData1]);
  let setLeafProperty = (node: any) => { node.uuu = node.nid + '_aa'; node.yyy = node.nid + '_bb'; };
  myUtil.tree.setTreeProps(eg11, setLeafProperty);

  // setTreeProps
  let eg12: any = cloneDeep([exampleData1]);
  eg12 = myUtil.tree.findAllAncestorIds(eg12, '131', 'nid', 'children');

  // setTreeProps
  let eg13: any = cloneDeep([exampleData1]);
  eg13 = myUtil.tree.findAllDescendantIds(eg13, '12', 'nid', 'children');

  // sortTree
  let eg14: any = cloneDeep([exampleData1]);
  myUtil.tree.sortTree(eg14, 'nid', 'desc');

  // console.info('1111111111111111111', exampleData1, exampleData2);
  // console.info('查找目标节点', targetCondition);
  // let exampleData1Arr2 = [cloneDeep(exampleData1)];
  // console.info('根据节点可以删除目标节点', exampleData1Arr);
  let myUtilTreeContent = [
    {
      id: 'deleteNode',
      desc: '根据节点id值删除节点',
      example: `myUtil.tree.deleteNode({ tree: exampleData, targetId: '12', parent: exampleData, idText: 'nid'})`,
      res: `原数据 ${JSON.stringify(exampleData1)}`,
      res2: `新数据 ${JSON.stringify(exampleData2)}`,
    },
    {
      id: 'findNodeInTree',
      desc: '查找目标节点',
      example: `myUtil.tree.findNodeInTree({ tree: exampleData1Arr, targetId: '131', idText: 'nid' })`,
      res: `原数据 ${JSON.stringify([cloneDeep(exampleData1)])}`,
      res2: `新数据 ${JSON.stringify(targetCondition)}`,
    },
    {
      id: 'deleteTargetKey',
      desc: '根据节点可以删除目标节点',
      example: `myUtil.tree.deleteTargetKey({ tree: exampleData1Arr, targetKey: ['a', 'c] })`,
      res: `原数据 ${JSON.stringify([cloneDeep(exampleData1)])}`,
      res2: `新数据 ${JSON.stringify(exampleData2Arr)}`,
    },
    {
      id: 'transformArrToTree',
      desc: '数组转树形结构',
      example: `myUtil.tree.transformArrToTree(treeArr, '-1', { idName:'nid', parentIdName:'pid', childrenName:'children' })`,
      res: `原数据 ${JSON.stringify([cloneDeep(exampleDataArr)])}`,
      res2: `新数据 ${JSON.stringify(eggTransformArrToTree)}`,
    },
    {
      id: 'setTreeLevels',
      desc: '设置树形结构数据层级属性',
      example: `myUtil.tree.setTreeLevels(treeArr, 0})`,
      res: `原数据 ${JSON.stringify([exampleData1])}`,
      res2: `新数据 ${JSON.stringify(eg10)}`,
    },
    {
      id: 'setTreeProps',
      desc: '设置树形结构数据节点属性',
      example: `myUtil.tree.setTreeProps(treeDateTmp, setLeafProperty)`,
      res: `原数据 ${JSON.stringify(cloneDeep([exampleData1]))}`,
      res2: `新数据 ${JSON.stringify(eg11)}`,
    },
    {
      id: 'findAllAncestorIds',
      desc: '获取所有上级节点',
      example: `myUtil.tree.findAllAncestorIds(treeData, '131, 'menuId', 'children');`,
      res: `原数据 ${JSON.stringify(cloneDeep([exampleData1]))}`,
      res2: `新数据 ${JSON.stringify(eg12)}`,
    },
    {
      id: 'findAllDescendantIds',
      desc: '获取所有下级节点',
      example: `myUtil.tree.findAllDescendantIds(treeData, '131, 'menuId', 'children');`,
      res: `原数据 ${JSON.stringify(cloneDeep([exampleData1]))}`,
      res2: `新数据 ${JSON.stringify(eg13)}`,
    },
    {
      id: 'sortTree',
      desc: '排序树节点',
      example: `myUtil.tree.sortTree(eg14, 'nid', 'asc');`,
      res: `原数据 ${JSON.stringify(cloneDeep([exampleData1]))}`,
      res2: `新数据 ${JSON.stringify(eg14)}`,
    },
  ];

  // doc theme
  let myUtilThemeContent = [
    { id: 'init', desc: '主题初始化' },
    { id: 'getLayoutToken', desc: '获取layout token' },
    { id: 'getRuntimeTheme', desc: '获取Runtime Theme' },
    { id: 'getThemeItem', desc: '根据主题类别获取配置' },
    { id: 'getNoDataImageUrl', desc: '获取无数据时加载图片' },
    { id: 'getJsonViewTheme', desc: '根据当前主题获取ReactJson皮肤样式' },
    { id: 'getChartStyle', desc: '根据当前主题获取ant-design/charts主题' },
  ]

  // 文档汇总
  let docUtil: any = [
    { categoryTitle: '文本处理', categoryJs: 'myUtil.text', content: myUtilTextContent },
    { categoryTitle: '日期处理', categoryJs: 'myUtil.date', content: myUtilDateContent },
    { categoryTitle: 'sessionStore', categoryJs: 'myUtil.sessionStore', content: myUtilsessionStoreContent },
    { categoryTitle: 'localStore', categoryJs: 'myUtil.localStore', content: myUtillocalStoreContent },
    { categoryTitle: '提示信息及弹窗', categoryJs: 'myUtil.modal', content: myUtilModalContent },
    { categoryTitle: '树', categoryJs: 'myUtil.tree', content: myUtilTreeContent },
    { categoryTitle: '主题布局', categoryJs: 'myUtil.theme', content: myUtilThemeContent },
  ];

  // 绘制文档页面
  let docDom: any = (docIndex: any) => {
    let aaa: any = [];
    docUtil[docIndex].content.forEach((ddd: any) => {
      let funTxt = `${docUtil[docIndex].categoryJs}.${ddd.id}`;
      let tmp: any = <>
        <div id={ddd.href || ddd.id}>
          <Divider titlePlacement="left" styles={{ content: { margin: '0 0 0 -24px' } }} dashed>{funTxt}</Divider>
          <div className="fun_wrap">
            <div className="fun">{funTxt}</div>
            { ddd?.desc && <div className="fun_desc" style={{ color: colorError }}>说明：{ddd.desc}</div>}
            { ddd?.example && <div className="fun_input"><Text type="success"><span>示例：</span>{`${ddd.example}`}</Text></div>}
            { ddd?.res && <div className="fun_output" ><Text type="secondary">{`// ${ddd.res}`}</Text></div>}
            { ddd?.resDom && <div className="fun_output" ><Text type="secondary">{ddd.resDom}</Text></div>}
            { ddd?.example2 && <div className="fun_input"><Text type="success"><span>示例：</span>{`${ddd.example2}`}</Text></div>}
            { ddd?.res2 && <div className="fun_output" ><Text type="secondary">{`// ${ddd.res2}`}</Text></div>}
            { ddd?.example3 && <div className="fun_input"><Text type="success"><span>示例：</span>{`${ddd.example3}`}</Text></div>}
            { ddd?.res3 && <div className="fun_output" ><Text type="secondary">{`// ${ddd.res3}`}</Text></div>}
          </div>
        </div>
      </>;
      aaa.push(<React.Fragment key={ddd.href || ddd.id}>{tmp}</React.Fragment>);
    });
    return <>{aaa}</>;
  }

  // 绘制文档页面索引
  let docDomLink: any = (docIndex: any) => {
    let aaa: any = [];
    docUtil[docIndex].content.forEach((ddd: any) => {
      let tmp: any = {
        key: `${ddd.href ? ddd.href : ddd.id}`,
        href: `#${ddd.href ? ddd.href : ddd.id}`,
        title: `${ddd.id}`,
      }
      aaa.push({ ...tmp, key: `link-${ddd.href || ddd.id}` });
    });
    return aaa;
  }

  // 绘制link
  let linkMap2: any = () => {
    let ccc: any = [];
    docUtil.forEach((eee: any, index: any) => {
      ccc.push({ key: eee.categoryJs, href: `#${eee.categoryJs}`, title: eee.categoryTitle, children: [ ...docDomLink(index) ] },);
    });
    return ccc;
  }

  // 绘制 doc dom
  let docDomAll = () => {
    let bbb: any = [];
    docUtil.forEach((eee: any, index: any) => {
      bbb.push(<React.Fragment key={eee.categoryJs}>
        <div className="fun_type" id="myUtil.text" style={{backgroundColor: token.colorFillQuaternary}}>{eee.categoryTitle}</div>
        {docDom(index)}
      </React.Fragment>);
    });
    return <div className='dd_util_test'>{bbb}</div>;
  };

  return <>
    <div className='dd_util_test_wrap'>
      <h1>with antd@{version}</h1>
      <Card> {docDomAll()} </Card>
      <div className='doc_anchor' >
        <Anchor items={linkMap2()} affix={false}/>
      </div>
    </div>
    <FloatButton.BackTop />
  </>
};

export default Unit2;