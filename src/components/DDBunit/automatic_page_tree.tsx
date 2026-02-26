import React, { useEffect, useState } from 'react';
import DDBunitTree from './DDBunitTree';
import { automaticPageDef } from '@/services/hts/api';
import assembleConfigUtil from './assemble_config_util';
import CONSTANTS from '../DDAssist/constants';
import { FloatButton } from 'antd';
import { CodeOutlined } from '@ant-design/icons';
import myUtil from '../DDAssist/util';
import { cloneDeep } from 'lodash';

const Unit2: React.FC<unknown> = () => {
  const [myConfig, setMyConfig] = useState<any>({});

  // setContent
  const setContent = (param: any) => {
    let { text, json } = param;
    if (text || json) {
      let tmpJsonObj = json || JSON.parse(text);
      setMyConfig(cloneDeep(tmpJsonObj));
    }
  }

  // json编辑
  const showModal = () => {
    myUtil.modal.viewJson({
      data: { ...myConfig },
      onChange: setContent,
    });
  };

  useEffect(() => {
    // 1、匹配url， 用于直接配置到routes  格式: /cfgp/test_app_mts_tsjh_tssb
    // 2、匹配url， 用于匹配模块预览      格式: /easy_dev/agility/cfgp?key=${appModulePath}
    const tmpUrl = window.location.href;
    let module_key = '';
    if (tmpUrl.indexOf('?') > -1) {
      const tmp = tmpUrl.split('?key=');
      module_key = tmp.length > 1 ? tmp[1] : '';
    } else {
      const tmp = tmpUrl.split('cfgp/');
      module_key = tmp.length > 1 ? tmp[1] : '';
    }
    automaticPageDef(module_key).then((response1: any) => {
			if (response1.code === '200') {
        let tmpConfig = assembleConfigUtil.moduleTree.assembleAll({
          moduleInfo: response1.body.moduleInfo,
          appTableDict: response1.body.appTableDict,
        });
        tmpConfig.gridParams = {
          pagination: {
            ...CONSTANTS.GRID_PAGINATION,
            // pageSize: CONSTANTS.GRID_PAGINATION_PAGESIZE,
            pageSize: myUtil.theme.getThemeItem('gridPaginationPagesize'),
          }
        };
				setMyConfig(tmpConfig);
			}
		});
  }, [window.location.href]);

  return <>
    <DDBunitTree config={myConfig} func={{}} />
    <FloatButton.Group style={{ right: 24 }} >
      <FloatButton tooltip='查看配置文件' onClick={(showModal)} icon={<CodeOutlined />}/>
    </FloatButton.Group>
  </>;
};

export default Unit2;