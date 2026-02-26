export default {
  form_items: [
    { label: '测试一', type: 'Select', name: 'test1', list: [
      { value: 'a', name: 'A' },
      { value: 'b', name: 'B' },
    ]},
    { label: '测试二', type: 'Select', name: 'test2', list: [
      { value: 'a', name: 'A' },
      { value: 'b', name: 'B' },
    ]},
    { label: '测试三', type: 'Select', name: 'test3', list: [
      { value: 'a', name: 'A' },
      { value: 'b', name: 'B' },
    ]},
    { label: '测试四', type: 'Select', name: 'test4', list: [
      { value: 'a', name: 'A' },
      { value: 'b', name: 'B' },
    ]},
    { label: '测试五', type: 'Select', name: 'test5', list: [
      { value: 'a', name: 'A' },
      { value: 'b', name: 'B' },
    ]},
  ],
  form_style: {
    drop_style: { width: '1000px', height: '500px' },
    drag_style: { width: 200 },
    form_items: [
      { name: 'test1', top: 0, left: 0 },
      { name: 'test2', top: 0, left: 300 },
      { name: 'test3', top: 0, left: 600 },
      { name: 'test4', top: 100, left: 0 },
      { name: 'test5', top: 100, left: 300 },
    ]
  }
};
