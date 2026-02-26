import React, { useImperativeHandle, useState } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import CONSTANTS from '@/components/DDAssist/constants';
import { Drawer } from 'antd';
import Func from './f';
import { automaticPageDef } from '@/services/hts/api';
import assembleConfigUtil from '@/components/DDBunit/assemble_config_util';

const DrawerList: React.FC<any> = ({
  onRef,
}) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [myConfig, setMyConfig] = useState<any>({});
  const [targetItem, setTargetItem] = useState<any>();
  const [initParam, setInitParam] = useState<any>();

  // 开启
  const showModal = (param: any) => {
    // 非 node
    // debugger;
    setInitParam(param);
    setTargetItem(initParam?.item);
    automaticPageDef('m_media_mgr').then((response1: any) => {
      // debugger;
			if (response1.code === '200') {
        let tmpConfig = assembleConfigUtil.module.assembleAll({
          moduleInfo: response1.body.moduleInfo,
          appTableDict: response1.body.appTableDict,
        });
        // 调整默认config
        tmpConfig.grid_list_card_type = 3; // 媒体库
        tmpConfig.grid_type_switch = true;
        tmpConfig.grid_type = 'list';
        // debugger
        tmpConfig.grid_list_card_field = {
          title: ENV_TYPE === 'node' ? 'media_name' : 'mediaName',
          description: ENV_TYPE === 'node' ? 'media_type' : 'mediaType',
          imagepath: ENV_TYPE === 'node' ? 'media_path' : 'mediaPath',
        };
        tmpConfig.grid_list_card_action = [
          { btnName: '选择', fun: (cardItem: any) => {
            // debugger
            let tmpFormVal: any = {};
            let targetField: any = param?.item?.name;
            tmpFormVal[targetField] = {
              mediaDesc: ENV_TYPE === 'node' ? cardItem.media_name : cardItem.mediaName,
              mediaId: ENV_TYPE === 'node' ? cardItem.media_uuid : cardItem.mediaUuid,
            };
            param?.form?.setFieldsValue(tmpFormVal);
            param?.setModalVisible(false);
          }},
        ];
        tmpConfig.grid_selection_type = false;
        tmpConfig.grid_columns.unshift({ title: '预览', dataIndex: 'priviewmedia', width: 60, render: { func: 'renderPreview2' }, align: 'center', });
        tmpConfig.toolbar_default = {};
        tmpConfig.grid_handle_columns_default = {};
        tmpConfig.handle_columns.push( { name: '选择', key: 'selectMediaToForm', func: 'selectMediaToForm' },);
        tmpConfig.grid_handle_width = 100;
        tmpConfig.parent = param;
        tmpConfig.parent.setModalVisible = setModalVisible;
				setMyConfig(tmpConfig);
        setModalVisible(true);
        setInitParam(param);

        // 配置项：自定义操作列
        Func.selectMediaToForm = (param2: any, event: any) => {
          event.stopPropagation();
          // debugger
          const { record } = param2;
          let tmpFormVal: any = {};
          let targetField: any = param?.item?.name;
          tmpFormVal[targetField] = {
            mediaDesc: 'node' ? record.media_name : record.mediaName,
            mediaId: 'node' ? record.media_uuid : record.mediaUuid,
          };
          param?.form?.setFieldsValue(tmpFormVal);
          setModalVisible(false);
        }
			}
		});
  };

  useImperativeHandle(onRef, () => {
    return {
      showModal,
    };
  });

  return (
    <Drawer
      title="媒体列表"
      open={modalVisible}
      onClose={() => {setModalVisible(false)}}
      size={CONSTANTS.C_MODAL_WIDTH_X4}
      destroyOnHidden={true}
      className="dd_modal_bg"
    >
      <DDBunit2 config={myConfig} func={Func} />
    </Drawer>
  );
};

export default DrawerList;
