import React, { useEffect, useState, useRef } from 'react';
import DDBunit2 from '@/components/DDBunit/DDBunit2';
import Func from './f';
import { automaticPageDef } from '@/services/hts/api';
import assembleConfigUtil from '@/components/DDBunit/assemble_config_util';
import { Button, Card } from 'antd';
import CONSTANTS from '@/components/DDAssist/constants';
import DDBunitFun from '@/components/DDBunit/DDBunitFun';
import myUtil from '@/components/DDAssist/util';
import formUtil from '@/components/DDForm/formUtil';

const index: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});
  const refDDBunit2: any = useRef();

  useEffect(() => {
    automaticPageDef('m_media_mgr').then((response1: any) => {
      if (response1.code === '200') {
        let tmpConfig = assembleConfigUtil.module.assembleAll({
          moduleInfo: response1.body.moduleInfo,
          appTableDict: response1.body.appTableDict,
        });
        tmpConfig.grid_columns.unshift({ title: '预览', dataIndex: 'mediaName2', width: 60, render: { func: 'renderPreview2' }, align: 'center', });
        tmpConfig.grid_type_switch = true;
        tmpConfig.grid_type = 'list';
        tmpConfig.grid_list_card_type = 3; // 媒体库
        // 如果开启自定义卡片渲染，则优先采用自定义卡片，grid_list_card_field不启用
        tmpConfig.grid_list_card_field = {
          title: ENV_TYPE === 'node' ? 'media_name' : 'mediaName',
          description: ENV_TYPE === 'node' ? 'media_type' : 'mediaType',
          imagepath: ENV_TYPE === 'node' ? 'media_path' : 'mediaPath',
          videopath: ENV_TYPE === 'node' ? 'media_path' : 'mediaPath',
        };
        // 自定义卡片示例
        tmpConfig.grid_list_card_render = (item: any, reload: any) => {
          // debugger;
          let coverTmp: any = myUtil.media.getCardContent(item);
          return <>
            <Card hoverable variant="borderless"
              style={{ width: '100%' }}
              cover={ coverTmp }
              actions={[
                <Button type='link' onClick={() => {
                  let apiPrefix = myUtil.api.getApiRoot();
                  // console.info(refDDBunit2);
                  // debugger;
                  DDBunitFun.popupUpdate({
                    record: {...item},
                    // event,
                    setMasker: refDDBunit2?.current?.setMasker,
                    setFormType: refDDBunit2?.current?.setFormType,
                    // unitKey,
                    rowKey: tmpConfig?.grid_row_key || 'uuid',
                    // getYwKey: tableUtil.getYwKey,
                    apiFormQuery: `${apiPrefix}${tmpConfig?.api_form_query || CONSTANTS.DEFAULT_API.FORM_QUERY}`,
                    formItems: formUtil.init({ items: tmpConfig?.form_items, func: Func }),
                    form: refDDBunit2?.current?.form,
                    func: Func,
                    // pageId,
                    // refUnit,
                    handleModalVisible: refDDBunit2?.current?.handleModalVisible,
                    setFormItems: refDDBunit2?.current?.setFormItems,
                    // getEditValueByGrid,
                  });
                }}>编辑</Button>,
                <Button type='link' onClick={() => {
                  let apiPrefix = myUtil.api.getApiRoot();
                  DDBunitFun.delete({
                    record: {...item},
                    // event,
                    // unitKey,
                    rowKey: tmpConfig?.grid_row_key || 'uuid',
                    apiFormDelete: `${apiPrefix}${tmpConfig?.api_form_delete || CONSTANTS.DEFAULT_API.FORM_DELETE}`,
                    // refUnit: Func.unitRef,
                    // refGrid,
                    reload: reload,
                    // func,
                    // getYwKey: tableUtil.getYwKey,
                    deleteKey: tmpConfig?.delete_key || 'uuids',
                  });
                }}>删除</Button>
              ]}
              >
              <Card.Meta title={ENV_TYPE === 'node' ? item.media_name : item.mediaName} description={item.mediaType} />
            </Card>
          </>
        }
        setMyConfig(tmpConfig);
      }
    });
  }, []);

  return <>
    <DDBunit2 config={myConfig} func={Func} refDDBunit2={refDDBunit2}/>
  </>;
};

export default index;