import { useEffect, useState, useRef } from 'react';
import { Graph } from '@antv/x6';
import { Button, message, Space, Form, Splitter } from 'antd';
import { useLocation } from 'umi';
import { editFlow, queryList, saveOrUpdate } from '@/services/hts/api';
import X6Util from './DDFlowUtil';
import './index.less';
import ApprovalFlow from './approvalFlow';
import DDBaseForm from '../DDForm/DDBaseForm';

const DDFlowDesigner: React.FC<any> = ({}) => {
  const location: any = useLocation();
  const containerRef = useRef<HTMLDivElement>(null);
  const stencilRef = useRef<HTMLDivElement>(null);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [roleList, setRoleList] = useState<any>([]);
  const graphRef: any = useRef(null);
  const [viewFlag] = useState<any>(location?.state?.viewFlag);
  const [form] = Form.useForm();
  const Func: any = {};

  // 审批流程卡片
  const approvalFlowRef = useRef<any>(null);

  // 初始化角色信息
  const initRoleData = () => {
    queryList({page: 1, pageSize: 999999, searchModel: []}, 'm_sys_role', 'baseurl').then((response: any) => {
      if (response?.code === '200' && response?.body?.rowCount > 0) {
        let gridData: any = response.body.rows || [];
        setRoleList(gridData);
      }
    });
  }

  useEffect(() => {
    if (!containerRef.current) return;

    if (viewFlag !== 'readonly') {
      if (!stencilRef.current) return;
    }

    // 注册节点
    X6Util.registerNode(Graph);

    // 初始化画布
    let graph: any = new Graph({
      ...X6Util.INIT_CONFIG,
      container: containerRef.current,
      interacting: viewFlag !== 'readonly',
    });

    if (viewFlag !== 'readonly') {
      // 使用插件
      X6Util.bindPlugin(graph);

      // 绑定快捷键与事件
      X6Util.bindKeys(graph);
    }

    // 初始化stencil
    if (viewFlag !== 'readonly') {
      X6Util.initStencil(graph, stencilRef);
    }

    // 控制连接桩显示/隐藏
    X6Util.bindMouseAction(graph, viewFlag);

    // 绑定节点事件
    X6Util.bindEvent({graph, form, setSelectedNode});

    // 初始化数据
    let initData: any = location?.state?.data || [];

    // 当前运行节点及线段设置
    if (viewFlag === 'readonly') {
      let processTaskRun = location?.state?.processTaskRun || [];
      let xtglProcessTaskIdArr: any = [];
      for (let mm = 0; mm < processTaskRun.length; mm++) {
        // 兼容 Node(eggjs) 后端的蛇形字段 xtgl_process_task_flag / xtgl_process_task_id
        // 与 Java 后端的驼峰 xtglProcessTaskFlag / xtglProcessTaskId
        let taskItem: any = processTaskRun[mm];
        let taskFlag: any = taskItem.xtgl_process_task_flag || taskItem.xtglProcessTaskFlag;
        let taskId: any = taskItem.xtgl_process_task_id || taskItem.xtglProcessTaskId;
        if (taskFlag === '1' || taskFlag === '0') {
          xtglProcessTaskIdArr.push(taskId);
        }
      }
      // debugger;
      for (let nn = 0; nn < initData.cells.length; nn++) {
        if (initData?.cells[nn].shape === 'edge') {
          // let tmpSourceCell = initData?.cells[nn]?.source?.cell;
          let tmptargetCell = initData?.cells[nn]?.target?.cell;
          if (xtglProcessTaskIdArr.indexOf(tmptargetCell) > -1) {
            initData.cells[nn].attrs = {
              ...initData?.cells[nn].attrs,
              line: {
                stroke:'#4ECDC4',
                strokeWidth: 3,
              }
            }
          }
        }
      }
    }
    graph.fromJSON(initData); // 渲染元素

    graphRef.current = graph;

    // 初始化角色信息
    initRoleData();

    // 卸载时销毁 Graph，避免事件监听与节点组件累积
    return () => {
      graph.dispose();
      graphRef.current = null;
    };
  }, []);

  // 保存
  const saveFlow = () => {
    if (!location.state) return;

    const record: any = location.state.record || {};
    const xtglProcessId: any = record?.xtglProcessId;
    const xtglProcessData: string = JSON.stringify(graphRef.current?.toJSON());

    const handleRes = (res: any) => {
      const { code } = res || {};
      if (code === '200') {
        message.success("保存成功！");
      } else {
        message.error("保存失败！");
      }
    };

    if (ENV_TYPE === 'node') {
      // Node（eggjs）后端：走通用 def saveOrUpdate，把流程图数据带在 body，
      // 由后端在 nbgl_process_def 行上同时更新 def 字段与 xtglProcessData。
      // ...record 提供主键 xtglProcessId 等 def 字段（值不变 = 安全 no-op），
      // xtglProcessData 用最新值覆盖 record 中旧的同名字段。
      saveOrUpdate({
        key: 'nbgl_process_def',
        formType: 'edit',
        ...record,
        xtgl_process_data: xtglProcessData,
      }).then(handleRes);
    } else {
      // 其它后端：保留原 editFlow 调用（POST /dict/procdef/save），行为不变
      editFlow({ xtglProcessId, xtglProcessData }).then(handleRes);
    }
  }

  // #region 表单设置 ***********************************************

  // 表单按钮 刷新视图
  const handleResetView = () => {
    let fi_name = form.getFieldValue('fi_name');
    let fi_type = form.getFieldValue('fi_type');
    let fi_role = form.getFieldValue('fi_role');
    let fi_org = form.getFieldValue('fi_org');
    let fi_type_name = form.getFieldValue('fi_type_name');
    selectedNode?.setData({
      fi_name: fi_name,
      fi_type: fi_type,
      fi_role: fi_role,
      fi_org: fi_org,
      fi_type_name: fi_type_name,
    });
    return;
  };

  // 表单按钮 删除节点
  const handleDeleteNode = () => {
    graphRef.current.removeCells([selectedNode]);
  };
  // #endregion ***********************************************


  // 视图左侧 工作流
  let viewLeft: any = () => {
    return <>
      <div className='d_flow_util'>
        <Space style={{ marginBottom: 16 }}>
          <Button onClick={() => X6Util.viewTools('toJSON', graphRef)}>转JSON</Button>
          <Button.Group>
            {X6Util.btnGroup2.map((item: any) => (
              <Button onClick={() => X6Util.viewTools(item.key, graphRef)} key={item.key}>{item.label}</Button>
            ))}
          </Button.Group>
          <Button.Group>
            {X6Util.btnGroup1.map((item: any) => (
              <Button onClick={() => X6Util.viewTools(item.key, graphRef)} key={item.key}>{item.label}</Button>
            ))}
          </Button.Group>
          <Button onClick={() => X6Util.viewTools('clear', graphRef)}>清空</Button>
          {/* <Button onClick={() => approvalFlowRef.current.showModal(true)}>开启审批弹窗</Button> */}
          <Button type='primary' onClick={saveFlow}>保存</Button>
        </Space>
      </div>
      <div className='d_flow'>
        <div id='container'>
          <div id='app_stencil' ref={stencilRef} />
          <div id='app-content' ref={containerRef} />
        </div>
      </div>
    </>;
  };

  // 视图左侧 工作流 只读
  let viewLeftReadonly: any = () => {
    return <>
      <div className='d_flow d_flow_readonly'>
        <div id='container'>
          <div id='app-content' ref={containerRef} />
        </div>
      </div>
    </>;
  };

  // 表单事件：OnChange
  Func.eventOnChange = {
    changeFlowForm: () => {
      handleResetView();
    },
  };
  // 视图右侧 表单节点编辑
  let viewRight2: any = () => {
    let role = [...roleList];
    role.forEach((roleItem: any) => {
      // 兼容 Node(eggjs) 后端的蛇形字段 role_name / role_id 与 Java 后端的驼峰 roleName / roleId
      roleItem.name = roleItem.role_name || roleItem.roleName;
      roleItem.value = roleItem.role_id || roleItem.roleId;
    })
    let formConfig: any = {
      form_layout_type: 'vertical',
      form_label_input_layout: 'vertical',
      form_items: [
        { label: '节点名称', type: 'Input', name: 'fi_name', eventOnChange: 'changeFlowForm' },
        { label: '节点类别', type: 'Select', name: 'fi_type', eventOnChange: 'changeFlowForm',  list: [
          { name: '角色', value: 'role' },
          { name: '组织架构', value: 'org' },
          { name: '人员', value: 'user' },
        ] },
        { label: '角色', type: 'Select', name: 'fi_role', eventOnChange: 'changeFlowForm', list: role },
        { label: '组织架构', type: 'TreeSelect', name: 'fi_org', eventOnChange: 'changeFlowForm', treeTable: 'code_dm_org' },
      ],
    };
    return <div style={{backgroundColor: '#ffffff', padding: '24px'}}>
      <DDBaseForm config={formConfig} form={form} initialValues={{}} func={Func}/>
      <Space>
        {/* <Button htmlType="button" onClick={handleResetView}>刷新视图</Button> */}
        <Button htmlType="button" onClick={handleDeleteNode} danger>删除节点</Button>
      </Space>
    </div>
  }

  // 视图 审批弹窗
  let testApprovalFlow = <><ApprovalFlow onRef={approvalFlowRef} /></>;

  return (<>
    {viewFlag !== 'readonly' && <>
    <Splitter style={{ height: '100vh - 100px' }} className='d_flow_splitter'>
      <Splitter.Panel >
        {viewLeft()}
      </Splitter.Panel>
      <Splitter.Panel collapsible defaultSize={300} max={300}>
        {viewRight2()}
      </Splitter.Panel>
    </Splitter>
    {testApprovalFlow}
    </>}
    {viewFlag === 'readonly' && <>
      {viewLeftReadonly()}
    </>}
  </>);
}

export default DDFlowDesigner;