import React from 'react';
import { Modal, Select, Input } from 'antd';

const { Option } = Select;

interface IcCardForm {
  kaklxDm: string;
  kakbm: string;
  kakmm: string;
}

interface FormErrors {
  kaklxDm: string;
  kakbm: string;
  kakmm: string;
}

interface IcCardMaintainProps {
  visible: boolean;
  icCardForm: IcCardForm;
  formErrors: FormErrors;
  onCancel: () => void;
  onSubmit: () => void;
  onFormChange: (field: string, value: string) => void;
}

const IcCardMaintain: React.FC<IcCardMaintainProps> = ({
                                                         visible,
                                                         icCardForm,
                                                         formErrors,
                                                         onCancel,
                                                         onSubmit,
                                                         onFormChange,
                                                       }) => {
  return (
    <Modal
      title="电子口岸IC卡信息"
      visible={visible}
      onCancel={onCancel}
      onOk={onSubmit}
      destroyOnHidden
      className="ic-card-modal"
      centered // 弹窗居中
    >
      {/* IC卡类型 */}
      <div className="ic-card-form-item" style={{ marginBottom: 20 }}>
        <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>
          IC卡类型 <span style={{ color: 'red' }}>*</span>
        </label>
        <Select
          value={icCardForm.kaklxDm}
          onChange={(value) => onFormChange('kaklxDm', value)}
          style={{ width: '100%' }}
          placeholder="请选择IC卡类型"
        >
          <Option value="1">操作员卡</Option>
          <Option value="2">法人卡</Option>
        </Select>
        {formErrors.kaklxDm && (
          <div className="error-message" style={{ color: 'red', marginTop: 4 }}>
            {formErrors.kaklxDm}
          </div>
        )}
      </div>

      {/* IC卡别名（手填，默认空） */}
      <div className="ic-card-form-item" style={{ marginBottom: 20 }}>
        <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>
          IC卡别名 <span style={{ color: 'red' }}>*</span>
        </label>
        <Input
          value={icCardForm.kakbm}
          onChange={(e) => onFormChange('kakbm', e.target.value)}
          maxLength={60}
          placeholder="IC卡别名（为方便后续下载识别，建议填写用途或型号）"
          style={{ width: '100%' }}
        />
        {formErrors.kakbm && (
          <div className="error-message" style={{ color: 'red', marginTop: 4 }}>
            {formErrors.kakbm}
          </div>
        )}
      </div>

      {/* IC卡密码（手填，默认空） */}
      <div className="ic-card-form-item" style={{ marginBottom: 20 }}>
        <label className="form-label" style={{ display: 'block', marginBottom: 8 }}>
          IC卡密码 <span style={{ color: 'red' }}>*</span>
        </label>
        <Input.Password
          value={icCardForm.kakmm}
          onChange={(e) => onFormChange('kakmm', e.target.value)}
          maxLength={8}
          placeholder="8位IC卡密码"
          style={{ width: '100%' }}
        />
        {formErrors.kakmm && (
          <div className="error-message" style={{ color: 'red', marginTop: 4 }}>
            {formErrors.kakmm}
          </div>
        )}
      </div>
    </Modal>
  );
};

export default IcCardMaintain;
