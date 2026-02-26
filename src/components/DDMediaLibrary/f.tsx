import React from 'react';
import { VideoOne } from '@icon-park/react';
import CONSTANTS from '@/components/DDAssist/constants';
import {  baseEditFormData } from '@/services/hts/api';
import { queryListNs } from '@/services/hts/apiNs'
import { Link } from 'umi';
import myUtil from '@/components/DDAssist/util';
import { Typography } from 'antd';

const Func: any = {
  unitRef: React.createRef(),
};

// 列表自定义渲染
Func.columnsRender = {
  // renderPreview2
  renderPreview2: (param: any) => {
    let { record, refGrid } = param;
    let mediaType = ENV_TYPE === 'node' ? record?.media_type?.toLowerCase() : record?.mediaType?.toLowerCase();
    let iconConfig = {
      size: '18',
      fill: '#333',
    };
    const themeToken: any = myUtil.theme.getThemeToken();
    const colorError = themeToken?.token?.colorError;
    let iconTmp: any = myUtil.media.getMediaIcon2(mediaType);
    let mediaPath: any;
    if (ENV_TYPE === 'node') {
      mediaPath = `${API_URL_BASE}/static/${record?.media_file_md5}.${mediaType}`;
    } else {
      mediaPath =`${record?.mediaPath}`;
    }
    if (CONSTANTS.MEDIA.TYPE_PICTURED.indexOf(mediaType) > -1) {
      return <>
        <span style={{cursor: 'pointer'}} onClick={() => {
          refGrid.current.setPreviewConfig({
            imageVisible: true,
            imageUrl: mediaPath,
            imagePreviewUrl: mediaPath,
          })
        } }>{iconTmp}</span>
      </>
    } else if (CONSTANTS.MEDIA.TYPE_VIDEO.indexOf(mediaType) > -1 || CONSTANTS.MEDIA.TYPE_MUSIC.indexOf(mediaType) > -1) {
      return <>
        <Link to={`/player?mediaPath=${mediaPath}`} target='_blank'>
        <Typography.Text type="success"><VideoOne theme="outline" {...iconConfig} fill={colorError} /></Typography.Text>
        </Link>
      </>
    } else {
      return <></>;
    }
  },
  // renderMediaName
  renderMediaName: (param: any) => {
    let { record, text } = param;
    let mediaType = ENV_TYPE === 'node' ? record?.media_type : record?.mediaType;
    return myUtil.media.getMediaIcon(mediaType, text);
  },
}

// 新建表单初始化
Func.initAddForm = (param: any) => {
  const { handleModalVisible, formItems, setFormItems } = param;
  let targetItem = formItems?.find((tmp: any) => tmp.name === 'file');
  targetItem.disabled = false;
  setFormItems(formItems);
  handleModalVisible(true);
}

// 编辑表单初始化
Func.initEditForm = (param: any) => {
  const { handleModalVisible, formItems, setFormItems } = param;
  let targetItem = formItems?.find((tmp: any) => tmp.name === 'file');
  targetItem.disabled = true;
  setFormItems(formItems);
  handleModalVisible(true);
}

// 表单提交
Func.mediaFormSubmit = async ({apiParma, url, handleSave2, handleModalVisible, setMasker2, reload}: any) => {
  const promiseArr: any = [];
  for (let i = 0; i < apiParma.length; i += 1) {
    let tmpCodeTable = await baseEditFormData({ data: apiParma[i], url: url })
    promiseArr.push(tmpCodeTable);
  }
  const allSettledPromise = Promise.allSettled(promiseArr);
  allSettledPromise.then(function (results: any) {
    let resCode = '200';
    let resCodeDesc = '保存成功';
    let resMsg = [];
    for (let i = 0; i < results.length; i++) {
      const { status, value } = results[i];
      if (status === 'fulfilled') {
        const { code, codeDesc } = value;
        if (code === '200') {
        } else {
          resCode = '0';
          resCodeDesc = '保存失败';
          resMsg.push(codeDesc);
        }
      } else if (status === 'rejected') {
        resCode = '0';
        resCodeDesc = '保存失败';
        resMsg.push('保存失败');
      }
    }
    handleSave2({response: {
      code: resCode,
      msg: resMsg,
      desc: resCodeDesc,
    }, handleModalVisible, setMasker2, reload });
  });
}

// 表单提交
// Func.formSubmit = async (param: any) => {
//   let { url, handleSave2, handleModalVisible, setMasker2, reload, originalData } = param;
//   let apiParma: any = [];
//   let mediaFiles = originalData['file'];
//   let mediaUuid = originalData['mediaUuid'];
//   if (mediaUuid) {
//     // 编辑
//     mediaFiles = [
//       {
//         mediaId: mediaUuid,
//       }
//     ]
//   } else {
//      // 新建
//   }
//   if (Array.isArray(mediaFiles) && mediaFiles.length > -1) {
//     for (let i = 0; i < mediaFiles.length; i++) {
//       let tmpMedia = mediaFiles[i];
//       const formData = new FormData();
//       if (tmpMedia?.originFileObj) {
//         formData.append('file', tmpMedia.originFileObj);
//       }
//       Object.keys(originalData).forEach(key => {
//         if (key !== 'file' && originalData[key]) {
//           formData.append(key, originalData[key]);
//         }
//       });
//       apiParma.push(formData);
//     }
//   }
//   await Func.mediaFormSubmit({apiParma, url, handleSave2, handleModalVisible, setMasker2, reload});
// }


// 表单提交
Func.formSubmit = async (param: any) => {
  let { url, handleSave2, handleModalVisible, setMasker2, reload, originalData } = param;
  let apiParma: any = [];
  let mediaFiles = originalData['file'];
  let mediaUuid = originalData[ENV_TYPE === 'node' ? 'media_uuid' : 'mediaUuid'];
  if (mediaUuid) {
    // 编辑
    mediaFiles = [
      {
        // mediaId: mediaUuid,
        media_uuid: mediaUuid,
      }
    ]
  } else {
     // 新建
  }
  if (ENV_TYPE === 'node') {
    if (Array.isArray(mediaFiles) && mediaFiles.length > -1) {
      let mediaGgrList: any = await queryListNs({page: 1, pageSize: 999999, searchModel: []}, 'media_mgr') || [];
      for (let i = 0; i < mediaFiles.length; i++) {
        let tmpMedia = mediaFiles[i];
        const formData = new FormData();
        let fileName = tmpMedia?.name;
        let fileType = fileName?.slice(fileName?.lastIndexOf('.') + 1);
        formData.append('media_name', fileName);
        formData.append('media_type', fileType);
        if (tmpMedia?.originFileObj) {
          let fileMD5: any = await myUtil.file.getFileMD5(tmpMedia?.originFileObj);
          // 判断是否已有相同md5文件
          let sameMD5File = (mediaGgrList.body.rows || []).find((tmp: any) => { return tmp.media_file_md5 === fileMD5 });
          formData.append('media_file_md5', fileMD5);
          if (!sameMD5File) {
            formData.append('file' + i, tmpMedia.originFileObj);
          }
        }
        Object.keys(originalData).forEach(key => {
          if (key === 'file' && originalData[key]) {
          } else if (key && originalData[key]) {
            formData.append(key, originalData[key]);
          }
        });
        apiParma.push(formData);
      }
    }
  } else {
    if (Array.isArray(mediaFiles) && mediaFiles.length > -1) {
      for (let i = 0; i < mediaFiles.length; i++) {
        let tmpMedia = mediaFiles[i];
        const formData = new FormData();
        if (tmpMedia?.originFileObj) {
          formData.append('file', tmpMedia.originFileObj);
        }
        Object.keys(originalData).forEach(key => {
          if (key !== 'file' && originalData[key]) {
            formData.append(key, originalData[key]);
          }
        });
        apiParma.push(formData);
      }
    }
  }
  await Func.mediaFormSubmit({apiParma, url, handleSave2, handleModalVisible, setMasker2, reload});
}

export default Func;