import React from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import {UnControlled as CodeMirror} from 'react-codemirror2';
import { message, Tooltip  } from 'antd';
import { CopyOutlined } from '@ant-design/icons';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/material.css';
import 'codemirror/mode/javascript/javascript';
import './style.less';

export type CodeViewerProps = {
  viewCode: any;
}

const CodeViewer: React.FC<CodeViewerProps> = ({
  viewCode,
}) => {

  const handleCopy = () => {
    message.info('代码已复制到剪贴板！');
  };

  return (
    <div style={{position: 'relative'}}>
      <CodeMirror
        value={viewCode}
        className='DDCodeMirror'
        options={{
          mode: 'javascript',
          theme: 'material',
          lineNumbers: true
        }}
        // onChange={(editor, data, value) => {
        // }}
      />
      <CopyToClipboard text={viewCode} onCopy={handleCopy} >
        <Tooltip placement="top" title="复制代码" arrowPointAtCenter>
          <CopyOutlined style={{position: 'absolute', top: '10px', right: '25px', color: '#fff', cursor: 'pointer', zIndex: 99}}/>
        </Tooltip>
      </CopyToClipboard>
    </div>
  );
};
export default CodeViewer;
