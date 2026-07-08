import React, { useEffect, useRef, useSyncExternalStore } from 'react';
import { createRoot } from 'react-dom/client';
import { Modal, Button, Spin, Table } from 'antd';
import { InfoCircleOutlined, CloseCircleOutlined, CheckCircleFilled, ExclamationCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import CONSTANTS from '@/components/DDAssist/constants';
import './style.less';
import AlertContentForm from './contentForm';

// 1. 默认 state（从原 class constructor 复制 22 个字段）
const defaultState = {
  modalVisible: false,                // 是否显示提示框
  title: '提示',                      // 标题
  okText: '确定',                     // 确认按钮文案
  cancelText: '取消',                 // 取消按钮文案
  isShowcancelText: true,             // 取消按钮是否显示
  modalType: 'info',                  // info confirm form table
  infoType: 'success',                // success error warning info question
  info: '',                           // 提示概要
  content: '',                        // 提示描述
  okCallbackFn: function () { },     // 确认 回调函数
  cancelCallbackFn: function () { }, // 取消 回调函数
  button: [],                         // 自定义按钮
  closeStatus: true,                  // 回调后弹窗是否关闭，默认关闭
  isFormContent: false,               // content 是否为 form
  initFormContentValues: {},          // content 为 form 时初始化值
  width: '',                          // Modal 宽度
  customerBtnLoading: false,          // 按钮 loading
  masker: false,                      // Spin 状态
  isTableContent: false,              // content 是否为 table
  tableData: [],                      // content 为 table 时 Data
  tableColumns: [],                   // content 为 table 时 columns
  closable: true,                     // 是否存在右上角的关闭按钮
  keyboard: true,                     // 是否支持键盘 esc 关闭
};

// 2. 模块级单例 store（替代 class 组件的 this.state）
let state: typeof defaultState = { ...defaultState };
const subscribers = new Set<() => void>();

const setState = (patch: Partial<typeof defaultState>) => {
  state = { ...state, ...patch };
  subscribers.forEach((cb) => cb());
};

const subscribe = (cb: () => void) => {
  subscribers.add(cb);
  return () => {
    subscribers.delete(cb);
  };
};

const getSnapshot = () => state;

// 3. 子表单 ref（替代 class 的 this.refAlertContentForm）
let refAlertContentForm: React.RefObject<any> | null = null;

// 4. DDAlert 同步定义（模块加载完毕即具备完整方法，零 ref callback 依赖）
const DDAlert: any = {
  open(options: any) {
    setState({ ...options, modalVisible: true });
  },
  close() {
    if (state.isFormContent) {
      DDAlert.getForms()?.resetFields?.();
    }
    setState({ ...defaultState });
  },
  // 兼容业务方 thisObj.setState({masker: true}) 模式（1197 处调用点依赖）
  setState(patch: any) {
    setState(patch);
  },
  getContentFormData() {
    return refAlertContentForm?.current?.getFormData?.();
  },
  getValidateFormData() {
    return refAlertContentForm?.current?.validateFields?.();
  },
  getForms() {
    return refAlertContentForm?.current?.forms?.();
  },
};

// 辅助函数（从 class method 改为模块级纯函数）
const getIcon = (infoType: string) => {
  if (infoType === 'info') return <InfoCircleOutlined />;
  if (infoType === 'error') return <CloseCircleOutlined />;
  if (infoType === 'success') return <CheckCircleFilled />;
  if (infoType === 'warning') return <ExclamationCircleOutlined />;
  if (infoType === 'question') return <QuestionCircleOutlined />;
  return null;
};

const getInfo = (s: any) => {
  if (Array.isArray(s.info)) {
    return s.info?.map((item: any, index: any) => (
      <p className="item" key={index}>{item}</p>
    ));
  }
  return s.info;
};

const getHeader = (s: any) => {
  if (s.modalType === 'form') return <></>;
  return (
    <>
      <div className="icon">{getIcon(s.infoType)}</div>
      <div className="info">{getInfo(s)}</div>
    </>
  );
};

const getContent = (s: any) => {
  if (Array.isArray(s.content)) {
    return s.content?.map((item: any, index: any) => (
      <p className="item" key={index}>{item}</p>
    ));
  }
  return s.content;
};

const getFooter = (s: any, thisObj: any) => {
  const { okText, cancelText, modalType, button, customerBtnLoading, isShowcancelText } = s;
  const footerElement: any[] = [];
  if ((modalType === 'confirm' || modalType === 'form') && isShowcancelText) {
    footerElement.push(
      <Button onClick={() => thisObj.close()} key="cancel" loading={customerBtnLoading}>
        {cancelText}
      </Button>,
    );
  }
  if (button && button.length > 0) {
    button.forEach((item: any) => {
      if (item.$$typeof) {
        // React element
        footerElement.push(item);
      } else {
        // js object
        footerElement.push(
          <Button
            loading={customerBtnLoading}
            onClick={() => {
              if (item.func) {
                item.func(thisObj);
              }
            }}
            type={item?.type}
            key={item?.key}
          >
            {item?.name}
          </Button>,
        );
      }
    });
  }
  footerElement.push(
    <Button
      onClick={() => {
        s.okCallbackFn(thisObj);
        if (s.closeStatus) thisObj.close();
      }}
      type="primary"
      key="ok"
      loading={customerBtnLoading}
    >
      {okText}
    </Button>,
  );
  return footerElement;
};

// 5. Alert 函数组件
const Alert: React.FC = () => {
  const s = useSyncExternalStore(subscribe, getSnapshot);
  const formRef = useRef<any>(null);

  // 把 formRef 同步到模块级变量（供 DDAlert.getForms/getValidateFormData/getContentFormData 使用）
  useEffect(() => {
    refAlertContentForm = formRef;
    return () => {
      refAlertContentForm = null;
    };
  }, []);

  return (
    <Modal
      title={s.title}
      open={s.modalVisible}
      width={s.width == '' ? CONSTANTS.C_MODAL_WIDTH_X1 : s.width}
      wrapClassName={`${s.isTableContent ? 'standard-modal-1' : ''}`}
      footer={getFooter(s, DDAlert)}
      closable={s.closable}
      destroyOnHidden={true}
      onCancel={() => DDAlert.close()}
      className={`${s.isTableContent ? '' : 'dd_modal_wrap'} ${s.masker ? 'dd_modal_show_masker' : ''}`}
      mask={{ closable: false }}
      keyboard={s.keyboard}
    >
      <Spin tip="Loading..." spinning={s.masker} delay={100}>
        {s.isFormContent ? (
          <>
            <AlertContentForm
              formItems={getContent(s)}
              onRef={formRef}
              initValue={s.initFormContentValues}
            />
          </>
        ) : s.isTableContent ? (
          <>
            <Table
              dataSource={s.tableData}
              columns={s.tableColumns}
              pagination={false}
              size={'small'}
              bordered={true}
            />
          </>
        ) : (
          <>
            <div className={`dd_modal_content ${s.infoType} ${s.modalType}`}>
              <div className="header">{getHeader(s)}</div>
              <div className="body">{getContent(s)}</div>
            </div>
          </>
        )}
      </Spin>
    </Modal>
  );
};

// 6. 模块级挂载（一次性，createRoot + render 同步执行 commit）
const div = document.createElement('div');
document.body.appendChild(div);
createRoot(div).render(<Alert />);

export default DDAlert;