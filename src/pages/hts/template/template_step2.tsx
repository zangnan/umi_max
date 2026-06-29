/**
 * titel: 退税流程
*/
import React, { useEffect } from 'react';
import { Steps, Row, Col, Typography } from 'antd';
import { history, useRouteData, useLocation } from 'umi';
import myUtil from '@/components/DDAssist/util';
import './style.less';
import { useAccess } from 'umi';
import qxUtil from '@/pages/hts/common/qxUtil';

export type TemplateStepProps = {
  title?: any;
  steps?: any;
}

const TemplateStep: React.FC<TemplateStepProps> = ({
  children,
  title = '流程向导',
  steps,
}) => {
  const [ current, setCurrent ] = React.useState(0);
  const [ myStep, setMyStep ] = React.useState<any>(steps || []);
  const [ myTitle, setMyTitle ] = React.useState(title);
  const routeMatch = useRouteData();     // 获取当前路由的匹配信息
  const location = useLocation();         // 获取 location 对象

  const access = useAccess(); // 权限

  // onChange
  const onChange = (current: any) => {
    setCurrent(current);
    if(myStep[current].routes && myStep[current].routes.length>0){
      history.push(myStep[current].routes[0].path)
    }else{
      history.push(myStep[current].path);
    }
  };

  // initMyStep
  const initMyStep = () => {
    const [pathname] = [...routeMatch.route.path.split('/')].reverse();
    const menuObj = myUtil.menu.getMenuObjByName(pathname);
    if (!menuObj) {
      return;
    }
    setMyTitle(menuObj.name);
    // 当前地址匹配路由
    let tmpCurrentLocationId = '';
    const locationArr = [...location.pathname.split('/')].reverse();
    if (locationArr && locationArr.length >= 1) {
      tmpCurrentLocationId = locationArr[0];
      // 打版之后会处理第一位为空，本地不受影响
      if(locationArr[0] === '') {
        tmpCurrentLocationId = locationArr[1];
      }
      if(tmpCurrentLocationId.indexOf('_') > -1){
        const newlocation = [...tmpCurrentLocationId.split('_')].reverse();
        tmpCurrentLocationId = newlocation[0];
      }
    }

    // if (!tmpCurrentLocationId) { // 菜单进入
    //   history.push(menuObj.routes[0].path);
    // }
    let steps: any[] = [];
    let stepsTmp = menuObj.routes || [];
    stepsTmp = stepsTmp.filter((item: any) => { return !item?.redirect})
    foreachStepsTmp(stepsTmp, tmpCurrentLocationId);
    stepsTmp.forEach((item: any, index: any) => {
      steps.push(item);
    });
    let myYwKey:any = '';
    if(steps.length === 3 && steps[1].component === './hts/ckts/scsbsj/scsbsj'){
      myYwKey = steps[1].ywKey;
    }
    // 申报结果查询菜单调整
    // const paramSbjg = {
    //   qxCode: 'sbjgcx_menu',
    //   accessObj: access,
    //   ywKey: myYwKey,
    // }
    // if(qxUtil.getQxz(paramSbjg)){
    //   steps.pop();
    // }
    setMyStep(steps);
  }

  let num = 0;
  const foreachStepsTmp = (arr: any, tmpId: any) => {
    arr.forEach((item: any, index: any) => {
      num = index;
      if (item.id === tmpId) {
        setCurrent(num);
      } else {
        if(item.routes && item.routes.length > 0){
          item.routes.forEach((item02: any) => {
            if (item02.id === tmpId) {
              setCurrent(num);
            }
          })
        }
      }
    });
  }

  // useEffect
  useEffect(() => {
    initMyStep();
  }, [location]);

  return (
    myStep && myStep.length > 0 &&
    <>
      <Row className="steps-wrap">
        <Col xs={8} sm={8} md={8} lg={8} xl={8}>
          <Typography.Paragraph ellipsis={{ rows: 1, tooltip: myTitle}} >
            <span className="step-title">{myTitle}</span>
          </Typography.Paragraph>
        </Col>
        <Col xs={16} sm={16} md={16} lg={16} xl={16}>
          <Steps type="navigation" onChange={(cur) => onChange(cur)} className="site-navigation-steps" size="small" current={current} >
            {myStep.map((item: any) => (
              <Steps.Step key={item.id} title={item.name} />
            ))}
          </Steps>
        </Col>
      </Row>
      <div className="steps-content">
        {children}
      </div>
    </>
  );
};

export default TemplateStep;
