import React, { useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Table, Button, Divider, Space, Form, Input, message, Switch, Spin, TreeSelect, Affix} from 'antd';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DownOutlined, UpOutlined, DoubleRightOutlined, DoubleLeftOutlined, FileImageOutlined } from '@ant-design/icons';
import update from 'immutability-helper';
import ProCard from '@ant-design/pro-card';
import myUtil, { intl as intl2 } from '@/pages/common/myUtil';
import { request, } from 'umi';
import { badzSzSxszSave, getTreeCode2, getDzmcTree } from '@/services/hts/api';
import './style.less';
import YlPicViewer from "@/pages/hts/badz/badzcommon/ylPicViewer";
import DDAlert from '@/components/DDAlert';
import cktsUtil from '@/pages/common/cktsUtil';

const EditableContext = React.createContext(null);
// 获取码表
const result = await getTreeCode2({
  codeStoreKey: 'TREE_BADZ_DM_ZXSB_BADZLX_ML',
  codeViewKey:""
});
let treeData = result?.body;
for(let i=0;i<treeData.length;i++){
  treeData[i].disabled = true;
}
const refYlPic: any = React.createRef();
const type = 'DraggableBodyRow';
const DraggableBodyRow: any = ({ index, moveRow, className, style, ...restProps }) => {
  const ref: any = useRef();
  const [{ isOver, dropClassName }, drop] = useDrop({
    accept: type,
    collect: monitor => {
      const { index: dragIndex } = monitor.getItem() || {};
      if (dragIndex === index) {
        return {};
      }
      return {
        isOver: monitor.isOver(),
        dropClassName: dragIndex < index ? ' drop-over-downward' : ' drop-over-upward',
      };
    },
    drop: (item: any) => {
      moveRow(item.index, index);
    },
  });
  const [, drag] = useDrag({
    type,
    item: { index },
    collect: monitor => ({
      isDragging: monitor.isDragging(),
    }),
  });
  drop(drag(ref));
  const [form] = Form.useForm();

  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr
          ref={ref}
          className={`${className}${isOver ? dropClassName : ''}`}
          style={{ cursor: 'move', ...style }}
          {...restProps}
        />
      </EditableContext.Provider>
    </Form>
  );
};


const EditableCell = ({
  title,
  editable,
  editType,
  children,
  dataIndex,
  record,
  range,
  handleSave,
  disabled,
  inputOnchange,
  selectOnchange,
  ...restProps
}) => {
  const inputRef = useRef(null);
  const form: any = useContext(EditableContext);
  const toggleEdit = () => {
    let formVal: any = {};
    formVal[dataIndex] = record[dataIndex];
    form.setFieldsValue(formVal);
  };

  let childNode = children;
  if (editable) {
    let inputNode: any;
    if (editType === 'Input') {
      inputNode = <Input ref={inputRef} onChange={(e) => inputOnchange(e, record)} />;
    } else if (editType === 'TreeSelect') {
      inputNode = <TreeSelect showSearch treeData={treeData} dropdownStyle={{ maxHeight: 400, overflow: 'auto' }} treeDefaultExpandAll onChange={(e) => selectOnchange(e, record)} />;
    }
    childNode = editable && (record.sfkbjbz == 'Y') ? (
      <>
        <Form.Item name={dataIndex} style={{ margin: 0 }} initialValue={record[dataIndex]}>
          {inputNode}
        </Form.Item>
      </>
    ) : (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }} onClick={toggleEdit} >
        {children}
      </div>
    );
  }

  return <td {...restProps}>{childNode}</td>;
};


export interface DDColumnProps {
  onRef?: any;
  data?: any;
}


const DDColumn: React.FC<DDColumnProps> = ({
  data,
}) => {
  const [gridData, setGridData] = useState<any>();
  const [masker, setMasker] = useState(false);
  //全部码表数据
  const [dataAll, setDataAll] = useState();
  //删除集合
  const [delList, setDelList] = useState<any>([]);
  // 备案类型筛选
  const [balxList, setBalxList] = useState<any>([]);
  // 单证类型 
  const [dzlxList, setDzlxList] = useState<any>([]);
  // 筛选条件
  const [filtersData, setfilters] = useState<any>({});
  useEffect(() => {
    let dataAllls: any = null;
    const data = {
      codeStoreKey: 'TREE_BADZ_CS_ZXSB_BADZLX_ALL',
    };
    request(`${API_URL_BASE}/hx/ty/crud/getComboTree`, { method: 'POST', data: data }).then((response: any) => {
      const { code, body } = response;
      if ('200' == code) {
        dataAllls = body;
        setDataAll(body);
        const balxData: any = [];
        const dzlxList: any = [];
        dataAllls.forEach((item: any) => {
          balxData.push({text: item.title, value: item.title});
          dzlxList.push({text: item.title, value: item.title});
          if(item.children){
            item.children.forEach((item02: any) => {
              dzlxList.push({text: item02.title, value: item02.title});
            });
          }
        });
        setBalxList(balxData)
        setDzlxList(dzlxList)
        getInitData(dataAllls);
      }
    });
  }, []);

  const getInitData = (dataAllls: any) => {
    setMasker(true);
    request(`${API_URL_BASE}/hx/ty/crud/queryPager`, { method: 'POST', data: { key: 'CX_BADZ_CS_ZXSB_BADZLXPZ',"searchModel":[],"orderModel":[],"pageSize":10000,"page":1} }).then((response: any) => {
      const { code, body } = response;
      setMasker(false);
      if ('200' == code) {
        body.rows.forEach((row: any, key: any) => {
          //单证类型
          const sjvalue = myUtil.getTreeName(dataAllls, row.sjbadzlxDm);
          body.rows[key].dzlx = sjvalue;
          //备案类型
          const ssjvalue = getFjdValue(row.sjbadzlxDm);
          const ssjTitle = myUtil.getTreeName(dataAllls, ssjvalue);
          body.rows[key].balx = ssjTitle;
          const uuid = myUtil.getUUID(32);
          body.rows[key].uuid = uuid;
        });
        setDelList([]);
        setGridData([].concat(body.rows));
      }
    });
  }

  // 获取最上层父节点ID
  const getFjdValue = (key: any) => {
    const id = key?.substr(0, 2) + '0000';
    return id;
  }

  const sjbadzlxDmList = [
    {
      badzlxDm: '010101',
      imglist: [{imglink: cktsUtil.getStaticLink('/template/badz/010100_010101.png'), name: '出口合同', id:"1"}, ]
    },
    {
      badzlxDm: '010103',
      imglist: [{imglink: cktsUtil.getStaticLink('/template/badz/010100_010103.png'), name: '外贸企业购货合同', id:"2"}, ]
    },
    {
      badzlxDm: '010201',
      imglist: [{imglink: cktsUtil.getStaticLink('/template/badz/010200_010201.png'), name: '海运提单', id:"3"}, ]
    },
    {
      badzlxDm: '010202',
      imglist: [{imglink: cktsUtil.getStaticLink('/template/badz/010200_010202.png'), name: '航空运单', id:"4"}, ]
    },
    {
      badzlxDm: '010203',
      imglist: [{imglink: cktsUtil.getStaticLink('/template/badz/010200_010203.png'), name: '铁路运单', id:"5"}, ]
    },
    {
      badzlxDm: '010301',
      imglist: [{imglink: cktsUtil.getStaticLink('/template/badz/010300_010301.png'), name: '委托报关单协议', id:"6"}, ]
    },
    {
      badzlxDm: '020104',
      imglist: [{imglink: cktsUtil.getStaticLink('/template/badz/020100_020104.png'), name: '装箱单', id:"7"}, ]
    },
  ]

  const openPicMb = (list: any) => {
    refYlPic.current?.showModal(list, true);
  }

  // 配置列表列
  const columns: any = [
    {
      title: '序号', dataIndex: 'index', width: 60, align: 'center', render: (_text: any, _record: any, index: number) => (
        <span>{index + 1}</span>)
    },
    { title: '备案类型', dataIndex: 'balx', width: 150,
      filters: balxList,
      filteredValue: filtersData?.balx || null,
      onFilter: (value: string, record: any) => record.balx.indexOf(value) === 0,
    },
    { title: '单证类型', dataIndex: 'dzlx', width: 200, editable: true, editType: 'TreeSelect',
      filters: dzlxList,
      filteredValue: filtersData?.dzlx || null,
      onFilter: (value: string, record: any) => record.dzlx.indexOf(value) === 0,
    },
    { title: '单证名称', dataIndex: 'badzlxmc', editable: true, editType: 'Input', render: (_text: any, _record: any, index: number) => (
      <>
        <span style={{marginRight: '10px'}}>{_text}</span>
        {
          sjbadzlxDmList.map((temp: any) => (
            temp.badzlxDm === _record.badzlxDm ? <a onClick={() => openPicMb(temp.imglist)}><FileImageOutlined /></a> : ''
          ))
        }
      </>
    ) },
    {
      title: '打印成册顺序', width: 150, align: 'center', render: (_text: any, _record: any, index: number) => (<>
        <Button type='link' onClick={() => setPosition(index, 'top')} disabled={index === 0}><DoubleLeftOutlined rotate={90} /></Button>
        <Divider type='vertical' />
        <Button type='link' onClick={() => setPosition(index, 'up')} disabled={index === 0}><UpOutlined /></Button>
        <Divider type='vertical' />
        <Button type='link' onClick={() => setPosition(index, 'down')} disabled={index === (gridData.length - 1)}><DownOutlined /></Button>
        <Divider type='vertical' />
        <Button type='link' onClick={() => setPosition(index, 'bottom')} disabled={index === (gridData.length - 1)}><DoubleRightOutlined rotate={90} /></Button>
      </>)
    },
    {
      title: '启用状态', dataIndex: 'xybz', width: 90, align: 'center', render: (_text: any, _record: any, index: number) => (
        <>
          <Switch checked={_text == 'Y' ? true : false} onClick={(checked) => onChangeSwitch(checked, index)} />
        </>
      )
    },
    {
      title: '操作', width: 80, align: 'center', dataIndex: 'sfkbjbz', render: (_text: any, _record: any, index: number) => (
        <>
          {_text == 'Y' ? <Button type='link' onClick={() => delete2(_text, _record)}>删除</Button> : <></>}
        </>
      )
    },
  ];

  const onChangeTable = (pagination: any, filters: any) => {
    setfilters(filters)
  };

  const myColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any) => ({
        record,
        editable: col.editable,
        editType: col.editType,
        range: col.range,
        dataIndex: col.dataIndex,
        title: col.title,
        inputOnchange: inputOnchange,
        selectOnchange: selectOnchange,
      }),
    };
  });


  // 上移 下移 置顶 置底
  const setPosition = (index: any, flag: any) => {
    if (flag === 'up') {
      [gridData[index], gridData[index - 1]] = [gridData[index - 1], gridData[index]];
    } else if (flag === 'down') {
      [gridData[index], gridData[index + 1]] = [gridData[index + 1], gridData[index]];
    } else if (flag === 'top') {
      gridData.unshift(gridData.splice(index, 1)[0]);
    } else if (flag === 'bottom') {
      gridData.push(gridData.splice(index, 1)[0]);
    }
    const newArr: any = [].concat(gridData);
    setGridData(newArr);
  };

  const components = {
    body: {
      row: DraggableBodyRow,
      cell: EditableCell,
    },
  };
  const moveRow = useCallback(
    (dragIndex, hoverIndex) => {
      const dragRow = gridData[dragIndex];
      setGridData(
        update(gridData, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, dragRow],
          ],
        }),
      );
    },
    [gridData],
  );
  // 名称值改变
  const inputOnchange = (e: any, row: any) => {
    if(e.target.value.length > 30 ){
      message.info("超出最大长度限制！");
      return;
    }
    const grid = [...gridData];
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].uuid == row.uuid) {
        grid[i].badzlxmc = e.target.value;
        break;
      }
    }
    setGridData(grid);
  }


  // 下拉列表值改变
  const selectOnchange = (e: any, row: any) => {
    const grid = [...gridData];
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].uuid == row.uuid) {
        grid[i].sjbadzlxDm = e + "";
        const ssjvalue = getFjdValue(e);
        const ssjTitle = myUtil.getTreeName(dataAll, ssjvalue);
        const sjTitle = myUtil.getTreeName(dataAll, e);
        grid[i].balx = ssjTitle
        grid[i].dzlx = sjTitle
        grid[i].badzlxDm = getBadzlxdm(dataAll, row);
        break;
      }
    }
    setGridData(grid);
  }

  // 获取新增lxdm
  const getBadzlxdm: any = (dataAll: any, row: any) => {
    if (!row.flag) {
      return row.badzlxDm;
    } else {
      let zjd: any = [];
      let max = 1001;
      //获取所有子节点
      // myUtil.getChild(dataAll, row.sjbadzlxDm, zjd)
      // let max = Math.max(...zjd) + 1;
      // const dm = row.sjbadzlxDm.substring(0,1) + max;
      gridData.forEach((item: any) => {
        if(item.sfkbjbz === 'Y' && item.badzlxDm.substring(0,2) === row.sjbadzlxDm.substring(0,2) && item.badzlxDm.substring(2,3) == '1'){
          zjd.push(Number(item.badzlxDm));
        }
      })
      if(zjd.length>0){
        // let dm = String(Math.max(...zjd) + 1);
        // max = Number(dm.substring(dm.length - 4, dm.length));
        const dm:any = String(missionNumber(zjd));
        max = dm.substring(dm.length - 4, dm.length);
      } else {
        max = 1001;
      }
      return row.sjbadzlxDm.substring(0,2) + max;
    }
  }

  const missionNumber = (arr: any) => {
    const min = Number(String(arr[0]).substring(0,2) + '001');
    const max = Math.max(...arr);
    const target = [];
    let num = max + 1;
    for(let i=min; i<=max; i++){
        if(!arr.includes(i)) {
          target.push(i)
        }
    }
    if(target.length > 0){
      num = Math.min(...target);
    }
    return num;
  }

  //开关值改变
  const onChangeSwitch = (checked: boolean, index: number) => {
    const grid = gridData[index];
    if(!checked && grid.badzlxyybz == 'Y'){
      DDAlert.open({
        title: '系统提示',
        info: '该单证在系统中已存在或已关联数据，禁用后将无法对相关数据进行操作，确定继续禁用吗',
        modalType: 'confirm',
        infoType: 'question',
        okText: '确定',
        cancelText: '取消',
        okCallbackFn: function (thisObj: any) {
          DDAlert.close();
          grid.xybz ='N' ;
          gridData[index] = grid;
          const newArr: any = [].concat(gridData);
          setGridData(newArr);
          return;
        },
        cancelCallbackFn: function () {
          grid.xybz ='Y' ;
          gridData[index] = grid;
          const newArr: any = [].concat(gridData);
          setGridData(newArr);
          return;
        }
      });

    }
    grid.xybz = checked ? 'Y' : 'N';
    gridData[index] = grid;
    const newArr: any = [].concat(gridData);
    setGridData(newArr);
  }

  // 删除
  const delete2 = (text: any, _record: any) => {
    const newFi = {...filtersData};
    if(_record.badzlxyybz == 'Y'){
      message.info('该单证在系统中已存在或已关联数据，不能进行删除操作！');
    } else {
      if(_record.badzlxDm){
        delList.push({ badzlxDm: _record.badzlxDm })
      }
      setDelList(delList)
      gridData.forEach((item: any, index: any) => {
        if(_record.badzlxDm == item.badzlxDm){
          gridData.splice(index, 1);
        }
      });
      const newArr: any = [].concat(gridData);
      setGridData(newArr);
      setfilters(newFi);
    }
  }

  // 添加凭证
  const tjpz = () => {
    const grid = [...gridData];
    const uuid = myUtil.getUUID(32);
    grid.push({ balx: '', dzlx: '', badzlxDm: '', badzlxmc: '', sfkbjbz: 'Y', sjbadzlxDm: '', xh: '', xybz: 'Y', yzjdbz: 'Y', uuid: uuid, flag: true });
    setGridData(grid);
    document.getElementById("divIdsss")?.scrollIntoView();
  };


  //主页面保存事件
  const save = async () => {
    const grid = [...gridData];
    for (let i = 0; i < grid.length; i++) {
      if (grid[i].badzlxDm == '') {
        message.info(intl2.formatMessage({ id: 'message_badz_sxtz_lxxz' }));
        return;
      }
      if (grid[i].badzlxmc == '') {
        message.info(intl2.formatMessage({ id: 'message_badz_sxtz_dzmc' }));
        return;
      }
      for (let j = 0; j < grid.length; j++) {
        if (grid[i].badzlxmc === grid[j].badzlxmc && grid[i].sjbadzlxDm === grid[j].sjbadzlxDm && i !== j) {
          message.info(intl2.formatMessage({ id: 'message_badz_sxtz_dzmc_info' }));
          return;
        }
      }
    }
    setMasker(true);
    const badzs = { badzs: [...grid], scBadzs: delList };
    badzSzSxszSave(badzs).then((res: any) => {
      if (res.code == '200') {
        sxmb(res.desc);
      } else {
        message.error(res.desc)
        setMasker(false);
      }
    });

  }

  //刷新码表
  const sxmb = async (des: any) => {
    getDzmcTree({ "codeStoreKey": "TREE_BADZ_CS_ZXSB_BADZLX_ALL", "codeViewKey": "" }).then((response) => {
      if (response.code === '200') {
        const userInfo = myUtil.sessionStore.getItem('userInfo');
        const qyuuid = userInfo?.qxQys[0].qyuuid;
        myUtil.treeCode.saveTreeCodeToLocalTable("TREE_BADZ_CS_ZXSB_BADZLX_ALL", response?.body, "");
        myUtil.treeCode.saveTreeCodeToLocalTable("TREE_BADZ_CS_ZXSB_BADZLX_ALL", response?.body, qyuuid);
        message.success(des);
        setMasker(false);
        getInitData(response?.body);
      } else {
        message.error(response.desc);
      }
    });
  }
  const toobar_affix = () => {
    const jcfs = localStorage.getItem('jcfs');
    let affix: any = (PRO_TYPE === 'xt' || jcfs === 'menu_ym') ? 40 : 84;
    return affix;
  };
  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <ProCard>
        <Affix offsetTop={toobar_affix()} >
          <div className='button01'>
            <Space>
              <Button onClick={() => tjpz()} type='link'>添加单证</Button>
              <Button type="link" onClick={save} block>保存</Button>
            </Space>
          </div>
        </Affix>
        <DndProvider backend={HTML5Backend}>
          <Table
            dataSource={gridData}
            components={components}
            pagination={false}
            size="small"
            rowKey='uuid'
            columns={myColumns}
            onRow={(_record, index) => ({
              index,
              moveRow,
            })}
            scroll={{ x: 1000 }}
            onChange={onChangeTable}
            sticky={{
              offsetHeader: masker ? 0 : localStorage.getItem('jcfs') ? 90 : 134,
            }}
          />
        </DndProvider>
        <div id="divIdsss" ></div>
      </ProCard>
      <YlPicViewer onRef={refYlPic} />
    </Spin>
  );
};

export default DDColumn;