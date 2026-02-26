import Prism from 'prismjs';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-typescript';
import 'prismjs/themes/prism.css';
import React, { useEffect, useRef } from 'react';
import styles from './CodeBlock.less';

interface CodeBlockProps {
  code: string;
  language: string;
  compact?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
  compact = false,
}) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      Prism.highlightElement(codeRef.current);
    }
  }, [code, language]);

  return (
    <div className={`${styles.codeBlock} ${compact ? styles.compact : ''}`}>
      <pre className={`language-${language}`}>
        <code ref={codeRef}>{code}</code>
      </pre>
    </div>
  );
};

export default CodeBlock;
