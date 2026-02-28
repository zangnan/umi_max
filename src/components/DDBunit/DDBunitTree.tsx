import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Space, Tree, Form, Button, Spin, message, notification, theme } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import myUtil from '../DDAssist/util';
import DDBaseForm from '../DDForm/DDBaseForm';
import { cloneDeep } from 'lodash';
import CONSTANTS from '../DDAssist/constants';
import { baseDelete, getGridData, baseEdit } from '@/services/hts/api';
import './style.less';

export type DDBunitPropsTree = {
  config: any;
  func?: any;
};

const DDBunitTree: React.FC<DDBunitPropsTree> = ({
  config, func = {},
}) => {
  const [form] = Form.useForm();
  const [masker, setMasker] = useState(false);
  const [treeData, setTreeData] = useState<any>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [formType, setFormType] = useState<string>(''); // 表单类型：edit：编辑，add：新建
  const [formConfig, setFormConfig] = useState<any>(config?.form || {});
  // tree
  const tree_checkable = config?.tree?.checkable;
  // tree field name
  const tree_field_names_key = config?.tree?.field_names?.key;
  const tree_field_names_parent_key = config?.tree?.field_names?.parent_key;
  const tree_field_names_title = config?.tree?.field_names?.title;
  const tree_field_names_children = config?.tree?.field_names?.children;
  const tree_root_id = config?.tree?.root_id || '';
  // api
  let apiPrefix = myUtil.api.getApiRoot();
  const api_grid_query = `${apiPrefix}${config?.api_grid_query || CONSTANTS.DEFAULT_API.GRID_QUERY}`;
  const api_form_delete = `${apiPrefix}${config?.api_form_delete || CONSTANTS.DEFAULT_API.FORM_DELETE}`;
  const api_form_edit = `${apiPrefix}${config?.api_form_edit || CONSTANTS.DEFAULT_API.FORM_EDIT}`;
  // btn
  const toolbar_default_add = config?.toolbar_default?.add;
  const toolbar_default_edit = config?.toolbar_default?.edit;
  const toolbar_default_delete = config?.toolbar_default?.delete;
  // themeToken
  const { useToken } = theme;
  const { token }: any = useToken();
  const colorSuccess: any = token?.Tag?.colorSuccess;
  const colorError: any = token?.Tag?.colorError;
  const colorInfo: any = token?.colorInfo;

  useEffect(() => {
    if (Object.keys(config).length !== 0) {
      getTreeData();
      setFormConfig({ ...config?.form });
    }
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
    if (func.treeOnSelect) {
      let reVal: any = func.treeOnSelect({
        form,
        values: formValTmp,
      });
      let values: any = reVal.values;
      formValTmp = { ...selectedNodes[0], ...values };
    }
    setFormType('edit');
    func.formType = 'edit';
    // let tmprightFormConfig: any = cloneDeep(formConfig);
    // 设置主键项只读 待优化
    // let tmpOnEdit = tmprightFormConfig.form_items.find((tmp: any) => { return tmp.name === tree_field_names_key });
    // tmpOnEdit.disabled = true;
    // setFormConfig(tmprightFormConfig);
    form.setFieldsValue(formValTmp);
  };

  // 获取完整树数据
  const getTreeData = () => {
    setMasker(true);
    getGridData(api_grid_query, {page: 1, pageSize: 999999, searchModel: []}).then((res: any) => {
      setMasker(false);
      const { code, msg, body } = res;
      if (code == '200') {
        // 数组转树形结构
        let treeDateTmp = myUtil.tree.transformArrToTree(body?.rows, tree_root_id, {
          idName: tree_field_names_key,
          parentIdName: tree_field_names_parent_key,
          childrenName: tree_field_names_children,
        });
        let tmpCol = config?.form?.form_items?.find((tmp: any) => { return tmp.order});
        if (tmpCol) {
          treeDateTmp = myUtil.tree.sortTree(treeDateTmp, tmpCol.name, tmpCol.order);
        }
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
  };

  // 保存树节点信息
  const saveTreeNode = () => {
    form.validateFields().then(values => {
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
        if (code == '200') {
          getTreeData();
          message.success("保存成功！");
        } else {
          message.error(msg);
          notification.error({
            message: `code: ${res?.code}`,
            description: <>{JSON.stringify(res?.msg)}</>,
            placement: 'top',
            duration: null,
          });
        }
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
          if (code == '200') {
            getTreeData();
            message.success("删除成功！");
          } else {
            notification.error({
              message: `code: ${res?.code}`,
              description: <>{JSON.stringify(res?.msg)}</>,
              placement: 'top',
              duration: null,
            });
          }
        })
      }
    });
  };

  // 表单页脚按钮
  const getFormBtn = () => {
    const btnTmp: any = [];
    if (toolbar_default_edit) {
      btnTmp.push(<Button type='primary' onClick={saveTreeNode}>保存</Button>);
    }
    if (btnTmp.length > 0) {
      return {
        actions: btnTmp,
      }
    }
    return {};
  }

  return <>
    <Spin description="Loading..." spinning={masker} delay={100}>
      <Row gutter={[16, 0]}>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <Card title={`${config.unit_title || ''}树`} >
            <div style={{ height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '25px']), overflowY: 'auto', overflowX: 'hidden' }}>
              <Tree
                checkable={tree_checkable}
                showLine
                blockNode
                onExpand={onExpand}
                expandedKeys={expandedKeys}
                onSelect={onSelect}
                className='treeCd'
                treeData={treeData}
                fieldNames={config?.tree?.field_names}
                titleRender={(nodeData: any) => <Space>
                  <span>{nodeData[tree_field_names_title]}</span>
                  { toolbar_default_add && <PlusOutlined className='cdgl-icon cdgl-icon-add' style={{ color: colorInfo }} onClick={(event: any) => addTreeNode(nodeData, event)} />}
                  { toolbar_default_delete && <DeleteOutlined className='cdgl-icon cdgl-icon-delete' style={{ color: colorError }} onClick={(event: any) => delTreeNode(nodeData, event)} />}
                </Space>}
              />
            </div>
          </Card>
        </Col>
        <Col xs={12} sm={12} md={12} lg={12} xl={12} xxl={12}>
          <Card styles={{ actions: { padding: '10px 0' }}} title={`${config.unit_title  || ''}编辑`} {...getFormBtn()} >
            <div style={{ height: myUtil.heightCalc.getCalc(['header', 'cardMargin', toolbar_default_edit ? '76px' : '14px']), overflowY: 'auto', overflowX: 'hidden' }}>
              <DDBaseForm config={formConfig} form={form} initialValues={{}} func={func}/>
            </div>
          </Card>
        </Col>
      </Row>
    </Spin>
  </>
};
export default DDBunitTree;
