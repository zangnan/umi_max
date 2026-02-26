import React, { useState, useRef } from 'react';
import { Button, Space } from 'antd';
import MdEditor from 'react-markdown-editor-lite';
import MarkdownIt from 'markdown-it';
import 'react-markdown-editor-lite/lib/index.css';

const CreateWord: React.FC<unknown> = () => {
  const ref: any = useRef();
  const [content, setContent] = useState('# 欢迎使用Markdown编辑器\n\n输入内容后右侧将实时预览');

  const handleEditorChange = ({ text }: any) => {
    setContent(text);
  };

  const handleGetMdValue = () => {
    console.log(ref?.current?.getMdValue())
  }

  const handleGetHtmlValue = () => {
    console.log(ref?.current?.getHtmlValue())
  }

  const view = {
    menu: true,
    md: true,
    html: true,
  };

  const plugins = [
    'header',
    'font-bold',
    'font-italic',
    'font-underline',
    'font-strikethrough',
    'list-unordered',
    'list-ordered',
    'block-quote',
    'block-wrap',
    'block-code-inline',
    'block-code-block',
    'table',
    'image',
    'link',
    'clear',
    'logger',
    'mode-toggle',
    'full-screen',
    'tab-insert'
  ];

  return (<>
    <Space>
      <Button type='default' onClick={handleGetMdValue} >getMdValue</Button>
      <Button type='default' onClick={handleGetHtmlValue} >getHtmlValue</Button>
    </Space>
    <MdEditor
      plugins={plugins}
      value={content}
      style={{ height: '500px' }}
      onChange={handleEditorChange}
      renderHTML={(text) => new MarkdownIt().render(text)}
      view={view}
      ref={ref}
    />
  </>);
};

export default CreateWord;
