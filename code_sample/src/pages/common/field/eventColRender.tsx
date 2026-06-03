import moment from 'moment';
import exampleFunc from '@/pages/example/data_page/list/f';
import { Button } from 'antd';

const columnsRender: any = {};

// 优惠政策类型
columnsRender.renderFpssyhlxDm = (param: any) => {
  let reVal = '';
  if (param.text == '1') {
    reVal = '免税'
  } else if (param.text == '2') {
    reVal = '不征税';
  }
  return reVal;
};

// 退免税类型
columnsRender.renderCksptssplxDm = (param: any) => {
  let reVal = '';
  if (param.text == '1') {
    reVal = '退税'
  } else if (param.text == '2') {
    reVal = '免税';
  } else if (param.text == '3') {
    reVal = '征税';
  }
  return reVal;
};

// 报关单结关状态
columnsRender.renderBgsbztDm = (param: any) => {
  if (param.text === '10') {
    return '已结关';
  } else {
    return '未结关';
  }
}

// 与台账匹配状态
columnsRender.renderYtzppbz = (param: any) => {
  if (param.text === 'Y') {
    return '已匹配';
  } else {
    return '未匹配';
  }
}

// 发票类型
columnsRender.renderFpkjglFplx = (param: any) => {
  if (param.text === '3') {
    return '增值税普通发票';
  } else if (param.text === '4') {
    return '增值税电子普通发票';
  }
  return param.text;
}

// 1是、0或其他否
columnsRender.renderBz1And0 = (param: any) => {
  let reVal = '';
  if (param.text == '1') {
    reVal = '是'
  } else {
    reVal = '否';
  }
  return reVal;
};

// Y是、其他否
columnsRender.renderYAndN = (param: any) => {
  let reVal = '';
  if (param.text == 'Y') {
    reVal = '是'
  } else {
    reVal = '否';
  }
  return reVal;
};

// 税率
columnsRender.renderSl1 = (param: any) => {
  return (param.text * 100) + '%';
}
// 税率
columnsRender.qtsprenderSl1 = (param: any) => {
  if(param?.record?.fpssyhlxDm == '1'){
    return "免税"
  }else if(param?.record?.fpssyhlxDm == '2'){
    return "不征税"
  }else{
    return (param.text * 100) + '%';
  }
}

// 数据检查状态
columnsRender.cytgbzCl = (param: any)=>{
  var text = '';
  if (param?.record?.cytgbz == 'Y') {
    text = '检查通过';
  } else if (param?.record?.cytgbz == 'N') {
    text = '检查未通过';
  } else {
    text = '未检查';
  }
  return text;
}
// 征免类型
columnsRender.zmlx = (param: any)=>{
  const { record } = param;
  var text = '';
  // 4=免税; 5=征税；其他=退税
  if (record.zmlx === '4') {
    text = '免税';
  } else if (record.zmlx === '5') {
    text = '征税';
  } else {
    text = '退税';
  }
  return text;
}
// 申报业务
columnsRender.sbyw = (param: any)=>{
  const { record } = param;
  var text = '--';
  // 1=退税申报; 2=代理出口; 3=退运补税;空=  --
  if (record.sbyw === '1') {
    text = '退税申报';
  } else if (record.sbyw === '2') {
    text = '代理出口';
  } else if (record.sbyw === '6') {
    text = '代办退税';
  } else if (record.sbyw === '7') {
    text = '边贸代理';
  }
  return text;
}
// 数据来源
columnsRender.sjlyFun = (param: any) => {
  let reVal = '';
  if (param.text == '3') {
    reVal = '智能分析'
  } else if (param.text == '4') {
    reVal = '内部台账';
  } else{
    reVal = '数据采集';
  }
  return reVal;
};

// 是否不予退税
columnsRender.bytsbz = (param: any) => {
  let reVal = '';
  if (param.text == 'Y') {
    reVal = '是'
  } else if (param.text == 'N') {
    reVal = '否';
  } 
  return reVal;
};

// 是否不予办理
columnsRender.byblbz = (param: any) => {
  let reVal = '';
  if (param.text == 'Y') {
    reVal = '是'
  } else if (param.text == 'N') {
    reVal = '否';
  } 
  return reVal;
};

// 是否暂不办理（暂定）
columnsRender.zbblbz = (param: any) => {
  let reVal = '';
  if (param.text == 'Y') {
    reVal = '是'
  } else if (param.text == 'N') {
    reVal = '否';
  } 
  return reVal;
};

// renderXh4
// columnsRender.renderExampleXh4 = (text: any, record: any, otherRef: any) => {
columnsRender.renderExampleXh4 = (param: any) => {
  const { text, record, otherRef, gridRef, unitRef } = param;
  // console.info(text);
  // console.info(record);
  // console.info(otherRef);
  // console.info(gridRef);
  // console.info(unitRef);
  return <Button type="link" onClick={(event: any) => {
    event.stopPropagation();
    exampleFunc.openDrawer(param);
  }}>{text}
  </Button>;
};

export default columnsRender;
