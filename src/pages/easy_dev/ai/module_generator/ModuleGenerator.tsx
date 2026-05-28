/**
 * 模块生成器主容器组件（Java 版本）
 */

import { Flex, message } from 'antd';
import React, { useState } from 'react';
import AIChatPanel from './components/AIChatPanel';
import DataPreview from './components/DataPreview';
import useModuleAI from './hooks/useModuleAI';
import type { SheetData } from './types/module';

const ModuleGenerator: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [sheetData, setSheetData] = useState<SheetData | null>(null);

  const handleSuccess = (data: SheetData) => {
    setSheetData(data);
  };

  const { messages, isRequesting, abort, submitRequirement } = useModuleAI({
    onSuccess: handleSuccess,
  });

  const handleSubmit = (value: string) => {
    setInputValue('');
    submitRequirement(value);
  };

  const handleCancel = () => {
    abort();
  };

  // ============== 保存模块到数据库（Java 版本 - 待后续实现）==============

  const handleSave = async (data: SheetData) => {
    // Java 版本保存功能待后续实现
    message.info('保存功能待后续实现');
  };

  return (
    <Flex style={{ height: 'calc(100vh - 48px)' }} gap={16}>
      {/* 左侧：AI对话区域 */}
      <div
        style={{
          width: '40%',
          minWidth: 400,
          display: 'flex',
          flexDirection: 'column',
          background: '#fff',
          borderRadius: 8,
          overflow: 'hidden',
        }}
      >
        <AIChatPanel
          messages={messages}
          isRequesting={isRequesting}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          inputValue={inputValue}
          setInputValue={setInputValue}
        />
      </div>

      {/* 右侧：数据预览区域 */}
      <div
        style={{
          flex: 1,
          minWidth: 0,
          background: '#fff',
          borderRadius: 8,
          padding: 16,
          overflow: 'auto',
        }}
      >
        <DataPreview data={sheetData} onSave={handleSave} />
      </div>
    </Flex>
  );
};

export default ModuleGenerator;