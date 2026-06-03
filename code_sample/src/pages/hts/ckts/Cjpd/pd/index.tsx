/**
 * 发票开具配置  关单开票配置
 */
import {Button, Checkbox, Col, DatePicker, Form, message, Modal, Radio, Row, Select, Space, Spin, Table, Tooltip, Upload, UploadProps} from 'antd';
import React, {useEffect, useState} from 'react';
import {commonDrwtdc, cxjcpz2, downloadTemplate, importData, mtsZnpdCjpdDzgxbc, sjpp} from '@/services/hts/api';
import importStyle from './style.less';
import {QuestionCircleOutlined} from '@ant-design/icons';
import moment from 'moment';
import myUtil from '@/pages/common/myUtil';
import DDAlert from '@/components/DDAlert';
import {history,} from 'umi';
import {RcFile} from "antd/es/upload";
import pro from "@/pages/common/proConfig";

const Index: React.FC<{ data?: any, zlbsx: any; form: any; }> = ({
  data,
}) => {

  const [masker, setMasker] = useState<boolean>(false);// 蒙板
  const [zdy, setZdy] = useState<boolean>(true); // 蒙板
  const [zdyCode, setZdyCode] = useState<any>('05'); // 蒙板
  const [zlbsx, setZlbsx] = useState<any>([{value:'05',name:'备注'}]);
  const [ppgzDm, setPpgzDm] = useState<any>('1'); // 蒙板
  const [modalVisible,setModalVisible] = useState<boolean>(false); // 导入异常信息列表
  const [druuid,setDruuid] = useState<string>(''); // 导入异常信息列表
  const [drModalData, setDrModalData] = useState<any>([]); // 导入异常信息列表
  const [dzgxdrts, setDzgxdrts] = useState<any>(0); // 对照关系导入条数
  const [dzgxdrgdts, setDzgxdrgdts] = useState<any>(0); // 对照关系导入关单条数
  const [dzgxdrfpts, setDzgxdrfpts] = useState<any>(0); // 对照关系导入发票条数

  const [form] = Form.useForm();
  const [formpp] = Form.useForm();
  const [formppfs] = Form.useForm();

  useEffect(() => {
    const bgddate = myUtil.date.getQZDateYfBeforeCurr(1);
    formpp.setFieldsValue({
      ckrq1: [moment(bgddate.firstDay, 'YYYY-MM-DD'), moment(bgddate.beforeDay, 'YYYY-MM-DD')],
      kprq1: [moment(bgddate.firstDay, 'YYYY-MM-DD'), moment(bgddate.beforeDay, 'YYYY-MM-DD')]
    });
    cxmm();
  }, []);


  const cxmm = async () => {
    setMasker(true);
    await cxjcpz2({}).then(async (res: any) => {
      setMasker(false);
      let zdycode = '';
      if (res.code === '200') {
        const dms = res.body?.cjpdsxzdDm ? res.body?.cjpdsxzdDm : [];
        const arr = ['01', '02', '03', '04'];
        const arr1 = dms.filter((item: string) => !arr.includes(item));
        if (arr1.length > 0) {
          setZdy(false);
          zdycode = arr1[0];
          // setZdyCode(zdycode);
        }
        if(dms.includes('05')){
          setZdyCode(false);
        }
        let hh = res.body;
        if (zlbsx?.length > 0) {
          hh.zdy = zdycode;
        }
        hh.sydwglddzgxpdbz = res.body?.sydwglddzgxpdbz == "Y" ? "Y" : "N";
        hh.pdppmsDm = !res.body?.pdppmsDm ? "1" : res.body?.pdppmsDm;
        hh.yddppkcfjhslbz = res.body?.yddppkcfjhslbz == 'Y' ? "Y" : "N";
        hh.ydyppkcfjhslbz = res.body?.ydyppkcfjhslbz == 'Y' ? "Y" : "N";
        hh.gdppfsDm = !res.body?.gdppfsDm ? "2" : res.body?.gdppfsDm;
        hh.cjpdsxzdDms = res.body?.cjpdsxzdDm;
        hh.bgdggxhbhfpggxhbz = !res.body?.bgdggxhbhfpggxhbz ? 'N' : res.body?.bgdggxhbhfpggxhbz;
        hh.ppgzDm = !res.body?.ppgzDm ? '1' : res.body?.ppgzDm;
        formppfs.setFieldsValue(hh);
        form.setFieldsValue(hh);
        setDzgxdrts(0);
        setDzgxdrgdts(0);
        setDzgxdrfpts(0);
        setPpgzDm(hh.ppgzDm);
      } else {
        message.error(res.msg);
      }
    });
  }


  const onchange2 = () => {
    onChange();
  }

  const onChange = async () => {

  };

  const onChange3 =  async (p:any) => {
    const ppsx = await form.validateFields();
    const p1 = ppsx?.cjpdsxzdDms || [];
    if(p1.includes("05")){
      setZdy(false);
      form.setFieldsValue({"zdy":"05"});
    }else{
      setZdy(true);
    }
  };


  const onSjpp = async ()=>{
    const sjfw =  await formpp.validateFields();
    const ppfs = await formppfs.validateFields();
    const ppsx = await form.validateFields();
    const p1 = ppsx?.cjpdsxzdDms || [];
    if (ppgzDm == '1' && ppsx?.pdppmsDm == '1' && p1.length == 0) {
      message.info('精准匹配时，发票备注匹配条件必须有勾选！');
      return;
    }
    if (ppgzDm == '2' && (dzgxdrgdts == 0 || dzgxdrfpts == 0)) {
      message.info('请先进行导入操作！');
      return;
    }
    const param = {
      sjpp:{
        ppgzDm: ppgzDm, // 1:日期范围匹配；2:对照关系匹配
        /*sjfw:{
          bgdCkrqQ:myUtil.date.formatDate(sjfw.ckrq1[0], 'YYYY-MM-DD') ,
          bgdCkrqZ:myUtil.date.formatDate(sjfw.ckrq1[1], 'YYYY-MM-DD') ,
          fpKprqQ:myUtil.date.formatDate(sjfw.kprq1[0], 'YYYY-MM-DD') ,
          fpKprqZ:myUtil.date.formatDate(sjfw.kprq1[1], 'YYYY-MM-DD'),
          fpJhbz:sjfw.fpJhbz=='Y' ? "Y":"N",
        },*/
        ppfs:{
          ydyppkcfjhslbz: ppfs?.ydyppkcfjhslbz,
          yddppkcfjhslbz: ppfs?.yddppkcfjhslbz,
          gdppfsDm: ppfs?.gdppfsDm,
        },
        ppsx:{
          sydwglddzgxpdbz:ppsx?.sydwglddzgxpdbz =='Y' ? "Y":"N",
          qdgfhppbz:ppsx?.qdgfhppbz =='Y' ? "Y":"N",
          cjpdsxzdDms:ppsx?.cjpdsxzdDms,
          pdppmsDm:ppsx?.pdppmsDm,
          bgdggxhbhfpggxhbz:ppsx?.bgdggxhbhfpggxhbz,
          jnhydyjxfpxfszdyzyxppbz:ppsx?.jnhydyjxfpxfszdyzyxppbz=='Y' ? "Y":"N",
          fpppsxDm:ppsx?.fpppsxDm
        },
      }
    };

    const sjfwJson = {};
    if (ppgzDm == '1') {
      sjfwJson['bgdCkrqQ'] = myUtil.date.formatDate(sjfw.ckrq1[0], 'YYYY-MM-DD');
      sjfwJson['bgdCkrqZ'] = myUtil.date.formatDate(sjfw.ckrq1[1], 'YYYY-MM-DD');
      sjfwJson['fpKprqQ'] = myUtil.date.formatDate(sjfw.kprq1[0], 'YYYY-MM-DD');
      sjfwJson['fpKprqZ'] = myUtil.date.formatDate(sjfw.kprq1[1], 'YYYY-MM-DD');
      sjfwJson['fpJhbz'] = sjfw.fpJhbz == 'Y' ? "Y" : "N";
    } else {
      // 对照关系匹配时，默认模糊匹配、清空发票备注匹配条件，但是不能修改页面值，需要保留页面选项，只读即可
      param['sjpp']['ppsx']['pdppmsDm'] = '2';
      param['sjpp']['ppsx']['cjpdsxzdDms'] = [];
    }
    param['sjpp']['sjfw'] = sjfwJson;
    setMasker(true);
    await sjpp(param).then(async (res: any) => {
      setMasker(false);
      if (res.code === '200') {
        setDzgxdrts(0);
        setDzgxdrgdts(0);
        setDzgxdrfpts(0);
        DDAlert.open({
          title: '系統提示',
          info: '启动任务成功!',
          infoType: 'success',
          modalType: 'success',
          okText: '转配单任务管理',
          closeStatus: true,
          content: [
            '可在配单任务管理中查询任务情况',
          ],
          okCallbackFn: function () {
           history.push('/26/2604/260405/26040502');
          },
        });
      } else {
        message.error(res.msg);
      }
    });


  }

  const onChangeJhfp = (param: any)=>{
      if(param?.length == 0 ){
        formpp.setFieldsValue('N');
      }else{
        formpp.setFieldsValue('Y');
      }
  }

  const beforeUpload = (file: any) => {
    const isLt2M = file.size;
    if (isLt2M > 10485760) {
      message.info('上传文件不能超过10M。');
      return Upload.LIST_IGNORE;
    }
    if (!file.name.toUpperCase().endsWith(".XLSX")) {
      message.info('上传文件必须是Excel文件。');
      return Upload.LIST_IGNORE;
    }
    return true;
  }

  const dzgxpdMbxzOnclick = () => {
    const obj = {
      sfBhsj: 'N',
      sfScsm: 'Y',
      key: 'SAAS_TSSB_MTS_SJPP_ZNPD_CJPD_DZGXPD_DRMBXZ',
      searchModel: []
    }
    downloadTemplate(obj).then((response: any) => {
      DDAlert.close();
      if (response.code === '200') {
        const {blob, fileName} = response.body;
        myUtil.file.downloadExcel(blob, fileName);
      } else {
        message.error(response.desc);
      }
    }).catch(() => {
      message.error('操作失败');
    })
  }


  // 自定义上传方法
  const uploadRequest: UploadProps['customRequest'] = async (options) => {
    const {file} = options;
    setMasker(true);
    // 1. 获取文件名和文件对象
    const scwj = (file as RcFile);
    const fileName = scwj.name;
    const formData = new FormData();
    formData.append('fileName', fileName);
    formData.append('file', scwj);
    formData.append('drgz', '1');
    formData.append('key', "IMPORT_SAAS_TSSB_MTS_SJPP_ZNPD_CJPD_DZGXPD");
    importData(formData).then((response) => {
      const {code, msg, desc, body} = response;
      DDAlert.close();
      if (code === '200') {
        // const drts = body.drts; // 导入条数
        // const bgdts = body.bgdts; // 报关单份数
        // const fpts = body.fpts; // 发票份数
        // const czbgdts = body.czbgdts; // 存在关单份数
        const bczbgdts = body.bczbgdts; // 不存在关单份数
        // const czfpts = body.czfpts; // 存在发票份数
        const bczfpts = body.bczfpts; // 不存在发票份数
        const knbz = body.knbz; // 跨年标志

        const jctgts = body.jctgts; // 关单、发票同时检查通过条数
        const kyppbgdts = body.kyppbgdts; // 可以匹配的报关单条数
        const kyppfpts = body.kyppfpts; // 可以匹配的发票条数

        DDAlert.open({
          title: '系统提示',
          info: (knbz == 'Y' ? '上传的报关单存在出口日期非同一自然年度的情况，请导出数据修改后重新导入。其中未通过报关单' + bczbgdts + '份、增值税发票' + bczfpts + '张，点击导出查看异常数据。'
            : '数据导入成功，检查通过' + jctgts + '行，报关单' + kyppbgdts + '份，增值税发票' + kyppfpts + '张；未通过报关单' + bczbgdts + '份、增值税发票' + bczfpts + '张。'),
          infoType: 'warning',
          modalType: 'confirm',
          okText: '保存',
          cancelText: '取消',
          width: 600,
          closeStatus: false,
          content: <>
            <div style={{height: '80px', lineHeight: '20px', color: 'red'}}>
              <div>说明：</div>
              <div>1.未通过的关单和发票对应的行不导入；</div>
              <div>2.未通过的关单可能未下载或在待处理、无信息中；</div>
              <div>3.未通过的发票可能未下载或已匹配。</div>
            </div>
          </>,
          button: [
            <Button key='close' onClick={(thisObj: any) => {
              downloadTemplate({
                sfBhsj: 'Y',
                sfScsm: 'Y',
                key: knbz == 'Y' ? 'SAAS_TSSB_MTS_SJPP_ZNPD_CJPD_WKNYCXXDC' : 'SAAS_TSSB_MTS_SJPP_ZNPD_CJPD_KNYCXXDC',
                searchModel: [{
                  values: knbz,
                  op: 'zdy',
                  property: 'knbz'
                }]
              }).then((response: any) => {
                if (response.code === '200') {
                  const {blob, fileName} = response.body;
                  myUtil.file.downloadExcel(blob, fileName);
                  DDAlert.close();
                } else {
                  message.error(response.msg);
                }
              }).catch(() => {
                message.error('操作失败');
              });
            }}>导出</Button>,
          ],
          okCallbackFn: function (thisObj: any) {
            if (knbz == 'Y' || kyppbgdts == 0 || kyppfpts == 0) {
              message.error(knbz == 'Y' ? '出口日期非同一自然年度或检查通过为0，不能进行保存操作！' : '检查通过为0，不能进行保存操作！');
            } else {
              thisObj.setState({masker: true});
              mtsZnpdCjpdDzgxbc().then((res1: any) => {
                if (res1.code === '200') {
                  setDzgxdrts(jctgts);
                  setDzgxdrgdts(kyppbgdts);
                  setDzgxdrfpts(kyppfpts);
                  DDAlert.close();
                  message.success('保存成功');
                } else {
                  message.error(res1.msg);
                }
              }).catch(() => {
                message.error('操作失败');
              }).finally(() => {
                thisObj.setState({masker: false});
              });
            }
          },
          cancelCallbackFn: function () {
          }
        });
      } else if (code === '900') {
        setModalVisible(true);
        setDruuid(body?.druuid);
        setDrModalData(body?.drycxx);
        if(!(msg === '' || msg === null)){
          message.error(msg);
        }
      } else {
        message.error(desc);
      }
    }).catch(() => {
      message.error('导入失败，请重新上传文件。');
    }).finally(() => {
      setMasker(false);
    });
  };

  // 导出错误信息
  const exportErrorMessage = (param: string) => {
    commonDrwtdc({ key: param }).then((response) => {
      if (response.code === '200') {
        const { blob, fileName } = response.body;
        myUtil.file.downloadExcel(blob, fileName);
        setModalVisible(false);
        setDruuid('');
        setDrModalData([]);
      } else {
        message.error(response.desc);
      }
    })
  };

  const sjppRqfwCardOnclick = () => {
    setPpgzDm('1');
  }

  const sjppDzgxfwCardOnclick = () => {
    setPpgzDm('2');
  }

  return (
    <Spin tip="Loading..." spinning={masker} delay={100}>
      <div style={{
        backgroundColor: "#f1f4f7",
        padding: "8px 10px 30px",
        height: 30,
        marginRight: -50,
      }}>数据匹配范围
      </div>
      <Form className={importStyle.jckppz_wrap} form={formpp} key={data} layout="horizontal" labelAlign="left" labelCol={{span: 8}}>
        <Space size={[20, 20]} wrap className={importStyle.tile_group}>
          <div className={ppgzDm == '1' ? importStyle.fpkjpz_titl : importStyle.fpkjpz_titl_readOnly} style={{ width: 397, height: 200 }} onClick={sjppRqfwCardOnclick}>
            <div className={importStyle.group_tile_c1}>日期范围匹配</div>
            <div className={importStyle.title_main}>
              {ppgzDm == '1' ? <div className={importStyle.blue_triangle} /> :<></>}
              <Form.Item name="ckrq1" label="报关单出口日期：" rules={[{ required: true, message: '请选择出口日期' },
              () => ({
                validator(_, value) {
                  if (value.length === 2) {
                    if (moment(value[0]).format('yyyy') != moment(value[1]).format('yyyy')) {
                      return Promise.reject(new Error('出口日期区间不为同一年度，请重新选择！'));
                    }
                    return Promise.resolve();
                  }
                  return Promise.resolve();
                },
              })
              ]} >
                <DatePicker.RangePicker style={{ width: '230px' }} allowClear={false} disabled={ppgzDm != '1'}/>
              </Form.Item>
              <Form.Item name="kprq1" label="发票开票日期：" rules={[{ required: true, message: '请选择开票日期' },]} >
                <DatePicker.RangePicker style={{width: '230px'}} allowClear={false} disabled={ppgzDm != '1'}/>
              </Form.Item>
              <Form.Item name="fpJhbz" style={{marginTop: -10,marginLeft: 122}}>
                <Checkbox.Group onChange={onChangeJhfp} disabled={ppgzDm != '1'}>
                  <Checkbox value='Y'>稽核发票&nbsp;&nbsp;
                    <Tooltip title="勾选后只匹配稽核状态的增值税专用发票数据；">
                      <QuestionCircleOutlined/>
                    </Tooltip>
                  </Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </div>
          </div>
          <div className={ppgzDm == '1' ? importStyle.fpkjpz_titl_readOnly : importStyle.fpkjpz_titl} style={{ width: 397, height: 200 }} onClick={sjppDzgxfwCardOnclick}>
            <div className={importStyle.group_tile_c1}>对照关系匹配&nbsp;&nbsp;
              <Tooltip title="按照上传的报关单与增值税发票的关系进行匹配，每次导入上限20000行。">
                <QuestionCircleOutlined />
              </Tooltip></div>
            <div className={importStyle.title_main}>
              {ppgzDm == '2' ? <div className={importStyle.blue_triangle} /> :<></>}
              <Form.Item label="Excel模板下载：">
                <Button type="link" key={'dzgxpdMbxz'} onClick={dzgxpdMbxzOnclick} disabled={ppgzDm != '2'}>模板下载</Button>
              </Form.Item>
              <Form.Item label="Excel文件导入：">
                <Upload accept=".xlsx" maxCount={1} showUploadList={false} beforeUpload={beforeUpload} customRequest={uploadRequest}>
                  <Button type="link" key={'dzgxpdMbsc'} disabled={ppgzDm != '2'}>文件上传</Button>
                </Upload>
              </Form.Item>
              <Form.Item style={{marginTop: -10}}>
                <span>共导入{dzgxdrts}行，其中报关单{dzgxdrgdts}份，发票{dzgxdrfpts}张</span>
              </Form.Item>
            </div>
          </div>
        </Space>
      </Form>
      <div style={{
        backgroundColor: "#f1f4f7",
        padding: "8px 10px 30px",
        height: 30,
        marginRight: -50,
        marginTop: -20,
      }}>数据匹配顺序
      </div>
      <Form className={importStyle.jckppz_wrap} form={form} key={data} layout="vertical">
        <Space size={[20, 20]} wrap className={importStyle.tile_group}>
          <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.group_tile_c1}>计量单位转换</div>
            <div className={importStyle.title_main}>
              <Form.Item name="sydwglddzgxpdbz">
                <Radio.Group onChange={onChange}>
                  <Space direction="vertical" size={10}>
                  <Radio value='Y'>使用计量单位转换</Radio>
                  <Radio value='N'>不使用计量单位转换</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>

          <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.group_tile_c1}>商品品名匹配顺序</div>
            <div className={importStyle.title_main}>
              <Form.Item name="qdgfhppbz" >
                <Checkbox.Group onChange={onChange}>
                  <Checkbox value={"Y"}>优先按商品品名、其次按规范化商品品名相同的顺序匹配</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </div>
          </div>

          <div className={ppgzDm == '1' ? importStyle.fpkjpz_titl : importStyle.fpkjpz_titl_readOnly} >
            <div className={importStyle.group_tile_c1}>发票备注匹配模式&nbsp;&nbsp;
            <Tooltip title="精准匹配指勾选的发票备注栏字段与出口报关单字段完全一致才能配单；模糊匹配指即使发票备注不满足，也可以按照其他配单规则执行配单；">
                  <QuestionCircleOutlined />
            </Tooltip>
            </div>
            <div className={importStyle.title_main}>
              <Form.Item name="pdppmsDm">
                <Radio.Group onChange={onChange} disabled={ppgzDm != '1'}>
                  <Radio value='1'>精准匹配</Radio>
                  <Radio value='2'>模糊匹配</Radio>
                </Radio.Group>
              </Form.Item>

            </div>
          </div>
          <div className={ppgzDm == '1' ? importStyle.fpkjpz_titl : importStyle.fpkjpz_titl_readOnly} >
            <div className={importStyle.group_tile_c1}>发票备注匹配条件</div>
            <div className={importStyle.title_main}>
              <Form.Item name="cjpdsxzdDms">
              <Checkbox.Group onChange={onChange3} style={{display: 'flex', flexWrap: 'wrap'}} disabled={ppgzDm != '1'}>
                    <Checkbox value='01'>报关单号(18位)</Checkbox>
                    <Checkbox value='02' style={{ marginBottom:10}}>报关单号(21位)</Checkbox>
                    <Checkbox value='03' style={{ marginLeft: 0}}>提运单号</Checkbox>
                    <Checkbox value='04' style={{ marginLeft: 46,marginBottom:10}}>合同协议号</Checkbox>
                    <Checkbox value='05' style={{ marginLeft: 0,marginBottom:10}}>自定义</Checkbox>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item name="zdy" style={{ marginLeft: 100, marginTop: -60 }}>
                <Select placeholder="请选择" onChange={onchange2} disabled={ppgzDm != '1' || zdy}>
                  {zlbsx.map((item: any) => (
                    <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
          </div>
          <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.group_tile_c1}>报关单规格型号匹配模式</div>
            <div className={importStyle.title_main}>
              <Form.Item name="bgdggxhbhfpggxhbz" rules={[{ required: true, message: '请选择报关单规格型号匹配模式' },]}>
                <Radio.Group onChange={onChange}>
                  <Space direction="vertical" size={10}>
                    <Radio value='A'>仅匹配包含发票规格型号的发票</Radio>
                    <Radio value='Y'>包含发票规格型号优先匹配</Radio>
                    <Radio value='N'>不考虑规格型号</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>

          <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.group_tile_c1}>境内货源地匹配顺序 &nbsp;&nbsp;
              <Tooltip title="勾选后系统会判断报关单境内货源地与进项发票销方所在地是否为同一地区。">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div className={importStyle.title_main}>
              <Form.Item name="jnhydyjxfpxfszdyzyxppbz">
                <Checkbox.Group onChange={onChange}>
                  <Checkbox value='Y'>境内货源地与进项发票销方所在地一致优先匹配</Checkbox>
                </Checkbox.Group>
              </Form.Item>
            </div>
          </div>

          <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.group_tile_c1}>发票匹配顺序</div>
            <div className={importStyle.title_main}>
              <Form.Item name="fpppsxDm" >
                <Radio.Group onChange={onChange}>
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>开票日期先入先出优先匹配</Radio>
                    <Radio value='2'>开票日期后入先出优先匹配</Radio>
                    <Radio value='3'>同一商品出口单价与进货单价由高至低进行匹配</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
        </Space>
      </Form>
      <div style={{
        backgroundColor: "#f1f4f7",
        padding: "8px 10px 30px",
        height: 30,
        marginRight: -50,
        marginTop: -20,
      }}>数据匹配方式
      </div>
      <Form className={importStyle.jckppz_wrap} form={formppfs} key={data} layout="vertical">
        <Space size={[20, 20]} wrap className={importStyle.tile_group}>
          <div className={importStyle.fpkjpz_titl} style={{ width: 600, height: 180 }}>
            <div className={importStyle.group_tile_c1}> 发票匹配方式&nbsp;&nbsp;
            <Tooltip title="一对一匹配是指一张报关单与一张发票进行匹配的场景；一对多匹配是指一张报关单与多张发票进行匹配的场景">
                  <QuestionCircleOutlined />
             </Tooltip></div>
            <div className={importStyle.title_main}>
              <Row>
                <Col span={12} style={{ border: '0.5px dashed rgb(181 175 175)', padding: '10px' }}>
                  <Form.Item name="ydyppkcfjhslbz" >
                    <Radio.Group>
                      <Radio value='N'>一对一匹配（不拆分进货数量）</Radio>
                      <Radio value='Y'>一对一匹配（可拆分进货数量）</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
                <Col span={12} style={{ border: '0.5px dashed rgb(181 175 175)', padding: '10px' }}>
                  <Form.Item name="yddppkcfjhslbz" >
                    <Radio.Group>
                      <Radio value='N'>一对多匹配（不拆分进货数量）</Radio>
                      <Radio value='Y'>一对多匹配（可拆分进货数量）</Radio>
                    </Radio.Group>
                  </Form.Item></Col>
              </Row>
            </div>
          </div>

          <div className={importStyle.fpkjpz_titl}>
            <div className={importStyle.group_tile_c1}>关单匹配方式&nbsp;&nbsp;
              <Tooltip title="整张匹配即一张关单的所有项都匹配成功才算匹配成功；单项商品即关单的一项商品匹配成功则匹配成功，与其他项不关联。">
                <QuestionCircleOutlined />
              </Tooltip>
            </div>
            <div className={importStyle.title_main}>
              <Form.Item name="gdppfsDm" rules={[{required: true, message: '请选择关单匹配方式'}]}>
                <Radio.Group>
                  <Space direction="vertical" size={10}>
                    <Radio value='1'>整张关单匹配成功视为匹配成功</Radio>
                    <Radio value='2'>单项商品匹配成功视为匹配成功</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
            </div>
          </div>
        </Space>
      </Form>
      <div>
        <Button type='primary' style={{ zIndex: 999, position: "fixed", bottom: 35, left: "50%" }} onClick={onSjpp}>数据匹配</Button>
      </div>
      <Modal
        title='导出Excel模板'
        destroyOnClose={true}
        visible={modalVisible}
        width={pro.c_modal_width_x4}
        wrapClassName='standard-modal-1'
        footer={(<>
          <Button onClick={() => {
            setDruuid('');
            setDrModalData([]);
            setModalVisible(false);
          }}>关闭</Button>
          <Button onClick={() => exportErrorMessage(druuid)}>导出异常信息</Button>
        </>)}
        onCancel={() => {
          setDruuid('');
          setDrModalData([]);
          setModalVisible(false);
        }}
      >
        <>
          <Table
            rowKey='xh'
            dataSource={drModalData}
            columns={[
              {
                title: '序号', dataIndex: 'xh', width: 60, render: (_text: any, _record: any, index: number) => (
                  <span key={index.toString()}>{index + 1}</span>)
              },
              {title: '失败原因', dataIndex: 'sbyy', width: 700},
            ]}
            pagination={false}
            size={'small'}
            bordered={true}
          />
        </>
      </Modal>
    </Spin>
  );
};

export default Index;
