import React, { useEffect, useState } from 'react';
import DDBunitTreeGrid from './DDBunitTreeGrid';
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
      data: {
        ...myConfig,
      },
      onChange: setContent,
    });
  };

  // 左侧 树
  const initTree = async (module_key: any) => {
    let response1: any = await automaticPageDef(module_key);
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
      return tmpConfig;
    }
  }

  // 右侧 业务单元
  const initGrid = async (module_key: any) => {
    let response1: any = await automaticPageDef(module_key);
    if (response1.code === '200') {
      let tmpAppTableDict = response1.body.appTableDict || [];
      let leafArr = [];
      for (let m = 0; m < tmpAppTableDict.length; m++) {
        let gridRenderTxt =  ENV_TYPE === 'node' ? 'grid_render' : 'gridRender';
        if (tmpAppTableDict[m][gridRenderTxt]?.indexOf('leaf:') > -1) {
          let formatStrArr = tmpAppTableDict[m][gridRenderTxt]?.split('leaf:') || [];
          if (formatStrArr.length > 1) {
            let leafModuleKey = formatStrArr[1]?.split('&')[0];
            let response2: any = await automaticPageDef(leafModuleKey);
            let tmpConfig = assembleConfigUtil.module.assembleAll({
              moduleInfo: response2.body.moduleInfo,
              appTableDict: response2.body.appTableDict,
            });
            leafArr.push({
              config: tmpConfig,
              field: tmpAppTableDict[m],
            });
          }
        }
      }
      let tmpConfig = assembleConfigUtil.module.assembleAll({
        moduleInfo: response1.body.moduleInfo,
        appTableDict: response1.body.appTableDict,
        leaf: leafArr,
      });
      tmpConfig.gridParams = {
        pagination: {
          ...CONSTANTS.GRID_PAGINATION,
          // pageSize: CONSTANTS.GRID_PAGINATION_PAGESIZE,
          pageSize: myUtil.theme.getThemeItem('gridPaginationPagesize'),
        }
      };
      return tmpConfig;
    }
  }

  // 初始化页面
  const initModule = async ({ module_key1, module_key2 }: any) => {
    const c1 = await initTree(module_key1);
    const c2 = await initGrid(module_key2);
    setMyConfig({
      left: c1,
      right: c2,
    });
  }

  useEffect(() => {
    // 1、匹配url， 用于直接配置到routes  格式: cfgp/eg_m_org_staff/eg_m_org/eg_m_staff
    // 2、匹配url， 用于匹配模块预览      格式: /easy_dev/agility/cfgp?key=${appModulePath}
    const tmpUrl = window.location.href;
    let module_key = '';
    let module_key1 = '';
    let module_key2 = '';
    if (tmpUrl.indexOf('?') > -1) {
      const tmp = tmpUrl.split('?key=');
      module_key1 = tmp.length > 1 ? tmp[1] : '';
    } else {
      const tmp = tmpUrl.split('cfgp/');
      module_key = tmp.length > 1 ? tmp[1] : '';
      const module_key_arr = module_key.split('/');
      module_key1 = module_key_arr.length > 1 ? module_key_arr[1] : '';
      module_key2 = module_key_arr.length > 2 ? module_key_arr[2] : '';
    }
    initModule({module_key1, module_key2});
  }, [window.location.href]);

  return <>
    <DDBunitTreeGrid config={myConfig} func={{}} func2={{}} />
    <FloatButton.Group style={{ right: 24 }} >
      <FloatButton tooltip='查看配置文件' onClick={(showModal)} icon={<CodeOutlined />}/>
    </FloatButton.Group>
  </>;
};

export default Unit2;