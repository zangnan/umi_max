/**
 * title: 菜单管理
 * author: wx
 */
import React, { useState, useEffect, useRef } from 'react';
import type { TreeProps } from 'antd/es/tree';
import ProCard from '@ant-design/pro-card';
import { Tree, Form, Input, Button, Switch, Spin, message, Select } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { queryCdTree, saveOrUpdateCd, checkCd, deleteCd, cdDcsjzd, dcjb } from '@/pages/hts/services/htsApi';
import myUtil from '@/components/DDAssist/util';
import DDAlert from '@/pages/hts/components/DDAlert';
import '../style.less';
import ModalForm from './modal_form';

const index: React.FC<unknown> = () => {
  const { TreeNode } = Tree;

  const Func: any = {
    refUnit: React.createRef(),
  };
  const modalRef: any = useRef();
  Func.getOtherRef = () => {
    const otherRef = [];
    otherRef.push(modalRef);
    return otherRef;
  };

  const [form] = Form.useForm();
  const [selectOption, setSelectOption] = useState<any>([]);
  const [masker, setMasker] = useState(false);
  const [treeData, setTreeData] = useState<any>([]);
  const [expandedKeys, setExpandedKeys] = useState<React.Key[]>([]);
  const [addFlag, setAddFlag] = useState<Boolean>(false);
  const [jcfqdDmOption, setJcfqdDmOption] = useState<any>([]);
  const [checkQdDm, setCheckQdDm] = useState(false);
  const [checkWlxh, setCheckWlxh] = useState(false);
  const [treeSelect, setTreeSelect] = useState<any>([]);


  useEffect(async () => {
    getCdTree();
    const tmpCodeTable: any = await myUtil.code.getCodeFromServerT1('CODE_DM_YCSB_CDLX:01');
    setSelectOption(tmpCodeTable);
    const tmpCodeTableQd: any = await myUtil.code.getCodeFromServerT1('CODE_QX_QD:01');
    setJcfqdDmOption(tmpCodeTableQd);
  }, []);

  useEffect(() => {
    let expandedKeys: any = [];
    function treeRecursive(data: any) {
      data.forEach((item: any) => {
        if (item.spread == true) {
          expandedKeys.push(item.id);
        }
        if (item.children && item.children.length > 0) {
          treeRecursive(item.children);
        }
      })
    };
    treeRecursive(treeData);
    setExpandedKeys(expandedKeys);
  }, [treeData]);

  // tree 展开/关闭节点事件
  const onExpand = (expandedKeysValue: React.Key[]) => {
    setExpandedKeys(expandedKeysValue);
  };

  const onCheck = (expandedKeysValue: React.Key[]) => {
    setTreeSelect(expandedKeysValue);
  };

  // tree 选择节点事件
  const onSelect: TreeProps['onSelect'] = (selectedKeys, info) => {
    const { selectedNodes } = info;
    const displayProcessing = {
      ycbz: selectedNodes[0]?.ycbz == 'Y' ? false : true,
      qpbz: selectedNodes[0]?.qpbz == 'Y' ? true : false,
      xybz: selectedNodes[0]?.xybz == 'Y' ? true : false,
    }
    setAddFlag(false);
    setCheckQdDm(false)
    setCheckWlxh(false)
    form.setFieldsValue({ ...selectedNodes[0], ...displayProcessing });
  };
  // 获取完整菜单树
  const getCdTree = () => {
    setMasker(true);
    queryCdTree({}).then((res: any) => {
      setMasker(false);
      const { code, msg, body } = res;
      if (code == '200') {
        setTreeData(body);
        form.setFieldsValue({ xybz: true });
      } else {
        message.error(msg)
      }
    })
  };
  // 新建树节点
  const addTreeNode = (data: any, event: any) => {
    event.stopPropagation();
    setAddFlag(true);
    setCheckQdDm(false);
    setCheckWlxh(false);
    form.setFieldsValue({
      cdDm: '',
      cdmc: '未命名',
      fjdcdDm: data.id,
      cdlj: '',
      bz: '',
      tbys: '',
      yqcdtb: '',
      wjlj: '',
      fjdcdlj: '',
      yqcdfjdDm: '',
      cdlxDm: '',
      wlxh: '',
      jcfQdDm: '',
      jcfJumpUrl: '',
      ycbz: false,
      qpbz: false,
      xybz: true,
    })
  };
  // 保存树节点信息
  const saveTreeNode = () => {
    form.validateFields().then(values => {
      values.ycbz = values.ycbz ? 'N' : 'Y';
      values.qpbz = values.qpbz ? 'Y' : 'N';
      values.xybz = values.xybz ? 'Y' : 'N';
      setMasker(true);
      saveOrUpdateCd(values).then((res: any) => {
        setMasker(false);
        const { code, msg } = res;
        if (code == '200') {
          getCdTree();
          message.success("菜单保存成功！");
        } else {
          message.error(msg);
        }
      })
    })
  };




  // 
  const tongji = (data: any, event: any) => {
    event.stopPropagation();
    const cddm = data.cdDm;
    const cdmc = data.cdmc;
    Func.getOtherRef()[0].current?.showModal(cddm, cdmc);
  }
  // 删除树节点
  const delTreeNode = (data: any, event: any) => {
    event.stopPropagation();
    setCheckQdDm(false);
    setCheckWlxh(false);
    // 存在子菜单无法删除
    if (data.children && data.children.length > 0) {
      message.info("当前菜单不允许删除！");
      return;
    }
    DDAlert.open({
      title: '系统提示',
      info: <span>确认删除该节点 "<span style={{ color: '#999' }}>{data.cdmc}</span>" 吗？</span>,
      infoType: 'question',
      modalType: 'confirm',
      closeStatus: false,
      okCallbackFn: function (thisObj: any) {
        thisObj.setState({ masker: true });
        deleteCd({ cdDm: data.id }).then((res: any) => {
          DDAlert.close();
          const { code, msg } = res;
          if (code == '200') {
            getCdTree();
            message.success("菜单删除成功！");
          } else {
            message.error(msg);
          }
        })
      },
    });
  };

  const onMouseOver = (item: any) => {
    const addIconEl = document.getElementById('addIcon' + item.id) as HTMLElement;
    addIconEl?.style?.setProperty('display', 'inline-block', 'important');
    const delIconEl = document.getElementById('delIcon' + item.id) as HTMLElement;
    delIconEl?.style?.setProperty('display', 'inline-block', 'important');
  };
  const onMouseOut = (item: any) => {
    const addIconEl = document.getElementById('addIcon' + item.id) as HTMLElement;
    addIconEl?.style?.setProperty('display', 'none', 'important');
    const delIconEl = document.getElementById('delIcon' + item.id) as HTMLElement;
    delIconEl?.style?.setProperty('display', 'none', 'important');
  };
  // 自定义树节点
  const getTreeNode = (data: any) => {
    if (data && data.length > 0) {
      return data.map((item: any) => {
        if (item.children) {
          return (
            <TreeNode key={item.id} {...item} title={
              <div onMouseOver={() => onMouseOver(item)} onMouseOut={() => onMouseOut(item)}>
                {item.title}
                <Button type="link" onClick={(event: any) => tongji(item, event)}>{item.cyhlys}</Button>
                <PlusOutlined id={'addIcon' + item.id} className='cdgl-icon' onClick={(event: any) => addTreeNode(item, event)} />
                <DeleteOutlined id={'delIcon' + item.id} className='cdgl-icon' onClick={(event: any) => delTreeNode(item, event)} />
              </div>
            }>
              {getTreeNode(item.children)}
            </TreeNode>
          );
        }
        return (
          <TreeNode key={item.id} {...item} title={
            <div onMouseOver={() => onMouseOver(item)} onMouseOut={() => onMouseOut(item)}>
              {item.title}
              <Button onClick={(event: any) => tongji(item, event)}>{item.cyhlys}</Button>
              <PlusOutlined id='addIcon' className='cdgl-icon' onClick={(event: any) => addTreeNode(item, event)} />
              <DeleteOutlined id='delIcon' className='cdgl-icon' onClick={(event: any) => delTreeNode(item, event)} />
            </div>
          } />
        );
      });
    }
    return [];
  };

  // 选择渠道代码
  const onCheckQdChange = (e: any) => {
    const jcfJumpUrl = form.getFieldValue('jcfJumpUrl');
    if (e || jcfJumpUrl) {
      setCheckQdDm(true);
    } else {
      setCheckQdDm(false);
    }
  };

  // 填写渠道路径
  const onCheckQdLjChange = (e: any) => {
    const jcfQdDm = form.getFieldValue('jcfQdDm');
    if (e.target.value || jcfQdDm) {
      setCheckQdDm(true);
    } else {
      setCheckQdDm(false);
    }
  };

  // 选择菜单类型
  const onCheckCdlxChange = (e: any) => {
    if (e === '01') {
      setCheckWlxh(true);
    } else {
      setCheckWlxh(false);
    }
  };

  const exportJb = async () => {
    const param = [...treeSelect];
    DDAlert.open({
      title: '导出脚本',
      infoType: 'warning',
      modalType: 'form',
      closeStatus: false,
      isFormContent: true,
      content: <>
        <Form.Item label="版本号" name="bbh" rules={[{ required: true, message: '版本号' }]}>
          <Input placeholder="请输入版本号" />
        </Form.Item>
        <Form.Item label="排除内容集合" name="pcnrs" initialValue={''}>
          <Input placeholder="请输入排除内容集合" />
        </Form.Item>
      </>,
      okCallbackFn: function (thisObj: any) {
        DDAlert.getForms().validateFields().then((values: any) => {
          thisObj.setState({ masker: true });
          values.dcbs = 'CD';
          values.dcnrs = param.join(',');
          dcjb(values).then((res: any) => {
            thisObj.setState({ masker: false });
            const { code, body, msg } = res;
            if (code === '200') {
              const { blob, fileName } = body;
              DDAlert.close();
              myUtil.file.downloadExcel(blob, fileName);
            } else {
              message.error(msg);
            }
          });
        });
      }
    });



  }

  const exportZd = () => {
    setMasker(true);
    cdDcsjzd({}).then((res: any) => {
      setMasker(false);
      const { code, body, msg } = res;
      if (code === '200') {
        const { blob, fileName } = body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(msg);
      }
    })
  }

  return <>
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard split="vertical">
        <ProCard
          actions={[
            <> <Button type='primary' onClick={exportJb}>导出脚本</Button>&nbsp;&nbsp;
              <Button type='primary' onClick={exportZd}>导出字典</Button>
            </>]}
        >
          <Tree
            checkable
            onCheck={onCheck}
            showLine
            blockNode
            onExpand={onExpand}
            expandedKeys={expandedKeys}
            onSelect={onSelect}
            className='treeCd'
            height={myUtil.heightCalc.getCalc(['header', 'cardMargin', '95px'])}
          >
            {getTreeNode(treeData)}
          </Tree>
        </ProCard>
        <ProCard actions={[<Button type='primary' onClick={saveTreeNode}>保存</Button>]}>
          <div style={{ height: myUtil.heightCalc.getCalc(['header', 'cardMargin', '95px']), overflowY: 'auto' }}>
            <Form
              name="form"
              form={form}
              labelCol={{ span: 8 }}
              wrapperCol={{ span: 13 }}
            >
              <Form.Item label="菜单代码" name="cdDm" rules={[{ required: true }, () => {
                const validator = async (_rule: any, value: any) => {
                  if (!value) {
                    return Promise.reject();
                  }
                  if (addFlag) { // 新建时校验菜单代码是否重复
                    await checkCd({ cdDm: value }).then((res) => {
                      const { code, msg } = res;
                      if (code !== '200') {
                        return Promise.reject(new Error(msg));
                      }
                      return Promise.resolve();
                    })
                  }
                  return Promise.resolve();
                };
                return { validator };
              }]}>
                <Input placeholder="请输入菜单代码" maxLength={20} disabled={!addFlag} />
              </Form.Item>
              <Form.Item label="菜单名称" name="cdmc" rules={[{ required: true, message: '请输入菜单名称' }]}>
                <Input placeholder="请输入菜单名称" maxLength={60} />
              </Form.Item>
              <Form.Item label="父节点菜单代码" name="fjdcdDm">
                <Input placeholder="请输入父节点菜单代码" maxLength={20} />
              </Form.Item>
              <Form.Item label="菜单路径" name="cdlj">
                <Input placeholder="请输入菜单路径" maxLength={200} />
              </Form.Item>
              <Form.Item label="高亮节点路径" name="bz">
                <Input placeholder="请输入高亮节点路径" maxLength={1000} />
              </Form.Item>
              <Form.Item label="菜单图标" name="tbys">
                <Input placeholder="请输入菜单图标" maxLength={100} />
              </Form.Item>
              <Form.Item label="页签菜单图标" name="yqcdtb">
                <Input placeholder="请输入菜单图标" maxLength={100} />
              </Form.Item>
              <Form.Item label="路径重定向" name="wjlj">
                <Input placeholder="请输入路径重定向" maxLength={300} />
              </Form.Item>
              <Form.Item label="组件" name="fjdcdlj">
                <Input placeholder="请输入组件" maxLength={200} />
              </Form.Item>
              <Form.Item label="业务标识" name="yqcdfjdDm">
                <Input placeholder="请输入业务标识" maxLength={50} />
              </Form.Item>
              <Form.Item label="菜单类型" name="cdlxDm">
                <Select placeholder="请选择菜单类型" allowClear onChange={onCheckCdlxChange}>
                  {selectOption?.map((item: any) => (
                    <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="外联序号" name="wlxh" rules={[{ required: checkWlxh, message: '请输入外联序号' }]} >
                <Input placeholder="请输入外联序号" maxLength={10} />
              </Form.Item>
              <Form.Item label="渠道名称" name="jcfQdDm" rules={[{ required: checkQdDm, message: '请选择渠道名称' }]} >
                <Select placeholder="请选择渠道名称" allowClear onChange={onCheckQdChange}>
                  {jcfqdDmOption?.map((item: any) => (
                    <Select.Option key={item.code} value={item.code}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item label="集成菜单路径" name="jcfJumpUrl" rules={[{ required: checkQdDm, message: '请输入集成方菜单路径' }]} >
                <Input placeholder="请输入集成菜单路径" maxLength={200} onChange={onCheckQdLjChange} />
              </Form.Item>
              <Form.Item label="默认全屏" name="ycbz" valuePropName='checked'>
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
              <Form.Item label="隐藏" name="qpbz" valuePropName='checked'>
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
              <Form.Item label="有效标志" name="xybz" valuePropName='checked'>
                <Switch checkedChildren="是" unCheckedChildren="否" />
              </Form.Item>
            </Form>
          </div>
        </ProCard>
      </ProCard>
    </Spin>
    <ModalForm onRef={modalRef} />
  </>
};

export default index;