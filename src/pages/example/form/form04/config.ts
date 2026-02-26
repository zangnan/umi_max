import CONSTANTS from '@/components/DDAssist/constants';

export default {
  form_items: [
    { label: '上传图片', name: 'wjnrpicture', fileName: 'wjmpicture', type: 'UploadPicture', listType: 'picture', maxCount: 3, tooltip: '支持上传视图片格式文件', layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW },
    { label: 'ST', name: 'st', type: 'Blank' },
    { label: '上传视频', name: 'wjnrvideo', fileName: 'wjmvideo', type: 'UploadVideo', maxCount: 3, tooltip: '支持上传视频格式文件', layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW },
    { label: 'ST', name: 'st', type: 'Blank' },
    { label: '上传音频', name: 'wjnraudio', fileName: 'wjmaudio', type: 'UploadAudio', maxCount: 3, tooltip: '支持上传音频格式文件', layout: CONSTANTS.DEFAULT_FORM_LAYOUT_100P_ROW },
  ]
};
