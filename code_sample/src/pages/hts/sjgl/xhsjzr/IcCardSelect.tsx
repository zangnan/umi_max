import React, { useEffect } from 'react';
import { Modal, Select } from 'antd';

const { Option } = Select;

export interface IcCardItem {
  kakuuid: string;
  kakbm: string;
  kaklxDm: string;
  kakmm: string;
}

interface IcCardSelectProps {
  visible: boolean;
  icCardList: IcCardItem[];
  selectedCard: IcCardItem | null; // 当前选中的IC卡
  onCancel: () => void;
  onSubmit: () => void;
  onSelectCard: (card: IcCardItem) => void; // 选择IC卡的回调
}

const IcCardSelect: React.FC<IcCardSelectProps> = ({
                                                     visible,
                                                     icCardList,
                                                     selectedCard,
                                                     onCancel,
                                                     onSubmit,
                                                     onSelectCard,
                                                   }) => {
  // 处理下拉选择事件
  const handleSelect = (value: string) => {
    const selected = icCardList.find(card => card.kakbm === value);
    if (selected) {
      onSelectCard(selected);
    }
  };

  // 当组件可见且有数据但未选择任何卡片时，默认选择第一条
  useEffect(() => {
    if (visible && icCardList.length > 0 && !selectedCard) {
      onSelectCard(icCardList[0]);
    }
  }, [visible, icCardList, selectedCard, onSelectCard]);

  return (
    <Modal
      title="电子口岸IC卡信息选择"
      visible={visible}
      onCancel={onCancel}
      onOk={onSubmit} // 使用onSubmit作为确定按钮回调
      destroyOnClose
      className="ic-card-modal" // 与维护页面使用相同的基础样式类
      centered // 弹窗居中，与维护页面保持一致
    >
      <div className="ic-card-form-item" style={{ marginBottom: 20 }}>
        <label className="form-label" style={{
          display: 'block',
          marginBottom: 8,
          fontSize: 14
        }}>
          海关IC卡 <span style={{ color: 'red' }}>*</span>
        </label>
        <Select
          placeholder="请选择IC卡别名"
          style={{ width: '100%' }} // 与维护页面输入框宽度保持一致
          value={selectedCard?.kakbm || ''} // 绑定选中的值
          onChange={handleSelect}
        >
          {icCardList.map((card) => (
            <Option key={card.kakuuid} value={card.kakbm}>
              {card.kakbm}
              {card.kaklxDm === '1' ? ' (操作员卡)' : ' (法人卡)'}
            </Option>
          ))}
        </Select>
      </div>
    </Modal>
  );
};

export default IcCardSelect;
