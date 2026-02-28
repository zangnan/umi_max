import React, { useState, useEffect, useRef } from 'react';
import { ProCard } from '@ant-design/pro-components';
import { Space, Tree, Form, Spin, message, Modal, theme } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import myUtil from '../DDAssist/util';
import DDBaseForm from '../DDForm/DDBaseForm';
import { cloneDeep } from 'lodash';
import CONSTANTS from '../DDAssist/constants';
import { baseDelete, getGridData, baseEdit } from '@/services/hts/api';
import './style.less';
import DDBunit2 from '../DDBunit/DDBunit2';

export type DDBunitPropsTree = {
  config: any;
  func?: any;
  func2?: any;
};

const DDBunitTreeGrid: React.FC<DDBunitPropsTree> = ({
  config, func = {}, func2 = {},
}) => {
  // left
  const config_left = config?.left || {};
  const config_right = config?.right || {};
  const [form] = Form.useForm();
  const [masker, setMasker] = useState(false);
  const [treeData, setTreeData] = useState<any>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [formType, setFormType] = useState<string>(''); // 表单类型：edit：编辑，add：新建
  const [formConfig, setFormConfig] = useState<any>(config_left?.form || {});
  // tree
  const tree_checkable = config_left?.tree?.checkable;
  // tree field name
  const tree_field_names_key = config_left?.tree?.field_names?.key;
  const tree_field_names_parent_key = config_left?.tree?.field_names?.parent_key;
  const tree_field_names_title = config_left?.tree?.field_names?.title;
  const tree_field_names_children = config_left?.tree?.field_names?.children;
  const tree_root_id = config_left?.tree?.root_id || '';
  // api
  let apiPrefix = myUtil.api.getApiRoot();
  const api_grid_query = `${apiPrefix}${config_left?.api_grid_query || CONSTANTS.DEFAULT_API.GRID_QUERY}`;
  const api_form_delete = `${apiPrefix}${config_left?.api_form_delete || CONSTANTS.DEFAULT_API.FORM_DELETE}`;
  const api_form_edit = `${apiPrefix}${config_left?.api_form_edit || CONSTANTS.DEFAULT_API.FORM_EDIT}`;
  // btn
  const toolbar_default_add = config_left?.toolbar_default?.add;
  const toolbar_default_edit = config_left?.toolbar_default?.edit;
  const toolbar_default_delete = config_left?.toolbar_default?.delete;
  // themeToken
  const { useToken } = theme;
  const { token }: any = useToken();
  const colorSuccess: any = token?.Tag?.colorSuccess;
  const colorError: any = token?.Tag?.colorError;
  const colorInfo: any = token?.colorInfo;


  const refDDBunit2: any = useRef();
  const [myConfig, setMyconfig] = useState<any>(config_right);
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);

  useEffect(() => {
    if (Object.keys(config).length !== 0) {
      getTreeData();
      setFormConfig({ ...config_left?.form });
    }
    setMyconfig(config_right);
  }, [config]);

  useEffect(() => {
    let expandedKeys: any = [];
    const treeRecursive = (data: any) => {
      data?.forEach((item: any) => {
        if (item[tree_field_names_children]?.length > 0) {
          expandedKeys.push(item[tree_field_names_key]);
          treeRecursive(item[tree_field_names_children]);
        }
      })
    };
    treeRecursive(treeData);
    setExpandedKeys(expandedKeys);
  }, [treeData]);

  // tree 展开/关闭节点事件
  const onExpand: any = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  // tree 选择节点事件
  const onSelect: any = (selectedKeys: any, info: any) => {
    const { selectedNodes } = info;
    let formValTmp: any = { ...selectedNodes[0]};
    const c = { ...myConfig };
    // 补充主键字段
    let itemDbField = c?.grid_columns?.find((item: any) => { return item.dataIndex === tree_field_names_key });
    let searchModelObj: any = { type: 4, property: tree_field_names_key, value: formValTmp[tree_field_names_key] || '', op: 'eq' };
    myUtil.mysql.addDbFields(searchModelObj, itemDbField); // 补充数据库字段
    const gridParams: any = {
      initSearchModal: [
        searchModelObj,
      ],
    }
    c.gridParams = gridParams;
    setMyconfig(c);
  };

  // 获取完整树数据
  const getTreeData = () => {
    setMasker(true);
    getGridData(api_grid_query, {page: 1, pageSize: 999999, searchModel: []}).then((res: any) => {
      setMasker(false);
      const { code, msg, body } = res;
      if (code === '200') {
        // 数组转树形结构
        let treeDateTmp = myUtil.tree.transformArrToTree(body?.rows, tree_root_id, {
          idName: tree_field_names_key,
          parentIdName: tree_field_names_parent_key,
          childrenName: tree_field_names_children,
        });
        setTreeData(treeDateTmp);
      } else {
        message.error(msg);
      }
    })
  };

  // 新建树节点
  const addTreeNode = (data: any, event: any) => {
    event.stopPropagation();
    setFormType('add');
    func.formType = 'add';
    let tmpFormConfig: any = cloneDeep(formConfig);
    setFormConfig(tmpFormConfig);
    let defaultVal: any = {};
    formConfig.form_items?.forEach((item: any) => {
      defaultVal[item.name] = item.default_value;
    })
    defaultVal[tree_field_names_parent_key] = data[tree_field_names_key] || '';
    form.setFieldsValue(defaultVal);
    handleModalVisible(true);
  };

  // 编辑树节点
  const editTreeNode = (data: any, event: any) => {
    event.stopPropagation();
    // const { selectedNodes } = info;
    // let formValTmp: any = { ...selectedNodes[0]};
    let formValTmp: any = { ...data};
    // if (func.treeOnSelect) {
    //   let reVal: any = func.treeOnSelect({
    //     form,
    //     values: formValTmp,
    //   });
    //   let values: any = reVal.values;
    //   formValTmp = { ...selectedNodes[0], ...values };
    // }
    setFormType('edit');
    func.formType = 'edit';
    form.setFieldsValue(formValTmp);

    // refDDBunit2?.current?.setMasker();

    handleModalVisible(true);
  };

  // 保存树节点信息
  const saveTreeNode = () => {
    form.validateFields().then((values: any) => {
      if (func.formBeforeSubmit) {
        let reVal: any = func.formBeforeSubmit({
          form,
          values,
        });
        values = reVal.values;
      }
      values.formType = formType;
      setMasker(true);
      baseEdit({
        data: values,
        url: api_form_edit,
      }).then((res: any) => {
        setMasker(false);
        const { code, msg } = res;
        myUtil.modal.responseInfo({code, msg});
        getTreeData();
        handleModalVisible(false);
      })
    })
  };

  // 删除树节点
  const delTreeNode = (data: any, event: any) => {
    event.stopPropagation();
    // 存在叶子节点无法删除
    if (data[tree_field_names_children] && data[tree_field_names_children].length > 0) {
      message.info("存在叶子节点，不允许删除！");
      return;
    }
    myUtil.modal.confirm({
      title: '系统提示',
      content: `确认删除该节点【${data[tree_field_names_title]}】吗？`,
      onOk() {
        setMasker(true);
        baseDelete({
          data: { uuids: [data[tree_field_names_key]]},
          url: api_form_delete
        }).then((res: any) => {
          setMasker(false);
          const { code, msg } = res;
          myUtil.modal.responseInfo({code, msg});
          getTreeData();
          handleModalVisible(false);
        })
      }
    });
  };

  const leftTree: any = <>
    <ProCard title={`${config_left?.unit_title || ''}树`} >
      <div style={{ height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '14px']), overflowY: 'auto', overflowX: 'hidden' }}>
        <Tree
          checkable={tree_checkable}
          showLine
          blockNode
          onExpand={onExpand}
          expandedKeys={expandedKeys}
          onSelect={onSelect}
          className='treeCd'
          treeData={treeData}
          fieldNames={config_left?.tree?.field_names}
          titleRender={(nodeData: any) => <Space>
            <span>{nodeData[tree_field_names_title]}</span>
            { toolbar_default_add && <PlusOutlined className='cdgl-icon cdgl-icon-add' style={{ color: colorInfo }} onClick={(event: any) => addTreeNode(nodeData, event)} />}
            { toolbar_default_edit && <EditOutlined className='cdgl-icon cdgl-icon-add' style={{ color: colorInfo }} onClick={(event: any) => editTreeNode(nodeData, event)} />}
            { toolbar_default_delete && <DeleteOutlined className='cdgl-icon cdgl-icon-delete' style={{ color: colorError }} onClick={(event: any) => delTreeNode(nodeData, event)} />}
          </Space>}
        />
      </div>
    </ProCard>
  </>;

  const rightUnit: any = <>
    <DDBunit2 config={myConfig} func={func2}  refDDBunit2={refDDBunit2}/>
  </>

  return <>
    <Spin description="Loading..." spinning={masker} delay={100}>
      <div style={{position: 'relative', padding: '0 0 0 320px'}}>
        <div style={{position: 'absolute', width: '300px', left: '0'}}>{leftTree}</div>
        <div style={{}}>{rightUnit}</div>
      </div>
      <Modal
        title={`${config.unit_title || ''}${formType === 'add' ? '采集' : '编辑'}`}
        open={createModalVisible}
        wrapClassName="standard-modal-1"
        width={CONSTANTS.C_MODAL_WIDTH_X2}
        okText="保存"
        cancelText="关闭"
        onCancel={() => handleModalVisible(false)}
        onOk={saveTreeNode}
        // className={`${masker2 ? 'dd_modal_show_masker' : ''}`}
        mask={{ closable: false }}
      >
        {/* <Spin
          tip="Loading..."
          // spinning={masker2}
          delay={100}
          key="DDBunit2DDBaseForm"
        > */}
          <DDBaseForm config={formConfig} form={form} initialValues={{}} func={func}/>
        {/* </Spin> */}
      </Modal>
    </Spin>
  </>
};
export default DDBunitTreeGrid;
