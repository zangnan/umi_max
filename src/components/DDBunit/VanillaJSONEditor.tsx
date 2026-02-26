import { JSONEditor } from 'vanilla-jsoneditor';
import React, { useEffect, useRef, useState } from 'react';
import styles from './vanillastyles.less';

const VanillaJSONEditor = props => {
  const refContainer = useRef(null);
  const refEditor = useRef(null);
  const [sizeClasssName, setSizeClassName] = useState('default');

  useEffect(() => {
    // create editor
    refEditor.current = new JSONEditor({
      target: refContainer.current,
      props: {},
    });
    setSizeClassName(props.sizeClasssName);
    return () => {
      // destroy editor
      if (refEditor.current) {
        refEditor.current.destroy();
        refEditor.current = null;
      }
    };
  }, []);

  // update props
  useEffect(() => {
    if (refEditor.current) {
      refEditor.current.updateProps(props);
    }
    setSizeClassName(props.sizeClasssName);
  }, [props]);

  return <div className={[styles['vanilla-jsoneditor-react'], styles[sizeClasssName || 'default']].join(' ')} ref={refContainer} />;
};

export default VanillaJSONEditor;

