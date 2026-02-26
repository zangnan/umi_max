import React from 'react';
import JsonDiffReact from 'jsondiffpatch-react';

const CreateWord: React.FC<unknown> = () => {
  const leftJson: any = {
    name: 'John',
    age: 31,
    address: {
      city: 'New York',
      zip: '10001'
    },
    hobbies: ['reading', 'swimming'],
    items: [
      { id: 1, name: 'Item A' },
      { id: 2, name: 'Item B' }
    ]
  };

  const rightJson: any = {
    name: 'John',
    age: 33,
    address: {
      city: 'Boston',
      zip: '10001'
    },
    hobbies: ['reading', 'running'],
    items: [
      { id: 2, name: 'Item B' },
      { id: 1, name: 'Item A (modified)' }
    ]
  };

  // const formatDiff = (delta) => {
    // const left = JSON.parse({});
    // const right = JSON.parse({});
    // let delta = jsondiffpatch.diff(left, right);
    // let visual = jsondiffpatch.formatters.html.format(delta, left);
    // jsondiffpatch.formatters.html.showUnchanged();
    // jsondiffpatch.formatters.html.hideUnchanged();
    // const formatter = jsondiffpatch.formatters.html;
    // return formatter.format(delta);

  // 参数说明 ****************************************************************************************
  // show (bool): you can show/hide unchanged values
  // annotated (bool): This will render the original JSON delta in html,
  //    with annotations aside explaining the meaning of each part.
  //    This attempts to make the JSON delta format self-explained.
  // tips (any): Displayed in case both elements are identical.
  // objectHash (function): Will be passed to jsondiffpatch to improve array comparison performance.

  return (<>
    <JsonDiffReact
      left={leftJson}
      right={rightJson}
      // show={false}
      // annotated={true}
      // tips={<div style={{color: 'red'}}>第三方sdfsdf</div>}
      // objectHash={(obj: any) => {
      //   return obj.id || obj._id || obj.name || JSON.stringify(obj)
      // }}
    />
        {/* <button onClick={compareJson} > Compare JSON </button>
        {diffResult && <div dangerouslySetInnerHTML={{ __html: formatDiff(diffResult) }} />} */}
    </>);
};

export default CreateWord;
