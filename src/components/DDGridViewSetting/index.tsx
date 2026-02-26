import React, { useState, useRef, useImperativeHandle, memo } from 'react';
import { Tabs, Button, Modal, message } from 'antd';
import DDColumn from './setting_column';
import DDFilter from './setting_filter';
import DDSort from './setting_sort';
import SchemeForm from './scheme_form';
import SchemeList from './scheme_list';
import CONSTANTS from '../DDAssist/constants';
import myUtil from '../DDAssist/util';
import UnitUtil from '../DDBunit/unit_util';
// import './style.less';

export interface DDGridViewSettingProps {
  pageId?: any;
  updateGridView?: any,
  onRef?: any;
  visible?: any;
  settingDataColumn?: any;
  settingDataFilter?: any;
  settingDataSort?: any;
  setGridViewPlan?: any;
}

const DDGridViewSetting: React.FC<DDGridViewSettingProps> = ({
  pageId,
  setGridViewPlan,
  updateGridView,
  onRef,
  visible = false,
  settingDataColumn = [ // 测试数据
    // { title: '报关单号', dataIndex: 'ckbgdh', width: 180, align: 'left', fixed: 'left' },
    // { title: '项号', dataIndex: 'xh4', width: 60, align: 'center', fixed: 'left' },
    // { title: '出口日期', dataIndex: 'ckrq1', width: 120, align: 'center' },
    // { title: '数据检查状态', dataIndex: 'cytgbz', width: 135, align: 'center' },
    // { title: '征免类型', dataIndex: 'zmlx', width: 95, align: 'center' },
    // { title: '申报业务', dataIndex: 'sbyw', width: 95, align: 'center' },
    // { title: '商品代码', dataIndex: 'ckspDm', width: 95, align: 'center' },
    // { title: '商品名称', dataIndex: 'ckspmc', width: 180, align: 'left' },
    // { title: '海关商品名称', dataIndex: 'hgspmc', width: 180, align: 'left' },
    // { title: '出口合同号', dataIndex: 'ckhth', width: 115, align: 'left' },
    // { title: '监管方式', dataIndex: 'jgfsDm', width: 135, align: 'left' },
    // { title: '成交方式', dataIndex: 'hgcjfsmc', width: 85, align: 'center' },
    // { title: '成交单位', dataIndex: 'hgjldwmc', width: 90, align: 'center', ellipsis: true },
    // { title: '成交数量', dataIndex: 'cjsl1', width: 140, align: 'right' },
    // { title: '成交币制', dataIndex: 'cjhghbzmDm', width: 85, align: 'center' },
    // { title: '成交金额', dataIndex: 'cjzj', width: 140, align: 'right' },
    // { title: '美元离岸价', dataIndex: 'mylaj', width: 140, align: 'right' },
    // { title: '法定单位', dataIndex: 'dyjldwDm', width: 90, align: 'center', ellipsis: true },
    // { title: '法定单位数量', dataIndex: 'cksl', width: 140, align: 'right' },
    // { title: '第二单位', dataIndex: 'dejldwDm', width: 90, align: 'center', ellipsis: true },
    // { title: '第二单位数量', dataIndex: 'decksl', width: 140, align: 'right' },
  ],
  settingDataFilter = { // 测试数据
    // range: [
    //   {name: 'ckrq', label: '出口日期', type: itemType.DatePicker, range: true,
    //   // layout: {
    //   //   label: {xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3},
    //   //   formItem: {xs: 16, sm: 16, md: 16, lg: 19, xl: 21, xxl: 21},
    //   // },
    //   quickOption: {
    //     type: itemType.Radio,
    //     list: [
    //       {value: 'ckrqv1', name: '本月'},
    //       {value: 'ckrqv2', name: '三个月'},
    //       {value: 'ckrqv3', name: '本年'},
    //     ]
    //   }},
    //   {name: 'ckgb', label: '出口国别', mode: 'multiple', type: itemType.Select, list: [
    //     {value: 'ckgb1', name: '出口国别1'},
    //     {value: 'ckgb2', name: '出口国别2'},
    //   ], quickOption: {
    //     type: itemType.Radio,
    //     list: [
    //       {value: 'ckgbv1', name: '亚洲'},
    //       {value: 'ckgbv2', name: '欧洲'},
    //       {value: 'ckgbv3', name: '美国'},
    //     ]
    //   }},
    //   {name: 'myfs', label: '贸易方式', type: itemType.Select, list: [
    //     {value: 'myfs1', name: '贸易方式1'},
    //     {value: 'myfs2', name: '贸易方式2'},
    //   ]},
    //   {name: 'ckka', label: '出口口岸', type: itemType.Select, list: [
    //     {value: 'ckka1', name: '出口口岸1'},
    //     {value: 'ckka2', name: '出口口岸2'},
    //   ]},
    //   {name: 'ysfs', label: '运输方式', type: itemType.Select, list: [
    //     {value: 'ysfs1', name: '运输方式1'},
    //     {value: 'ysfs2', name: '运输方式2'},
    //   ]},
    //   {name: 'hwlx', label: '货物类型', type: itemType.Checkbox, list: [
    //     {value: 'bqf', name: '不区分'},
    //     {value: 'tshw', name: '退税货物'},
    //     {value: 'yzshw', name: '应征税货物'},
    //   ],
    //   // layout: {
    //   //   label: {xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3},
    //   //   formItem: {xs: 16, sm: 16, md: 16, lg:19, xl: 9, xxl: 8},
    //   // }
    // },
    //   {name: 'ckfslx', label: '出口方式类型', type: itemType.Checkbox, list: [
    //     {value: 'bqf', name: '不区分'},
    //     {value: 'zyck', name: '自营出口'},
    //     {value: 'wtck', name: '委托出口'},
    //   ],
    //   // layout: {
    //   //   label: {xs: 8, sm: 8, md: 8, lg: 5, xl: 3, xxl: 3},
    //   //   formItem: {xs: 16, sm: 16, md: 16, lg:19, xl: 9, xxl: 8},
    //   // }
    // },
    //   {name: 'spdm', label: '商品代码', type: itemType.Select, list: [
    //     {value: 'spdm1', name: '商品代码1'},
    //     {value: 'spdm2', name: '商品代码2'},
    //   ]},
    //   {name: 'sjzt', label: '数据状态', type: itemType.Select, list: [
    //     {value: 'sjzt1', name: '数据状态1'},
    //     {value: 'sjzt2', name: '数据状态2'},
    //   ]},
    // ],
    // condition: [
    //   {
    //     groupLabel: '报关单表头',
    //     items: [
    //       {value: 'bgdh', label: '报关单号'},
    //       {value: 'ckhth', label: '出口合同号'},
    //       {value: 'cke', label: '出口额'},
    //       {value: 'jldw', label: '计量单位'},
    //     ]
    //   },
    //   {
    //     groupLabel: '报关单表体',
    //     items: [
    //       {value: 'xh', label: '项号'},
    //       {value: 'fddw', label: '法定单位'},
    //     ]
    //   },
    //   {
    //     groupLabel: '商品维度',
    //     items: [
    //       {value: 'spdm', label: '商品代码'},
    //       {value: 'spmc', label: '商品名称'},
    //     ]
    //   },
    //   {
    //     groupLabel: '贸易方式',
    //     items: [
    //       {value: 'myfsdm', label: '贸易方式代码'},
    //       {value: 'myfsmc', label: '贸易方式名称'},
    //     ]
    //   }
    // ]
  },
  settingDataSort = [ // 测试数据
    // { col: '报关单号', order: "asc", name: 'bgd' },
    // { col: '出口日期', order: "desc", name: 'ckrq' },
    // { col: '数据检查状态', order: "default", name: 'sjjczt' },
    // { col: '征免类型', order: "default", name: 'zmlx' }
  ],
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(visible);
  const refDDGridViewSort: any = useRef();
  const refDDGridViewFilter: any = useRef();
  const refDDGridViewColumn: any = useRef();
  const refSchemeForm: any = useRef();
  const refSchemeList: any = useRef();

  const [isScheme, setIsScheme] = useState<boolean>(false);
  const [isSettingDataFilter, setIsSettingDataFilter] = useState<boolean>(false);
  const [isSettingDataSort, setIsSettingDataSort] = useState<boolean>(false);
  // console.info('render DDGridViewSetting ~~~')

  // 开启
  const showModal = () => {
    setIsScheme(pageId ? true : false);
    setIsSettingDataFilter((settingDataFilter?.range?.length > 0 || settingDataFilter?.condition?.length > 0) ? true : false);
    setIsSettingDataSort(settingDataSort?.length > 0 ? true : false);

    setModalVisible(true);
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
      saveView,
    };
  });

  // 获取视图数据
  const getViewConfig = () => {
    // 列
    const column: any = refDDGridViewColumn?.current?.getSettingColumn();
    // 筛选
    const filter: any = refDDGridViewFilter?.current?.getSettingFilter();
    // 排序
    const rules: any = refDDGridViewSort?.current?.getSettingSort();
    return {
      column,
      filter,
      rules,
    }
  }
  // 获取视图源数据
  const getViewConfigSource = () => {
    // 列
    const column: any = refDDGridViewColumn?.current?.getSettingColumnSource();
    // 筛选
    const filter: any = refDDGridViewFilter?.current?.getSettingFilterSource();
    // 排序
    const rules: any = refDDGridViewSort?.current?.getSettingSortSource();
    return {
      column,
      filter,
      rules,
    }
  }

  // 更新视图
  const saveView = () => {
    const viewConfig = getViewConfig();
    if (updateGridView) {
      updateGridView(viewConfig);
    }
    setModalVisible(false);
  };

  // 开启另存为方案弹窗
  const showSchemeModa = () => {
    let tmpType: boolean = true;
    for (let i = 0; i < settingDataColumn.length; i++) {
      if (typeof settingDataColumn[i].title !== 'string') {
        tmpType = false
        break;
      }
    }
    if (tmpType) {
      refSchemeForm.current!.showModal();
    } else {
      message.error('此类型列表无法使用另存为方案功能。');
    }
  }

  // 选择方案
  const chooseScheme = () => {
    let tmpType: boolean = true;
    for (let i = 0; i < settingDataColumn.length; i++) {
      if (typeof settingDataColumn[i].title !== 'string') {
        tmpType = false
        break;
      }
    }
    if (tmpType) {
      refSchemeList.current!.showModal();
    } else {
      message.error('此类型列表无法使用选择方案功能。');
    }
  }

  // 保存方案
  const saveSchemeDate = (schemeData: any) => {
    const config: any = getViewConfigSource();
    const scheme: any = {
      config,
      ...schemeData,
      faid: myUtil.text.uuid(),
    }
    const viewId: string = pageId;
    const viewConfig: any = myUtil.localStore.getItem('view_config') || {};
    const currentViewConfig: any = viewConfig[viewId] || [];
    currentViewConfig.push(scheme);
    viewConfig[viewId] = currentViewConfig;
    myUtil.localStore.setItem('view_config', viewConfig);
    // 设置父页面
    UnitUtil.gridViewSetting.getGridViewPlan({ setGridViewPlan, unitKey: viewId });
    // 关闭页面
    refSchemeForm.current!.closeModal();
  }
  // 选择方案
  const chooseSchemeDate = (schemeData: any) => {
    const { column, filter, rules } = schemeData?.config;
    // 列
    refDDGridViewColumn?.current?.setSettingColumnSource(column);
    // 筛选
    refDDGridViewFilter?.current?.setSettingFilterSource(filter);
    // 排序
    refDDGridViewSort?.current?.setSettingSortSource(rules);
    // 设置当前使用方案标识
    UnitUtil.gridViewSetting.setGridViewUsed(pageId, schemeData, setGridViewPlan);
  }

  let getTabItems = () => {
    let tabItems = [
      { key: '1', label: '列', forceRender: true, children: <DDColumn onRef={refDDGridViewColumn} data={settingDataColumn}/>, }
    ];
    if (isSettingDataFilter) {
      tabItems.push({ key: '2', label: '筛选', forceRender: true, children: <DDFilter onRef={refDDGridViewFilter} data={settingDataFilter}/>, });
    }
    if (isSettingDataSort) {
      tabItems.push({ key: '3', label: '排序', forceRender: true, children: <DDSort onRef={refDDGridViewSort} data={settingDataSort}/>, });
    }
    return tabItems;
  };

  return (
    <>
      <Modal
        title="视图设置"
        centered
        destroyOnHidden
        open={modalVisible}
        wrapClassName='standard-modal-1'
        width={CONSTANTS.C_MODAL_WIDTH_X4}
        onCancel={() => setModalVisible(false)}
        zIndex={1001}
        footer={(
          <>
            {
              isScheme ?
              <>
                <Button onClick={() => chooseScheme()}>选择方案</Button>
                <Button onClick={() => showSchemeModa()}>另存为方案</Button>
              </> : <></>
            }
            <Button onClick={() => saveView()} type="primary">确定</Button>
            <Button onClick={() => setModalVisible(false)}>关闭</Button>
          </>
        )}
      >
        <div className="dd_grid_view_setting_wrap">
          <Tabs defaultActiveKey="1" items={getTabItems()} />
        </div>
      </Modal>
      <SchemeForm onRef={refSchemeForm} saveScheme={saveSchemeDate}/>
      <SchemeList onRef={refSchemeList} chooseScheme={chooseSchemeDate} pageId={pageId}/>
    </>
  );
};
export default memo(DDGridViewSetting);
